import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Nat8 "mo:base/Nat8";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Float "mo:base/Float";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Blob "mo:base/Blob";
import Ledger "canister:icp_ledger_canister";
import Debug "mo:base/Debug";

actor class BricksFi(owner : Principal) = this {
  // Types ---------------------------------------------------------------------
  public type Property = {
    id : Nat;
    name : Text;
    description : Text;
    bedrooms : Nat;
    bathrooms : Nat;
    squareMeters : Nat;
    imageUrls : [Text];
    location : Text;
    totalPrice : Nat; // in e8s (100_000_000 e8s = 1 ICP)
    yieldPercentage : Float;
    fundedAmount : Nat; // in e8s
    fundingComplete : Bool;
    createdAt : Int;
    creator : Principal;
  };

  public type Investment = {
    id : Nat;
    propertyId : Nat;
    amount : Nat; // in e8s
    investor : Principal;
    timestamp : Int;
  };

  public type Error = {
    #NotFound;
    #Unauthorized;
    #AlreadyFunded;
    #InvalidAmount;
    #TransferFailed : Text;
  };

  // Constants -----------------------------------------------------------------
  let FEE : Nat = 10_000; // Standard ICP ledger fee (0.0001 ICP)
  let ICP_LEDGER_CANISTER_ID = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");

  // State ---------------------------------------------------------------------
  private stable var nextPropertyId : Nat = 1;
  private stable var nextInvestmentId : Nat = 1;
  private stable var properties : [Property] = [];
  private stable var investments : [Investment] = [];

  // Auth Helpers --------------------------------------------------------------
  private func isOwner(caller : Principal) : Bool {
    caller == owner;
  };

  // Property Management -------------------------------------------------------
  public shared (msg) func createProperty(
    name : Text,
    description : Text,
    bedrooms : Nat,
    bathrooms : Nat,
    squareMeters : Nat,
    imageUrls : [Text],
    location : Text,
    totalPrice : Nat,
    yieldPercentage : Float,
  ) : async Result.Result<Nat, Error> {

    let newProperty : Property = {
      id = nextPropertyId;
      name;
      description;
      bedrooms;
      bathrooms;
      squareMeters;
      imageUrls;
      location;
      totalPrice;
      yieldPercentage;
      fundedAmount = 0;
      fundingComplete = false;
      createdAt = Time.now();
      creator = msg.caller;
    };

    properties := Array.append(properties, [newProperty]);
    nextPropertyId += 1;

    #ok(newProperty.id);
  };

  public shared (msg) func updateProperty(
    id : Nat,
    name : Text,
    description : Text,
    imageUrls : [Text],
  ) : async Result.Result<(), Error> {
    switch (Array.find(properties, func(p : Property) : Bool { p.id == id })) {
      case null { return #err(#NotFound) };
      case (?property) {
        // Allow updates by creator or owner
        if (msg.caller != property.creator and not isOwner(msg.caller)) {
          return #err(#Unauthorized);
        };

        let updatedProperties = Array.map<Property, Property>(
          properties,
          func(p) {
            if (p.id == id) {
              {
                p with
                name = name;
                description = description;
                imageUrls = imageUrls;
              };
            } else { p };
          },
        );

        properties := updatedProperties;
        #ok(());
      };
    };
  };

  // Investment Functions ------------------------------------------------------
  public shared (msg) func investInProperty(
    propertyId : Nat,
    amount : Nat,
  ) : async Result.Result<Nat, Error> {
    if (amount <= FEE) {
      return #err(#InvalidAmount);
    };

    switch (Array.find(properties, func(p : Property) : Bool { p.id == propertyId })) {
      case null { #err(#NotFound) };
      case (?property) {
        if (property.fundingComplete) {
          return #err(#AlreadyFunded);
        };

        // Safe subtraction to avoid trapping
        let amountAfterFee = if (amount > FEE) { amount - FEE } else {
          return #err(#InvalidAmount);
        }; // Shouldn't happen due to earlier check

        // Transfer ICP from investor to canister
        let transferResult = await transferICP(msg.caller, Principal.fromActor(this), amount);
        switch (transferResult) {
          case (#err(e)) { return #err(#TransferFailed(e)) };
          case _ {};
        };

        let newFundedAmount = property.fundedAmount + amountAfterFee;
        let fundingComplete = newFundedAmount >= property.totalPrice;

        // Update property
        properties := Array.map(
          properties,
          func(p : Property) : Property {
            if (p.id == propertyId) {
              {
                p with
                fundedAmount = newFundedAmount;
                fundingComplete = fundingComplete;
              };
            } else { p };
          },
        );

        // Record investment
        let newInvestment : Investment = {
          id = nextInvestmentId;
          propertyId;
          amount = amountAfterFee;
          investor = msg.caller;
          timestamp = Time.now();
        };

        investments := Array.append(investments, [newInvestment]);
        nextInvestmentId += 1;

        #ok(newInvestment.id);
      };
    };
  };

  // ICP Transfer Functions ----------------------------------------------------
  private func transferICP(
    from : Principal,
    to : Principal,
    amount : Nat,
  ) : async Result.Result<Nat, Text> {
    try {
      let transferArgs : Ledger.TransferArgs = {
        memo = 0 : Nat64;
        amount = { e8s = Nat64.fromNat(amount) };
        fee = { e8s = Nat64.fromNat(FEE) };
        from_subaccount = null;
        to = principalToAccount(to);
        created_at_time = null;
      };

      let transferResult = await Ledger.transfer(transferArgs);
      switch (transferResult) {
        case (#Ok(blockIndex)) { #ok(Nat64.toNat(blockIndex)) };
        case (#Err(transferError)) {
          #err("Transfer error: " # debug_show (transferError));
        };
      };
    } catch (e) {
      #err("Caught exception: " # Error.message(e));
    };
  };

  // Simplified principal to account identifier conversion
  private func principalToAccount(principal : Principal) : Ledger.AccountIdentifier {
    let account = Blob.toArray(Principal.toBlob(principal));
    let size = account.size();
    var sum = 0;

    for (i in account.keys()) {
      sum += Nat8.toNat(account[i]); // Convert Nat8 to Nat for safe addition
    };

    let crc = sum % 65536; // Simple checksum (for demo purposes)
    let crcBytes = [
      Nat8.fromNat(crc / 256),
      Nat8.fromNat(crc % 256),
    ];
    Blob.fromArray(Array.append(crcBytes, account));
  };

  // Query Functions -----------------------------------------------------------
  public query func getCanisterAccount() : async Blob {
    principalToAccount(Principal.fromActor(this));
  };

  public query func getPrincipal() : async Principal {
    Principal.fromActor(this);
  };

  public query func getFundingPercentage(propertyId : Nat) : async ?Float {
    switch (Array.find(properties, func(p : Property) : Bool { p.id == propertyId })) {
      case null { null };
      case (?property) {
        if (property.totalPrice == 0) { ?0.0 } else {
          ?(Float.fromInt(property.fundedAmount) / Float.fromInt(property.totalPrice) * 100.0);
        };
      };
    };
  };

  public query func getProperty(id : Nat) : async ?Property {
    Array.find(properties, func(p : Property) : Bool { p.id == id });
  };

  public query func getAllProperties() : async [Property] {
    properties;
  };

  public query func getPropertyCount() : async Nat {
    properties.size();
  };

  public query func getPropertyInvestments(propertyId : Nat) : async [Investment] {
    Array.filter(investments, func(i : Investment) : Bool { i.propertyId == propertyId });
  };

  public shared query (msg) func getMyInvestments() : async [Investment] {
    Array.filter(investments, func(i : Investment) : Bool { i.investor == msg.caller });
  };

  public shared query (msg) func getCreatedProperties() : async [Property] {
    Array.filter(properties, func(p : Property) : Bool { p.creator == msg.caller });
  };

  // Admin Functions -----------------------------------------------------------
  public shared (msg) func deleteProperty(id : Nat) : async Result.Result<(), Error> {
    if (not isOwner(msg.caller)) {
      return #err(#Unauthorized);
    };

    properties := Array.filter(properties, func(p : Property) : Bool { p.id != id });
    #ok(());
  };

  public shared (msg) func withdrawFunds(
    amount : Nat,
    to : Principal,
  ) : async Result.Result<Nat, Error> {
    if (not isOwner(msg.caller)) {
      return #err(#Unauthorized);
    };

    let transferResult = await transferICP(Principal.fromActor(this), to, amount);
    switch (transferResult) {
      case (#ok(blockIndex)) { #ok(blockIndex) };
      case (#err(e)) { #err(#TransferFailed(e)) };
    };
  };
};
