# Ramp demo and SDK source

The overview and implementation pages now describe the reusable ramp workflow:
enabled routes, exact saved terms, required fields, verification, explicit
continuation/signing, saved lifecycle progress and verified receipts.

The demo uses the shared React widget from
[SDK PR #66](https://github.com/pollar-xyz/pollar/pull/66).
Its source is pinned in `pollar-sdk-source.json`; package version 0.11.3 alone
does not identify the ramp changes while that PR remains open.

## Run and build

Use Node 24 and pnpm 11.8.0:

```sh
pnpm run bootstrap
pnpm run typecheck
pnpm run build
pnpm run dev
```

Bootstrap fetches the exact public SDK commit, installs its locked dependencies,
builds core/React and generates ignored packages under `.pollar-sdk`.
The demo lockfile resolves those packages instead of the older registry copies.
The package check rejects stale builds and duplicate core instances.
For an already checked-out SDK at that exact clean commit, use
`POLLAR_SDK_PATH=/absolute/path/to/pollar pnpm run bootstrap`.

The Vercel install command runs the same preparation before its frozen install.
No SDK package publication is needed to review this branch.

## Backend and release order

Deploy the additive database/backend changes from
[platform PR #15](https://github.com/pollar-xyz/pollar-platform/pull/15) before
rolling out the SDK/demo. SDK PR #66 depends on native component PR #64.
Use an authenticated application and wallet with enabled, enrolled routes.
The new catalog may be empty when required settlement integrations are absent.
Abroad remains disabled without its production payout evidence reader.

The SDK example reads API content directly; it does not use a second
`content` wrapper. Display decimal strings from saved terms.
Collect every declared field before acceptance. Show verification groups and
instructions using `describeRampAction`. Invoke `continueRamp` or
`signRampAction` only from a user button, using the saved action ID and version.
Polling/restoration only reads; it does not establish funding or completion.
For additional chains, register the exact chain/encoding handler and enable
routes only after the backend chain and settlement integrations pass their gates.

The unlisted `/pollar/ramp/abroad` page is still the existing direct provider
workbench. It is separate from the shared ramp widget and is not enrollment
evidence for the new adapter.

After the SDK is merged and released, replace the source build with exact
published package versions that contain these APIs, regenerate the lockfile
and rerun the package, type and build checks.
