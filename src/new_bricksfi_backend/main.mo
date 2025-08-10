import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Float "mo:base/Float";

persistent actor BricksFi {
  // Define the Property type
  public type Property = {
    id : Nat;
    name : Text;
    description : Text;
    bedrooms : Nat;
    bathrooms : Nat;
    squareMeters : Nat;
    imageUrls : [Text];
    location : Text;
    totalPrice : Nat; // Total price of the property
    yieldPercentage : Float; // Expected annual yield percentage
    fundedAmount : Nat; // Total amount funded so far
    fundingComplete : Bool; // Whether funding is complete
    createdAt : Int;
  };

  public type Investment = {
    propertyId : Nat;
    amount : Nat;
    investor : Principal;
    timestamp : Int;
  };

  // Counter for generating unique IDs
  private transient var nextId : Nat = 1;

  // Storage for properties and investments
  private transient var properties : [Property] = [];
  private transient var investments : [Investment] = [];

  // Function to create a new property
  public func createProperty(
    name : Text,
    description : Text,
    bedrooms : Nat,
    bathrooms : Nat,
    squareMeters : Nat,
    imageUrls : [Text],
    location : Text,
    totalPrice : Nat,
    yieldPercentage : Float,
  ) : async Nat {
    let newProperty : Property = {
      id = nextId;
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
    };

    properties := Array.append(properties, [newProperty]);
    nextId += 1;

    return newProperty.id;
  };

  // Function to invest in a property
  public shared (msg) func investInProperty(propertyId : Nat, amount : Nat) : async Bool {
    // Find the property
    switch (Array.find(properties, func(p : Property) : Bool { p.id == propertyId })) {
      case null { return false }; // Property not found
      case (?property) {
        if (property.fundingComplete) {
          return false; // Funding already complete
        };

        // Calculate new funded amount
        let newFundedAmount = property.fundedAmount + amount;
        let fundingComplete = newFundedAmount >= property.totalPrice;

        // Update the property
        let updatedProperties = Array.map<Property, Property>(
          properties,
          func(p) {
            if (p.id == propertyId) {
              {
                p with
                fundedAmount = newFundedAmount;
                fundingComplete = fundingComplete;
              };
            } else {
              p;
            };
          },
        );

        properties := updatedProperties;

        // Record the investment
        let newInvestment : Investment = {
          propertyId;
          amount;
          investor = msg.caller;
          timestamp = Time.now();
        };

        investments := Array.append(investments, [newInvestment]);

        return true;
      };
    };
  };

  // Function to get the funding percentage for a property
  public query func getFundingPercentage(propertyId : Nat) : async ?Float {
    switch (Array.find(properties, func(p : Property) : Bool { p.id == propertyId })) {
      case null { null };
      case (?property) {
        if (property.totalPrice == 0) {
          ?0.0;
        } else {
          ?(Float.fromInt(property.fundedAmount) / Float.fromInt(property.totalPrice) * 100.0);
        };
      };
    };
  };

  // Function to get a property by ID
  public query func getProperty(id : Nat) : async ?Property {
    Array.find(properties, func(p : Property) : Bool { p.id == id });
  };

  // Function to get all properties
  public query func getAllProperties() : async [Property] {
    properties;
  };

  // Function to get the total number of properties
  public query func getPropertyCount() : async Nat {
    properties.size();
  };

  // Function to get investments for a property
  public query func getPropertyInvestments(propertyId : Nat) : async [Investment] {
    Array.filter(investments, func(i : Investment) : Bool { i.propertyId == propertyId });
  };
};
