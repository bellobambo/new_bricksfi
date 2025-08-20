import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface BricksFi {
  'addToWishlist' : ActorMethod<[bigint], Result_1>,
  'createProperty' : ActorMethod<
    [
      string,
      string,
      bigint,
      bigint,
      bigint,
      Array<string>,
      string,
      bigint,
      number,
    ],
    Result
  >,
  'deleteProperty' : ActorMethod<[bigint], Result_1>,
  'getAllProperties' : ActorMethod<[], Array<Property>>,
  'getCanisterAccount' : ActorMethod<[], Uint8Array | number[]>,
  'getCreatedProperties' : ActorMethod<[], Array<Property>>,
  'getFundingPercentage' : ActorMethod<[bigint], [] | [number]>,
  'getMyInvestments' : ActorMethod<[], Array<Investment>>,
  'getMyWishlist' : ActorMethod<[], Array<Property>>,
  'getPrincipal' : ActorMethod<[], Principal>,
  'getProperty' : ActorMethod<[bigint], [] | [Property]>,
  'getPropertyCount' : ActorMethod<[], bigint>,
  'getPropertyInvestments' : ActorMethod<[bigint], Array<Investment>>,
  'investInProperty' : ActorMethod<[bigint, bigint], Result>,
  'removeFromWishlist' : ActorMethod<[bigint], Result_1>,
  'updateProperty' : ActorMethod<
    [bigint, string, string, Array<string>],
    Result_1
  >,
  'withdrawFunds' : ActorMethod<[bigint, Principal], Result>,
}
export type Error = { 'InvalidAmount' : null } |
  { 'AlreadyFunded' : null } |
  { 'NotFound' : null } |
  { 'Unauthorized' : null } |
  { 'TransferFailed' : string };
export interface Investment {
  'id' : bigint,
  'propertyId' : bigint,
  'timestamp' : bigint,
  'amount' : bigint,
  'investor' : Principal,
}
export interface Property {
  'id' : bigint,
  'creator' : Principal,
  'imageUrls' : Array<string>,
  'bedrooms' : bigint,
  'name' : string,
  'createdAt' : bigint,
  'squareMeters' : bigint,
  'description' : string,
  'fundingComplete' : boolean,
  'yieldPercentage' : number,
  'bathrooms' : bigint,
  'totalPrice' : bigint,
  'location' : string,
  'fundedAmount' : bigint,
}
export type Result = { 'ok' : bigint } |
  { 'err' : Error };
export type Result_1 = { 'ok' : null } |
  { 'err' : Error };
export interface _SERVICE extends BricksFi {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
