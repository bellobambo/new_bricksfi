import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface BricksFi {
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
    Result_1
  >,
  'deleteProperty' : ActorMethod<[bigint], Result>,
  'getAllProperties' : ActorMethod<[], Array<Property>>,
  'getCreatedProperties' : ActorMethod<[], Array<Property>>,
  'getFundingPercentage' : ActorMethod<[bigint], [] | [number]>,
  'getMyInvestments' : ActorMethod<[], Array<Investment>>,
  'getPrincipal' : ActorMethod<[], Principal>,
  'getProperty' : ActorMethod<[bigint], [] | [Property]>,
  'getPropertyCount' : ActorMethod<[], bigint>,
  'getPropertyInvestments' : ActorMethod<[bigint], Array<Investment>>,
  'investInProperty' : ActorMethod<[bigint, bigint], Result_1>,
  'updateProperty' : ActorMethod<
    [bigint, string, string, Array<string>],
    Result
  >,
  'whoami' : ActorMethod<[], Principal>,
}
export type Error = { 'InvalidAmount' : null } |
  { 'AnonymousNotAllowed' : null } |
  { 'AlreadyFunded' : null } |
  { 'NotFound' : null } |
  { 'Unauthorized' : null };
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
export type Result = { 'ok' : null } |
  { 'err' : Error };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : Error };
export interface _SERVICE extends BricksFi {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
