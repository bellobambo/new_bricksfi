export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({
    'InvalidAmount' : IDL.Null,
    'AnonymousNotAllowed' : IDL.Null,
    'AlreadyFunded' : IDL.Null,
    'NotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
  });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : Error });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const Property = IDL.Record({
    'id' : IDL.Nat,
    'creator' : IDL.Principal,
    'imageUrls' : IDL.Vec(IDL.Text),
    'bedrooms' : IDL.Nat,
    'name' : IDL.Text,
    'createdAt' : IDL.Int,
    'squareMeters' : IDL.Nat,
    'description' : IDL.Text,
    'fundingComplete' : IDL.Bool,
    'yieldPercentage' : IDL.Float64,
    'bathrooms' : IDL.Nat,
    'totalPrice' : IDL.Nat,
    'location' : IDL.Text,
    'fundedAmount' : IDL.Nat,
  });
  const Investment = IDL.Record({
    'id' : IDL.Nat,
    'propertyId' : IDL.Nat,
    'timestamp' : IDL.Int,
    'amount' : IDL.Nat,
    'investor' : IDL.Principal,
  });
  const BricksFi = IDL.Service({
    'createProperty' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
          IDL.Vec(IDL.Text),
          IDL.Text,
          IDL.Nat,
          IDL.Float64,
        ],
        [Result_1],
        [],
      ),
    'deleteProperty' : IDL.Func([IDL.Nat], [Result], []),
    'getAllProperties' : IDL.Func([], [IDL.Vec(Property)], ['query']),
    'getCreatedProperties' : IDL.Func([], [IDL.Vec(Property)], ['query']),
    'getFundingPercentage' : IDL.Func(
        [IDL.Nat],
        [IDL.Opt(IDL.Float64)],
        ['query'],
      ),
    'getMyInvestments' : IDL.Func([], [IDL.Vec(Investment)], ['query']),
    'getPrincipal' : IDL.Func([], [IDL.Principal], ['query']),
    'getProperty' : IDL.Func([IDL.Nat], [IDL.Opt(Property)], ['query']),
    'getPropertyCount' : IDL.Func([], [IDL.Nat], ['query']),
    'getPropertyInvestments' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(Investment)],
        ['query'],
      ),
    'investInProperty' : IDL.Func([IDL.Nat, IDL.Nat], [Result_1], []),
    'updateProperty' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Text, IDL.Vec(IDL.Text)],
        [Result],
        [],
      ),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
  return BricksFi;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
