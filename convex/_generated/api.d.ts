/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as products from "../products.js";
import type * as roulette_castVote from "../roulette/castVote.js";
import type * as roulette_createSession from "../roulette/createSession.js";
import type * as roulette_finalizeSession from "../roulette/finalizeSession.js";
import type * as roulette_getCandidates from "../roulette/getCandidates.js";
import type * as roulette_getSession from "../roulette/getSession.js";
import type * as roulette_joinSession from "../roulette/joinSession.js";
import type * as roulette_spinSession from "../roulette/spinSession.js";
import type * as roulette from "../roulette.js";
import type * as stores from "../stores.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  products: typeof products;
  "roulette/castVote": typeof roulette_castVote;
  "roulette/createSession": typeof roulette_createSession;
  "roulette/finalizeSession": typeof roulette_finalizeSession;
  "roulette/getCandidates": typeof roulette_getCandidates;
  "roulette/getSession": typeof roulette_getSession;
  "roulette/joinSession": typeof roulette_joinSession;
  "roulette/spinSession": typeof roulette_spinSession;
  roulette: typeof roulette;
  stores: typeof stores;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
