# Anclap workflow demo

This page depends on the SDK change adding `getRampRoutes`,
`continueRampTransaction` and the `RampWorkflow*` public types. Merge and publish
that SDK change, then update both SDK packages in this repository before merging
this demo. Local validation uses yalc; local `.yalc` files, `yalc.lock`, and
`file:.yalc` dependency changes are intentionally excluded from the PR.

For local review, build `@pollar/core` and `@pollar/react` in the sibling SDK
repository, publish both to the local yalc store, and run from this repository:

```sh
yalc add @pollar/core @pollar/react
pnpm install
pnpm exec next dev --webpack -p 3070
```

Configure `NEXT_PUBLIC_POLLAR_BASE_URL` and optionally
`NEXT_PUBLIC_POLLAR_MAINNET_API_KEY` in `.env.local`. Open
`/pollar/ramp/anclap?apiKey=<publishable-mainnet-key>`. Use the browser where your
Stellar wallet is installed. The backend app must allow the demo origin and
have its Anclap routes enrolled in the adapter registry.

The dedicated page handles quotes, authentication signatures, hosted KYC,
continuations and transaction polling. An authentication XDR is signed and sent
back to the API, never broadcast by the page. Wallet signatures and real bank
payments require the user. Mainnet deposits and withdrawals use real funds.
The public Anclap discovery advertises mainnet; testnet login alone does not
provide Anclap sandbox routes.

A transaction is restored from session storage, scoped by app key and wallet.
An explicit `txId` query parameter can recover an existing transaction; the
backend still enforces ownership. Do not create replacement orders to retry an
uncertain provider outcome.

The original generic ramp modal does not implement all adapter continuations.
Use this page for the new Anclap workflow. App KYC requirements and Anclap's own
hosted KYC are configured and enforced separately.

Validation: the dedicated page was served locally with the linked SDK. The full
demo typecheck has unrelated card/KYC compatibility failures against the linked
development SDK; it is not considered a clean build. A real signed-user KYC and
funds round trip has not been completed.
