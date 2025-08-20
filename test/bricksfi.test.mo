import Test "mo:test/async";

actor {
  public func run() : async () {
    await Test.suite(
      "Basic Tests",
      [
        Test.test(
          "Addition works",
          func() : async () {
            assert (1 + 1 == 2);
          },
        ),
        Test.test(
          "Text concat works",
          func() : async () {
            assert ("Hello, " # "World" == "Hello, World");
          },
        ),
      ],
    );
  };
};
