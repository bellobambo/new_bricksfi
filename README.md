# `Bricksfi` 🏢💰

**BricksFi** is a decentralized real estate investment platform built on the Internet Computer (ICP). This Motoko canister enables fractional property investment, letting users invest ICP tokens into tokenized properties while tracking funding, yields, and ownership transparently on-chain.

Welcome to your new `new_bricksfi` project and the Internet Computer development community! This README provides essential instructions for local development, deployment, and understanding the project structure.

---

## Features ✨

- **Property Management** – Create, update, and track properties with bedrooms, bathrooms, square meters, location, images, and total price in ICP.
- **Investment Tracking** – Users can invest ICP in properties, view funding progress, and track personal investments.
- **Admin Controls** – Only the owner can delete properties or withdraw funds.
- **Secure ICP Transfers** – Handles ledger transfers safely with built-in fees and error handling.

---

## Getting Started 🚀

### Local Development

```bash
# Start the local replica in the background
dfx start --background

# Deploy backend and frontend canisters
dfx deploy new_bricksfi_backend --argument '(principal "2vxsx-fae")'
dfx deploy new_bricksfi_frontend
```

- Access your app locally at: `http://localhost:4943?canisterId={asset_canister_id}`
- To regenerate the Candid interface after backend changes:

```bash
npm run generate
```

- To run the frontend development server:

```bash
npm start
```

---

### Mainnet Deployment

```bash
# Deploy backend to the Internet Computer
dfx deploy --network ic --argument '(principal "YOUR_PRINCIPAL_HERE")'

# Deploy frontend
dfx deploy --network ic new_bricksfi_frontend
```

- Check your principal:

```bash
dfx identity get-principal
```

---

## Useful Commands 💻

```bash
# Fabricate cycles for local development
dfx ledger fabricate-cycles --canister new_bricksfi_backend --amount 100

# Check wallet balance locally
dfx wallet --network local balance

# Top-up canister with ICP locally
dfx ledger --network local top-up <your-canister-id> --amount 100
```

---

## Documentation 📚

- [Internet Computer Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [DFINITY SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)

---

my principal :
6yhvo-xuihb-at5pm-6r4mj-zviub-isbdm-ltiku-qwcpf-fwd2u-ldpnl-mqe

dfx deploy new_bricksfi_frontend
dfx deploy new_bricksfi_backend
dfx deploy --argument 'internet_identity=(null)'

"candid": "https://raw.githubusercontent.com/dfinity/ic/047925dfd8386aca91d154054149727131766084/rs/ledger_suite/icp/ledger.did",
"wasm": "https://download.dfinity.systems/ic/047925dfd8386aca91d154054149727131766084/canisters/ledger-canister.wasm.gz",

dfx ledger account-id
bd29fc3ef91413dbd3fbb2f632f84d3c30e576f4d7e43ef2c49958c24afee436

wallet canister id: uxrrr-q7777-77774-qaaaq-cai
