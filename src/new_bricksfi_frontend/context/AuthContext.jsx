import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
// import { createActor } from "../declarations/new_bricksfi_backend";
// import { canisterId } from "/declarations/new_bricksfi_backend/index.js";
import { createActor } from "declarations/new_bricksfi_backend";
// import { canisterId } from "declarations/new_bricksfi_backend/index.js";

const backendCanisterId = process.env.CANISTER_ID_BRICKSFI_BACKEND;
// const frontendCanisterId = process.env.CANISTER_ID_INTERNET_IDENTITY;

const frontendCanisterId = "umunu-kh777-77774-qaaca-cai";

const network = process.env.DFX_NETWORK || "local";
const identityProvider =
  network === "ic"
    ? "https://identity.ic0.app"
    : `http://${frontendCanisterId}.localhost:4943`;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authClient, setAuthClient] = useState();
  const [actor, setActor] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState();

  const initializeAuthClient = async () => {
    const client = await AuthClient.create();
    setAuthClient(client);
    updateActor(client);
  };

  const updateActor = async (client = authClient) => {
    if (!client || !backendCanisterId) return;

    const identity = client.getIdentity();
    const newActor = createActor(backendCanisterId, {
      agentOptions: { identity },
    });

    setActor(newActor);
    setIsAuthenticated(await client.isAuthenticated());

    if (await client.isAuthenticated()) {
      setPrincipal(identity.getPrincipal().toString());
    } else {
      setPrincipal(null);
    }
  };

  const login = async () => {
    await authClient.login({
      identityProvider,
      onSuccess: () => updateActor(),
    });
  };

  const logout = async () => {
    await authClient.logout();
    await updateActor();
  };

  useEffect(() => {
    initializeAuthClient();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authClient,
        actor,
        isAuthenticated,
        principal,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
