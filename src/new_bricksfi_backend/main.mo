import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Float "mo:base/Float";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor class BricksFi(owner : Principal) = this {
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
    totalPrice : Nat;
    yieldPercentage : Float;
    fundedAmount : Nat;
    fundingComplete : Bool;
    createdAt : Int;
    creator : Principal; // Track who created the property
  };

  public type Investment = {
    id : Nat;
    propertyId : Nat;
    amount : Nat;
    investor : Principal;
    timestamp : Int;
  };

  public type Error = {
    #NotFound;
    #Unauthorized;
    #AlreadyFunded;
    #InvalidAmount;
    #AnonymousNotAllowed;
  };

  // State ---------------------------------------------------------------------
  private stable var nextPropertyId : Nat = 1;
  private stable var nextInvestmentId : Nat = 1;
  private stable var properties : [Property] = [];
  private stable var investments : [Investment] = [];

  // Auth Helpers --------------------------------------------------------------
  private func isOwner(caller : Principal) : Bool {
    caller == owner;
  };

  private func isAnonymous(caller : Principal) : Bool {
    Principal.isAnonymous(caller);
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
        // Only owner or creator can update
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
    if (isAnonymous(msg.caller)) {
      return #err(#AnonymousNotAllowed);
    };

    if (amount == 0) {
      return #err(#InvalidAmount);
    };

    switch (Array.find(properties, func(p : Property) : Bool { p.id == propertyId })) {
      case null { #err(#NotFound) };
      case (?property) {
        if (property.fundingComplete) {
          return #err(#AlreadyFunded);
        };

        let newFundedAmount = property.fundedAmount + amount;
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
          amount;
          investor = msg.caller;
          timestamp = Time.now();
        };

        investments := Array.append(investments, [newInvestment]);
        nextInvestmentId += 1;

        #ok(newInvestment.id);
      };
    };
  };

  // Query Functions -----------------------------------------------------------
  public query func whoami() : async Principal {
    // Useful for frontend to verify authentication
    Principal.fromActor(this);
  };

  public query func getPrincipal() : async Principal {
    // Returns caller's principal
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

  system func preupgrade() {
    // Can add persistent storage handling here if needed
  };

  system func postupgrade() {
    // Post-upgrade hooks
  };
};
