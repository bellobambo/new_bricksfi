import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";

persistent actor BricksFi {
  // Define the Property type
  public type Property = {
    id : Nat;
    name : Text;
    description : Text;
    bedrooms : Nat;
    bathrooms : Nat;
    squareMeters : Nat;
    imageUrls : [Text]; // Changed from [Blob] to [Text] for URLs
    createdAt : Int;
  };

  // Counter for generating unique IDs
  private transient var nextId : Nat = 1;

  // Storage for properties
  private transient var properties : [Property] = [];

  // Function to create a new property
  public func createProperty(
    name : Text,
    description : Text,
    bedrooms : Nat,
    bathrooms : Nat,
    squareMeters : Nat,
    imageUrls : [Text], // Changed parameter type
  ) : async Nat {
    let newProperty : Property = {
      id = nextId;
      name;
      description;
      bedrooms;
      bathrooms;
      squareMeters;
      imageUrls;
      createdAt = Time.now();
    };

    properties := Array.append(properties, [newProperty]);
    nextId += 1;

    return newProperty.id;
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
};
