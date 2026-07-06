// Translation dictionaries for the demo UI.
// `en` is the source of truth — `es` and `pt` are typed against it so a
// missing key fails the build. Code samples stay in English on purpose.

import { nekoEn, nekoEs, nekoPt, nekoNavLabel } from "@/app/neko/_i18n";

import { walletAdaptersNavLabel } from "@/app/wallet-adapters/_i18n";

export const en = {
  langName: "English",

  common: {
    connectWalletFirst: "Connect wallet first",
    connectWalletToContinue: "Connect wallet to continue",
    loading: "Loading…",
    unknownError: "Unknown error",
    viewModal: "View modal",
    optional: "(optional)",
    cancel: "Cancel",
    save: "Save",
    comingSoon: "Coming soon",
    comingSoonDesc: "This feature will be available shortly.",
    soon: "Soon",
    new: "New",
    coreClientNote: {
      title: "Using core from @pollar/react",
      intro:
        "Prefer @pollar/react? You keep all of core — the same PollarClient sits underneath. Reach it two equivalent ways:",
      outro:
        "Both hand you the identical client, so every @pollar/core method on this page works verbatim. You can even run @pollar/react fully headless (just getClient(), ignore the prebuilt modals) — but its edge is the reactive hooks that re-render your UI for you.",
    },
  },

  nav: {
    transactions: "Transactions",
    send: "Send",
    receive: "Receive",
    history: "History",
    balance: "Balance",
    assets: "Assets",
    ramp: "Ramp",
    kyc: "KYC",
    escrow: "Escrow",
    payments: "Payments",
    login: "Login",
    logout: "Logout",
    sessions: "Sessions",
    signXdr: "Sign XDR",
    distribution: "Distribution",
    lumenwipe: "LumenWipe",
    overview: "Overview",
    dashboard: "Dashboard",
    pools: "Pools",
    vaults: "Vaults",
    wallet: "Wallet",
    privy: "Privy",
    stellarWalletsKit: "Stellar Wallets Kit",
    acceslyAdapter: "Accesly",
    swap: "Swap",
    setup: "Setup",
    implementation: "Implementation",
    adapter: "Adapter",
    groups: {
      auth: "Authentication",
      pollarWallet: "Wallet",
      transactions: "Transactions",
      distribution: "Distribution",
      kyc: "KYC",
      ramp: "Ramp",
      swap: "Swap",
      earn: "Earn",
      trustlessWork: "Trustless Work",
      nirium: "Nirium",
      cosmosPay: "Cosmos Pay",
      lumenwipe: "LumenWipe",
      hedgepay: "Hedgepay",
      vaquita: "Vaquita",
      humanWeb: "Human Web",
      e4c: "E4C",
      stellarWalletsKit: "Stellar Wallets Kit",
      privy: "Privy",
      acceslyAdapter: "Accesly",
      neko: nekoNavLabel,
    },
  },

  shell: {
    apiKey: "Custom API key",
    apiKeyTitle: "Use your own publishable API key",
    switchToLight: "Switch to light mode",
    switchToDark: "Switch to dark mode",
    changeLanguage: "Change language",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    products: "Products",
    integrations: "Integrations",
    walletAdapters: walletAdaptersNavLabel,
    adapters: "Adapters",
    builtWith: "Built with Pollar",
  },

  adapterDoc: {
    title: "The {name} adapter",
    intro:
      "How {name} plugs into Pollar. The adapter is plain client-side code: it calls the protocol, gets back an unsigned transaction, and hands it to Pollar to sign and submit.",
    contractTitle: "The adapter contract",
    contractDesc:
      "Every adapter function returns { unsignedTransaction: string }. Pollar signs and submits it with the user's connected wallet — no secret key or API key ever touches the frontend.",
    sourceTitle: "adapter.ts",
    sourceDesc:
      "The full adapter definition. Each method calls the protocol and returns the unsigned XDR.",
    registerTitle: "Register it once",
    registerDesc:
      "Register the adapter on the Pollar provider and derive a typed hook with createPollarAdapterHook. From then on any component can call it, and Pollar owns the signing.",
  },

  home: {
    badge: "SDK demo — every feature, live on testnet",
    titlePre: "Explore the ",
    titleHighlight: "Pollar SDK",
    subtitle:
      "Each tab demonstrates one capability of @pollar/core and @pollar/react, with the equivalent code side by side.",
    descs: {
      transactions: "Invoke smart contracts and build Stellar operations.",
      send: "Transfer assets to another Stellar address.",
      receive: "Show your address and QR code to receive funds.",
      history: "List the wallet's past transactions.",
      balance: "Fetch Stellar account balances by public key.",
      assets:
        "See the app's enabled assets and which trustlines you're missing.",
      ramp: "Buy and sell crypto with local payment methods.",
      kyc: "Verify your identity to unlock higher limits.",
      escrow: "Trustless Work escrows with automatic XDR signing.",
      payments: "x402 programmatic payments — Nirium plans, Pollar signs.",
      login: "Sign users in with social, email or a wallet.",
      logout: "Revoke the session and clear local state.",
      sessions: "Review active sessions and revoke devices.",
      signXdr: "Sign an XDR built elsewhere with the logged-in wallet.",
      distribution: "List distribution rules and claim your share.",
      lumenwipe: "Close a Stellar account and merge its balance out.",
      stellarWalletsKit:
        "Register Stellar Wallets Kit wallets (Freighter, Albedo, xBull…) as Pollar adapters.",
      privy: "Email / Google login backed by a Privy embedded Stellar wallet.",
      acceslyAdapter:
        "Sign Pollar transactions with an Accesly smart account (passkey + Shamir-MPC).",
      swap: "Swap one asset for another at the best on-chain price.",
      earn: "Deposit into DeFindex vaults and Blend pools to earn yield.",
      setup: "Wire it up with @pollar/core or @pollar/react.",
    },
  },

  apiKeyModal: {
    title: "Use your API key",
    subtitle:
      "Paste your Pollar publishable key to run this demo against your own app.",
    keyLabel: "Publishable key",
    storedNote1: "It's stored only in the URL (",
    storedNote2:
      "), so the SDK client reads it on the next render — nothing is sent anywhere else.",
    noKey1: "Don't have one? Grab your publishable key from ",
    noKey2: " → API keys.",
    reset: "Reset to default",
  },

  originModal: {
    title: "Domain not allowed",
    subtitle:
      "The Pollar SDK couldn't load its config because this domain isn't in your app's allowed origins.",
    originLabel: "Origin to add",
    instructions1: "Open your app in ",
    instructions2:
      " → Build → Domains, add the origin above, then reload this page.",
    openDashboard: "Open dashboard",
    dismiss: "Dismiss",
  },

  invalidKeyModal: {
    title: "Invalid API key",
    subtitle:
      "The Pollar SDK couldn't load its config because this API key isn't recognized.",
    keyLabel: "API key in use",
    instructions1: "Check the key in ",
    instructions2:
      " → Build → API keys, then update it here or remove it to fall back to the demo key.",
    openDashboard: "Open dashboard",
    dismiss: "Dismiss",
  },

  networkModal: {
    title: "Network is tied to your API key",
    subtitle:
      "Your custom API key only works on one network, fixed by its prefix (pub_testnet_… or pub_mainnet_…).",
    body: "To switch networks, change the API key to one issued for the network you want.",
    changeKey: "Change API key",
    dismiss: "Dismiss",
  },

  send: {
    title: "Send",
    desc: "Transfer assets to another Stellar address. Pollar renders the asset picker, amount input, review and signing flow inside a modal.",
    open: "Open Send modal",
    note: "takes no arguments — asset, amount and destination are picked inside the modal.",
    reactDesc:
      "Drop-in button that opens a prebuilt modal — asset picker, amount, review and the signing flow are all rendered for you.",
    coreDesc:
      "Build, sign and submit the payment yourself with a single runTx('payment', …) call, then read the transaction state.",
    form: {
      destinationLabel: "Destination",
      destinationPh: "G… (recipient address)",
      assetLabel: "Asset",
      assetHint:
        "assets the connected wallet holds — loaded via refreshWalletBalance().",
      amountLabel: "Amount",
      amountPh: "10",
      run: "Run payment",
      running: "Submitting…",
      stateIdle: "Fill in destination, asset and amount, then run the payment.",
      nativeOnly:
        "Connect a wallet to load its held assets — native XLM is shown by default.",
    },
    coreFnsTitle: "Functions used",
    coreFnsIntro:
      "All of these are methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "runTx(operation, params, options?)",
        tag: "async",
        params:
          "operation: TxBuildBody['operation'] (e.g. 'payment'); params: the operation body — for a payment, { destination, asset, amount }; options?: optional build flags.",
        returns:
          "Promise<SubmitOutcome> — { status: 'success' | 'pending' | 'error', hash, … }. One-shot build → sign → submit.",
      },
      {
        fn: "getTransactionState()",
        tag: "sync",
        params: "No arguments.",
        returns:
          "TransactionState — the current build/sign/submit progress; null before any tx runs.",
      },
      {
        fn: "onTransactionStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: TransactionState) => void — invoked on every state transition.",
        returns:
          "() => void — an unsubscribe function. The react hook's tx value is built on top of this.",
      },
    ],
    reactFnsTitle: "Hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "No arguments. Call it at the top level of a component — it reads React context, so it must run during render.",
        returns:
          "PollarContextValue — the whole SDK surface: reactive state values, modal openers, and getClient() to drop down to core.",
      },
      {
        fn: "openSendModal()",
        tag: "sync",
        params:
          "No arguments — asset, amount and destination are picked inside the modal.",
        returns: "void — opens the prebuilt modal; there is nothing to await.",
      },
      {
        fn: "tx",
        tag: "reactive value",
        params:
          "Not a function — a value of type TransactionState read from usePollar().",
        returns:
          "Re-renders your component as the payment builds, signs and submits. Mirrors getClient().getTransactionState().",
      },
    ],
  },

  receive: {
    title: "Receive",
    desc: "Show the connected wallet's address and QR code so others can send funds to it. Pollar renders the whole view inside a modal.",
    open: "Open Receive modal",
    note: "takes no arguments — it reads the connected wallet address from context.",
    reactDesc:
      "Drop-in button that opens a prebuilt modal showing the connected wallet's address and a QR code.",
    coreDesc:
      "Read the connected wallet's public key from the auth state and render the address + QR yourself.",
    coreFnsTitle: "Functions used",
    coreFnsIntro:
      "All of these are methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "getAuthState()",
        tag: "sync",
        params: "No arguments.",
        returns:
          "AuthState — when step === 'authenticated', session.wallet?.publicKey is the receiving address (a G… string).",
      },
    ],
    reactFnsTitle: "Hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "No arguments. Call it at the top level of a component — it reads React context, so it must run during render.",
        returns:
          "PollarContextValue — the whole SDK surface: reactive state values, modal openers, and getClient() to drop down to core.",
      },
      {
        fn: "openReceiveModal()",
        tag: "sync",
        params:
          "No arguments — it reads the connected wallet address from context.",
        returns:
          "void — opens the prebuilt modal with the address and QR code.",
      },
      {
        fn: "wallet",
        tag: "reactive value",
        params:
          "Not a function — a WalletInfo object read from usePollar(), or null when not connected.",
        returns:
          "The connected wallet (wallet.address holds the public key, wallet.custody/provider its type); re-renders when the session changes.",
      },
    ],
  },

  history: {
    title: "History",
    desc: "List the connected wallet's past transactions with pagination. The loading state is exposed reactively, so your UI can react as the data arrives.",
    open: "Open History modal",
    note: "takes no arguments — pagination is handled inside the modal.",
    idle: "Open the modal to load history.",
    recordsLoaded: (n: number) => `${n} record${n === 1 ? "" : "s"} loaded.`,
    coreOpen: "Run fetchTxHistory()",
    coreNote:
      "imperative fetch via getClient() — drives the same txHistory state.",
    reactDesc:
      "Drop-in button that opens a prebuilt modal — the list, pagination, loading and empty states are all rendered for you.",
    coreDesc:
      "Fetch the records imperatively and handle the raw response yourself. No UI is rendered — you read the state and build your own.",
    rawResponse: "Raw response",
    coreFnsTitle: "Functions used",
    coreFnsIntro:
      "All of these are methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "fetchTxHistory(params?)",
        tag: "async",
        params:
          "params?: { network?: 'testnet' | 'mainnet'; limit?: number; offset?: number }. Every field is optional — omit the whole object to use the session defaults; pass limit + offset to paginate.",
        returns:
          "Promise<void> — it doesn't return the data; it writes the result into the reactive state, which you then read with getTxHistoryState().",
      },
      {
        fn: "getTxHistoryState()",
        tag: "sync",
        params: "No arguments.",
        returns:
          "TxHistoryState — a discriminated union on step: 'idle' | 'loading' | 'loaded' | 'error'. data (records, total, limit, offset) exists only when step === 'loaded'.",
      },
      {
        fn: "onTxHistoryStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: TxHistoryState) => void — invoked on every state transition.",
        returns:
          "() => void — an unsubscribe function; call it to stop listening. The react hook's txHistory is built on top of this.",
      },
    ],
    reactFnsTitle: "Hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "No arguments. Call it at the top level of a component — it reads React context, so it must run during render.",
        returns:
          "PollarContextValue — the whole SDK surface: reactive state values, modal openers, and getClient() to drop down to core.",
      },
      {
        fn: "openTxHistoryModal()",
        tag: "sync",
        params:
          "No arguments — fetching, pagination and rendering all happen inside the modal.",
        returns: "void — opens the prebuilt modal; there is nothing to await.",
      },
      {
        fn: "txHistory",
        tag: "reactive value",
        params:
          "Not a function — a value of type TxHistoryState read from usePollar().",
        returns:
          "Re-renders your component whenever it changes. Mirrors getClient().getTxHistoryState(): step plus data when loaded.",
      },
    ],
  },

  signXdr: {
    title: "Sign XDR",
    desc: "Sign a transaction that was built somewhere else — a backend, a CLI, another app — with the currently logged-in wallet. Paste the unsigned XDR and either sign + submit in one call, or split signing from submission.",
    xdrLabel: "Unsigned XDR",
    xdrPlaceholder: "AAAAAgAAAAA… (base64 transaction envelope)",
    xdrNote:
      "The base64 transaction envelope produced wherever the transaction was built.",
    oneShotTitle: "One-shot — sign + submit",
    splitTitle: "Split flow — external wallets sign client-side",
    working: "Working…",
    signedXdrLabel: "Signed XDR",
    stateLabel: "tx state",
    stateIdle: "Paste an XDR and sign to drive the transaction state machine.",
    reactFnsTitle: "Hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "signAndSubmitTx(unsignedXdr?)",
        tag: "async",
        params:
          "unsignedXdr: string — the envelope built elsewhere. Signs it with the logged-in wallet and submits in one call (custodial or external).",
        returns:
          "Promise<SubmitOutcome> — { status: 'success' | 'pending', hash } or { status: 'error', … }. Also drives the reactive tx state.",
      },
      {
        fn: "signTx(unsignedXdr)",
        tag: "async",
        params:
          "unsignedXdr: string. External-wallet only — the wallet signs client-side. Custodial flows should use signAndSubmitTx.",
        returns:
          "Promise<SignOutcome> — { status: 'signed', signedXdr } or { status: 'error', … }.",
      },
      {
        fn: "submitTx(signedXdr)",
        tag: "async",
        params:
          "signedXdr: string — the signed envelope from signTx. Broadcasts it to the network.",
        returns:
          "Promise<SubmitOutcome> — { status: 'success' | 'pending', hash } or { status: 'error', … }.",
      },
      {
        fn: "tx",
        tag: "reactive value",
        params:
          "Not a function — a TransactionState read from usePollar(). Re-renders through 'signing' → 'submitting' → 'success' / 'error'.",
        returns:
          "Mirrors getClient().getTransactionState(): step plus hash / buildData when present.",
      },
    ],
    coreFnsTitle: "Functions used",
    coreFnsIntro:
      "The same methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "signAndSubmitTx(unsignedXdr?)",
        tag: "async",
        params:
          "unsignedXdr: string — the envelope built elsewhere. One-shot sign + submit with the logged-in wallet.",
        returns: "Promise<SubmitOutcome> — status + hash, or an error.",
      },
      {
        fn: "signTx(unsignedXdr)",
        tag: "async",
        params:
          "unsignedXdr: string. External-wallet only — returns the signed XDR without broadcasting.",
        returns:
          "Promise<SignOutcome> — { status: 'signed', signedXdr } or error.",
      },
      {
        fn: "submitTx(signedXdr)",
        tag: "async",
        params: "signedXdr: string — broadcast a client-signed envelope.",
        returns: "Promise<SubmitOutcome> — status + hash, or an error.",
      },
    ],
  },

  login: {
    title: "Login",
    desc: "Sign a user in. With @pollar/react a single prebuilt modal renders every provider you configured — social, email OTP and any wallet adapters. With @pollar/core you drive each provider yourself and read the auth state machine.",
    open: "Open login modal",
    alreadyIn: "You're already signed in",
    note: "takes no arguments — it renders every configured provider and resolves the session for you.",
    reactDesc:
      "openLoginModal() opens the prebuilt modal with every provider; login({ provider }) enters one provider directly, skipping the modal.",
    coreDesc:
      "Start a login for any provider with login({ provider }), run the email OTP steps, and subscribe to onAuthStateChange to render your own flow.",
    coreFnsTitle: "Functions used",
    coreFnsIntro:
      "All of these are methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "login(options)",
        tag: "sync",
        params:
          "options: { provider: 'google' | 'github' | 'email' | <wallet adapter type> } (email also takes { email }). Fire-and-forget — it drives the auth state machine.",
        returns:
          "void — progress and result surface through onAuthStateChange / getAuthState().",
      },
      {
        fn: "beginEmailLogin()",
        tag: "sync",
        params:
          "No arguments. Step 1 of the email OTP flow — opens the email step so the user can type their address.",
        returns: "void — advances the auth state machine to 'entering_email'.",
      },
      {
        fn: "sendEmailCode(email)",
        tag: "sync",
        params:
          "email: string — the address to send the one-time code to. Step 2 of the email OTP flow.",
        returns:
          "void — dispatches the code and advances the auth state machine to 'entering_code'.",
      },
      {
        fn: "verifyEmailCode(code)",
        tag: "sync",
        params:
          "code: string — the one-time code the user received by email. Step 3 of the email OTP flow.",
        returns:
          "void — on a valid code the auth state machine reaches 'authenticated'.",
      },
      {
        fn: "loginSmartWallet()",
        tag: "sync",
        params:
          "No arguments. Runs the passkey (WebAuthn) ceremony for a returning smart-wallet user; use createSmartWallet() for a new one.",
        returns: "void — drives the auth state machine.",
      },
      {
        fn: "onAuthStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: AuthState) => void — called on every transition ('idle', 'creating_session', 'opening_oauth', 'authenticated', 'error', …).",
        returns:
          "() => void — an unsubscribe function. Pair with getAuthState() to read the current step.",
      },
    ],
    reactFnsTitle: "Hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "No arguments. Call it at the top level of a component — it reads React context, so it must run during render.",
        returns:
          "PollarContextValue — the whole SDK surface: reactive state values, modal openers, and getClient() to drop down to core.",
      },
      {
        fn: "openLoginModal()",
        tag: "sync",
        params:
          "No arguments — it renders every configured provider in Pollar's prebuilt modal.",
        returns: "void — opens the prebuilt modal; there is nothing to await.",
      },
      {
        fn: "login(options)",
        tag: "sync",
        params:
          "Same options as core — enter one provider directly (e.g. login({ provider: 'google' })) without opening the modal.",
        returns:
          "void — progress surfaces through the reactive isAuthenticated / wallet values.",
      },
      {
        fn: "isAuthenticated",
        tag: "reactive value",
        params:
          "Not a function — a boolean read from usePollar(). false until the server confirms the session.",
        returns:
          "Re-renders your component when the session is created or torn down. Pair with verified before gating signing.",
      },
    ],
  },

  logout: {
    title: "Logout",
    desc: "Sign the current user out. logout() revokes this device's session server-side and clears local storage; pass { everywhere: true } to revoke every device. The same call backs both @pollar/core and @pollar/react.",
    open: "Sign out",
    alreadyOut: "You're already signed out",
    note: "revokes the current session and clears local state — isAuthenticated flips to false.",
    reactDesc:
      "logout() from usePollar() revokes the session and clears local state; the reactive isAuthenticated flips to false and your UI re-renders.",
    coreDesc:
      "client.logout() revokes this device server-side and wipes storage; logout({ everywhere: true }) or logoutEverywhere() signs out all devices.",
    coreFnsTitle: "Functions used",
    coreFnsIntro:
      "All of these are methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "logout(options?)",
        tag: "async",
        params:
          "options?: { everywhere?: boolean }. Default revokes only this device's refresh-token family; everywhere: true revokes them all.",
        returns:
          "Promise<void> — server revocation is best-effort; local state is cleared regardless.",
      },
      {
        fn: "logoutEverywhere()",
        tag: "async",
        params: "No arguments. Convenience for logout({ everywhere: true }).",
        returns:
          "Promise<void> — revokes every active session for this user across all devices.",
      },
      {
        fn: "onAuthStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: AuthState) => void — fires as the machine returns to 'idle' after the session is cleared.",
        returns: "() => void — an unsubscribe function.",
      },
    ],
    reactFnsTitle: "Hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "No arguments. Call it at the top level of a component — it reads React context, so it must run during render.",
        returns:
          "PollarContextValue — the whole SDK surface: reactive state values, modal openers, and getClient() to drop down to core.",
      },
      {
        fn: "logout()",
        tag: "sync",
        params:
          "No arguments — wraps client.logout(). Revokes the current session and clears local state.",
        returns:
          "void — nothing to await; isAuthenticated flips to false and dependent UI re-renders.",
      },
      {
        fn: "isAuthenticated",
        tag: "reactive value",
        params:
          "Not a function — a boolean read from usePollar(). Gate the sign-out button on it (nothing to revoke when already false).",
        returns:
          "Re-renders your component when it flips to false after logout.",
      },
    ],
  },

  sessions: {
    title: "Sessions",
    desc: "Review the active sessions for the signed-in user, revoke a single device, or sign out everywhere. Pollar renders the list and actions inside a modal.",
    open: "Open Sessions modal",
    note: "takes no arguments — it lists the current user's sessions and handles revocation.",
    reactDesc:
      "Drop-in button that opens a prebuilt modal — the device list, revoke and sign-out-everywhere actions are all rendered for you.",
    coreDesc:
      "Enumerate the user's sessions, revoke a single device or sign out everywhere — and render the list yourself.",
    coreFnsTitle: "Functions used",
    coreFnsIntro:
      "All of these are methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "listSessions()",
        tag: "async",
        params: "No arguments.",
        returns:
          "Promise<SessionInfo[]> — one row per device / refresh-token family (familyId, deviceLabel, current, lastUsedAt, expiresAt, …).",
      },
      {
        fn: "revokeSession(familyId)",
        tag: "async",
        params:
          "familyId: string — from a SessionInfo row. Revoking the current session signs this device out.",
        returns: "Promise<void>.",
      },
      {
        fn: "logoutEverywhere()",
        tag: "async",
        params: "No arguments.",
        returns: "Promise<void> — revokes every session for the user.",
      },
      {
        fn: "getSessionsState()",
        tag: "sync",
        params: "No arguments.",
        returns:
          "SessionsState — a discriminated union on step; data holds the list when loaded. onSessionsStateChange(cb) subscribes to it.",
      },
    ],
    reactFnsTitle: "Hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "No arguments. Call it at the top level of a component — it reads React context, so it must run during render.",
        returns:
          "PollarContextValue — the whole SDK surface: reactive state values, modal openers, and getClient() to drop down to core.",
      },
      {
        fn: "openSessionsModal()",
        tag: "sync",
        params:
          "No arguments — it lists the current user's sessions and handles revocation.",
        returns: "void — opens the prebuilt modal; there is nothing to await.",
      },
      {
        fn: "sessions",
        tag: "reactive value",
        params:
          "Not a function — a value of type SessionsState read from usePollar().",
        returns:
          "Re-renders as the list loads or a device is revoked. Mirrors getClient().getSessionsState().",
      },
    ],
  },

  distribution: {
    title: "Distribution",
    desc: "List the distribution rules the user is eligible for and claim their share. Pollar renders the rule list and claim actions inside a modal.",
    open: "Open Distribution modal",
    note: "takes no arguments — it loads the user's rules and handles claiming.",
    reactDesc:
      "Drop-in button that opens a prebuilt modal — the eligible-rule list and claim actions are all rendered for you.",
    coreDesc:
      "List the rules the user is eligible for and claim a share yourself.",
    coreFnsTitle: "Functions used",
    coreFnsIntro:
      "All of these are methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "listDistributionRules()",
        tag: "async",
        params: "No arguments.",
        returns:
          "Promise<DistributionRule[]> — the rules the user is eligible for (id, period, amount, …).",
      },
      {
        fn: "claimDistributionRule(body)",
        tag: "async",
        params:
          "body: DistributionClaimBody — { ruleId: string } identifying the rule to claim.",
        returns:
          "Promise<DistributionClaimContent> — the claim result (amount, tx reference, …).",
      },
    ],
    reactFnsTitle: "Hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "No arguments. Call it at the top level of a component — it reads React context, so it must run during render.",
        returns:
          "PollarContextValue — the whole SDK surface: reactive state values, modal openers, and getClient() to drop down to core.",
      },
      {
        fn: "openDistributionRulesModal()",
        tag: "sync",
        params:
          "No arguments — it loads the user's rules and handles claiming.",
        returns: "void — opens the prebuilt modal; there is nothing to await.",
      },
    ],
  },

  ramp: {
    title: "Ramp",
    desc: "Buy and sell crypto with local payment methods (SPEI, PIX, PSE, ACH) through anchors like Anclap. Pollar renders the entire quote-and-payment flow inside a modal.",
    open: "Open Ramp modal",
    note: "takes no arguments — country, currency and direction are picked inside the modal.",
    reactDesc:
      "Drop-in button that opens a prebuilt modal — the whole quote → payment → settle flow is rendered for you.",
    coreDesc:
      "Drive the on/off-ramp yourself: quote, create the ramp, then poll until it settles.",
    coreFnsTitle: "Functions used",
    coreFnsIntro:
      "All of these are methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "getRampsQuote(query)",
        tag: "async",
        params:
          "query: RampsQuoteQuery — { direction: 'onramp' | 'offramp', amount, fiatCurrency, country, … }.",
        returns:
          "Promise<RampsQuoteResponse> — the available quotes for the request.",
      },
      {
        fn: "createOnRamp(body)",
        tag: "async",
        params: "body: RampsOnrampBody — a chosen quote selection.",
        returns:
          "Promise<RampsOnrampResponse> — content.id and content.paymentInstructions.",
      },
      {
        fn: "createOffRamp(body)",
        tag: "async",
        params: "body: RampsOfframpBody — a chosen quote selection.",
        returns: "Promise<RampsOfframpResponse> — the off-ramp payout details.",
      },
      {
        fn: "pollRampTransaction(txId, opts?)",
        tag: "async",
        params:
          "txId: string (from the created ramp); opts?: polling options (interval, signal, …).",
        returns:
          "Promise<RampsTransactionResponse> — resolves once the ramp reaches a terminal status.",
      },
    ],
    reactFnsTitle: "Hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "No arguments. Call it at the top level of a component — it reads React context, so it must run during render.",
        returns:
          "PollarContextValue — the whole SDK surface: reactive state values, modal openers, and getClient() to drop down to core.",
      },
      {
        fn: "openRampModal()",
        tag: "sync",
        params:
          "No arguments — country, currency and direction are picked inside the modal.",
        returns: "void — opens the prebuilt modal; there is nothing to await.",
      },
    ],
  },

  swap: {
    title: "Swap",
    desc: "Swap one asset for another across on-chain venues (Aquarius AMM, Soroswap, SDEX). Pollar quotes every route, ranks them best-first and renders the whole quote-and-swap flow inside a modal.",
    open: "Open Swap modal",
    note: "takes no arguments — assets, amount and venue are picked inside the modal.",
    venuesTitle: "Venues are configured in your dashboard",
    venuesBody:
      "The swap modal only offers the venues you enable under Treasury → Swap in the Pollar dashboard. The SDK reads that selection at runtime via getSwapConfig() (the SDK_SWAP_CONFIG response) — no code change needed. An empty list hides the swap UI entirely.",
    reactDesc:
      "Drop-in button that opens a prebuilt modal — the whole quote → swap flow (trustline included) is rendered for you.",
    coreDesc:
      "Drive the swap yourself: quote across venues, then execute the best route.",
    coreFnsTitle: "Functions used",
    coreFnsIntro:
      "All of these are methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "getSwapConfig()",
        tag: "async",
        params:
          "No arguments — reads the app's dashboard selection (Treasury → Swap), intersected with server capability.",
        returns:
          "Promise<SwapVenue[]> — the enabled venues (e.g. ['aquarius', 'sdex']); empty means swap is disabled, so hide the UI.",
      },
      {
        fn: "getSwapQuote(params)",
        tag: "async",
        params:
          "params: SwapQuoteParams — { sellAsset, buyAsset, amount, provider?: 'auto' | 'aquarius' | 'soroswap' | 'sdex', slippageBps? }.",
        returns:
          "Promise<SwapQuote[]> — routes ranked by output, best first; empty when no route exists.",
      },
      {
        fn: "swap(quote, opts?)",
        tag: "async",
        params:
          "quote: SwapQuote (a route from getSwapQuote); opts?: { autoTrustline? } — adds the buy-asset trustline first when needed.",
        returns:
          "Promise<SubmitOutcome> — runs the quote's build payload through the tx pipeline (on-chain minReceived enforces slippage).",
      },
    ],
    reactFnsTitle: "Hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "No arguments. Call it at the top level of a component — it reads React context, so it must run during render.",
        returns:
          "PollarContextValue — the whole SDK surface: reactive state values, modal openers, and getClient() to drop down to core.",
      },
      {
        fn: "getSwapConfig()",
        tag: "async",
        params:
          "No arguments — resolves the venues this app exposes, from your dashboard selection (Treasury → Swap).",
        returns:
          "Promise<SwapVenue[]> — enabled venues; empty means swap is disabled for this app, so hide the swap UI.",
      },
      {
        fn: "openSwapModal()",
        tag: "sync",
        params:
          "No arguments — assets, amount and venue are picked inside the modal.",
        returns: "void — opens the prebuilt modal; there is nothing to await.",
      },
    ],
  },

  earn: {
    title: "Earn",
    desc: "Put idle balances to work: deposit into DeFindex vaults or Blend pools and earn on-chain yield. Pollar lists every enabled provider with its live APY and renders the whole deposit-and-withdraw flow inside a modal.",
    open: "Open Earn modal",
    note: "takes no arguments — provider, opportunity and amount are picked inside the modal.",
    providersTitle: "Providers are configured in your dashboard",
    providersBody:
      "The Earn modal only offers the providers you enable under Treasury → Earn in the Pollar dashboard, intersected with server capability — Blend needs a pool address, DeFindex needs an API key. The SDK reads that selection at runtime via getEarnProviders() (the SDK_EARN_PROVIDERS response). An empty list hides the Earn UI entirely.",
    reactDesc:
      "Drop-in button that opens a prebuilt modal — the whole provider → opportunity → deposit / withdraw flow is rendered for you.",
    coreDesc:
      "Drive Earn yourself: list opportunities, read the position, then deposit or withdraw.",
    coreFnsTitle: "Functions used",
    coreFnsIntro:
      "All of these are methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "getEarnProviders()",
        tag: "async",
        params:
          "No arguments — reads the app's dashboard selection (Treasury → Earn), intersected with server capability.",
        returns:
          "Promise<EarnProviderId[]> — the enabled providers (e.g. ['blend', 'defindex']); empty means Earn is disabled, so hide the UI.",
      },
      {
        fn: "getEarnOpportunities(provider)",
        tag: "async",
        params: "provider: EarnProviderId — 'blend' or 'defindex'.",
        returns:
          "Promise<EarnOpportunity[]> — the vaults (DeFindex) / pools (Blend) on this network, each with id, kind, asset and live APY.",
      },
      {
        fn: "getEarnPosition(params)",
        tag: "async",
        params:
          "params: EarnPositionParams — { provider, opportunity } (wallet address filled by the client).",
        returns:
          "Promise<EarnPosition> — balance, live APY, withdrawUnit ('asset' for Blend, 'shares' for DeFindex) and the max withdrawable.",
      },
      {
        fn: "earnDeposit(params)",
        tag: "async",
        params:
          "params: EarnTxParams — { provider, opportunity, amount } (amount is the underlying asset).",
        returns:
          "Promise<SubmitOutcome> — signs + submits the provider-built XDR through the tx pipeline.",
      },
      {
        fn: "earnWithdraw(params)",
        tag: "async",
        params:
          "params: EarnTxParams — { provider, opportunity, amount } (amount in the position's withdrawUnit).",
        returns:
          "Promise<SubmitOutcome> — signs + submits the provider-built XDR through the tx pipeline.",
      },
    ],
    reactFnsTitle: "Hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "No arguments. Call it at the top level of a component — it reads React context, so it must run during render.",
        returns:
          "PollarContextValue — the whole SDK surface: reactive state values, modal openers, and getClient() to drop down to core.",
      },
      {
        fn: "getEarnProviders()",
        tag: "async",
        params:
          "No arguments — resolves the providers this app exposes, from your dashboard selection (Treasury → Earn).",
        returns:
          "Promise<EarnProviderId[]> — enabled providers; empty means Earn is disabled for this app, so hide the Earn UI.",
      },
      {
        fn: "openEarnModal()",
        tag: "sync",
        params:
          "No arguments — provider, opportunity and amount are picked inside the modal.",
        returns: "void — opens the prebuilt modal; there is nothing to await.",
      },
    ],
  },

  kyc: {
    title: "KYC",
    desc: "Verify the user's identity. Pollar renders the entire provider-selection and verification flow inside a modal.",
    countryLabel: "Country (ISO 3166-1 alpha-2)",
    levelLabel: "Level",
    currentStatus: "current status",
    start: "Start KYC",
    coreFnsTitle: "@pollar/core — functions used",
    coreFnsIntro:
      "All of these are methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "getKycProviders(country)",
        tag: "async",
        params: "country: string — an ISO 3166-1 alpha-2 code (e.g. 'MX').",
        returns:
          "Promise<{ providers }> — the KYC providers available in that country.",
      },
      {
        fn: "startKyc(body)",
        tag: "async",
        params:
          "body: KycStartBody — { providerId: string; level: 'basic' | 'intermediate' | 'enhanced' }.",
        returns:
          "Promise<KycStartResponse> — the verification session to hand off to the provider.",
      },
      {
        fn: "pollKycStatus(providerId, opts?)",
        tag: "async",
        params:
          "providerId: string; opts?: { intervalMs?, timeoutMs? } polling controls.",
        returns:
          "Promise — resolves once the status settles to 'approved' | 'rejected' (from 'none' | 'pending').",
      },
      {
        fn: "getKycStatus(providerId?)",
        tag: "async",
        params: "providerId?: string — omit to read the user's overall status.",
        returns: "Promise<{ status, level?, providerId }> — a one-shot read.",
      },
    ],
    reactFnsTitle: "@pollar/react — hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "No arguments. Call it at the top level of a component — it reads React context, so it must run during render.",
        returns:
          "PollarContextValue — the whole SDK surface: reactive state values, modal openers, and getClient() to drop down to core.",
      },
      {
        fn: "openKycModal(options?)",
        tag: "sync",
        params:
          "options?: { country?: string; level?: 'basic' | 'intermediate' | 'enhanced'; onApproved?: () => void } — wraps getKycProviders / startKyc / pollKycStatus.",
        returns: "void — opens the prebuilt modal; there is nothing to await.",
      },
      {
        fn: "<KycStatus status={…} />",
        tag: "component",
        params:
          "status: 'none' | 'pending' | 'approved' | 'rejected' — the badge to render.",
        returns:
          "A ready-made status badge component, exported from @pollar/react.",
      },
    ],
  },

  balance: {
    title: "Balance",
    desc: "Read a Stellar account's balances — the connected wallet's, or any address by public key.",
    reactDesc:
      "Drop-in button that opens a prebuilt modal showing the connected wallet's balances, fully rendered.",
    coreDesc:
      "Fetch balances yourself and render the raw response — the connected wallet via refreshBalance(), or any address via getWalletBalance(pk).",
    open: "Open Balance modal",
    modalNote:
      "takes no arguments — it reads the connected wallet and renders the table for you.",
    lookupLabel: "Look up any address",
    fetch: "Fetch",
    useMyWallet: "Use my wallet",
    coreNote:
      "the connected wallet drives the reactive walletBalance state; an arbitrary address returns the data directly.",
    idle: "Submit a request to load balances.",
    noBalances: "No balances found.",
    assetCol: "Asset",
    balanceCol: "Balance",
    availableCol: "Available",
    rawResponse: "Raw response",
    coreFnsTitle: "Functions used",
    coreFnsIntro:
      "All of these are methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "refreshBalance()",
        tag: "async",
        params:
          "No arguments — the wallet and network are resolved server-side from the session.",
        returns:
          "Promise<void> — writes the connected wallet's balances into the reactive state; read it with getWalletBalanceState().",
      },
      {
        fn: "getWalletBalance(publicKey, network?)",
        tag: "async",
        params:
          "publicKey: string (a G… address); network?: 'testnet' | 'mainnet' — defaults to the client's current network.",
        returns:
          "Promise<WalletBalanceContent> — returns the balances directly (no reactive state); use it for any arbitrary address.",
      },
      {
        fn: "getWalletBalanceState()",
        tag: "sync",
        params: "No arguments.",
        returns:
          "WalletBalanceState — a discriminated union on step: 'idle' | 'loading' | 'loaded' | 'error'. data.balances exists only when step === 'loaded'.",
      },
      {
        fn: "onWalletBalanceStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: WalletBalanceState) => void — invoked on every state transition.",
        returns:
          "() => void — an unsubscribe function. The react hook's walletBalance is built on top of this.",
      },
    ],
    reactFnsTitle: "Hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "No arguments. Call it at the top level of a component — it reads React context, so it must run during render.",
        returns:
          "PollarContextValue — the whole SDK surface: reactive state values, modal openers, and getClient() to drop down to core.",
      },
      {
        fn: "openWalletBalanceModal()",
        tag: "sync",
        params:
          "No arguments — it reads the connected wallet and renders the balances table inside the modal.",
        returns: "void — opens the prebuilt modal; there is nothing to await.",
      },
      {
        fn: "walletBalance",
        tag: "reactive value",
        params:
          "Not a function — a value of type WalletBalanceState read from usePollar().",
        returns:
          "Re-renders your component whenever it changes. Mirrors getClient().getWalletBalanceState(): step plus data when loaded.",
      },
    ],
  },

  assets: {
    title: "Enabled assets",
    desc: "The app's dashboard-enabled assets paired with the connected wallet's on-chain trustline state — so you know which trustlines the wallet still needs to add. Native XLM is always present.",
    reactDesc:
      "Drop-in button that opens a prebuilt modal listing every enabled asset and whether the connected wallet has a trustline for it.",
    coreDesc:
      "Fetch the enabled assets yourself with refreshAssets() and render the reactive enabledAssets state — no balances, just trustline status.",
    open: "Open Assets modal",
    modalNote:
      "takes no arguments — it reads the connected wallet's session and renders the trustline table for you.",
    refresh: "Refresh assets",
    coreNote:
      "the wallet and network are resolved server-side from the session; the result drives the reactive enabledAssets state.",
    idle: "Refresh to load the app's enabled assets.",
    noAssets: "No enabled assets found.",
    assetCol: "Asset",
    typeCol: "Type",
    trustlineCol: "Trustline",
    established: "Established",
    missing: "Missing",
    rawResponse: "Raw response",
    coreFnsTitle: "Functions used",
    coreFnsIntro:
      "All of these are methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "refreshAssets()",
        tag: "async",
        params:
          "No arguments — the wallet and network are resolved server-side from the session.",
        returns:
          "Promise<void> — writes the enabled assets + trustline state into the reactive state; read it with getEnabledAssetsState().",
      },
      {
        fn: "getEnabledAssetsState()",
        tag: "sync",
        params: "No arguments.",
        returns:
          "EnabledAssetsState — a discriminated union on step: 'idle' | 'loading' | 'loaded' | 'error'. data.assets exists only when step === 'loaded'.",
      },
      {
        fn: "onEnabledAssetsStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: EnabledAssetsState) => void — invoked on every state transition.",
        returns:
          "() => void — an unsubscribe function. The react hook's enabledAssets is built on top of this.",
      },
    ],
    reactFnsTitle: "Hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "openEnabledAssetsModal()",
        tag: "sync",
        params:
          "No arguments — it reads the connected wallet and renders the enabled-assets / trustline table inside the modal.",
        returns: "void — opens the prebuilt modal; there is nothing to await.",
      },
      {
        fn: "refreshAssets()",
        tag: "async",
        params:
          "No arguments — same call as the core method, re-exported on the hook for convenience.",
        returns:
          "Promise<void> — refreshes the enabledAssets reactive value below.",
      },
      {
        fn: "enabledAssets",
        tag: "reactive value",
        params:
          "Not a function — a value of type EnabledAssetsState read from usePollar().",
        returns:
          "Re-renders your component whenever it changes. Mirrors getClient().getEnabledAssetsState(): step plus data when loaded.",
      },
    ],
    trust: {
      title: "Enable / disable a trustline",
      desc: 'A trustline is a change_trust operation. Enabling adds the asset (optionally capped by a limit); disabling sends limit "0", which removes it — and only succeeds when the asset balance is already zero. Native XLM never needs a trustline.',
      typeLabel: "Asset type",
      codeLabel: "Asset code",
      codePh: "USDC",
      issuerLabel: "Issuer",
      issuerPh: "G… (issuing account)",
      limitLabel: "Limit",
      limitNote:
        'Maximum amount you\'ll trust. Leave empty for the maximum; Disable forces "0".',
      limitPh: "1000000",
      enable: "Enable trustline",
      disable: "Disable trustline",
      running: "Submitting…",
      stateIdle: "Set the asset, then enable or disable its trustline.",
      removedNote:
        "On a successful disable, the balance response reports trustlineRemoved: true.",
      fnsTitle: "change_trust functions",
      fnsIntro:
        "runTx is the one-shot path; the demo then re-renders the table via refreshAssets(). Both come from usePollar() (or the underlying PollarClient via getClient()).",
      fns: [
        {
          fn: "runTx(operation, params, options?)",
          tag: "async",
          params:
            "operation: 'change_trust'; params.asset: { type, code, issuer }; params.limit?: string ('0' removes the trustline, omitted = max).",
          returns:
            "Promise<SubmitOutcome> — build → sign → submit in one call; status: 'success' | 'pending' | 'error'. Drives the reactive tx state.",
        },
        {
          fn: "buildTx(operation, params, options?)",
          tag: "async",
          params:
            "Same arguments as runTx — use it when you want to inspect the unsigned XDR before signing.",
          returns:
            "Promise<BuildOutcome> — returns the built tx without submitting; pair it with signAndSubmitTx().",
        },
        {
          fn: "refreshAssets()",
          tag: "async",
          params: "No arguments.",
          returns:
            "Promise<void> — re-fetches the enabled-assets table so trustlineEstablished reflects the change_trust you just submitted.",
        },
      ],
    },
  },

  escrow: {
    title: "Escrow",
    desc: "Trustless Work adapter — the SDK signs and submits the unsigned XDR with the connected wallet, so your code only deals with business params.",
    tabs: {
      deploy: "Deploy",
      fund: "Fund",
      milestone: "Milestone",
      dispute: "Dispute",
    },
    engagementId: "Engagement ID",
    titleField: "Title",
    description: "Description",
    approver: "Approver",
    approverNote: "Defaults to your wallet address.",
    serviceProvider: "Service provider",
    platformAddress: "Platform address",
    amountUsdc: "Amount (USDC)",
    platformFee: "Platform fee %",
    contractId: "Contract ID",
    contractIdNote: "The escrow contract address returned after deployment.",
    milestoneIndex: "Milestone index",
    approverFunds: "Approver funds",
    serviceProviderFunds: "Service provider funds",
    signing: "Signing…",
    approveMilestone: "Approve milestone",
    releaseFunds: "Release funds",
    initiateDispute: "Initiate dispute",
    resolveDispute: "Resolve dispute",
    deployEscrow: "Deploy escrow",
    fundEscrow: "Fund escrow",
    setupSummary: "one-time adapter setup",
    txIdle: "Trigger an operation to see signing progress.",
    coreFnsTitle: "@pollar/core — functions used",
    coreFnsIntro:
      "All of these are methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "signAndSubmitTx(unsignedXdr?)",
        tag: "async",
        params:
          "unsignedXdr?: string — the unsigned XDR the escrow adapter returns from Trustless Work. Omit it for custodial flows.",
        returns:
          "Promise<SubmitOutcome> — signs the XDR with the connected wallet and broadcasts it; { status, hash, … }.",
      },
      {
        fn: "getTransactionState()",
        tag: "sync",
        params: "No arguments.",
        returns:
          "TransactionState — the auto-sign-and-submit progress; null before any tx runs.",
      },
    ],
    reactFnsTitle: "@pollar/react — hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook (plus the adapter factory) — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "No arguments. Call it at the top level of a component — it reads React context, so it must run during render.",
        returns:
          "PollarContextValue — the whole SDK surface: reactive state values, modal openers, and getClient() to drop down to core.",
      },
      {
        fn: "createPollarAdapterHook(key)",
        tag: "factory",
        params:
          "key: string — the adapter slot registered on the provider (e.g. 'escrow'). Call it once at module scope.",
        returns:
          "A typed hook (e.g. useEscrow) whose methods each return Promise<SubmitOutcome> — adapter → unsigned XDR → auto sign + submit.",
      },
      {
        fn: "openTxModal()",
        tag: "sync",
        params: "No arguments.",
        returns:
          "void — opens the prebuilt review/sign modal for the in-flight escrow tx.",
      },
      {
        fn: "tx",
        tag: "reactive value",
        params:
          "Not a function — a value of type TransactionState read from usePollar().",
        returns:
          "Re-renders through the auto sign-and-submit flow (building → signing → submitting → success).",
      },
    ],
  },

  transactions: {
    ops: {
      create_account: "Create Account",
      payment: "Payment",
      path_payment_strict_send: "Path Payment Strict Send",
      change_trust: "Change Trust",
      invoke_contract: "[Smart Contract] Invoke Contract Function",
    },
    operationType: "Operation type",
    destination: "Destination",
    startingBalance: "Starting balance",
    startingBalanceNote: "Amount of XLM to fund the new account with.",
    asset: "Asset",
    amount: "Amount",
    sendingAsset: "Sending asset",
    sendingAssetNote: "Asset deducted from sender's account.",
    sendAmount: "Send amount",
    destAsset: "Destination asset",
    destAssetNote: "Asset received by destination account.",
    destMin: "Minimum destination amount",
    destMinNote: "Minimum amount destination must receive.",
    intermediatePath: "Intermediate path",
    intermediatePathNote:
      "Assets to route through. Leave empty for direct path.",
    pathAsset: (i: number) => `Path asset ${i}`,
    addAsset: "+ Add asset",
    assetType: "Asset type",
    xlmNative: "XLM (native)",
    alphanum4: "Alphanumeric 4",
    alphanum12: "Alphanumeric 12",
    alphanum412: "Alphanumeric 4 / 12",
    poolShares: "Liquidity pool shares",
    assetCodePh: (max: number) => `Asset code (max ${max} chars)`,
    issuerPh: "Issuer account ID (G...)",
    trustLimit: "Trust limit",
    trustLimitNote: "Leave empty for max int64. Set 0 to remove the trustline.",
    trustLimitPh: "Leave empty for max",
    contractId: "Contract ID",
    fetchMethods: "Fetch methods",
    fetching: "Fetching…",
    fetchFailed: "Failed to fetch methods",
    selectMethod: "Select a method",
    options: "Options",
    timeout: "Timeout",
    timeoutNote: "Transaction timeout in seconds.",
    maxFee: "Max fee stroops",
    maxFeeNote: "Maximum fee in stroops (1 XLM = 10,000,000 stroops).",
    memo: "Memo",
    memoPhId: "Numeric ID",
    memoPhText: "Text memo",
    building: "Building…",
    invalidParams: "Invalid params",
    tipPre: "Tip: ",
    tipPost: " opens a built-in modal that handles step 2 for you.",
    buildStep: "build transaction",
    submitStep: "submit signed transaction",
    stateLabel: "transaction state",
    stateIdle: "Submit a transaction to see its state here.",
    coreFnsTitle: "@pollar/core — functions used",
    coreFnsIntro:
      "All of these are methods on the client returned by getClient() — the underlying PollarClient instance.",
    coreFns: [
      {
        fn: "buildTx(operation, params, options?)",
        tag: "async",
        params:
          "operation: TxBuildBody['operation'] (e.g. 'payment'); params: the operation body; options?: optional build flags (timeout, maxFee, memo).",
        returns:
          "Promise<BuildOutcome> — builds the transaction and returns the unsigned XDR (or a custodial built tx) without submitting.",
      },
      {
        fn: "signAndSubmitTx(unsignedXdr?)",
        tag: "async",
        params:
          "unsignedXdr?: string — the XDR from buildTx. Omit it for custodial flows, where the SDK submits the built tx for you.",
        returns:
          "Promise<SubmitOutcome> — { status: 'success' | 'pending' | 'error', hash, … }.",
      },
      {
        fn: "runTx(operation, params, options?)",
        tag: "async",
        params: "Same arguments as buildTx.",
        returns:
          "Promise<SubmitOutcome> — one-shot build → sign → submit. Use it when you don't need the unsigned XDR in between.",
      },
      {
        fn: "getTransactionState()",
        tag: "sync",
        params: "No arguments.",
        returns:
          "TransactionState — the current build/sign/submit progress; null before any tx runs.",
      },
    ],
    reactFnsTitle: "@pollar/react — hook & values used",
    reactFnsIntro:
      "All of these come from the usePollar() hook — the react layer built on top of getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "No arguments. Call it at the top level of a component — it reads React context, so it must run during render.",
        returns:
          "PollarContextValue — the whole SDK surface: reactive state values, modal openers, and getClient() to drop down to core.",
      },
      {
        fn: "buildTx(operation, params, options?)",
        tag: "async",
        params: "Same as client.buildTx — operation, params, options?.",
        returns:
          "Promise<BuildOutcome> — builds the tx and drives the reactive tx state; the unsigned XDR lands in tx.buildData.",
      },
      {
        fn: "signAndSubmitTx(unsignedXdr?)",
        tag: "async",
        params:
          "unsignedXdr?: string — from the previous buildTx; omit for custodial flows.",
        returns:
          "Promise<SubmitOutcome> — signs the built tx and broadcasts it.",
      },
      {
        fn: "openTxModal()",
        tag: "sync",
        params: "No arguments.",
        returns:
          "void — opens a built-in modal that handles signing + submitting the built tx for you.",
      },
      {
        fn: "tx",
        tag: "reactive value",
        params:
          "Not a function — a value of type TransactionState read from usePollar().",
        returns:
          "Re-renders your component through building → signing → submitting → success. Mirrors getClient().getTransactionState().",
      },
    ],
  },

  activateWallet: {
    title: "Activate KYC-verified wallet",
    subtitle:
      "Simulates the server-side activation step after a user has passed KYC.",
    step1: "STEP 1",
    step2: "STEP 2",
    step1Title: "Enter your secret API key",
    warnStrong: "Demo only.",
    warnMid: " In a real integration you should ",
    warnNever: "never",
    warnEnd:
      " handle secret keys on the frontend. This call must be made exclusively from your backend server.",
    edit: "edit",
    confirm: "confirm",
    keySet: "✓ key set — not persisted, will clear on refresh",
    step2Title: "Activate wallet",
    step2Desc:
      "Provide the public key of a wallet that has already passed KYC. The server will fund it with XLM on Stellar so it becomes active.",
    publicKeyLabel: "Public key (G...)",
    activating: "Activating…",
    activate: "Activate wallet",
    activated: "✓ Wallet activated",
    amountFunded: "amount funded:",
    unexpectedError: "An unexpected error occurred.",
    endpointRef: "endpoint reference",
    back: "← back to main demo",
    errors: {
      API_KEY_NOT_FOUND: "Secret key not found or invalid.",
      API_KEY_TYPE_NOT_ALLOWED:
        "This key is a publishable key. You must use a secret key (sec_...).",
      WALLET_NOT_FOUND: "Wallet not found in the database.",
      FORBIDDEN: "This wallet does not belong to your application.",
      WALLET_ALREADY_FUNDED: "This wallet is already active on Stellar.",
      ACTIVATION_DISABLED:
        "Wallet activation is disabled in this demo — it moves to the Pollar SDK once KYC is ready.",
      APP_WALLET_NOT_FOUND:
        "Your application does not have a funding wallet configured.",
      FUND_XLM_FAILED: "Failed to send XLM to the wallet. Please try again.",
    } as Record<string, string>,
  },

  lumenwipe: {
    title: "LumenWipe",
    intro:
      "Plan and build the transactions that close a Stellar account and merge its remaining XLM into a destination. The API returns an ordered plan and the unsigned XDR for each step — you sign locally and submit yourself.",
    creditPre: "This tab is a live demo of the public ",
    creditApi: "LumenWipe API",
    creditMid: ". All credit to the LumenWipe team — see ",
    creditPost: " for the original service and documentation.",

    network: "Network",
    account: "Account to close",
    accountNote: "Source account (G…). It must exist on the selected network.",
    destination: "Destination",
    destinationNote: "Where the XLM goes — a wallet or exchange address (G…).",
    memo: "Memo",
    memoNote: "Required by memo-enforcing exchanges.",
    memoType: "Memo type",
    getPlan: "Get plan",
    gettingPlan: "Getting plan…",

    planTitle: "Plan",
    executable: "Executable",
    notExecutable: "Not executable",
    mediatorRequired: "Mediator required",
    requiresMemo: "Requires memo",
    blockers: "Blockers",
    steps: "Steps",
    noSteps: "No steps — the account is already closed.",
    buildXdr: "Build XDR",
    building: "Building…",
    unsignedXdr: "Unsigned XDR",
    copy: "Copy",
    copied: "Copied",
    fee: "fee",
    ops: "ops",
    cosignNote: "Needs the mediator co-signature (exchange merge).",
    fallbackNote:
      "No DEX route — asset sent back to its issuer instead of swapped to XLM.",
    useMyWallet: "Use my wallet",
    myWallet: "My wallet",
    swap: "Swap account ↔ destination",
    signWithPollar: "Sign & submit with Pollar",
    signing: "Signing…",
    submitted: "Submitted:",
    ownAccountHint:
      "This is your connected wallet — sign each step with Pollar.",
    networkMismatch:
      "Your wallet is on a different network — switch the selector to match it to sign.",
    cosignManual:
      "Mediator co-sign required — sign and submit this step manually.",
    signNeedsPollarWallet:
      "This action isn't allowed — to sign, the account being closed must be the wallet you're logged in with on Pollar.",

    safetyTitle: "Read-only & non-custodial",
    safety1:
      "The API is read-only. Never send a secret key (S…) — only public keys (G…).",
    safety2:
      "Responses contain unsigned transaction envelopes. Decode and verify every XDR before signing it in your own environment.",

    loopTitle: "The wind-down loop",
    refTitle: "Step types",

    requestFailed:
      "Request failed. Check the account, destination and network.",
    emptyFields: "Enter both an account and a destination.",
  },

  twAbout: {
    eyebrow: "Trustless Work",
    title: "Milestone-based escrows on Stellar",
    tagline: "Escrows for stablecoins made easy.",
    body: [
      "Trustless Work provides non-custodial, milestone-based escrow infrastructure built on the Stellar blockchain. Funds are locked on-chain and released only when predefined conditions are met — taking counterparty risk out of stablecoin transactions.",
      "Instead of writing smart contracts from scratch, builders integrate escrow through Trustless Work's APIs, SDKs and open-source templates — powering marketplaces, crowdfunding, freelancing and trade-finance flows without a custodial intermediary.",
      "In this demo, the Escrow tab uses the Pollar SDK's Trustless Work adapter: you deploy, fund, approve milestones and resolve disputes, and the SDK signs and submits the unsigned XDR with your connected wallet automatically.",
    ],
    featuresTitle: "What it offers",
    features: [
      {
        title: "Non-custodial escrow",
        desc: "Funds are locked on-chain and released by rules — never held by a third party.",
      },
      {
        title: "Milestone-based releases",
        desc: "Break a deal into milestones and release funds as each one is approved.",
      },
      {
        title: "APIs, SDKs & templates",
        desc: "Drop-in escrow without writing or auditing smart contracts yourself.",
      },
      {
        title: "Built for stablecoins",
        desc: "Designed around stablecoin payments on Stellar.",
      },
    ],
    resourcesTitle: "Official resources",
    websiteLabel: "Website",
    dappLabel: "Open the dApp",
    disclaimer:
      "Summary based on the official Trustless Work pages. Pollar is not affiliated with Trustless Work — all credit to their team.",
  },

  lwAbout: {
    eyebrow: "LumenWipe",
    title: "Cleanly close a Stellar account",
    tagline: "Recover the XLM locked in account reserves.",
    body: [
      "Every Stellar account locks a minimum reserve — 1 XLM plus 0.5 XLM per subentry (trustlines, offers, data entries, signers). LumenWipe recovers those reserves by guiding an account through a complete, auditable wind-down.",
      "It systematically unwinds every encumbrance — cancelling offers, exiting Soroban DeFi positions, removing trustlines and data entries — converts the remaining balances to XLM, then merges the account into a destination wallet.",
      "LumenWipe is non-custodial: every transaction is signed in your browser and keys never leave it. The API is read-only and returns unsigned XDRs, so you decode and verify each step before signing.",
      "In this demo, the LumenWipe tab calls the public LumenWipe API to plan and build the wind-down, and lets you sign each step with your connected Pollar wallet.",
    ],
    featuresTitle: "What it does",
    features: [
      {
        title: "Recovers locked reserves",
        desc: "Frees the XLM held by an account's minimum reserve.",
      },
      {
        title: "Full wind-down loop",
        desc: "Offers, trustlines, data, signers and DeFi positions — handled in order.",
      },
      {
        title: "Soroban & DeFi aware",
        desc: "Exits supported Soroban DeFi positions before closing.",
      },
      {
        title: "Non-custodial & resumable",
        desc: "Signs in the browser; sessions can be paused and resumed.",
      },
    ],
    resourcesTitle: "Official resources",
    websiteLabel: "Website",
    docsLabel: "Documentation",
    disclaimer:
      "Summary based on the official LumenWipe site and docs. All credit to the LumenWipe team.",
  },

  niriumAbout: {
    eyebrow: "Nirium",
    title: "Treasury & payments for Stellar agents",
    tagline: "Nirium plans the transactions; you sign with your own wallet.",
    body: [
      "Nirium is a non-custodial treasury and payments layer for Stellar. It plans and assembles transactions — returning unsigned XDR — while signing stays entirely with the connected wallet. Nirium thinks; you sign.",
      "It ships as an npm package (npm i nirium) that exposes an Agent you can drive from the browser. The first integration is x402 (programmatic payments), followed by an audit trail, with treasury/CETES (yield via Etherfuse) as the flagship once it reaches mainnet.",
      "In this demo, Nirium plugs into Pollar exactly like the DeFindex or Blend adapters: the adapter runs client-side with public information only, calls Nirium for the unsigned XDR, and the Pollar SDK signs and submits it with your connected wallet. No secret key ever touches the frontend — your signature is the authorization.",
    ],
    featuresTitle: "What it offers",
    features: [
      {
        title: "Non-custodial by design",
        desc: "Nirium builds unsigned XDR; the connected Pollar wallet signs. No secret keys in the frontend.",
      },
      {
        title: "x402 payments",
        desc: "Software-only programmatic payments — the first integration, no API key required.",
      },
      {
        title: "Audit trail",
        desc: "A verifiable, non-custodial record of activity for compliance and trust.",
      },
      {
        title: "Treasury & CETES",
        desc: "Yield-bearing treasury via Etherfuse — the flagship track, headed to mainnet after audit.",
      },
    ],
    resourcesTitle: "Official resources",
    websiteLabel: "Developers",
    repoLabel: "SDK (GitHub)",
    disclaimer:
      "Summary based on materials shared by the Nirium team. Pollar is not affiliated with Nirium — all credit to their team.",
  },

  rampAbout: {
    eyebrow: "Integration",
    title: "On/off-ramp with local payment methods",
    tagline:
      "Buy and sell crypto through regional anchors — one modal, one flow.",
    body: [
      "Ramp connects your users to fiat: they buy crypto with a local payment method (SPEI, PIX, PSE, ACH) or cash out the other way. Pollar quotes the anchor, creates the on/off-ramp and surfaces the payment instructions inside a single modal.",
      "Which anchors and rails are available is decided in your dashboard — the SDK reads that selection at runtime from the app config, so enabling a new anchor is a dashboard toggle, not a redeploy. If nothing is enabled, the ramp UI stays hidden.",
      "Under the hood the flow is quote → create ramp → poll until it settles, all through @pollar/core. See the Implementation tab for the live demo and the exact calls.",
    ],
    featuresTitle: "Anchors & status",
    features: [
      {
        title: "Anclap — live",
        desc: "On/off-ramp local currency across regional rails (SPEI, PIX, PSE…), settled on Stellar.",
      },
      {
        title: "More anchors — in progress",
        desc: "Additional regional anchors and payment rails are being wired in; enable them from the dashboard as they ship.",
      },
      {
        title: "Configured in your dashboard",
        desc: "Toggle anchors under Treasury — the SDK reads your selection at runtime, with no code change.",
      },
      {
        title: "One modal, core or React",
        desc: "openRampModal() renders the whole quote → payment → settle flow; or drive it yourself with @pollar/core.",
      },
    ],
    resourcesTitle: "Resources",
    anclapLabel: "Anclap",
    docsLabel: "Stellar anchors & SEPs",
    disclaimer:
      "Anchor availability depends on your dashboard configuration and each anchor's coverage. Anclap is a third party — all credit to their team.",
  },

  swapAbout: {
    eyebrow: "Integration",
    title: "Swap across on-chain venues",
    tagline: "One modal, best price across every venue you enable.",
    body: [
      "Swap lets your users exchange one asset for another on-chain. Pollar quotes every enabled venue, ranks the routes best-first and renders the whole quote → swap flow — trustline included — inside a single modal.",
      "The venues on offer are decided in your dashboard (Treasury → Swap). The SDK reads that selection at runtime via getSwapConfig() (the SDK_SWAP_CONFIG response), so turning a venue on or off is a dashboard toggle. An empty list hides the swap UI entirely.",
      "Under the hood the flow is getSwapQuote → swap, all through @pollar/core. See the Implementation tab for the live demo and the exact calls.",
    ],
    featuresTitle: "Venues & status",
    features: [
      {
        title: "Aquarius — live",
        desc: "Soroban AMM (liquidity pools). Works for classic and smart wallets.",
      },
      {
        title: "Stellar DEX — live",
        desc: "Stellar's native order book via path payments. Classic wallets only.",
      },
      {
        title: "Soroswap — in progress",
        desc: "DEX aggregator across Soroban protocols. Needs a platform Soroswap API key; skipped until it's set.",
      },
      {
        title: "Configured in your dashboard",
        desc: "Enable venues under Treasury → Swap; the SDK reads getSwapConfig() at runtime, with no code change.",
      },
    ],
    resourcesTitle: "Resources",
    aquariusLabel: "Aquarius",
    soroswapLabel: "Soroswap",
    disclaimer:
      "Venue availability depends on your dashboard configuration and platform capability. Aquarius and Soroswap are third parties — all credit to their teams.",
  },

  earnAbout: {
    eyebrow: "Integration",
    title: "Earn yield on-chain",
    tagline: "One modal, real yield across every provider you enable.",
    body: [
      "Earn lets your users put idle balances to work: deposit into a DeFindex vault or a Blend pool and earn on-chain yield. Pollar lists every enabled provider with its live APY and renders the whole deposit → withdraw flow inside a single modal.",
      "The providers on offer are decided in your dashboard (Treasury → Earn) and intersected with server capability — Blend needs a pool address, DeFindex needs an API key. The SDK reads that selection at runtime via getEarnProviders() (the SDK_EARN_PROVIDERS response), so turning a provider on or off is a dashboard toggle. An empty list hides the Earn UI entirely.",
      "Under the hood the flow is getEarnOpportunities → getEarnPosition → earnDeposit / earnWithdraw, all through @pollar/core. See the Implementation tab for the live demo and the exact calls.",
    ],
    featuresTitle: "Providers & status",
    features: [
      {
        title: "DeFindex — live",
        desc: "Automated yield vaults. Deposit an asset, receive shares; withdraw amounts are in shares. Built via the DeFindex API.",
      },
      {
        title: "Blend — live",
        desc: "Lending pools. Deposit and withdraw in the underlying asset; the XDR is built contract-direct.",
      },
      {
        title: "Configured in your dashboard",
        desc: "Enable providers under Treasury → Earn; the SDK reads getEarnProviders() at runtime, with no code change.",
      },
      {
        title: "One modal, core or React",
        desc: "openEarnModal() renders the whole opportunity → deposit / withdraw flow; or drive it yourself with @pollar/core.",
      },
    ],
    resourcesTitle: "Resources",
    defindexLabel: "DeFindex",
    blendLabel: "Blend",
    disclaimer:
      "Provider availability depends on your dashboard configuration and platform capability. DeFindex and Blend are third parties — all credit to their teams.",
  },

  niriumX402: {
    title: "x402 payments",
    desc: "Send a programmatic x402 payment. Nirium plans and assembles the transaction; the Pollar SDK signs and submits the unsigned XDR with your connected wallet — no secret key, no API key.",
    destination: "Destination",
    destinationNote: "Recipient Stellar address (G…) on testnet.",
    asset: "Asset",
    assetNote: "'XLM' for native, or 'CODE:ISSUER' for an issued asset.",
    amount: "Amount",
    reference: "Reference",
    referenceNote:
      "Optional x402 resource / invoice id — stored as the tx memo (max 28 chars).",
    pay: "Pay with Pollar",
    signing: "Signing…",
    setupSummary: "Setup — register the Nirium adapter once",
    txIdle: "Fill in destination, amount and asset, then pay.",
    coreFnsTitle: "@pollar/core — functions used",
    coreFnsIntro:
      "The adapter returns an unsigned XDR; the core client signs and submits it.",
    coreFns: [
      {
        fn: "niriumAdapter.pay(params)",
        tag: "async",
        params:
          "params: { to, amount, asset, reference?, signer }. Nirium plans the payment.",
        returns:
          "Promise<{ unsignedTransaction: string }> — the unsigned XDR, ready to sign.",
      },
      {
        fn: "client.signAndSubmitTx(xdr)",
        tag: "async",
        params:
          "xdr: string — the unsigned transaction returned by the adapter.",
        returns:
          "Promise<SubmitOutcome> — { status, hash, … }. Signs with the connected wallet, then submits.",
      },
    ],
    reactFnsTitle: "@pollar/react — hook & values used",
    reactFnsIntro:
      "createPollarAdapterHook wires the adapter so Pollar auto-signs; usePollar exposes the live tx state.",
    reactFns: [
      {
        fn: "useNiriumX402()",
        tag: "hook",
        params:
          "No arguments. Returns the wrapped adapter — calling pay() builds, signs and submits in one step.",
        returns:
          "WrappedAdapter — { pay }. The unsigned XDR is signed + submitted automatically.",
      },
      {
        fn: "usePollar().tx",
        tag: "reactive value",
        params: "No arguments — read it during render.",
        returns:
          "TransactionState — the live build → sign → submit progress (tx.step, tx.hash).",
      },
    ],
  },

  cosmosPayAbout: {
    eyebrow: "Cosmos Pay",
    title: "SEP-7 payment intents for Stellar",
    tagline: "Cosmos Pay assembles the payment; you sign with your own wallet.",
    body: [
      "Cosmos Pay is an object-oriented SDK for the Cosmos Pay Payments API. Its server half creates Stellar SEP-7 payment intents — plus webhooks, products, customers and analytics — with your secret key; its browser half completes them.",
      "Browser wallets don't ingest SEP-7 `web+stellar:` URIs from a dapp, so Cosmos Pay's web client adapts each intent into a concrete Stellar transaction (XDR) instead — building the payment for a `pay` intent, or reusing the XDR for a `tx` intent.",
      "In this demo Cosmos Pay plugs into Pollar exactly like the Trustless Work and Nirium adapters: the web client's buildTransaction turns the SEP-7 `pay` intent into an unsigned XDR — built from your connected account as source — and the Pollar SDK signs and submits it with your wallet. No secret key and no API key ever touch the frontend.",
    ],
    featuresTitle: "What it offers",
    features: [
      {
        title: "SEP-7 payment intents",
        desc: "Create `pay` and `tx` intents server-side; each returns a SEP-7 URI + QR any wallet can consume.",
      },
      {
        title: "Provider-agnostic web client",
        desc: "Auto-detects Freighter, xBull, Rabet, LOBSTR & Albedo — or, here, hands the unsigned XDR to Pollar.",
      },
      {
        title: "Webhooks & catalogs",
        desc: "Signed webhook delivery plus products, customers and analytics — all behind your secret key.",
      },
      {
        title: "Signed by Pollar",
        desc: "Cosmos Pay builds the payment; the connected Pollar wallet signs. No secret keys in the frontend.",
      },
    ],
    resourcesTitle: "Official resources",
    npmLabel: "npm package",
    repoLabel: "SDK (GitHub)",
    disclaimer:
      "Summary based on the published @cosmosapp/pay_sdk package. Pollar is not affiliated with Cosmos Pay — all credit to their team.",
  },

  cosmosPay: {
    title: "SEP-7 payment",
    desc: "Send a Stellar payment through a Cosmos Pay SEP-7 intent. Cosmos Pay assembles the payment and returns an unsigned XDR; the Pollar SDK signs and submits it with your connected wallet — no secret key, no API key.",
    destination: "Destination",
    destinationNote: "Recipient Stellar address (G…) on testnet.",
    asset: "Asset",
    assetNote: "'XLM' for native, or 'CODE:ISSUER' for an issued asset.",
    amount: "Amount",
    memo: "Memo",
    memoNote: "Optional note stored as a MEMO_TEXT (max 28 chars).",
    message: "Message",
    messageNote: "Optional human-readable message carried by the SEP-7 intent.",
    pay: "Pay with Pollar",
    signing: "Signing…",
    setupSummary: "Setup — register the Cosmos Pay adapter once",
    txIdle: "Fill in destination, amount and asset, then pay.",
    coreFnsTitle: "@pollar/core — functions used",
    coreFnsIntro:
      "The adapter returns an unsigned XDR; the core client signs and submits it.",
    coreFns: [
      {
        fn: "cosmosPayAdapter.pay(params)",
        tag: "async",
        params:
          "params: { destination, amount, asset, memo?, msg?, signer }. Cosmos Pay builds the SEP-7 payment.",
        returns:
          "Promise<{ unsignedTransaction: string }> — the unsigned XDR, ready to sign.",
      },
      {
        fn: "client.signAndSubmitTx(xdr)",
        tag: "async",
        params:
          "xdr: string — the unsigned transaction returned by the adapter.",
        returns:
          "Promise<SubmitOutcome> — { status, hash, … }. Signs with the connected wallet, then submits.",
      },
    ],
    reactFnsTitle: "@pollar/react — hook & values used",
    reactFnsIntro:
      "createPollarAdapterHook wires the adapter so Pollar auto-signs; usePollar exposes the live tx state.",
    reactFns: [
      {
        fn: "useCosmosPay()",
        tag: "hook",
        params:
          "No arguments. Returns the wrapped adapter — calling pay() builds, signs and submits in one step.",
        returns:
          "WrappedAdapter — { pay }. The unsigned XDR is signed + submitted automatically.",
      },
      {
        fn: "usePollar().tx",
        tag: "reactive value",
        params: "No arguments — read it during render.",
        returns:
          "TransactionState — the live build → sign → submit progress (tx.step, tx.hash).",
      },
    ],
  },

  hedgepayAbout: {
    eyebrow: "HedgePay",
    title: "Self-custodial banking on stablecoins",
    tagline: "Your self-custodial app. Your rules.",
    body: [
      "HedgePay is a self-custodial banking app: hold and manage stablecoins, convert to and from fiat, send cross-border transfers with minimal fees, and spend worldwide with virtual debit cards — all without giving up custody of your funds.",
      "This tab is a preview of the HedgePay integration with Pollar — coming soon.",
    ],
    featuresTitle: "What it offers",
    features: [
      {
        title: "Virtual debit cards",
        desc: "Spend stablecoins worldwide, anywhere cards are accepted.",
      },
      {
        title: "Fiat on/off & transfers",
        desc: "Convert fiat ↔ stablecoins and send low-fee cross-border payments.",
      },
      {
        title: "Self-custodial",
        desc: "You keep custody of your funds — your keys, your rules.",
      },
      {
        title: "Save in strong currencies",
        desc: "Hold balances in USD / EUR-backed stablecoins.",
      },
    ],
    resourcesTitle: "Official resources",
    websiteLabel: "Website",
    disclaimer:
      "Summary based on the official HedgePay site. Pollar is not affiliated with HedgePay — all credit to their team.",
  },

  vaquitaAbout: {
    eyebrow: "Vaquita",
    title: "Community savings on Stellar",
    tagline: "The power of saving in community.",
    body: [
      "Vaquita is a community savings platform on Stellar: members contribute regularly and earn interest through a fair, decentralized system, with flexible withdrawals — the longer you wait, the higher your return.",
      "This tab is a preview of the Vaquita integration with Pollar — coming soon.",
    ],
    featuresTitle: "What it offers",
    features: [
      {
        title: "Save in community",
        desc: "Pool regular contributions with others and grow together.",
      },
      {
        title: "Fair, decentralized yield",
        desc: "Interest is distributed fairly through smart contracts.",
      },
      {
        title: "Flexible withdrawals",
        desc: "Withdraw when you need to; longer waits earn more.",
      },
      {
        title: "Secured on Stellar",
        desc: "Runs on Stellar smart contracts.",
      },
    ],
    resourcesTitle: "Official resources",
    websiteLabel: "Website",
    disclaimer:
      "Summary based on the official Vaquita site. Pollar is not affiliated with Vaquita — all credit to their team.",
  },

  humanWebAbout: {
    eyebrow: "Human Web",
    title: "Share your opinion, anonymously",
    tagline: "Your opinion — without revealing who you are.",
    body: [
      "Human Web is a platform for voicing opinions and voting anonymously: weigh in on the topics you care about and take part in polls without ever exposing your identity.",
      "This tab is a preview of the Human Web integration with Pollar — coming soon.",
    ],
    featuresTitle: "What it offers",
    features: [
      {
        title: "Anonymous by design",
        desc: "Share opinions and vote without revealing who you are.",
      },
      {
        title: "Community polls",
        desc: "Create and answer polls the community cares about.",
      },
      {
        title: "Have your say",
        desc: "Weigh in on the topics and causes that matter to you.",
      },
      {
        title: "Built on Stellar",
        desc: "Runs on Stellar for transparent, tamper-proof results.",
      },
    ],
    resourcesTitle: "Official resources",
    websiteLabel: "Website",
    disclaimer:
      "Summary based on the official Human Web site. Pollar is not affiliated with Human Web — all credit to their team.",
  },

  e4cAbout: {
    eyebrow: "E4C",
    title: "Education on the blockchain",
    tagline: "Learning, powered by Stellar.",
    body: [
      "E4C is an education platform built on Stellar — access learning content and earn verifiable, on-chain credentials for what you complete.",
      "This tab is a preview of the E4C integration with Pollar — coming soon.",
    ],
    featuresTitle: "What it offers",
    features: [
      {
        title: "Learn anywhere",
        desc: "Access educational content from any device.",
      },
      {
        title: "On-chain credentials",
        desc: "Earn verifiable proof of what you've completed.",
      },
      {
        title: "Open to everyone",
        desc: "Lower the barriers to quality education.",
      },
      {
        title: "Built on Stellar",
        desc: "Runs on Stellar for transparent, tamper-proof records.",
      },
    ],
    resourcesTitle: "Official resources",
    websiteLabel: "Website",
    disclaimer:
      "Summary based on the official E4C site. Pollar is not affiliated with E4C — all credit to their team.",
  },

  ...nekoEn,
};

export type Dictionary = typeof en;

export const es: Dictionary = {
  langName: "Español",

  common: {
    connectWalletFirst: "Conecta tu billetera primero",
    connectWalletToContinue: "Conecta tu billetera para continuar",
    loading: "Cargando…",
    unknownError: "Error desconocido",
    viewModal: "Ver modal",
    optional: "(opcional)",
    cancel: "Cancelar",
    save: "Guardar",
    comingSoon: "Próximamente",
    comingSoonDesc: "Esta funcionalidad estará disponible pronto.",
    soon: "Pronto",
    new: "Nuevo",
    coreClientNote: {
      title: "Usar core desde @pollar/react",
      intro:
        "¿Prefieres @pollar/react? Conservas todo core: el mismo PollarClient está por debajo. Accede a él de dos formas equivalentes:",
      outro:
        "Ambas te dan el mismo cliente idéntico, así que cada método de @pollar/core de esta página funciona tal cual. Incluso puedes usar @pollar/react totalmente headless (solo getClient(), ignorando los modales prearmados), pero su ventaja son los hooks reactivos que re-renderizan tu UI por ti.",
    },
  },

  nav: {
    transactions: "Transacciones",
    send: "Enviar",
    receive: "Recibir",
    history: "Historial",
    balance: "Saldo",
    assets: "Activos",
    ramp: "Ramp",
    kyc: "KYC",
    escrow: "Escrow",
    payments: "Pagos",
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    sessions: "Sesiones",
    signXdr: "Firmar XDR",
    distribution: "Distribución",
    lumenwipe: "LumenWipe",
    overview: "Resumen",
    dashboard: "Panel",
    pools: "Pools",
    vaults: "Vaults",
    wallet: "Billetera",
    privy: "Privy",
    stellarWalletsKit: "Stellar Wallets Kit",
    acceslyAdapter: "Accesly",
    swap: "Swap",
    setup: "Setup",
    implementation: "Implementación",
    adapter: "Adapter",
    groups: {
      auth: "Autenticación",
      pollarWallet: "Billetera",
      transactions: "Transacciones",
      distribution: "Distribución",
      kyc: "KYC",
      ramp: "Ramp",
      swap: "Swap",
      earn: "Earn",
      trustlessWork: "Trustless Work",
      nirium: "Nirium",
      cosmosPay: "Cosmos Pay",
      lumenwipe: "LumenWipe",
      hedgepay: "Hedgepay",
      vaquita: "Vaquita",
      humanWeb: "Human Web",
      e4c: "E4C",
      stellarWalletsKit: "Stellar Wallets Kit",
      privy: "Privy",
      acceslyAdapter: "Accesly",
      neko: nekoNavLabel,
    },
  },

  shell: {
    apiKey: "Clave API personalizada",
    apiKeyTitle: "Usa tu propia clave API publicable",
    switchToLight: "Cambiar a modo claro",
    switchToDark: "Cambiar a modo oscuro",
    changeLanguage: "Cambiar idioma",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    products: "Productos",
    integrations: "Integraciones",
    walletAdapters: walletAdaptersNavLabel,
    adapters: "Adapters",
    builtWith: "Hecho con Pollar",
  },

  adapterDoc: {
    title: "El adapter de {name}",
    intro:
      "Cómo se conecta {name} con Pollar. El adapter es código de cliente puro: llama al protocolo, recibe una transacción sin firmar y se la entrega a Pollar para firmarla y enviarla.",
    contractTitle: "El contrato del adapter",
    contractDesc:
      "Cada función del adapter devuelve { unsignedTransaction: string }. Pollar la firma y la envía con la wallet conectada del usuario — ninguna clave secreta ni API key toca el frontend.",
    sourceTitle: "adapter.ts",
    sourceDesc:
      "La definición completa del adapter. Cada método llama al protocolo y devuelve el XDR sin firmar.",
    registerTitle: "Regístralo una vez",
    registerDesc:
      "Registra el adapter en el provider de Pollar y deriva un hook tipado con createPollarAdapterHook. A partir de ahí cualquier componente puede llamarlo, y Pollar se encarga de la firma.",
  },

  home: {
    badge: "Demo del SDK — todas las funciones, en vivo en testnet",
    titlePre: "Explora el ",
    titleHighlight: "SDK de Pollar",
    subtitle:
      "Cada pestaña demuestra una capacidad de @pollar/core y @pollar/react, con el código equivalente lado a lado.",
    descs: {
      transactions:
        "Invoca contratos inteligentes y construye operaciones de Stellar.",
      send: "Transfiere activos a otra dirección de Stellar.",
      receive: "Muestra tu dirección y código QR para recibir fondos.",
      history: "Lista las transacciones pasadas de la billetera.",
      balance: "Consulta los saldos de cuentas de Stellar por clave pública.",
      assets:
        "Mira los activos habilitados de la app y qué trustlines te faltan.",
      ramp: "Compra y vende cripto con métodos de pago locales.",
      kyc: "Verifica tu identidad para desbloquear límites más altos.",
      escrow: "Escrows de Trustless Work con firma automática de XDR.",
      payments: "Pagos x402 programáticos — Nirium planifica, Pollar firma.",
      login: "Autentica usuarios con redes sociales, email o wallet.",
      logout: "Revoca la sesión y limpia el estado local.",
      sessions: "Revisa las sesiones activas y revoca dispositivos.",
      signXdr: "Firma un XDR generado en otro lado con la wallet logueada.",
      distribution: "Lista las reglas de distribución y reclama tu parte.",
      lumenwipe: "Cierra una cuenta Stellar y transfiere su saldo restante.",
      stellarWalletsKit:
        "Registra wallets de Stellar Wallets Kit (Freighter, Albedo, xBull…) como adaptadores de Pollar.",
      privy:
        "Login con email / Google respaldado por una billetera Stellar embebida de Privy.",
      acceslyAdapter:
        "Firma transacciones de Pollar con una smart account de Accesly (passkey + Shamir-MPC).",
      swap: "Intercambia un activo por otro al mejor precio on-chain.",
      earn: "Deposita en vaults de DeFindex y pools de Blend para generar rendimiento.",
      setup: "Conectalo con @pollar/core o @pollar/react.",
    },
  },

  apiKeyModal: {
    title: "Usa tu clave API",
    subtitle:
      "Pega tu clave publicable de Pollar para ejecutar esta demo con tu propia aplicación.",
    keyLabel: "Clave publicable",
    storedNote1: "Se guarda solo en la URL (",
    storedNote2:
      "), así el cliente del SDK la lee en el siguiente render — no se envía a ningún otro lado.",
    noKey1: "¿No tienes una? Obtén tu clave publicable en ",
    noKey2: " → API keys.",
    reset: "Restablecer al valor por defecto",
  },

  originModal: {
    title: "Dominio no permitido",
    subtitle:
      "El SDK de Pollar no pudo cargar su configuración porque este dominio no está en los orígenes permitidos de tu aplicación.",
    originLabel: "Origen a agregar",
    instructions1: "Abre tu aplicación en ",
    instructions2:
      " → Build → Domains, agrega el origen de arriba y recarga esta página.",
    openDashboard: "Abrir dashboard",
    dismiss: "Cerrar",
  },

  invalidKeyModal: {
    title: "Clave API inválida",
    subtitle:
      "El SDK de Pollar no pudo cargar su configuración porque esta clave API no es reconocida.",
    keyLabel: "Clave API en uso",
    instructions1: "Revisa la clave en ",
    instructions2:
      " → Build → API keys, luego actualízala aquí o elimínala para volver a la clave de demostración.",
    openDashboard: "Abrir dashboard",
    dismiss: "Cerrar",
  },

  networkModal: {
    title: "La red está ligada a tu clave API",
    subtitle:
      "Tu clave API personalizada solo funciona en una red, fijada por su prefijo (pub_testnet_… o pub_mainnet_…).",
    body: "Para cambiar de red, cambia la clave API por una emitida para la red que quieras.",
    changeKey: "Cambiar clave API",
    dismiss: "Cerrar",
  },

  send: {
    title: "Enviar",
    desc: "Transfiere activos a otra dirección de Stellar. Pollar renderiza el selector de activo, el campo de monto, la revisión y el flujo de firma dentro de un modal.",
    open: "Abrir modal de envío",
    note: "no recibe argumentos: el activo, el monto y el destino se eligen dentro del modal.",
    reactDesc:
      "Botón listo que abre un modal prearmado: el selector de activo, el monto, la revisión y el flujo de firma ya vienen renderizados.",
    coreDesc:
      "Construye, firma y envía el pago tú mismo con una sola llamada runTx('payment', …), y luego lee el estado de la transacción.",
    form: {
      destinationLabel: "Destino",
      destinationPh: "G… (dirección del destinatario)",
      assetLabel: "Activo",
      assetHint:
        "los activos que tiene la billetera conectada: se cargan con refreshWalletBalance().",
      amountLabel: "Monto",
      amountPh: "10",
      run: "Ejecutar pago",
      running: "Enviando…",
      stateIdle: "Completa destino, activo y monto, y luego ejecuta el pago.",
      nativeOnly:
        "Conecta una billetera para cargar sus activos; XLM nativo se muestra por defecto.",
    },
    coreFnsTitle: "Funciones utilizadas",
    coreFnsIntro:
      "Todas son métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "runTx(operation, params, options?)",
        tag: "async",
        params:
          "operation: TxBuildBody['operation'] (p. ej. 'payment'); params: el cuerpo de la operación — para un pago, { destination, asset, amount }; options?: flags de build opcionales.",
        returns:
          "Promise<SubmitOutcome>: { status: 'success' | 'pending' | 'error', hash, … }. En un solo paso build → sign → submit.",
      },
      {
        fn: "getTransactionState()",
        tag: "sync",
        params: "Sin argumentos.",
        returns:
          "TransactionState: el progreso actual de build/sign/submit; null antes de ejecutar cualquier tx.",
      },
      {
        fn: "onTransactionStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: TransactionState) => void — se invoca en cada transición de estado.",
        returns:
          "() => void: una función para cancelar la suscripción. El valor tx del hook de react se construye sobre esto.",
      },
    ],
    reactFnsTitle: "Hook y valores utilizados",
    reactFnsIntro:
      "Todos vienen del hook usePollar(): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sin argumentos. Llámalo en el nivel superior de un componente: lee el contexto de React, así que debe ejecutarse durante el render.",
        returns:
          "PollarContextValue: toda la superficie del SDK: valores de estado reactivo, abridores de modales y getClient() para bajar a core.",
      },
      {
        fn: "openSendModal()",
        tag: "sync",
        params:
          "Sin argumentos: el activo, el monto y el destino se eligen dentro del modal.",
        returns: "void: abre el modal prearmado; no hay nada que esperar.",
      },
      {
        fn: "tx",
        tag: "reactive value",
        params:
          "No es una función: es un valor de tipo TransactionState que se lee de usePollar().",
        returns:
          "Vuelve a renderizar tu componente mientras el pago se construye, firma y envía. Refleja getClient().getTransactionState().",
      },
    ],
  },

  receive: {
    title: "Recibir",
    desc: "Muestra la dirección de la billetera conectada y su código QR para que otros puedan enviarle fondos. Pollar renderiza toda la vista dentro de un modal.",
    open: "Abrir modal de recepción",
    note: "no recibe argumentos: lee la dirección de la billetera conectada desde el contexto.",
    reactDesc:
      "Botón listo que abre un modal prearmado con la dirección de la billetera conectada y un código QR.",
    coreDesc:
      "Lee la clave pública de la billetera conectada desde el estado de autenticación y renderiza la dirección + QR tú mismo.",
    coreFnsTitle: "Funciones utilizadas",
    coreFnsIntro:
      "Todas son métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "getAuthState()",
        tag: "sync",
        params: "Sin argumentos.",
        returns:
          "AuthState: cuando step === 'authenticated', session.wallet?.publicKey es la dirección de recepción (una cadena G…).",
      },
    ],
    reactFnsTitle: "Hook y valores utilizados",
    reactFnsIntro:
      "Todos vienen del hook usePollar(): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sin argumentos. Llámalo en el nivel superior de un componente: lee el contexto de React, así que debe ejecutarse durante el render.",
        returns:
          "PollarContextValue: toda la superficie del SDK: valores de estado reactivo, abridores de modales y getClient() para bajar a core.",
      },
      {
        fn: "openReceiveModal()",
        tag: "sync",
        params:
          "Sin argumentos: lee la dirección de la billetera conectada desde el contexto.",
        returns:
          "void: abre el modal prearmado con la dirección y el código QR.",
      },
      {
        fn: "wallet",
        tag: "reactive value",
        params:
          "No es una función: es un objeto WalletInfo que se lee de usePollar(), o null cuando no hay conexión.",
        returns:
          "La billetera conectada (wallet.address contiene la clave pública, wallet.custody/provider su tipo); vuelve a renderizar cuando cambia la sesión.",
      },
    ],
  },

  history: {
    title: "Historial",
    desc: "Lista las transacciones pasadas de la billetera conectada con paginación. El estado de carga se expone de forma reactiva, para que tu UI reaccione a medida que llegan los datos.",
    open: "Abrir modal de historial",
    note: "no recibe argumentos: la paginación se maneja dentro del modal.",
    idle: "Abre el modal para cargar el historial.",
    recordsLoaded: (n: number) =>
      `${n} ${n === 1 ? "registro cargado" : "registros cargados"}.`,
    coreOpen: "Ejecutar fetchTxHistory()",
    coreNote:
      "fetch imperativo vía getClient(): alimenta el mismo estado txHistory.",
    reactDesc:
      "Botón listo que abre un modal prearmado: la lista, la paginación y los estados de carga y vacío ya vienen renderizados.",
    coreDesc:
      "Obtén los registros de forma imperativa y maneja el response crudo tú mismo. No renderiza UI: lees el estado y armas la tuya.",
    rawResponse: "Response crudo",
    coreFnsTitle: "Funciones utilizadas",
    coreFnsIntro:
      "Todas son métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "fetchTxHistory(params?)",
        tag: "async",
        params:
          "params?: { network?: 'testnet' | 'mainnet'; limit?: number; offset?: number }. Todos los campos son opcionales: omite el objeto para usar los valores por defecto de la sesión, o pasa limit + offset para paginar.",
        returns:
          "Promise<void>: no retorna los datos; escribe el resultado en el estado reactivo, que luego lees con getTxHistoryState().",
      },
      {
        fn: "getTxHistoryState()",
        tag: "sync",
        params: "Sin argumentos.",
        returns:
          "TxHistoryState: una unión discriminada por step ('idle' | 'loading' | 'loaded' | 'error'). data (records, total, limit, offset) solo existe cuando step === 'loaded'.",
      },
      {
        fn: "onTxHistoryStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: TxHistoryState) => void — se invoca en cada transición de estado.",
        returns:
          "() => void: una función para cancelar la suscripción; llámala para dejar de escuchar. El txHistory del hook de react se construye sobre esto.",
      },
    ],
    reactFnsTitle: "Hook y valores utilizados",
    reactFnsIntro:
      "Todos vienen del hook usePollar(): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sin argumentos. Llámalo en el nivel superior de un componente: lee el contexto de React, así que debe ejecutarse durante el render.",
        returns:
          "PollarContextValue: toda la superficie del SDK: valores de estado reactivo, abridores de modales y getClient() para bajar a core.",
      },
      {
        fn: "openTxHistoryModal()",
        tag: "sync",
        params:
          "Sin argumentos: el fetch, la paginación y el render ocurren dentro del modal.",
        returns: "void: abre el modal prearmado; no hay nada que esperar.",
      },
      {
        fn: "txHistory",
        tag: "reactive value",
        params:
          "No es una función: es un valor de tipo TxHistoryState que se lee de usePollar().",
        returns:
          "Vuelve a renderizar tu componente cada vez que cambia. Refleja getClient().getTxHistoryState(): step y data cuando ya cargó.",
      },
    ],
  },

  signXdr: {
    title: "Firmar XDR",
    desc: "Firma una transacción que se construyó en otro lado — un backend, una CLI, otra app — con la wallet que tiene la sesión iniciada. Pega el XDR sin firmar y, o bien firma y envía en una sola llamada, o separa la firma del envío.",
    xdrLabel: "XDR sin firmar",
    xdrPlaceholder: "AAAAAgAAAAA… (envelope de transacción en base64)",
    xdrNote:
      "El envelope de transacción en base64 producido allí donde se construyó la transacción.",
    oneShotTitle: "Una sola llamada — firmar + enviar",
    splitTitle: "Flujo separado — las wallets externas firman en el cliente",
    working: "Procesando…",
    signedXdrLabel: "XDR firmado",
    stateLabel: "estado de la tx",
    stateIdle:
      "Pega un XDR y firma para alimentar la máquina de estados de la transacción.",
    reactFnsTitle: "Hook y valores usados",
    reactFnsIntro:
      "Todo esto viene del hook usePollar(): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "signAndSubmitTx(unsignedXdr?)",
        tag: "async",
        params:
          "unsignedXdr: string — el envelope construido en otro lado. Lo firma con la wallet logueada y lo envía en una sola llamada (custodial o externa).",
        returns:
          "Promise<SubmitOutcome> — { status: 'success' | 'pending', hash } o { status: 'error', … }. También alimenta el valor reactivo tx.",
      },
      {
        fn: "signTx(unsignedXdr)",
        tag: "async",
        params:
          "unsignedXdr: string. Solo wallets externas — la wallet firma en el cliente. Los flujos custodiales deben usar signAndSubmitTx.",
        returns:
          "Promise<SignOutcome> — { status: 'signed', signedXdr } o { status: 'error', … }.",
      },
      {
        fn: "submitTx(signedXdr)",
        tag: "async",
        params:
          "signedXdr: string — el envelope firmado que devuelve signTx. Lo transmite a la red.",
        returns:
          "Promise<SubmitOutcome> — { status: 'success' | 'pending', hash } o { status: 'error', … }.",
      },
      {
        fn: "tx",
        tag: "reactive value",
        params:
          "No es una función: un TransactionState leído de usePollar(). Re-renderiza a través de 'signing' → 'submitting' → 'success' / 'error'.",
        returns:
          "Refleja getClient().getTransactionState(): step más hash / buildData cuando existen.",
      },
    ],
    coreFnsTitle: "Funciones usadas",
    coreFnsIntro:
      "Los mismos métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "signAndSubmitTx(unsignedXdr?)",
        tag: "async",
        params:
          "unsignedXdr: string — el envelope construido en otro lado. Firma + envío en una llamada con la wallet logueada.",
        returns: "Promise<SubmitOutcome> — status + hash, o un error.",
      },
      {
        fn: "signTx(unsignedXdr)",
        tag: "async",
        params:
          "unsignedXdr: string. Solo wallets externas — devuelve el XDR firmado sin transmitirlo.",
        returns:
          "Promise<SignOutcome> — { status: 'signed', signedXdr } o un error.",
      },
      {
        fn: "submitTx(signedXdr)",
        tag: "async",
        params:
          "signedXdr: string — transmite un envelope firmado en el cliente.",
        returns: "Promise<SubmitOutcome> — status + hash, o un error.",
      },
    ],
  },

  login: {
    title: "Iniciar sesión",
    desc: "Autentica a un usuario. Con @pollar/react un único modal prearmado renderiza cada proveedor que configuraste: redes sociales, código por email y cualquier adaptador de wallet. Con @pollar/core controlas cada proveedor tú mismo y lees la máquina de estados de autenticación.",
    open: "Abrir modal de login",
    alreadyIn: "Ya tienes la sesión iniciada",
    note: "no recibe argumentos: renderiza cada proveedor configurado y resuelve la sesión por ti.",
    reactDesc:
      "openLoginModal() abre el modal prearmado con todos los proveedores; login({ provider }) entra directo a un proveedor, saltándose el modal.",
    coreDesc:
      "Inicia un login para cualquier proveedor con login({ provider }), ejecuta los pasos del código por email y suscríbete a onAuthStateChange para renderizar tu propio flujo.",
    coreFnsTitle: "Funciones usadas",
    coreFnsIntro:
      "Todas son métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "login(options)",
        tag: "sync",
        params:
          "options: { provider: 'google' | 'github' | 'email' | <tipo de adaptador de wallet> } (email además recibe { email }). Dispara y olvida: alimenta la máquina de estados de autenticación.",
        returns:
          "void — el progreso y el resultado se ven a través de onAuthStateChange / getAuthState().",
      },
      {
        fn: "beginEmailLogin()",
        tag: "sync",
        params:
          "Sin argumentos. Paso 1 del flujo de código por email: abre el paso de email para que el usuario escriba su dirección.",
        returns: "void — avanza la máquina de estados a 'entering_email'.",
      },
      {
        fn: "sendEmailCode(email)",
        tag: "sync",
        params:
          "email: string — la dirección a la que enviar el código de un solo uso. Paso 2 del flujo de código por email.",
        returns:
          "void — envía el código y avanza la máquina de estados a 'entering_code'.",
      },
      {
        fn: "verifyEmailCode(code)",
        tag: "sync",
        params:
          "code: string — el código de un solo uso que el usuario recibió por email. Paso 3 del flujo de código por email.",
        returns:
          "void — con un código válido la máquina de estados llega a 'authenticated'.",
      },
      {
        fn: "loginSmartWallet()",
        tag: "sync",
        params:
          "Sin argumentos. Ejecuta la ceremonia passkey (WebAuthn) para un usuario de smart wallet que regresa; usa createSmartWallet() para uno nuevo.",
        returns: "void — alimenta la máquina de estados de autenticación.",
      },
      {
        fn: "onAuthStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: AuthState) => void — se llama en cada transición ('idle', 'creating_session', 'opening_oauth', 'authenticated', 'error', …).",
        returns:
          "() => void — una función para desuscribirte. Combínala con getAuthState() para leer el paso actual.",
      },
    ],
    reactFnsTitle: "Hook y valores usados",
    reactFnsIntro:
      "Todo esto viene del hook usePollar(): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sin argumentos. Llámalo en el nivel superior de un componente: lee el contexto de React, así que debe ejecutarse durante el render.",
        returns:
          "PollarContextValue — toda la superficie del SDK: valores de estado reactivos, aperturas de modales y getClient() para bajar a core.",
      },
      {
        fn: "openLoginModal()",
        tag: "sync",
        params:
          "Sin argumentos: renderiza cada proveedor configurado en el modal prearmado de Pollar.",
        returns: "void — abre el modal prearmado; no hay nada que esperar.",
      },
      {
        fn: "login(options)",
        tag: "sync",
        params:
          "Las mismas opciones que en core: entra directo a un proveedor (p. ej. login({ provider: 'google' })) sin abrir el modal.",
        returns:
          "void — el progreso se refleja en los valores reactivos isAuthenticated / wallet.",
      },
      {
        fn: "isAuthenticated",
        tag: "reactive value",
        params:
          "No es una función: un booleano leído de usePollar(). false hasta que el servidor confirma la sesión.",
        returns:
          "Re-renderiza tu componente cuando la sesión se crea o se destruye. Combínalo con verified antes de habilitar la firma.",
      },
    ],
  },

  logout: {
    title: "Cerrar sesión",
    desc: "Cierra la sesión del usuario actual. logout() revoca la sesión de este dispositivo en el servidor y limpia el almacenamiento local; pasa { everywhere: true } para revocar todos los dispositivos. La misma llamada respalda tanto @pollar/core como @pollar/react.",
    open: "Cerrar sesión",
    alreadyOut: "Ya cerraste la sesión",
    note: "revoca la sesión actual y limpia el estado local: isAuthenticated pasa a false.",
    reactDesc:
      "logout() de usePollar() revoca la sesión y limpia el estado local; el valor reactivo isAuthenticated pasa a false y tu UI se re-renderiza.",
    coreDesc:
      "client.logout() revoca este dispositivo en el servidor y borra el almacenamiento; logout({ everywhere: true }) o logoutEverywhere() cierran sesión en todos los dispositivos.",
    coreFnsTitle: "Funciones usadas",
    coreFnsIntro:
      "Todas son métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "logout(options?)",
        tag: "async",
        params:
          "options?: { everywhere?: boolean }. Por defecto revoca solo la familia de refresh-token de este dispositivo; everywhere: true las revoca todas.",
        returns:
          "Promise<void> — la revocación en el servidor es best-effort; el estado local se limpia de todas formas.",
      },
      {
        fn: "logoutEverywhere()",
        tag: "async",
        params: "Sin argumentos. Atajo para logout({ everywhere: true }).",
        returns:
          "Promise<void> — revoca todas las sesiones activas de este usuario en todos los dispositivos.",
      },
      {
        fn: "onAuthStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: AuthState) => void — se dispara cuando la máquina vuelve a 'idle' tras limpiar la sesión.",
        returns: "() => void — una función para desuscribirte.",
      },
    ],
    reactFnsTitle: "Hook y valores usados",
    reactFnsIntro:
      "Todo esto viene del hook usePollar(): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sin argumentos. Llámalo en el nivel superior de un componente: lee el contexto de React, así que debe ejecutarse durante el render.",
        returns:
          "PollarContextValue — toda la superficie del SDK: valores de estado reactivos, aperturas de modales y getClient() para bajar a core.",
      },
      {
        fn: "logout()",
        tag: "sync",
        params:
          "Sin argumentos: envuelve client.logout(). Revoca la sesión actual y limpia el estado local.",
        returns:
          "void — no hay nada que esperar; isAuthenticated pasa a false y la UI dependiente se re-renderiza.",
      },
      {
        fn: "isAuthenticated",
        tag: "reactive value",
        params:
          "No es una función: un booleano leído de usePollar(). Habilita el botón de cerrar sesión según su valor (no hay nada que revocar cuando ya es false).",
        returns:
          "Re-renderiza tu componente cuando pasa a false tras el logout.",
      },
    ],
  },

  sessions: {
    title: "Sesiones",
    desc: "Revisa las sesiones activas del usuario que inició sesión, revoca un dispositivo individual o cierra sesión en todas partes. Pollar renderiza la lista y las acciones dentro de un modal.",
    open: "Abrir modal de sesiones",
    note: "no recibe argumentos: lista las sesiones del usuario actual y gestiona la revocación.",
    reactDesc:
      "Botón listo que abre un modal prearmado: la lista de dispositivos, las acciones de revocar y cerrar sesión en todas partes ya vienen renderizadas.",
    coreDesc:
      "Enumera las sesiones del usuario, revoca un dispositivo o cierra sesión en todas partes, y renderiza la lista tú mismo.",
    coreFnsTitle: "Funciones utilizadas",
    coreFnsIntro:
      "Todas son métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "listSessions()",
        tag: "async",
        params: "Sin argumentos.",
        returns:
          "Promise<SessionInfo[]>: una fila por dispositivo / familia de refresh-token (familyId, deviceLabel, current, lastUsedAt, expiresAt, …).",
      },
      {
        fn: "revokeSession(familyId)",
        tag: "async",
        params:
          "familyId: string — de una fila SessionInfo. Revocar la sesión actual cierra la sesión en este dispositivo.",
        returns: "Promise<void>.",
      },
      {
        fn: "logoutEverywhere()",
        tag: "async",
        params: "Sin argumentos.",
        returns: "Promise<void>: revoca todas las sesiones del usuario.",
      },
      {
        fn: "getSessionsState()",
        tag: "sync",
        params: "Sin argumentos.",
        returns:
          "SessionsState: una unión discriminada por step; data tiene la lista cuando cargó. onSessionsStateChange(cb) se suscribe.",
      },
    ],
    reactFnsTitle: "Hook y valores utilizados",
    reactFnsIntro:
      "Todos vienen del hook usePollar(): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sin argumentos. Llámalo en el nivel superior de un componente: lee el contexto de React, así que debe ejecutarse durante el render.",
        returns:
          "PollarContextValue: toda la superficie del SDK: valores de estado reactivo, abridores de modales y getClient() para bajar a core.",
      },
      {
        fn: "openSessionsModal()",
        tag: "sync",
        params:
          "Sin argumentos: lista las sesiones del usuario actual y gestiona la revocación.",
        returns: "void: abre el modal prearmado; no hay nada que esperar.",
      },
      {
        fn: "sessions",
        tag: "reactive value",
        params:
          "No es una función: es un valor de tipo SessionsState que se lee de usePollar().",
        returns:
          "Vuelve a renderizar cuando la lista carga o se revoca un dispositivo. Refleja getClient().getSessionsState().",
      },
    ],
  },

  distribution: {
    title: "Distribución",
    desc: "Lista las reglas de distribución para las que el usuario es elegible y reclama su parte. Pollar renderiza la lista de reglas y las acciones de reclamo dentro de un modal.",
    open: "Abrir modal de distribución",
    note: "no recibe argumentos: carga las reglas del usuario y gestiona el reclamo.",
    reactDesc:
      "Botón listo que abre un modal prearmado: la lista de reglas elegibles y las acciones de reclamo ya vienen renderizadas.",
    coreDesc:
      "Lista las reglas para las que el usuario es elegible y reclama una parte tú mismo.",
    coreFnsTitle: "Funciones utilizadas",
    coreFnsIntro:
      "Todas son métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "listDistributionRules()",
        tag: "async",
        params: "Sin argumentos.",
        returns:
          "Promise<DistributionRule[]>: las reglas para las que el usuario es elegible (id, period, amount, …).",
      },
      {
        fn: "claimDistributionRule(body)",
        tag: "async",
        params:
          "body: DistributionClaimBody — { ruleId: string } que identifica la regla a reclamar.",
        returns:
          "Promise<DistributionClaimContent>: el resultado del reclamo (monto, referencia de tx, …).",
      },
    ],
    reactFnsTitle: "Hook y valores utilizados",
    reactFnsIntro:
      "Todos vienen del hook usePollar(): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sin argumentos. Llámalo en el nivel superior de un componente: lee el contexto de React, así que debe ejecutarse durante el render.",
        returns:
          "PollarContextValue: toda la superficie del SDK: valores de estado reactivo, abridores de modales y getClient() para bajar a core.",
      },
      {
        fn: "openDistributionRulesModal()",
        tag: "sync",
        params:
          "Sin argumentos: carga las reglas del usuario y gestiona el reclamo.",
        returns: "void: abre el modal prearmado; no hay nada que esperar.",
      },
    ],
  },

  ramp: {
    title: "Ramp",
    desc: "Compra y vende cripto con métodos de pago locales (SPEI, PIX, PSE, ACH) a través de anchors como Anclap. Pollar renderiza todo el flujo de cotización y pago dentro de un modal.",
    open: "Abrir modal de ramp",
    note: "no recibe argumentos: el país, la moneda y el tipo de operación se eligen dentro del modal.",
    reactDesc:
      "Botón listo que abre un modal prearmado: todo el flujo cotización → pago → liquidación ya viene renderizado.",
    coreDesc:
      "Controla el on/off-ramp tú mismo: cotiza, crea el ramp y luego haz polling hasta que se liquide.",
    coreFnsTitle: "Funciones utilizadas",
    coreFnsIntro:
      "Todas son métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "getRampsQuote(query)",
        tag: "async",
        params:
          "query: RampsQuoteQuery — { direction: 'onramp' | 'offramp', amount, fiatCurrency, country, … }.",
        returns:
          "Promise<RampsQuoteResponse>: las cotizaciones disponibles para la solicitud.",
      },
      {
        fn: "createOnRamp(body)",
        tag: "async",
        params: "body: RampsOnrampBody — una cotización elegida.",
        returns:
          "Promise<RampsOnrampResponse>: content.id y content.paymentInstructions.",
      },
      {
        fn: "createOffRamp(body)",
        tag: "async",
        params: "body: RampsOfframpBody — una cotización elegida.",
        returns:
          "Promise<RampsOfframpResponse>: los detalles del pago del off-ramp.",
      },
      {
        fn: "pollRampTransaction(txId, opts?)",
        tag: "async",
        params:
          "txId: string (del ramp creado); opts?: opciones de polling (intervalo, signal, …).",
        returns:
          "Promise<RampsTransactionResponse>: se resuelve cuando el ramp llega a un estado terminal.",
      },
    ],
    reactFnsTitle: "Hook y valores utilizados",
    reactFnsIntro:
      "Todos vienen del hook usePollar(): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sin argumentos. Llámalo en el nivel superior de un componente: lee el contexto de React, así que debe ejecutarse durante el render.",
        returns:
          "PollarContextValue: toda la superficie del SDK: valores de estado reactivo, abridores de modales y getClient() para bajar a core.",
      },
      {
        fn: "openRampModal()",
        tag: "sync",
        params:
          "Sin argumentos: el país, la moneda y el tipo de operación se eligen dentro del modal.",
        returns: "void: abre el modal prearmado; no hay nada que esperar.",
      },
    ],
  },

  swap: {
    title: "Swap",
    desc: "Intercambia un activo por otro en venues on-chain (AMM de Aquarius, Soroswap, SDEX). Pollar cotiza cada ruta, las ordena de mejor a peor y renderiza todo el flujo de cotización e intercambio dentro de un modal.",
    open: "Abrir modal de swap",
    note: "no recibe argumentos: los activos, el monto y el venue se eligen dentro del modal.",
    venuesTitle: "Los venues se configuran desde tu dashboard",
    venuesBody:
      "El modal de swap solo ofrece los venues que habilites en Treasury → Swap del dashboard de Pollar. El SDK lee esa selección en tiempo de ejecución vía getSwapConfig() (la respuesta SDK_SWAP_CONFIG), sin cambiar código. Una lista vacía oculta por completo la UI de swap.",
    reactDesc:
      "Botón listo que abre un modal prearmado: todo el flujo cotización → swap (trustline incluida) ya viene renderizado.",
    coreDesc:
      "Controla el swap tú mismo: cotiza entre venues y luego ejecuta la mejor ruta.",
    coreFnsTitle: "Funciones utilizadas",
    coreFnsIntro:
      "Todas son métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "getSwapConfig()",
        tag: "async",
        params:
          "Sin argumentos: lee la selección del dashboard de la app (Treasury → Swap), intersectada con la capacidad del servidor.",
        returns:
          "Promise<SwapVenue[]>: los venues habilitados (p. ej. ['aquarius', 'sdex']); vacío significa que el swap está deshabilitado, así que oculta la UI.",
      },
      {
        fn: "getSwapQuote(params)",
        tag: "async",
        params:
          "params: SwapQuoteParams — { sellAsset, buyAsset, amount, provider?: 'auto' | 'aquarius' | 'soroswap' | 'sdex', slippageBps? }.",
        returns:
          "Promise<SwapQuote[]>: rutas ordenadas por output, la mejor primero; vacío cuando no existe ruta.",
      },
      {
        fn: "swap(quote, opts?)",
        tag: "async",
        params:
          "quote: SwapQuote (una ruta de getSwapQuote); opts?: { autoTrustline? } — agrega primero la trustline del activo a recibir si hace falta.",
        returns:
          "Promise<SubmitOutcome>: corre el payload build de la cotización por el pipeline de tx (el minReceived on-chain aplica el slippage).",
      },
    ],
    reactFnsTitle: "Hook y valores utilizados",
    reactFnsIntro:
      "Todos vienen del hook usePollar(): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sin argumentos. Llámalo en el nivel superior de un componente: lee el contexto de React, así que debe ejecutarse durante el render.",
        returns:
          "PollarContextValue: toda la superficie del SDK: valores de estado reactivo, abridores de modales y getClient() para bajar a core.",
      },
      {
        fn: "getSwapConfig()",
        tag: "async",
        params:
          "Sin argumentos: resuelve los venues que expone esta app, desde tu selección del dashboard (Treasury → Swap).",
        returns:
          "Promise<SwapVenue[]>: venues habilitados; vacío significa que el swap está deshabilitado para esta app, así que oculta la UI de swap.",
      },
      {
        fn: "openSwapModal()",
        tag: "sync",
        params:
          "Sin argumentos: los activos, el monto y el venue se eligen dentro del modal.",
        returns: "void: abre el modal prearmado; no hay nada que esperar.",
      },
    ],
  },

  earn: {
    title: "Earn",
    desc: "Pon a trabajar los balances ociosos: deposita en vaults de DeFindex o pools de Blend y genera rendimiento on-chain. Pollar lista cada provider habilitado con su APY en vivo y renderiza todo el flujo de depósito y retiro dentro de un modal.",
    open: "Abrir modal de Earn",
    note: "no recibe argumentos: el provider, la oportunidad y el monto se eligen dentro del modal.",
    providersTitle: "Los providers se configuran desde tu dashboard",
    providersBody:
      "El modal de Earn solo ofrece los providers que habilites en Treasury → Earn del dashboard de Pollar, intersectados con la capacidad del servidor: Blend necesita una dirección de pool y DeFindex una API key. El SDK lee esa selección en tiempo de ejecución vía getEarnProviders() (la respuesta SDK_EARN_PROVIDERS). Una lista vacía oculta por completo la UI de Earn.",
    reactDesc:
      "Botón listo que abre un modal prearmado: todo el flujo provider → oportunidad → depósito / retiro ya viene renderizado.",
    coreDesc:
      "Controla Earn tú mismo: lista oportunidades, lee la posición y luego deposita o retira.",
    coreFnsTitle: "Funciones utilizadas",
    coreFnsIntro:
      "Todas son métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "getEarnProviders()",
        tag: "async",
        params:
          "Sin argumentos: lee la selección del dashboard de la app (Treasury → Earn), intersectada con la capacidad del servidor.",
        returns:
          "Promise<EarnProviderId[]>: los providers habilitados (p. ej. ['blend', 'defindex']); vacío significa que Earn está deshabilitado, así que oculta la UI.",
      },
      {
        fn: "getEarnOpportunities(provider)",
        tag: "async",
        params: "provider: EarnProviderId — 'blend' o 'defindex'.",
        returns:
          "Promise<EarnOpportunity[]>: los vaults (DeFindex) / pools (Blend) en esta red, cada uno con id, kind, asset y APY en vivo.",
      },
      {
        fn: "getEarnPosition(params)",
        tag: "async",
        params:
          "params: EarnPositionParams — { provider, opportunity } (la dirección la completa el cliente).",
        returns:
          "Promise<EarnPosition>: balance, APY en vivo, withdrawUnit ('asset' para Blend, 'shares' para DeFindex) y el máximo retirable.",
      },
      {
        fn: "earnDeposit(params)",
        tag: "async",
        params:
          "params: EarnTxParams — { provider, opportunity, amount } (el monto es el activo subyacente).",
        returns:
          "Promise<SubmitOutcome>: firma y envía el XDR construido por el provider a través del pipeline de tx.",
      },
      {
        fn: "earnWithdraw(params)",
        tag: "async",
        params:
          "params: EarnTxParams — { provider, opportunity, amount } (el monto en el withdrawUnit de la posición).",
        returns:
          "Promise<SubmitOutcome>: firma y envía el XDR construido por el provider a través del pipeline de tx.",
      },
    ],
    reactFnsTitle: "Hook y valores utilizados",
    reactFnsIntro:
      "Todos vienen del hook usePollar(): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sin argumentos. Llámalo en el nivel superior de un componente: lee el contexto de React, así que debe ejecutarse durante el render.",
        returns:
          "PollarContextValue: toda la superficie del SDK: valores de estado reactivo, abridores de modales y getClient() para bajar a core.",
      },
      {
        fn: "getEarnProviders()",
        tag: "async",
        params:
          "Sin argumentos: resuelve los providers que expone esta app, desde tu selección del dashboard (Treasury → Earn).",
        returns:
          "Promise<EarnProviderId[]>: providers habilitados; vacío significa que Earn está deshabilitado para esta app, así que oculta la UI de Earn.",
      },
      {
        fn: "openEarnModal()",
        tag: "sync",
        params:
          "Sin argumentos: el provider, la oportunidad y el monto se eligen dentro del modal.",
        returns: "void: abre el modal prearmado; no hay nada que esperar.",
      },
    ],
  },

  kyc: {
    title: "KYC",
    desc: "Verifica la identidad del usuario. Pollar renderiza todo el flujo de selección de proveedor y verificación dentro de un modal.",
    countryLabel: "País (ISO 3166-1 alfa-2)",
    levelLabel: "Nivel",
    currentStatus: "estado actual",
    start: "Iniciar KYC",
    coreFnsTitle: "@pollar/core — funciones utilizadas",
    coreFnsIntro:
      "Todas son métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "getKycProviders(country)",
        tag: "async",
        params: "country: string — un código ISO 3166-1 alfa-2 (p. ej. 'MX').",
        returns:
          "Promise<{ providers }>: los proveedores de KYC disponibles en ese país.",
      },
      {
        fn: "startKyc(body)",
        tag: "async",
        params:
          "body: KycStartBody — { providerId: string; level: 'basic' | 'intermediate' | 'enhanced' }.",
        returns:
          "Promise<KycStartResponse>: la sesión de verificación para entregar al proveedor.",
      },
      {
        fn: "pollKycStatus(providerId, opts?)",
        tag: "async",
        params:
          "providerId: string; opts?: { intervalMs?, timeoutMs? } controles de polling.",
        returns:
          "Promise: se resuelve cuando el estado llega a 'approved' | 'rejected' (desde 'none' | 'pending').",
      },
      {
        fn: "getKycStatus(providerId?)",
        tag: "async",
        params:
          "providerId?: string — omítelo para leer el estado general del usuario.",
        returns:
          "Promise<{ status, level?, providerId }>: una lectura puntual.",
      },
    ],
    reactFnsTitle: "@pollar/react — hook y valores utilizados",
    reactFnsIntro:
      "Todos vienen del hook usePollar(): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sin argumentos. Llámalo en el nivel superior de un componente: lee el contexto de React, así que debe ejecutarse durante el render.",
        returns:
          "PollarContextValue: toda la superficie del SDK: valores de estado reactivo, abridores de modales y getClient() para bajar a core.",
      },
      {
        fn: "openKycModal(options?)",
        tag: "sync",
        params:
          "options?: { country?: string; level?: 'basic' | 'intermediate' | 'enhanced'; onApproved?: () => void } — envuelve getKycProviders / startKyc / pollKycStatus.",
        returns: "void: abre el modal prearmado; no hay nada que esperar.",
      },
      {
        fn: "<KycStatus status={…} />",
        tag: "component",
        params:
          "status: 'none' | 'pending' | 'approved' | 'rejected' — el badge a renderizar.",
        returns:
          "Un componente de badge de estado ya hecho, exportado desde @pollar/react.",
      },
    ],
  },

  balance: {
    title: "Saldo",
    desc: "Lee los saldos de una cuenta de Stellar: la de la billetera conectada o la de cualquier dirección por clave pública.",
    reactDesc:
      "Botón listo que abre un modal prearmado con los saldos de la billetera conectada, ya renderizados.",
    coreDesc:
      "Obtén los saldos tú mismo y renderiza el response crudo: la billetera conectada con refreshBalance(), o cualquier dirección con getWalletBalance(pk).",
    open: "Abrir modal de saldo",
    modalNote:
      "no recibe argumentos: lee la billetera conectada y renderiza la tabla por ti.",
    lookupLabel: "Consultar cualquier dirección",
    fetch: "Consultar",
    useMyWallet: "Usar mi billetera",
    coreNote:
      "la billetera conectada alimenta el estado reactivo walletBalance; una dirección arbitraria devuelve los datos directamente.",
    idle: "Envía una solicitud para cargar los saldos.",
    noBalances: "No se encontraron saldos.",
    assetCol: "Activo",
    balanceCol: "Saldo",
    availableCol: "Disponible",
    rawResponse: "Response crudo",
    coreFnsTitle: "Funciones utilizadas",
    coreFnsIntro:
      "Todas son métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "refreshBalance()",
        tag: "async",
        params:
          "Sin argumentos: la billetera y la red se resuelven en el servidor a partir de la sesión.",
        returns:
          "Promise<void>: escribe los saldos de la billetera conectada en el estado reactivo; léelo con getWalletBalanceState().",
      },
      {
        fn: "getWalletBalance(publicKey, network?)",
        tag: "async",
        params:
          "publicKey: string (una dirección G…); network?: 'testnet' | 'mainnet', por defecto la red actual del cliente.",
        returns:
          "Promise<WalletBalanceContent>: devuelve los saldos directamente (sin estado reactivo); úsalo para cualquier dirección arbitraria.",
      },
      {
        fn: "getWalletBalanceState()",
        tag: "sync",
        params: "Sin argumentos.",
        returns:
          "WalletBalanceState: una unión discriminada por step ('idle' | 'loading' | 'loaded' | 'error'). data.balances solo existe cuando step === 'loaded'.",
      },
      {
        fn: "onWalletBalanceStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: WalletBalanceState) => void — se invoca en cada transición de estado.",
        returns:
          "() => void: una función para cancelar la suscripción. El walletBalance del hook de react se construye sobre esto.",
      },
    ],
    reactFnsTitle: "Hook y valores utilizados",
    reactFnsIntro:
      "Todos vienen del hook usePollar(): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sin argumentos. Llámalo en el nivel superior de un componente: lee el contexto de React, así que debe ejecutarse durante el render.",
        returns:
          "PollarContextValue: toda la superficie del SDK: valores de estado reactivo, abridores de modales y getClient() para bajar a core.",
      },
      {
        fn: "openWalletBalanceModal()",
        tag: "sync",
        params:
          "Sin argumentos: lee la billetera conectada y renderiza la tabla de saldos dentro del modal.",
        returns: "void: abre el modal prearmado; no hay nada que esperar.",
      },
      {
        fn: "walletBalance",
        tag: "reactive value",
        params:
          "No es una función: es un valor de tipo WalletBalanceState que se lee de usePollar().",
        returns:
          "Vuelve a renderizar tu componente cada vez que cambia. Refleja getClient().getWalletBalanceState(): step y data cuando ya cargó.",
      },
    ],
  },

  assets: {
    title: "Activos habilitados",
    desc: "Los activos habilitados en el panel de la app junto con el estado de trustline en cadena de la billetera conectada, para saber qué trustlines le faltan por agregar. XLM nativo siempre está presente.",
    reactDesc:
      "Botón listo para usar que abre un modal prearmado con cada activo habilitado y si la billetera conectada tiene trustline para él.",
    coreDesc:
      "Obtén los activos habilitados con refreshAssets() y renderiza el estado reactivo enabledAssets: sin saldos, solo el estado de trustline.",
    open: "Abrir modal de Activos",
    modalNote:
      "no toma argumentos: lee la sesión de la billetera conectada y renderiza la tabla de trustlines por ti.",
    refresh: "Actualizar activos",
    coreNote:
      "la billetera y la red se resuelven en el servidor a partir de la sesión; el resultado alimenta el estado reactivo enabledAssets.",
    idle: "Actualiza para cargar los activos habilitados de la app.",
    noAssets: "No se encontraron activos habilitados.",
    assetCol: "Activo",
    typeCol: "Tipo",
    trustlineCol: "Trustline",
    established: "Establecida",
    missing: "Falta",
    rawResponse: "Respuesta cruda",
    coreFnsTitle: "Funciones usadas",
    coreFnsIntro:
      "Todas son métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "refreshAssets()",
        tag: "async",
        params:
          "Sin argumentos: la billetera y la red se resuelven en el servidor a partir de la sesión.",
        returns:
          "Promise<void>: escribe los activos habilitados y el estado de trustline en el estado reactivo; léelo con getEnabledAssetsState().",
      },
      {
        fn: "getEnabledAssetsState()",
        tag: "sync",
        params: "Sin argumentos.",
        returns:
          "EnabledAssetsState: una unión discriminada por step: 'idle' | 'loading' | 'loaded' | 'error'. data.assets existe solo cuando step === 'loaded'.",
      },
      {
        fn: "onEnabledAssetsStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: EnabledAssetsState) => void: se invoca en cada cambio de estado.",
        returns:
          "() => void: una función para cancelar la suscripción. El enabledAssets del hook de react se construye sobre esto.",
      },
    ],
    reactFnsTitle: "Hook y valores usados",
    reactFnsIntro:
      "Todo esto viene del hook usePollar(): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "openEnabledAssetsModal()",
        tag: "sync",
        params:
          "Sin argumentos: lee la billetera conectada y renderiza la tabla de activos habilitados / trustlines dentro del modal.",
        returns: "void: abre el modal prearmado; no hay nada que esperar.",
      },
      {
        fn: "refreshAssets()",
        tag: "async",
        params:
          "Sin argumentos: la misma llamada que el método de core, reexportada en el hook por comodidad.",
        returns:
          "Promise<void>: actualiza el valor reactivo enabledAssets de abajo.",
      },
      {
        fn: "enabledAssets",
        tag: "reactive value",
        params:
          "No es una función: es un valor de tipo EnabledAssetsState que se lee de usePollar().",
        returns:
          "Vuelve a renderizar tu componente cada vez que cambia. Refleja getClient().getEnabledAssetsState(): step y data cuando ya cargó.",
      },
    ],
    trust: {
      title: "Habilitar / deshabilitar un trustline",
      desc: 'Un trustline es una operación change_trust. Habilitarlo agrega el activo (con un límite opcional); deshabilitarlo envía limit "0", que lo elimina, y solo funciona si el saldo del activo ya es cero. El XLM nativo nunca necesita trustline.',
      typeLabel: "Tipo de activo",
      codeLabel: "Código del activo",
      codePh: "USDC",
      issuerLabel: "Emisor",
      issuerPh: "G… (cuenta emisora)",
      limitLabel: "Límite",
      limitNote:
        'Monto máximo que confiarás. Déjalo vacío para el máximo; Deshabilitar fuerza "0".',
      limitPh: "1000000",
      enable: "Habilitar trustline",
      disable: "Deshabilitar trustline",
      running: "Enviando…",
      stateIdle:
        "Define el activo y luego habilita o deshabilita su trustline.",
      removedNote:
        "Tras una deshabilitación exitosa, la respuesta de balance reporta trustlineRemoved: true.",
      fnsTitle: "Funciones de change_trust",
      fnsIntro:
        "runTx es el camino de una sola llamada; el demo luego vuelve a renderizar la tabla con refreshAssets(). Ambas vienen de usePollar() (o del PollarClient subyacente vía getClient()).",
      fns: [
        {
          fn: "runTx(operation, params, options?)",
          tag: "async",
          params:
            "operation: 'change_trust'; params.asset: { type, code, issuer }; params.limit?: string ('0' elimina el trustline, omitido = máximo).",
          returns:
            "Promise<SubmitOutcome>: construye → firma → envía en una sola llamada; status: 'success' | 'pending' | 'error'. Alimenta el estado reactivo tx.",
        },
        {
          fn: "buildTx(operation, params, options?)",
          tag: "async",
          params:
            "Los mismos argumentos que runTx: úsalo cuando quieras inspeccionar el XDR sin firmar antes de firmar.",
          returns:
            "Promise<BuildOutcome>: devuelve la tx construida sin enviarla; combínala con signAndSubmitTx().",
        },
        {
          fn: "refreshAssets()",
          tag: "async",
          params: "Sin argumentos.",
          returns:
            "Promise<void>: vuelve a obtener la tabla de activos habilitados para que trustlineEstablished refleje el change_trust que acabas de enviar.",
        },
      ],
    },
  },

  escrow: {
    title: "Escrow",
    desc: "Adaptador de Trustless Work: el SDK firma y envía el XDR sin firmar con la billetera conectada, así tu código solo se ocupa de los parámetros de negocio.",
    tabs: {
      deploy: "Desplegar",
      fund: "Fondear",
      milestone: "Hito",
      dispute: "Disputa",
    },
    engagementId: "ID de engagement",
    titleField: "Título",
    description: "Descripción",
    approver: "Aprobador",
    approverNote: "Por defecto, la dirección de tu billetera.",
    serviceProvider: "Proveedor del servicio",
    platformAddress: "Dirección de la plataforma",
    amountUsdc: "Monto (USDC)",
    platformFee: "Comisión de la plataforma %",
    contractId: "ID del contrato",
    contractIdNote:
      "La dirección del contrato de escrow que se devuelve tras el despliegue.",
    milestoneIndex: "Índice del hito",
    approverFunds: "Fondos del aprobador",
    serviceProviderFunds: "Fondos del proveedor",
    signing: "Firmando…",
    approveMilestone: "Aprobar hito",
    releaseFunds: "Liberar fondos",
    initiateDispute: "Iniciar disputa",
    resolveDispute: "Resolver disputa",
    deployEscrow: "Desplegar escrow",
    fundEscrow: "Fondear escrow",
    setupSummary: "configuración única del adaptador",
    txIdle: "Ejecuta una operación para ver el progreso de la firma.",
    coreFnsTitle: "@pollar/core — funciones utilizadas",
    coreFnsIntro:
      "Todas son métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "signAndSubmitTx(unsignedXdr?)",
        tag: "async",
        params:
          "unsignedXdr?: string — el XDR sin firmar que el adaptador de escrow devuelve de Trustless Work. Omítelo en flujos custodiales.",
        returns:
          "Promise<SubmitOutcome>: firma el XDR con la billetera conectada y lo transmite; { status, hash, … }.",
      },
      {
        fn: "getTransactionState()",
        tag: "sync",
        params: "Sin argumentos.",
        returns:
          "TransactionState: el progreso del auto-firmar-y-enviar; null antes de ejecutar cualquier tx.",
      },
    ],
    reactFnsTitle: "@pollar/react — hook y valores utilizados",
    reactFnsIntro:
      "Todos vienen del hook usePollar() (más la fábrica del adaptador): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sin argumentos. Llámalo en el nivel superior de un componente: lee el contexto de React, así que debe ejecutarse durante el render.",
        returns:
          "PollarContextValue: toda la superficie del SDK: valores de estado reactivo, abridores de modales y getClient() para bajar a core.",
      },
      {
        fn: "createPollarAdapterHook(key)",
        tag: "factory",
        params:
          "key: string — el slot del adaptador registrado en el provider (p. ej. 'escrow'). Llámalo una vez a nivel de módulo.",
        returns:
          "Un hook tipado (p. ej. useEscrow) cuyos métodos devuelven cada uno Promise<SubmitOutcome>: adaptador → XDR sin firmar → auto firmar + enviar.",
      },
      {
        fn: "openTxModal()",
        tag: "sync",
        params: "Sin argumentos.",
        returns:
          "void: abre el modal de revisión/firma para la tx de escrow en curso.",
      },
      {
        fn: "tx",
        tag: "reactive value",
        params:
          "No es una función: es un valor de tipo TransactionState que se lee de usePollar().",
        returns:
          "Vuelve a renderizar a lo largo del flujo auto firmar-y-enviar (building → signing → submitting → success).",
      },
    ],
  },

  transactions: {
    ops: {
      create_account: "Crear cuenta",
      payment: "Pago",
      path_payment_strict_send: "Path Payment (envío estricto)",
      change_trust: "Cambiar trustline",
      invoke_contract: "[Contrato inteligente] Invocar función del contrato",
    },
    operationType: "Tipo de operación",
    destination: "Destino",
    startingBalance: "Saldo inicial",
    startingBalanceNote:
      "Cantidad de XLM con la que se fondea la cuenta nueva.",
    asset: "Activo",
    amount: "Monto",
    sendingAsset: "Activo de envío",
    sendingAssetNote: "Activo que se descuenta de la cuenta del remitente.",
    sendAmount: "Monto a enviar",
    destAsset: "Activo de destino",
    destAssetNote: "Activo que recibe la cuenta de destino.",
    destMin: "Monto mínimo de destino",
    destMinNote: "Cantidad mínima que debe recibir el destino.",
    intermediatePath: "Ruta intermedia",
    intermediatePathNote:
      "Activos por los que enrutar. Déjalo vacío para una ruta directa.",
    pathAsset: (i: number) => `Activo de ruta ${i}`,
    addAsset: "+ Agregar activo",
    assetType: "Tipo de activo",
    xlmNative: "XLM (nativo)",
    alphanum4: "Alfanumérico 4",
    alphanum12: "Alfanumérico 12",
    alphanum412: "Alfanumérico 4 / 12",
    poolShares: "Participaciones de pool de liquidez",
    assetCodePh: (max: number) => `Código del activo (máx. ${max} caracteres)`,
    issuerPh: "ID de la cuenta emisora (G...)",
    trustLimit: "Límite de confianza",
    trustLimitNote:
      "Déjalo vacío para el máximo int64. Usa 0 para eliminar la trustline.",
    trustLimitPh: "Déjalo vacío para el máximo",
    contractId: "ID del contrato",
    fetchMethods: "Obtener métodos",
    fetching: "Obteniendo…",
    fetchFailed: "No se pudieron obtener los métodos",
    selectMethod: "Selecciona un método",
    options: "Opciones",
    timeout: "Tiempo de espera",
    timeoutNote: "Tiempo de espera de la transacción en segundos.",
    maxFee: "Comisión máxima en stroops",
    maxFeeNote: "Comisión máxima en stroops (1 XLM = 10.000.000 de stroops).",
    memo: "Memo",
    memoPhId: "ID numérico",
    memoPhText: "Memo de texto",
    building: "Construyendo…",
    invalidParams: "Parámetros inválidos",
    tipPre: "Consejo: ",
    tipPost: " abre un modal integrado que se encarga del paso 2 por ti.",
    buildStep: "construir transacción",
    submitStep: "enviar transacción firmada",
    stateLabel: "estado de la transacción",
    stateIdle: "Envía una transacción para ver su estado aquí.",
    coreFnsTitle: "@pollar/core — funciones utilizadas",
    coreFnsIntro:
      "Todas son métodos del cliente que devuelve getClient(): la instancia subyacente de PollarClient.",
    coreFns: [
      {
        fn: "buildTx(operation, params, options?)",
        tag: "async",
        params:
          "operation: TxBuildBody['operation'] (p. ej. 'payment'); params: el cuerpo de la operación; options?: flags de build opcionales (timeout, maxFee, memo).",
        returns:
          "Promise<BuildOutcome>: construye la transacción y devuelve el XDR sin firmar (o una tx custodial ya armada) sin enviarla.",
      },
      {
        fn: "signAndSubmitTx(unsignedXdr?)",
        tag: "async",
        params:
          "unsignedXdr?: string — el XDR de buildTx. Omítelo en flujos custodiales, donde el SDK envía la tx ya armada por ti.",
        returns:
          "Promise<SubmitOutcome>: { status: 'success' | 'pending' | 'error', hash, … }.",
      },
      {
        fn: "runTx(operation, params, options?)",
        tag: "async",
        params: "Mismos argumentos que buildTx.",
        returns:
          "Promise<SubmitOutcome>: en un solo paso build → sign → submit. Úsalo cuando no necesitas el XDR sin firmar en el medio.",
      },
      {
        fn: "getTransactionState()",
        tag: "sync",
        params: "Sin argumentos.",
        returns:
          "TransactionState: el progreso actual de build/sign/submit; null antes de ejecutar cualquier tx.",
      },
    ],
    reactFnsTitle: "@pollar/react — hook y valores utilizados",
    reactFnsIntro:
      "Todos vienen del hook usePollar(): la capa de react construida sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sin argumentos. Llámalo en el nivel superior de un componente: lee el contexto de React, así que debe ejecutarse durante el render.",
        returns:
          "PollarContextValue: toda la superficie del SDK: valores de estado reactivo, abridores de modales y getClient() para bajar a core.",
      },
      {
        fn: "buildTx(operation, params, options?)",
        tag: "async",
        params: "Igual que client.buildTx — operation, params, options?.",
        returns:
          "Promise<BuildOutcome>: construye la tx y alimenta el estado reactivo tx; el XDR sin firmar queda en tx.buildData.",
      },
      {
        fn: "signAndSubmitTx(unsignedXdr?)",
        tag: "async",
        params:
          "unsignedXdr?: string — del buildTx anterior; omítelo en flujos custodiales.",
        returns: "Promise<SubmitOutcome>: firma la tx armada y la transmite.",
      },
      {
        fn: "openTxModal()",
        tag: "sync",
        params: "Sin argumentos.",
        returns:
          "void: abre un modal integrado que firma y envía la tx armada por ti.",
      },
      {
        fn: "tx",
        tag: "reactive value",
        params:
          "No es una función: es un valor de tipo TransactionState que se lee de usePollar().",
        returns:
          "Vuelve a renderizar tu componente a través de building → signing → submitting → success. Refleja getClient().getTransactionState().",
      },
    ],
  },

  activateWallet: {
    title: "Activar billetera verificada por KYC",
    subtitle:
      "Simula el paso de activación del lado del servidor después de que un usuario pasa el KYC.",
    step1: "PASO 1",
    step2: "PASO 2",
    step1Title: "Ingresa tu clave API secreta",
    warnStrong: "Solo para la demo.",
    warnMid: " En una integración real ",
    warnNever: "nunca",
    warnEnd:
      " debes manejar claves secretas en el frontend. Esta llamada debe hacerse exclusivamente desde tu servidor backend.",
    edit: "editar",
    confirm: "confirmar",
    keySet: "✓ clave establecida — no se guarda, se borrará al recargar",
    step2Title: "Activar billetera",
    step2Desc:
      "Proporciona la clave pública de una billetera que ya pasó el KYC. El servidor la fondeará con XLM en Stellar para que quede activa.",
    publicKeyLabel: "Clave pública (G...)",
    activating: "Activando…",
    activate: "Activar billetera",
    activated: "✓ Billetera activada",
    amountFunded: "monto fondeado:",
    unexpectedError: "Ocurrió un error inesperado.",
    endpointRef: "referencia del endpoint",
    back: "← volver a la demo principal",
    errors: {
      API_KEY_NOT_FOUND: "Clave secreta no encontrada o inválida.",
      API_KEY_TYPE_NOT_ALLOWED:
        "Esta clave es una clave publicable. Debes usar una clave secreta (sec_...).",
      WALLET_NOT_FOUND: "Billetera no encontrada en la base de datos.",
      FORBIDDEN: "Esta billetera no pertenece a tu aplicación.",
      WALLET_ALREADY_FUNDED: "Esta billetera ya está activa en Stellar.",
      ACTIVATION_DISABLED:
        "La activación de billeteras está deshabilitada en este demo; se moverá al SDK de Pollar cuando el KYC esté listo.",
      APP_WALLET_NOT_FOUND:
        "Tu aplicación no tiene una billetera de fondeo configurada.",
      FUND_XLM_FAILED:
        "No se pudo enviar XLM a la billetera. Inténtalo de nuevo.",
    },
  },

  lumenwipe: {
    title: "LumenWipe",
    intro:
      "Planifica y construye las transacciones que cierran una cuenta Stellar y transfieren su XLM restante a un destino. La API devuelve un plan ordenado y el XDR sin firmar de cada paso — tú lo firmas localmente y lo envías.",
    creditPre: "Esta pestaña es una demo en vivo de la API pública de ",
    creditApi: "LumenWipe",
    creditMid: ". Todo el crédito al equipo de LumenWipe — visita ",
    creditPost: " para ver el servicio original y la documentación.",

    network: "Red",
    account: "Cuenta a cerrar",
    accountNote: "Cuenta origen (G…). Debe existir en la red seleccionada.",
    destination: "Destino",
    destinationNote:
      "A dónde va el XLM — una billetera o dirección de exchange (G…).",
    memo: "Memo",
    memoNote: "Requerido por exchanges que exigen memo.",
    memoType: "Tipo de memo",
    getPlan: "Obtener plan",
    gettingPlan: "Obteniendo plan…",

    planTitle: "Plan",
    executable: "Ejecutable",
    notExecutable: "No ejecutable",
    mediatorRequired: "Requiere mediador",
    requiresMemo: "Requiere memo",
    blockers: "Bloqueos",
    steps: "Pasos",
    noSteps: "Sin pasos — la cuenta ya está cerrada.",
    buildXdr: "Construir XDR",
    building: "Construyendo…",
    unsignedXdr: "XDR sin firmar",
    copy: "Copiar",
    copied: "Copiado",
    fee: "comisión",
    ops: "ops",
    cosignNote: "Requiere la co-firma del mediador (merge a exchange).",
    fallbackNote:
      "Sin ruta en el DEX — el activo se devuelve a su emisor en lugar de cambiarse a XLM.",
    useMyWallet: "Usar mi billetera",
    myWallet: "Mi billetera",
    swap: "Intercambiar cuenta ↔ destino",
    signWithPollar: "Firmar y enviar con Pollar",
    signing: "Firmando…",
    submitted: "Enviado:",
    ownAccountHint:
      "Esta es tu billetera conectada — firma cada paso con Pollar.",
    networkMismatch:
      "Tu billetera está en otra red — cambia el selector para que coincida y poder firmar.",
    cosignManual:
      "Requiere co-firma del mediador — firma y envía este paso manualmente.",
    signNeedsPollarWallet:
      "Esta acción no está permitida — para firmar, la cuenta a cerrar debe ser la billetera con la que iniciaste sesión en Pollar.",

    safetyTitle: "Solo lectura y no custodial",
    safety1:
      "La API es de solo lectura. Nunca envíes una clave secreta (S…) — solo claves públicas (G…).",
    safety2:
      "Las respuestas contienen sobres de transacción sin firmar. Decodifica y verifica cada XDR antes de firmarlo en tu propio entorno.",

    loopTitle: "El bucle de cierre",
    refTitle: "Tipos de paso",

    requestFailed: "La solicitud falló. Revisa la cuenta, el destino y la red.",
    emptyFields: "Ingresa una cuenta y un destino.",
  },

  twAbout: {
    eyebrow: "Trustless Work",
    title: "Escrows por hitos en Stellar",
    tagline: "Escrows para stablecoins, fáciles.",
    body: [
      "Trustless Work ofrece infraestructura de escrow no custodial y basada en hitos, construida sobre la blockchain de Stellar. Los fondos se bloquean on-chain y se liberan solo cuando se cumplen condiciones predefinidas, eliminando el riesgo de contraparte en las transacciones con stablecoins.",
      "En lugar de escribir contratos inteligentes desde cero, los desarrolladores integran escrow mediante las APIs, SDKs y plantillas open source de Trustless Work, habilitando marketplaces, crowdfunding, freelancing y financiamiento comercial sin un intermediario custodio.",
      "En esta demo, la pestaña Escrow usa el adaptador de Trustless Work del SDK de Pollar: despliegas, financias, apruebas hitos y resuelves disputas, y el SDK firma y envía el XDR sin firmar con tu billetera conectada automáticamente.",
    ],
    featuresTitle: "Qué ofrece",
    features: [
      {
        title: "Escrow no custodial",
        desc: "Los fondos se bloquean on-chain y se liberan por reglas, nunca los retiene un tercero.",
      },
      {
        title: "Liberación por hitos",
        desc: "Divide un acuerdo en hitos y libera fondos a medida que se aprueba cada uno.",
      },
      {
        title: "APIs, SDKs y plantillas",
        desc: "Escrow listo para usar sin escribir ni auditar contratos inteligentes tú mismo.",
      },
      {
        title: "Hecho para stablecoins",
        desc: "Diseñado en torno a pagos con stablecoins en Stellar.",
      },
    ],
    resourcesTitle: "Recursos oficiales",
    websiteLabel: "Sitio web",
    dappLabel: "Abrir la dApp",
    disclaimer:
      "Resumen basado en las páginas oficiales de Trustless Work. Pollar no está afiliado a Trustless Work; todo el crédito es de su equipo.",
  },

  lwAbout: {
    eyebrow: "LumenWipe",
    title: "Cierra una cuenta Stellar de forma limpia",
    tagline: "Recupera el XLM bloqueado en las reservas de la cuenta.",
    body: [
      "Cada cuenta de Stellar bloquea una reserva mínima: 1 XLM más 0,5 XLM por cada subentrada (trustlines, ofertas, entradas de datos, firmantes). LumenWipe recupera esas reservas guiando a la cuenta por un cierre completo y auditable.",
      "Desarma sistemáticamente cada gravamen — cancelando ofertas, saliendo de posiciones DeFi en Soroban, eliminando trustlines y entradas de datos —, convierte los saldos restantes a XLM y luego fusiona la cuenta en una billetera de destino.",
      "LumenWipe es no custodial: cada transacción se firma en tu navegador y las claves nunca salen de él. La API es de solo lectura y devuelve XDR sin firmar, así que decodificas y verificas cada paso antes de firmar.",
      "En esta demo, la pestaña LumenWipe llama a la API pública de LumenWipe para planificar y construir el cierre, y te permite firmar cada paso con tu billetera de Pollar conectada.",
    ],
    featuresTitle: "Qué hace",
    features: [
      {
        title: "Recupera reservas bloqueadas",
        desc: "Libera el XLM retenido por la reserva mínima de una cuenta.",
      },
      {
        title: "Bucle de cierre completo",
        desc: "Ofertas, trustlines, datos, firmantes y posiciones DeFi, en orden.",
      },
      {
        title: "Compatible con Soroban y DeFi",
        desc: "Sale de las posiciones DeFi de Soroban compatibles antes de cerrar.",
      },
      {
        title: "No custodial y reanudable",
        desc: "Firma en el navegador; las sesiones se pueden pausar y reanudar.",
      },
    ],
    resourcesTitle: "Recursos oficiales",
    websiteLabel: "Sitio web",
    docsLabel: "Documentación",
    disclaimer:
      "Resumen basado en el sitio y la documentación oficiales de LumenWipe. Todo el crédito es del equipo de LumenWipe.",
  },

  niriumAbout: {
    eyebrow: "Nirium",
    title: "Tesorería y pagos para agentes en Stellar",
    tagline: "Nirium arma las transacciones; tú firmas con tu propia wallet.",
    body: [
      "Nirium es una capa de tesorería y pagos no custodial para Stellar. Planifica y arma las transacciones —devolviendo XDR sin firmar— mientras que la firma queda por completo en la wallet conectada. Nirium piensa; tú firmas.",
      "Se distribuye como paquete de npm (npm i nirium) que expone un Agent que puedes usar desde el navegador. La primera integración es x402 (pagos programáticos), seguida de un audit trail, y con tesorería/CETES (rendimiento vía Etherfuse) como producto insignia una vez que llegue a mainnet.",
      "En esta demo, Nirium se conecta a Pollar igual que los adaptadores de DeFindex o Blend: el adaptador corre del lado del cliente solo con información pública, llama a Nirium para obtener el XDR sin firmar, y el SDK de Pollar lo firma y lo envía con tu wallet conectada. Ninguna clave secreta toca el frontend: tu firma es la autorización.",
    ],
    featuresTitle: "Qué ofrece",
    features: [
      {
        title: "No custodial por diseño",
        desc: "Nirium construye XDR sin firmar; la wallet de Pollar conectada firma. Sin claves secretas en el frontend.",
      },
      {
        title: "Pagos x402",
        desc: "Pagos programáticos solo por software: la primera integración, sin necesidad de API key.",
      },
      {
        title: "Audit trail",
        desc: "Un registro de actividad verificable y no custodial para cumplimiento y confianza.",
      },
      {
        title: "Tesorería y CETES",
        desc: "Tesorería con rendimiento vía Etherfuse: el producto insignia, rumbo a mainnet tras la auditoría.",
      },
    ],
    resourcesTitle: "Recursos oficiales",
    websiteLabel: "Desarrolladores",
    repoLabel: "SDK (GitHub)",
    disclaimer:
      "Resumen basado en los materiales compartidos por el equipo de Nirium. Pollar no está afiliado con Nirium; todo el crédito es de su equipo.",
  },

  rampAbout: {
    eyebrow: "Integración",
    title: "On/off-ramp con métodos de pago locales",
    tagline:
      "Compra y vende cripto vía anchors regionales — un modal, un flujo.",
    body: [
      "Ramp conecta a tus usuarios con el fiat: compran cripto con un método de pago local (SPEI, PIX, PSE, ACH) o hacen el cash-out al revés. Pollar cotiza el anchor, crea el on/off-ramp y muestra las instrucciones de pago dentro de un solo modal.",
      "Qué anchors y rieles están disponibles se decide en tu dashboard — el SDK lee esa selección en tiempo de ejecución desde la config de la app, así que habilitar un nuevo anchor es un toggle del dashboard, no un redeploy. Si no hay nada habilitado, la UI de ramp queda oculta.",
      "Por dentro el flujo es cotizar → crear ramp → hacer polling hasta que liquida, todo con @pollar/core. Mirá la pestaña Implementación para el demo en vivo y las llamadas exactas.",
    ],
    featuresTitle: "Anchors y estado",
    features: [
      {
        title: "Anclap — activo",
        desc: "On/off-ramp de moneda local sobre rieles regionales (SPEI, PIX, PSE…), liquidado en Stellar.",
      },
      {
        title: "Más anchors — en proceso",
        desc: "Se están integrando más anchors y rieles de pago regionales; habilitalos desde el dashboard a medida que salen.",
      },
      {
        title: "Configurado desde tu dashboard",
        desc: "Activá anchors en Treasury — el SDK lee tu selección en tiempo de ejecución, sin cambiar código.",
      },
      {
        title: "Un modal, core o React",
        desc: "openRampModal() renderiza todo el flujo cotización → pago → liquidación; o controlalo vos con @pollar/core.",
      },
    ],
    resourcesTitle: "Recursos",
    anclapLabel: "Anclap",
    docsLabel: "Anchors y SEPs de Stellar",
    disclaimer:
      "La disponibilidad de anchors depende de tu configuración del dashboard y de la cobertura de cada anchor. Anclap es un tercero; todo el crédito es de su equipo.",
  },

  swapAbout: {
    eyebrow: "Integración",
    title: "Swap entre venues on-chain",
    tagline: "Un modal, el mejor precio entre cada venue que habilites.",
    body: [
      "Swap permite a tus usuarios intercambiar un activo por otro on-chain. Pollar cotiza cada venue habilitado, ordena las rutas de mejor a peor y renderiza todo el flujo cotización → swap — trustline incluida — dentro de un solo modal.",
      "Los venues disponibles se deciden en tu dashboard (Treasury → Swap). El SDK lee esa selección en tiempo de ejecución vía getSwapConfig() (la respuesta SDK_SWAP_CONFIG), así que prender o apagar un venue es un toggle del dashboard. Una lista vacía oculta por completo la UI de swap.",
      "Por dentro el flujo es getSwapQuote → swap, todo con @pollar/core. Mirá la pestaña Implementación para el demo en vivo y las llamadas exactas.",
    ],
    featuresTitle: "Venues y estado",
    features: [
      {
        title: "Aquarius — activo",
        desc: "AMM de Soroban (pools de liquidez). Funciona para wallets clásicas y smart.",
      },
      {
        title: "Stellar DEX — activo",
        desc: "El order book nativo de Stellar vía path payments. Solo wallets clásicas.",
      },
      {
        title: "Soroswap — en proceso",
        desc: "Agregador de DEX sobre protocolos de Soroban. Necesita una API key de Soroswap de la plataforma; se omite hasta configurarla.",
      },
      {
        title: "Configurado desde tu dashboard",
        desc: "Habilitá venues en Treasury → Swap; el SDK lee getSwapConfig() en tiempo de ejecución, sin cambiar código.",
      },
    ],
    resourcesTitle: "Recursos",
    aquariusLabel: "Aquarius",
    soroswapLabel: "Soroswap",
    disclaimer:
      "La disponibilidad de venues depende de tu configuración del dashboard y de la capacidad de la plataforma. Aquarius y Soroswap son terceros; todo el crédito es de sus equipos.",
  },

  earnAbout: {
    eyebrow: "Integración",
    title: "Genera rendimiento on-chain",
    tagline: "Un modal, rendimiento real entre cada provider que habilites.",
    body: [
      "Earn permite a tus usuarios poner a trabajar los balances ociosos: depositar en un vault de DeFindex o un pool de Blend y generar rendimiento on-chain. Pollar lista cada provider habilitado con su APY en vivo y renderiza todo el flujo depósito → retiro dentro de un solo modal.",
      "Los providers disponibles se deciden en tu dashboard (Treasury → Earn) e intersectados con la capacidad del servidor: Blend necesita una dirección de pool y DeFindex una API key. El SDK lee esa selección en tiempo de ejecución vía getEarnProviders() (la respuesta SDK_EARN_PROVIDERS), así que prender o apagar un provider es un toggle del dashboard. Una lista vacía oculta por completo la UI de Earn.",
      "Por dentro el flujo es getEarnOpportunities → getEarnPosition → earnDeposit / earnWithdraw, todo con @pollar/core. Mirá la pestaña Implementación para el demo en vivo y las llamadas exactas.",
    ],
    featuresTitle: "Providers y estado",
    features: [
      {
        title: "DeFindex — activo",
        desc: "Vaults de rendimiento automatizado. Depositás un activo y recibís shares; los retiros van en shares. Se arma vía la API de DeFindex.",
      },
      {
        title: "Blend — activo",
        desc: "Pools de lending. Depositás y retirás en el activo subyacente; el XDR se arma contract-direct.",
      },
      {
        title: "Configurado desde tu dashboard",
        desc: "Habilitá providers en Treasury → Earn; el SDK lee getEarnProviders() en tiempo de ejecución, sin cambiar código.",
      },
      {
        title: "Un modal, core o React",
        desc: "openEarnModal() renderiza todo el flujo oportunidad → depósito / retiro; o controlalo tú mismo con @pollar/core.",
      },
    ],
    resourcesTitle: "Recursos",
    defindexLabel: "DeFindex",
    blendLabel: "Blend",
    disclaimer:
      "La disponibilidad de providers depende de tu configuración del dashboard y de la capacidad de la plataforma. DeFindex y Blend son terceros; todo el crédito es de sus equipos.",
  },

  niriumX402: {
    title: "Pagos x402",
    desc: "Envía un pago x402 programático. Nirium planifica y arma la transacción; el SDK de Pollar firma y envía el XDR sin firmar con tu wallet conectada — sin secret key, sin API key.",
    destination: "Destino",
    destinationNote: "Dirección Stellar del destinatario (G…) en testnet.",
    asset: "Activo",
    assetNote: "'XLM' para el nativo, o 'CODE:ISSUER' para un activo emitido.",
    amount: "Monto",
    reference: "Referencia",
    referenceNote:
      "Id de recurso / factura x402 opcional — se guarda como memo de la tx (máx. 28 caracteres).",
    pay: "Pagar con Pollar",
    signing: "Firmando…",
    setupSummary: "Setup: registra el adaptador de Nirium una vez",
    txIdle: "Completa destino, monto y activo, luego paga.",
    coreFnsTitle: "@pollar/core — funciones utilizadas",
    coreFnsIntro:
      "El adaptador devuelve un XDR sin firmar; el cliente core lo firma y lo envía.",
    coreFns: [
      {
        fn: "niriumAdapter.pay(params)",
        tag: "async",
        params:
          "params: { to, amount, asset, reference?, signer }. Nirium planifica el pago.",
        returns:
          "Promise<{ unsignedTransaction: string }> — el XDR sin firmar, listo para firmar.",
      },
      {
        fn: "client.signAndSubmitTx(xdr)",
        tag: "async",
        params:
          "xdr: string — la transacción sin firmar devuelta por el adaptador.",
        returns:
          "Promise<SubmitOutcome> — { status, hash, … }. Firma con la wallet conectada y luego envía.",
      },
    ],
    reactFnsTitle: "@pollar/react — hook y valores utilizados",
    reactFnsIntro:
      "createPollarAdapterHook conecta el adaptador para que Pollar firme solo; usePollar expone el estado de la tx en vivo.",
    reactFns: [
      {
        fn: "useNiriumX402()",
        tag: "hook",
        params:
          "Sin argumentos. Devuelve el adaptador envuelto — al llamar pay() construye, firma y envía en un paso.",
        returns:
          "WrappedAdapter — { pay }. El XDR sin firmar se firma y envía automáticamente.",
      },
      {
        fn: "usePollar().tx",
        tag: "reactive value",
        params: "Sin argumentos — léelo durante el render.",
        returns:
          "TransactionState — el progreso en vivo build → sign → submit (tx.step, tx.hash).",
      },
    ],
  },

  cosmosPayAbout: {
    eyebrow: "Cosmos Pay",
    title: "Intenciones de pago SEP-7 para Stellar",
    tagline: "Cosmos Pay arma el pago; tú firmas con tu propia wallet.",
    body: [
      "Cosmos Pay es un SDK orientado a objetos para la API de pagos de Cosmos Pay. Su mitad de servidor crea intenciones de pago SEP-7 de Stellar —además de webhooks, productos, clientes y analíticas— con tu clave secreta; su mitad de navegador las completa.",
      "Las wallets de navegador no consumen las URIs SEP-7 `web+stellar:` desde una dapp, así que el cliente web de Cosmos Pay adapta cada intención a una transacción Stellar concreta (XDR): construye el pago para una intención `pay`, o reutiliza el XDR para una intención `tx`.",
      "En esta demo Cosmos Pay se integra con Pollar igual que los adapters de Trustless Work y Nirium: buildTransaction del cliente web convierte la intención SEP-7 `pay` en un XDR sin firmar —construido desde tu cuenta conectada como origen— y el SDK de Pollar lo firma y lo envía con tu wallet. Ninguna clave secreta ni API key toca el frontend.",
    ],
    featuresTitle: "Qué ofrece",
    features: [
      {
        title: "Intenciones de pago SEP-7",
        desc: "Crea intenciones `pay` y `tx` en el servidor; cada una devuelve una URI SEP-7 + QR que cualquier wallet puede consumir.",
      },
      {
        title: "Cliente web agnóstico",
        desc: "Detecta Freighter, xBull, Rabet, LOBSTR y Albedo — o, aquí, entrega el XDR sin firmar a Pollar.",
      },
      {
        title: "Webhooks y catálogos",
        desc: "Entrega de webhooks firmados más productos, clientes y analíticas — todo detrás de tu clave secreta.",
      },
      {
        title: "Firmado por Pollar",
        desc: "Cosmos Pay arma el pago; la wallet de Pollar conectada firma. Sin claves secretas en el frontend.",
      },
    ],
    resourcesTitle: "Recursos oficiales",
    npmLabel: "Paquete npm",
    repoLabel: "SDK (GitHub)",
    disclaimer:
      "Resumen basado en el paquete publicado @cosmosapp/pay_sdk. Pollar no está afiliado a Cosmos Pay — todo el crédito para su equipo.",
  },

  cosmosPay: {
    title: "Pago SEP-7",
    desc: "Envía un pago Stellar a través de una intención SEP-7 de Cosmos Pay. Cosmos Pay arma el pago y devuelve un XDR sin firmar; el SDK de Pollar lo firma y lo envía con tu wallet conectada — sin clave secreta ni API key.",
    destination: "Destino",
    destinationNote: "Dirección Stellar del receptor (G…) en testnet.",
    asset: "Activo",
    assetNote: "'XLM' para el nativo, o 'CODE:ISSUER' para un activo emitido.",
    amount: "Monto",
    memo: "Memo",
    memoNote: "Nota opcional guardada como MEMO_TEXT (máx. 28 caracteres).",
    message: "Mensaje",
    messageNote: "Mensaje opcional legible que lleva la intención SEP-7.",
    pay: "Pagar con Pollar",
    signing: "Firmando…",
    setupSummary: "Configuración — registra el adapter de Cosmos Pay una vez",
    txIdle: "Completa destino, monto y activo, luego paga.",
    coreFnsTitle: "@pollar/core — funciones usadas",
    coreFnsIntro:
      "El adapter devuelve un XDR sin firmar; el cliente core lo firma y lo envía.",
    coreFns: [
      {
        fn: "cosmosPayAdapter.pay(params)",
        tag: "async",
        params:
          "params: { destination, amount, asset, memo?, msg?, signer }. Cosmos Pay arma el pago SEP-7.",
        returns:
          "Promise<{ unsignedTransaction: string }> — el XDR sin firmar, listo para firmar.",
      },
      {
        fn: "client.signAndSubmitTx(xdr)",
        tag: "async",
        params:
          "xdr: string — la transacción sin firmar que devuelve el adapter.",
        returns:
          "Promise<SubmitOutcome> — { status, hash, … }. Firma con la wallet conectada y luego envía.",
      },
    ],
    reactFnsTitle: "@pollar/react — hook y valores usados",
    reactFnsIntro:
      "createPollarAdapterHook conecta el adapter para que Pollar firme automáticamente; usePollar expone el estado de la tx en vivo.",
    reactFns: [
      {
        fn: "useCosmosPay()",
        tag: "hook",
        params:
          "Sin argumentos. Devuelve el adapter envuelto — llamar a pay() construye, firma y envía en un paso.",
        returns:
          "WrappedAdapter — { pay }. El XDR sin firmar se firma y envía automáticamente.",
      },
      {
        fn: "usePollar().tx",
        tag: "valor reactivo",
        params: "Sin argumentos — léelo durante el render.",
        returns:
          "TransactionState — el progreso en vivo construir → firmar → enviar (tx.step, tx.hash).",
      },
    ],
  },

  hedgepayAbout: {
    eyebrow: "HedgePay",
    title: "Banca self-custodial sobre stablecoins",
    tagline: "Tu app self-custodial. Tus reglas.",
    body: [
      "HedgePay es una app de banca self-custodial: guarda y administra stablecoins, convierte desde y hacia fiat, envía transferencias internacionales con comisiones mínimas y gasta en todo el mundo con tarjetas de débito virtuales — sin ceder la custodia de tus fondos.",
      "Esta pestaña es un adelanto de la integración de HedgePay con Pollar — próximamente.",
    ],
    featuresTitle: "Qué ofrece",
    features: [
      {
        title: "Tarjetas de débito virtuales",
        desc: "Gasta stablecoins en todo el mundo, donde acepten tarjetas.",
      },
      {
        title: "Fiat on/off y transferencias",
        desc: "Convierte fiat ↔ stablecoins y envía pagos internacionales de baja comisión.",
      },
      {
        title: "Self-custodial",
        desc: "Tú conservas la custodia de tus fondos — tus llaves, tus reglas.",
      },
      {
        title: "Ahorra en monedas fuertes",
        desc: "Mantén saldos en stablecoins respaldadas en USD / EUR.",
      },
    ],
    resourcesTitle: "Recursos oficiales",
    websiteLabel: "Sitio web",
    disclaimer:
      "Resumen basado en el sitio oficial de HedgePay. Pollar no está afiliado a HedgePay — todo el crédito para su equipo.",
  },

  vaquitaAbout: {
    eyebrow: "Vaquita",
    title: "Ahorro comunitario en Stellar",
    tagline: "El poder de ahorrar en comunidad.",
    body: [
      "Vaquita es una plataforma de ahorro comunitario en Stellar: los miembros aportan de forma periódica y ganan interés mediante un sistema justo y descentralizado, con retiros flexibles — mientras más esperas, mayor es tu rendimiento.",
      "Esta pestaña es un adelanto de la integración de Vaquita con Pollar — próximamente.",
    ],
    featuresTitle: "Qué ofrece",
    features: [
      {
        title: "Ahorra en comunidad",
        desc: "Junta aportes periódicos con otros y crezcan juntos.",
      },
      {
        title: "Rendimiento justo y descentralizado",
        desc: "El interés se distribuye de forma justa mediante smart contracts.",
      },
      {
        title: "Retiros flexibles",
        desc: "Retira cuando lo necesites; esperar más rinde más.",
      },
      {
        title: "Asegurado en Stellar",
        desc: "Funciona con smart contracts de Stellar.",
      },
    ],
    resourcesTitle: "Recursos oficiales",
    websiteLabel: "Sitio web",
    disclaimer:
      "Resumen basado en el sitio oficial de Vaquita. Pollar no está afiliado a Vaquita — todo el crédito para su equipo.",
  },

  humanWebAbout: {
    eyebrow: "Human Web",
    title: "Comparte tu opinión, de forma anónima",
    tagline: "Tu opinión, sin exponer quién sos.",
    body: [
      "Human Web es una plataforma para opinar y votar de forma anónima: participa en los temas que te importan y responde encuestas sin exponer nunca tu identidad.",
      "Esta pestaña es un adelanto de la integración de Human Web con Pollar — próximamente.",
    ],
    featuresTitle: "Qué ofrece",
    features: [
      {
        title: "Anónimo por diseño",
        desc: "Opina y vota sin revelar quién eres.",
      },
      {
        title: "Encuestas de la comunidad",
        desc: "Crea y responde encuestas que le importan a la comunidad.",
      },
      {
        title: "Haz oír tu voz",
        desc: "Participa en los temas y causas que te importan.",
      },
      {
        title: "Construido sobre Stellar",
        desc: "Funciona sobre Stellar para resultados transparentes e inalterables.",
      },
    ],
    resourcesTitle: "Recursos oficiales",
    websiteLabel: "Sitio web",
    disclaimer:
      "Resumen basado en el sitio oficial de Human Web. Pollar no está afiliado a Human Web — todo el crédito para su equipo.",
  },

  e4cAbout: {
    eyebrow: "E4C",
    title: "Educación en la blockchain",
    tagline: "Aprendizaje, impulsado por Stellar.",
    body: [
      "E4C es una plataforma educativa construida sobre Stellar: accede a contenido de aprendizaje y obtén credenciales verificables en cadena por lo que completas.",
      "Esta pestaña es un adelanto de la integración de E4C con Pollar — próximamente.",
    ],
    featuresTitle: "Qué ofrece",
    features: [
      {
        title: "Aprende donde sea",
        desc: "Accede al contenido educativo desde cualquier dispositivo.",
      },
      {
        title: "Credenciales en cadena",
        desc: "Obtén una prueba verificable de lo que completaste.",
      },
      {
        title: "Abierto para todos",
        desc: "Reduce las barreras a la educación de calidad.",
      },
      {
        title: "Construido sobre Stellar",
        desc: "Funciona sobre Stellar para registros transparentes e inalterables.",
      },
    ],
    resourcesTitle: "Recursos oficiales",
    websiteLabel: "Sitio web",
    disclaimer:
      "Resumen basado en el sitio oficial de E4C. Pollar no está afiliado a E4C — todo el crédito para su equipo.",
  },

  ...nekoEs,
};

export const pt: Dictionary = {
  langName: "Português",

  common: {
    connectWalletFirst: "Conecte sua carteira primeiro",
    connectWalletToContinue: "Conecte sua carteira para continuar",
    loading: "Carregando…",
    unknownError: "Erro desconhecido",
    viewModal: "Ver modal",
    optional: "(opcional)",
    cancel: "Cancelar",
    save: "Salvar",
    comingSoon: "Em breve",
    comingSoonDesc: "Esta funcionalidade estará disponível em breve.",
    soon: "Em breve",
    new: "Novo",
    coreClientNote: {
      title: "Usar o core a partir do @pollar/react",
      intro:
        "Prefere o @pollar/react? Você mantém todo o core — o mesmo PollarClient está por baixo. Acesse-o de duas formas equivalentes:",
      outro:
        "Ambas entregam o mesmo cliente idêntico, então cada método do @pollar/core desta página funciona tal como está. Você pode até usar o @pollar/react totalmente headless (só getClient(), ignorando os modais prontos), mas sua vantagem são os hooks reativos que re-renderizam sua UI para você.",
    },
  },

  nav: {
    transactions: "Transações",
    send: "Enviar",
    receive: "Receber",
    history: "Histórico",
    balance: "Saldo",
    assets: "Ativos",
    ramp: "Ramp",
    kyc: "KYC",
    escrow: "Escrow",
    payments: "Pagamentos",
    login: "Entrar",
    logout: "Sair",
    sessions: "Sessões",
    signXdr: "Assinar XDR",
    distribution: "Distribuição",
    lumenwipe: "LumenWipe",
    overview: "Visão geral",
    dashboard: "Painel",
    pools: "Pools",
    vaults: "Vaults",
    wallet: "Carteira",
    privy: "Privy",
    stellarWalletsKit: "Stellar Wallets Kit",
    acceslyAdapter: "Accesly",
    swap: "Swap",
    setup: "Setup",
    implementation: "Implementação",
    adapter: "Adapter",
    groups: {
      auth: "Autenticação",
      pollarWallet: "Carteira",
      transactions: "Transações",
      distribution: "Distribuição",
      kyc: "KYC",
      ramp: "Ramp",
      swap: "Swap",
      earn: "Earn",
      trustlessWork: "Trustless Work",
      nirium: "Nirium",
      cosmosPay: "Cosmos Pay",
      lumenwipe: "LumenWipe",
      hedgepay: "Hedgepay",
      vaquita: "Vaquita",
      humanWeb: "Human Web",
      e4c: "E4C",
      stellarWalletsKit: "Stellar Wallets Kit",
      privy: "Privy",
      acceslyAdapter: "Accesly",
      neko: nekoNavLabel,
    },
  },

  shell: {
    apiKey: "Chave de API personalizada",
    apiKeyTitle: "Use sua própria chave de API publicável",
    switchToLight: "Mudar para o modo claro",
    switchToDark: "Mudar para o modo escuro",
    changeLanguage: "Alterar idioma",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    products: "Produtos",
    integrations: "Integrações",
    walletAdapters: walletAdaptersNavLabel,
    adapters: "Adapters",
    builtWith: "Feito com Pollar",
  },

  adapterDoc: {
    title: "O adapter do {name}",
    intro:
      "Como o {name} se conecta ao Pollar. O adapter é código de cliente puro: chama o protocolo, recebe uma transação não assinada e a entrega ao Pollar para assinar e enviar.",
    contractTitle: "O contrato do adapter",
    contractDesc:
      "Cada função do adapter retorna { unsignedTransaction: string }. O Pollar assina e envia com a carteira conectada do usuário — nenhuma chave secreta ou API key toca o frontend.",
    sourceTitle: "adapter.ts",
    sourceDesc:
      "A definição completa do adapter. Cada método chama o protocolo e retorna o XDR não assinado.",
    registerTitle: "Registre uma vez",
    registerDesc:
      "Registre o adapter no provider do Pollar e derive um hook tipado com createPollarAdapterHook. A partir daí qualquer componente pode chamá-lo, e o Pollar cuida da assinatura.",
  },

  home: {
    badge: "Demo do SDK — todos os recursos, ao vivo na testnet",
    titlePre: "Explore o ",
    titleHighlight: "SDK da Pollar",
    subtitle:
      "Cada aba demonstra um recurso de @pollar/core e @pollar/react, com o código equivalente lado a lado.",
    descs: {
      transactions:
        "Invoque contratos inteligentes e construa operações na Stellar.",
      send: "Transfira ativos para outro endereço Stellar.",
      receive: "Mostre seu endereço e código QR para receber fundos.",
      history: "Liste as transações anteriores da carteira.",
      balance: "Consulte os saldos de contas Stellar pela chave pública.",
      assets:
        "Veja os ativos habilitados do app e quais trustlines estão faltando.",
      ramp: "Compre e venda cripto com métodos de pagamento locais.",
      kyc: "Verifique sua identidade para desbloquear limites maiores.",
      escrow: "Escrows da Trustless Work com assinatura automática de XDR.",
      payments:
        "Pagamentos x402 programáticos — Nirium planeja, Pollar assina.",
      login: "Autentique usuários com redes sociais, email ou carteira.",
      logout: "Revogue a sessão e limpe o estado local.",
      sessions: "Revise as sessões ativas e revogue dispositivos.",
      signXdr:
        "Assine um XDR construído em outro lugar com a carteira conectada.",
      distribution: "Liste as regras de distribuição e resgate sua parte.",
      lumenwipe: "Encerre uma conta Stellar e transfira o saldo restante.",
      stellarWalletsKit:
        "Registre carteiras do Stellar Wallets Kit (Freighter, Albedo, xBull…) como adaptadores da Pollar.",
      privy:
        "Login com e-mail / Google com uma carteira Stellar embutida da Privy.",
      acceslyAdapter:
        "Assine transações da Pollar com uma smart account da Accesly (passkey + Shamir-MPC).",
      swap: "Troque um ativo por outro pelo melhor preço on-chain.",
      earn: "Deposite em vaults da DeFindex e pools da Blend para gerar rendimento.",
      setup: "Conecte com @pollar/core ou @pollar/react.",
    },
  },

  apiKeyModal: {
    title: "Use sua chave de API",
    subtitle:
      "Cole sua chave publicável da Pollar para executar esta demo com seu próprio aplicativo.",
    keyLabel: "Chave publicável",
    storedNote1: "Ela fica armazenada apenas na URL (",
    storedNote2:
      "), então o cliente do SDK a lê na próxima renderização — nada é enviado para nenhum outro lugar.",
    noKey1: "Não tem uma? Obtenha sua chave publicável em ",
    noKey2: " → API keys.",
    reset: "Restaurar o padrão",
  },

  originModal: {
    title: "Domínio não permitido",
    subtitle:
      "O SDK da Pollar não conseguiu carregar sua configuração porque este domínio não está nas origens permitidas do seu aplicativo.",
    originLabel: "Origem a adicionar",
    instructions1: "Abra seu aplicativo em ",
    instructions2:
      " → Build → Domains, adicione a origem acima e recarregue esta página.",
    openDashboard: "Abrir dashboard",
    dismiss: "Fechar",
  },

  invalidKeyModal: {
    title: "Chave de API inválida",
    subtitle:
      "O SDK da Pollar não conseguiu carregar sua configuração porque esta chave de API não é reconhecida.",
    keyLabel: "Chave de API em uso",
    instructions1: "Verifique a chave em ",
    instructions2:
      " → Build → API keys, depois atualize-a aqui ou remova-a para voltar à chave de demonstração.",
    openDashboard: "Abrir dashboard",
    dismiss: "Fechar",
  },

  networkModal: {
    title: "A rede está vinculada à sua chave de API",
    subtitle:
      "Sua chave de API personalizada só funciona em uma rede, definida pelo seu prefixo (pub_testnet_… ou pub_mainnet_…).",
    body: "Para trocar de rede, altere a chave de API por uma emitida para a rede desejada.",
    changeKey: "Alterar chave de API",
    dismiss: "Fechar",
  },

  send: {
    title: "Enviar",
    desc: "Transfira ativos para outro endereço Stellar. A Pollar renderiza o seletor de ativos, o campo de valor, a revisão e o fluxo de assinatura dentro de um modal.",
    open: "Abrir modal de envio",
    note: "não recebe argumentos — o ativo, o valor e o destino são escolhidos dentro do modal.",
    reactDesc:
      "Botão pronto que abre um modal pré-montado: o seletor de ativos, o valor, a revisão e o fluxo de assinatura já vêm renderizados.",
    coreDesc:
      "Construa, assine e envie o pagamento você mesmo com uma única chamada runTx('payment', …), e então leia o estado da transação.",
    form: {
      destinationLabel: "Destino",
      destinationPh: "G… (endereço do destinatário)",
      assetLabel: "Ativo",
      assetHint:
        "os ativos que a carteira conectada possui — carregados via refreshWalletBalance().",
      amountLabel: "Valor",
      amountPh: "10",
      run: "Executar pagamento",
      running: "Enviando…",
      stateIdle: "Preencha destino, ativo e valor e então execute o pagamento.",
      nativeOnly:
        "Conecte uma carteira para carregar seus ativos; o XLM nativo é exibido por padrão.",
    },
    coreFnsTitle: "Funções utilizadas",
    coreFnsIntro:
      "Todas são métodos do cliente que getClient() retorna — a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "runTx(operation, params, options?)",
        tag: "async",
        params:
          "operation: TxBuildBody['operation'] (ex. 'payment'); params: o corpo da operação — para um pagamento, { destination, asset, amount }; options?: flags de build opcionais.",
        returns:
          "Promise<SubmitOutcome>: { status: 'success' | 'pending' | 'error', hash, … }. Em um passo só build → sign → submit.",
      },
      {
        fn: "getTransactionState()",
        tag: "sync",
        params: "Sem argumentos.",
        returns:
          "TransactionState: o progresso atual de build/sign/submit; null antes de executar qualquer tx.",
      },
      {
        fn: "onTransactionStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: TransactionState) => void — invocado a cada transição de estado.",
        returns:
          "() => void: uma função para cancelar a inscrição. O valor tx do hook do react é construído sobre isto.",
      },
    ],
    reactFnsTitle: "Hook e valores utilizados",
    reactFnsIntro:
      "Todos vêm do hook usePollar() — a camada do react construída sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sem argumentos. Chame-o no nível superior de um componente: ele lê o contexto do React, então precisa rodar durante o render.",
        returns:
          "PollarContextValue: toda a superfície do SDK: valores de estado reativo, abridores de modais e getClient() para descer ao core.",
      },
      {
        fn: "openSendModal()",
        tag: "sync",
        params:
          "Sem argumentos: o ativo, o valor e o destino são escolhidos dentro do modal.",
        returns: "void: abre o modal pré-montado; não há nada para aguardar.",
      },
      {
        fn: "tx",
        tag: "reactive value",
        params:
          "Não é uma função: é um valor do tipo TransactionState lido de usePollar().",
        returns:
          "Re-renderiza seu componente enquanto o pagamento é construído, assinado e enviado. Reflete getClient().getTransactionState().",
      },
    ],
  },

  receive: {
    title: "Receber",
    desc: "Mostre o endereço da carteira conectada e o código QR para que outros possam enviar fundos para ela. A Pollar renderiza toda a visualização dentro de um modal.",
    open: "Abrir modal de recebimento",
    note: "não recebe argumentos — ele lê o endereço da carteira conectada do contexto.",
    reactDesc:
      "Botão pronto que abre um modal pré-montado com o endereço da carteira conectada e um código QR.",
    coreDesc:
      "Leia a chave pública da carteira conectada a partir do estado de autenticação e renderize o endereço + QR você mesmo.",
    coreFnsTitle: "Funções utilizadas",
    coreFnsIntro:
      "Todas são métodos do cliente que getClient() retorna — a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "getAuthState()",
        tag: "sync",
        params: "Sem argumentos.",
        returns:
          "AuthState: quando step === 'authenticated', session.wallet?.publicKey é o endereço de recebimento (uma string G…).",
      },
    ],
    reactFnsTitle: "Hook e valores utilizados",
    reactFnsIntro:
      "Todos vêm do hook usePollar() — a camada do react construída sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sem argumentos. Chame-o no nível superior de um componente: ele lê o contexto do React, então precisa rodar durante o render.",
        returns:
          "PollarContextValue: toda a superfície do SDK: valores de estado reativo, abridores de modais e getClient() para descer ao core.",
      },
      {
        fn: "openReceiveModal()",
        tag: "sync",
        params:
          "Sem argumentos: ele lê o endereço da carteira conectada do contexto.",
        returns: "void: abre o modal pré-montado com o endereço e o código QR.",
      },
      {
        fn: "wallet",
        tag: "reactive value",
        params:
          "Não é uma função: é um objeto WalletInfo lido de usePollar(), ou null quando não conectado.",
        returns:
          "A carteira conectada (wallet.address contém a chave pública, wallet.custody/provider seu tipo); re-renderiza quando a sessão muda.",
      },
    ],
  },

  history: {
    title: "Histórico",
    desc: "Liste as transações anteriores da carteira conectada com paginação. O estado de carregamento é exposto de forma reativa, para que sua UI reaja à medida que os dados chegam.",
    open: "Abrir modal de histórico",
    note: "não recebe argumentos — a paginação é tratada dentro do modal.",
    idle: "Abra o modal para carregar o histórico.",
    recordsLoaded: (n: number) =>
      `${n} ${n === 1 ? "registro carregado" : "registros carregados"}.`,
    coreOpen: "Executar fetchTxHistory()",
    coreNote:
      "fetch imperativo via getClient() — alimenta o mesmo estado txHistory.",
    reactDesc:
      "Botão pronto que abre um modal pré-montado: a lista, a paginação e os estados de carregamento e vazio já vêm renderizados.",
    coreDesc:
      "Busque os registros de forma imperativa e trate o response cru você mesmo. Não renderiza UI: você lê o estado e monta a sua.",
    rawResponse: "Response cru",
    coreFnsTitle: "Funções utilizadas",
    coreFnsIntro:
      "Todas são métodos do cliente que getClient() retorna — a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "fetchTxHistory(params?)",
        tag: "async",
        params:
          "params?: { network?: 'testnet' | 'mainnet'; limit?: number; offset?: number }. Todos os campos são opcionais: omita o objeto para usar os padrões da sessão, ou passe limit + offset para paginar.",
        returns:
          "Promise<void>: não retorna os dados; grava o resultado no estado reativo, que você depois lê com getTxHistoryState().",
      },
      {
        fn: "getTxHistoryState()",
        tag: "sync",
        params: "Sem argumentos.",
        returns:
          "TxHistoryState: uma união discriminada por step ('idle' | 'loading' | 'loaded' | 'error'). data (records, total, limit, offset) só existe quando step === 'loaded'.",
      },
      {
        fn: "onTxHistoryStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: TxHistoryState) => void — invocado a cada transição de estado.",
        returns:
          "() => void: uma função para cancelar a inscrição; chame-a para parar de escutar. O txHistory do hook do react é construído sobre isto.",
      },
    ],
    reactFnsTitle: "Hook e valores utilizados",
    reactFnsIntro:
      "Todos vêm do hook usePollar() — a camada do react construída sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sem argumentos. Chame-o no nível superior de um componente: ele lê o contexto do React, então precisa rodar durante o render.",
        returns:
          "PollarContextValue: toda a superfície do SDK: valores de estado reativo, abridores de modais e getClient() para descer ao core.",
      },
      {
        fn: "openTxHistoryModal()",
        tag: "sync",
        params:
          "Sem argumentos: o fetch, a paginação e o render acontecem dentro do modal.",
        returns: "void: abre o modal pré-montado; não há nada para aguardar.",
      },
      {
        fn: "txHistory",
        tag: "reactive value",
        params:
          "Não é uma função: é um valor do tipo TxHistoryState lido de usePollar().",
        returns:
          "Re-renderiza seu componente sempre que muda. Reflete getClient().getTxHistoryState(): step e data quando carregado.",
      },
    ],
  },

  signXdr: {
    title: "Assinar XDR",
    desc: "Assine uma transação que foi construída em outro lugar — um backend, uma CLI, outro app — com a carteira que está conectada. Cole o XDR não assinado e assine + envie em uma única chamada, ou separe a assinatura do envio.",
    xdrLabel: "XDR não assinado",
    xdrPlaceholder: "AAAAAgAAAAA… (envelope de transação em base64)",
    xdrNote:
      "O envelope de transação em base64 produzido onde a transação foi construída.",
    oneShotTitle: "Uma chamada — assinar + enviar",
    splitTitle: "Fluxo separado — carteiras externas assinam no cliente",
    working: "Processando…",
    signedXdrLabel: "XDR assinado",
    stateLabel: "estado da tx",
    stateIdle:
      "Cole um XDR e assine para alimentar a máquina de estados da transação.",
    reactFnsTitle: "Hook e valores usados",
    reactFnsIntro:
      "Tudo isso vem do hook usePollar(): a camada de react construída sobre getClient().",
    reactFns: [
      {
        fn: "signAndSubmitTx(unsignedXdr?)",
        tag: "async",
        params:
          "unsignedXdr: string — o envelope construído em outro lugar. Assina com a carteira conectada e envia em uma única chamada (custodial ou externa).",
        returns:
          "Promise<SubmitOutcome> — { status: 'success' | 'pending', hash } ou { status: 'error', … }. Também alimenta o valor reativo tx.",
      },
      {
        fn: "signTx(unsignedXdr)",
        tag: "async",
        params:
          "unsignedXdr: string. Apenas carteiras externas — a carteira assina no cliente. Fluxos custodiais devem usar signAndSubmitTx.",
        returns:
          "Promise<SignOutcome> — { status: 'signed', signedXdr } ou { status: 'error', … }.",
      },
      {
        fn: "submitTx(signedXdr)",
        tag: "async",
        params:
          "signedXdr: string — o envelope assinado que signTx retorna. Transmite-o para a rede.",
        returns:
          "Promise<SubmitOutcome> — { status: 'success' | 'pending', hash } ou { status: 'error', … }.",
      },
      {
        fn: "tx",
        tag: "reactive value",
        params:
          "Não é uma função: um TransactionState lido de usePollar(). Re-renderiza através de 'signing' → 'submitting' → 'success' / 'error'.",
        returns:
          "Espelha getClient().getTransactionState(): step mais hash / buildData quando presentes.",
      },
    ],
    coreFnsTitle: "Funções usadas",
    coreFnsIntro:
      "Os mesmos métodos do cliente retornado por getClient(): a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "signAndSubmitTx(unsignedXdr?)",
        tag: "async",
        params:
          "unsignedXdr: string — o envelope construído em outro lugar. Assinatura + envio em uma chamada com a carteira conectada.",
        returns: "Promise<SubmitOutcome> — status + hash, ou um erro.",
      },
      {
        fn: "signTx(unsignedXdr)",
        tag: "async",
        params:
          "unsignedXdr: string. Apenas carteiras externas — retorna o XDR assinado sem transmiti-lo.",
        returns:
          "Promise<SignOutcome> — { status: 'signed', signedXdr } ou um erro.",
      },
      {
        fn: "submitTx(signedXdr)",
        tag: "async",
        params:
          "signedXdr: string — transmite um envelope assinado no cliente.",
        returns: "Promise<SubmitOutcome> — status + hash, ou um erro.",
      },
    ],
  },

  login: {
    title: "Entrar",
    desc: "Autentique um usuário. Com @pollar/react um único modal pronto renderiza cada provedor que você configurou: redes sociais, código por email e quaisquer adaptadores de carteira. Com @pollar/core você controla cada provedor por conta própria e lê a máquina de estados de autenticação.",
    open: "Abrir modal de login",
    alreadyIn: "Você já está conectado",
    note: "não recebe argumentos: renderiza cada provedor configurado e resolve a sessão para você.",
    reactDesc:
      "openLoginModal() abre o modal pronto com todos os provedores; login({ provider }) entra direto em um provedor, pulando o modal.",
    coreDesc:
      "Inicie um login para qualquer provedor com login({ provider }), execute os passos do código por email e inscreva-se em onAuthStateChange para renderizar seu próprio fluxo.",
    coreFnsTitle: "Funções usadas",
    coreFnsIntro:
      "Todos são métodos do cliente retornado por getClient(): a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "login(options)",
        tag: "sync",
        params:
          "options: { provider: 'google' | 'github' | 'email' | <tipo de adaptador de carteira> } (email também recebe { email }). Dispare e esqueça: alimenta a máquina de estados de autenticação.",
        returns:
          "void — o progresso e o resultado aparecem via onAuthStateChange / getAuthState().",
      },
      {
        fn: "beginEmailLogin()",
        tag: "sync",
        params:
          "Sem argumentos. Passo 1 do fluxo de código por email: abre o passo de email para o usuário digitar seu endereço.",
        returns: "void — avança a máquina de estados para 'entering_email'.",
      },
      {
        fn: "sendEmailCode(email)",
        tag: "sync",
        params:
          "email: string — o endereço para o qual enviar o código de uso único. Passo 2 do fluxo de código por email.",
        returns:
          "void — envia o código e avança a máquina de estados para 'entering_code'.",
      },
      {
        fn: "verifyEmailCode(code)",
        tag: "sync",
        params:
          "code: string — o código de uso único que o usuário recebeu por email. Passo 3 do fluxo de código por email.",
        returns:
          "void — com um código válido a máquina de estados chega a 'authenticated'.",
      },
      {
        fn: "loginSmartWallet()",
        tag: "sync",
        params:
          "Sem argumentos. Executa a cerimônia passkey (WebAuthn) para um usuário de smart wallet que retorna; use createSmartWallet() para um novo.",
        returns: "void — alimenta a máquina de estados de autenticação.",
      },
      {
        fn: "onAuthStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: AuthState) => void — chamado a cada transição ('idle', 'creating_session', 'opening_oauth', 'authenticated', 'error', …).",
        returns:
          "() => void — uma função para cancelar a inscrição. Combine com getAuthState() para ler o passo atual.",
      },
    ],
    reactFnsTitle: "Hook e valores usados",
    reactFnsIntro:
      "Tudo isso vem do hook usePollar(): a camada de react construída sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sem argumentos. Chame-o no nível superior de um componente: ele lê o contexto do React, então deve rodar durante o render.",
        returns:
          "PollarContextValue — toda a superfície do SDK: valores de estado reativos, aberturas de modais e getClient() para descer ao core.",
      },
      {
        fn: "openLoginModal()",
        tag: "sync",
        params:
          "Sem argumentos: renderiza cada provedor configurado no modal pronto da Pollar.",
        returns: "void — abre o modal pronto; não há nada a aguardar.",
      },
      {
        fn: "login(options)",
        tag: "sync",
        params:
          "As mesmas opções do core: entre direto em um provedor (ex.: login({ provider: 'google' })) sem abrir o modal.",
        returns:
          "void — o progresso aparece nos valores reativos isAuthenticated / wallet.",
      },
      {
        fn: "isAuthenticated",
        tag: "reactive value",
        params:
          "Não é uma função: um booleano lido de usePollar(). false até o servidor confirmar a sessão.",
        returns:
          "Re-renderiza seu componente quando a sessão é criada ou destruída. Combine com verified antes de liberar a assinatura.",
      },
    ],
  },

  logout: {
    title: "Sair",
    desc: "Encerre a sessão do usuário atual. logout() revoga a sessão deste dispositivo no servidor e limpa o armazenamento local; passe { everywhere: true } para revogar todos os dispositivos. A mesma chamada sustenta tanto @pollar/core quanto @pollar/react.",
    open: "Sair",
    alreadyOut: "Você já saiu",
    note: "revoga a sessão atual e limpa o estado local: isAuthenticated passa a false.",
    reactDesc:
      "logout() do usePollar() revoga a sessão e limpa o estado local; o valor reativo isAuthenticated passa a false e sua UI é re-renderizada.",
    coreDesc:
      "client.logout() revoga este dispositivo no servidor e apaga o armazenamento; logout({ everywhere: true }) ou logoutEverywhere() encerram a sessão em todos os dispositivos.",
    coreFnsTitle: "Funções usadas",
    coreFnsIntro:
      "Todos são métodos do cliente retornado por getClient(): a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "logout(options?)",
        tag: "async",
        params:
          "options?: { everywhere?: boolean }. Por padrão revoga apenas a família de refresh-token deste dispositivo; everywhere: true revoga todas.",
        returns:
          "Promise<void> — a revogação no servidor é best-effort; o estado local é limpo de qualquer forma.",
      },
      {
        fn: "logoutEverywhere()",
        tag: "async",
        params: "Sem argumentos. Atalho para logout({ everywhere: true }).",
        returns:
          "Promise<void> — revoga todas as sessões ativas deste usuário em todos os dispositivos.",
      },
      {
        fn: "onAuthStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: AuthState) => void — dispara quando a máquina volta para 'idle' após limpar a sessão.",
        returns: "() => void — uma função para cancelar a inscrição.",
      },
    ],
    reactFnsTitle: "Hook e valores usados",
    reactFnsIntro:
      "Tudo isso vem do hook usePollar(): a camada de react construída sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sem argumentos. Chame-o no nível superior de um componente: ele lê o contexto do React, então deve rodar durante o render.",
        returns:
          "PollarContextValue — toda a superfície do SDK: valores de estado reativos, aberturas de modais e getClient() para descer ao core.",
      },
      {
        fn: "logout()",
        tag: "sync",
        params:
          "Sem argumentos: envolve client.logout(). Revoga a sessão atual e limpa o estado local.",
        returns:
          "void — não há nada a aguardar; isAuthenticated passa a false e a UI dependente é re-renderizada.",
      },
      {
        fn: "isAuthenticated",
        tag: "reactive value",
        params:
          "Não é uma função: um booleano lido de usePollar(). Habilite o botão de sair conforme seu valor (não há nada a revogar quando já é false).",
        returns:
          "Re-renderiza seu componente quando passa a false após o logout.",
      },
    ],
  },

  sessions: {
    title: "Sessões",
    desc: "Revise as sessões ativas do usuário conectado, revogue um único dispositivo ou encerre a sessão em todos os lugares. A Pollar renderiza a lista e as ações dentro de um modal.",
    open: "Abrir modal de sessões",
    note: "não recebe argumentos — ele lista as sessões do usuário atual e cuida da revogação.",
    reactDesc:
      "Botão pronto que abre um modal pré-montado: a lista de dispositivos, as ações de revogar e encerrar a sessão em todos os lugares já vêm renderizadas.",
    coreDesc:
      "Enumere as sessões do usuário, revogue um dispositivo ou encerre a sessão em todos os lugares, e renderize a lista você mesmo.",
    coreFnsTitle: "Funções utilizadas",
    coreFnsIntro:
      "Todas são métodos do cliente que getClient() retorna — a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "listSessions()",
        tag: "async",
        params: "Sem argumentos.",
        returns:
          "Promise<SessionInfo[]>: uma linha por dispositivo / família de refresh-token (familyId, deviceLabel, current, lastUsedAt, expiresAt, …).",
      },
      {
        fn: "revokeSession(familyId)",
        tag: "async",
        params:
          "familyId: string — de uma linha SessionInfo. Revogar a sessão atual encerra a sessão neste dispositivo.",
        returns: "Promise<void>.",
      },
      {
        fn: "logoutEverywhere()",
        tag: "async",
        params: "Sem argumentos.",
        returns: "Promise<void>: revoga todas as sessões do usuário.",
      },
      {
        fn: "getSessionsState()",
        tag: "sync",
        params: "Sem argumentos.",
        returns:
          "SessionsState: uma união discriminada por step; data tem a lista quando carregada. onSessionsStateChange(cb) se inscreve.",
      },
    ],
    reactFnsTitle: "Hook e valores utilizados",
    reactFnsIntro:
      "Todos vêm do hook usePollar() — a camada do react construída sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sem argumentos. Chame-o no nível superior de um componente: ele lê o contexto do React, então precisa rodar durante o render.",
        returns:
          "PollarContextValue: toda a superfície do SDK: valores de estado reativo, abridores de modais e getClient() para descer ao core.",
      },
      {
        fn: "openSessionsModal()",
        tag: "sync",
        params:
          "Sem argumentos: ele lista as sessões do usuário atual e cuida da revogação.",
        returns: "void: abre o modal pré-montado; não há nada para aguardar.",
      },
      {
        fn: "sessions",
        tag: "reactive value",
        params:
          "Não é uma função: é um valor do tipo SessionsState lido de usePollar().",
        returns:
          "Re-renderiza quando a lista carrega ou um dispositivo é revogado. Reflete getClient().getSessionsState().",
      },
    ],
  },

  distribution: {
    title: "Distribuição",
    desc: "Liste as regras de distribuição para as quais o usuário é elegível e resgate a parte dele. A Pollar renderiza a lista de regras e as ações de resgate dentro de um modal.",
    open: "Abrir modal de distribuição",
    note: "não recebe argumentos — ele carrega as regras do usuário e cuida do resgate.",
    reactDesc:
      "Botão pronto que abre um modal pré-montado: a lista de regras elegíveis e as ações de resgate já vêm renderizadas.",
    coreDesc:
      "Liste as regras para as quais o usuário é elegível e resgate uma parte você mesmo.",
    coreFnsTitle: "Funções utilizadas",
    coreFnsIntro:
      "Todas são métodos do cliente que getClient() retorna — a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "listDistributionRules()",
        tag: "async",
        params: "Sem argumentos.",
        returns:
          "Promise<DistributionRule[]>: as regras para as quais o usuário é elegível (id, period, amount, …).",
      },
      {
        fn: "claimDistributionRule(body)",
        tag: "async",
        params:
          "body: DistributionClaimBody — { ruleId: string } que identifica a regra a resgatar.",
        returns:
          "Promise<DistributionClaimContent>: o resultado do resgate (valor, referência de tx, …).",
      },
    ],
    reactFnsTitle: "Hook e valores utilizados",
    reactFnsIntro:
      "Todos vêm do hook usePollar() — a camada do react construída sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sem argumentos. Chame-o no nível superior de um componente: ele lê o contexto do React, então precisa rodar durante o render.",
        returns:
          "PollarContextValue: toda a superfície do SDK: valores de estado reativo, abridores de modais e getClient() para descer ao core.",
      },
      {
        fn: "openDistributionRulesModal()",
        tag: "sync",
        params:
          "Sem argumentos: ele carrega as regras do usuário e cuida do resgate.",
        returns: "void: abre o modal pré-montado; não há nada para aguardar.",
      },
    ],
  },

  ramp: {
    title: "Ramp",
    desc: "Compre e venda cripto com métodos de pagamento locais (SPEI, PIX, PSE, ACH) através de anchors como a Anclap. A Pollar renderiza todo o fluxo de cotação e pagamento dentro de um modal.",
    open: "Abrir modal de ramp",
    note: "não recebe argumentos — o país, a moeda e o tipo de operação são escolhidos dentro do modal.",
    reactDesc:
      "Botão pronto que abre um modal pré-montado: todo o fluxo cotação → pagamento → liquidação já vem renderizado.",
    coreDesc:
      "Controle o on/off-ramp você mesmo: cote, crie o ramp e então faça polling até liquidar.",
    coreFnsTitle: "Funções utilizadas",
    coreFnsIntro:
      "Todas são métodos do cliente que getClient() retorna — a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "getRampsQuote(query)",
        tag: "async",
        params:
          "query: RampsQuoteQuery — { direction: 'onramp' | 'offramp', amount, fiatCurrency, country, … }.",
        returns:
          "Promise<RampsQuoteResponse>: as cotações disponíveis para a solicitação.",
      },
      {
        fn: "createOnRamp(body)",
        tag: "async",
        params: "body: RampsOnrampBody — uma cotação escolhida.",
        returns:
          "Promise<RampsOnrampResponse>: content.id e content.paymentInstructions.",
      },
      {
        fn: "createOffRamp(body)",
        tag: "async",
        params: "body: RampsOfframpBody — uma cotação escolhida.",
        returns:
          "Promise<RampsOfframpResponse>: os detalhes de pagamento do off-ramp.",
      },
      {
        fn: "pollRampTransaction(txId, opts?)",
        tag: "async",
        params:
          "txId: string (do ramp criado); opts?: opções de polling (intervalo, signal, …).",
        returns:
          "Promise<RampsTransactionResponse>: resolve quando o ramp atinge um estado terminal.",
      },
    ],
    reactFnsTitle: "Hook e valores utilizados",
    reactFnsIntro:
      "Todos vêm do hook usePollar() — a camada do react construída sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sem argumentos. Chame-o no nível superior de um componente: ele lê o contexto do React, então precisa rodar durante o render.",
        returns:
          "PollarContextValue: toda a superfície do SDK: valores de estado reativo, abridores de modais e getClient() para descer ao core.",
      },
      {
        fn: "openRampModal()",
        tag: "sync",
        params:
          "Sem argumentos: o país, a moeda e o tipo de operação são escolhidos dentro do modal.",
        returns: "void: abre o modal pré-montado; não há nada para aguardar.",
      },
    ],
  },

  swap: {
    title: "Swap",
    desc: "Troque um ativo por outro em venues on-chain (AMM da Aquarius, Soroswap, SDEX). A Pollar cota cada rota, ordena da melhor para a pior e renderiza todo o fluxo de cotação e troca dentro de um modal.",
    open: "Abrir modal de swap",
    note: "não recebe argumentos: os ativos, o valor e o venue são escolhidos dentro do modal.",
    venuesTitle: "Os venues são configurados no seu dashboard",
    venuesBody:
      "O modal de swap só oferece os venues que você habilitar em Treasury → Swap no dashboard da Pollar. O SDK lê essa seleção em tempo de execução via getSwapConfig() (a resposta SDK_SWAP_CONFIG), sem alterar código. Uma lista vazia oculta totalmente a UI de swap.",
    reactDesc:
      "Botão pronto que abre um modal pré-montado: todo o fluxo cotação → troca (trustline incluída) já vem renderizado.",
    coreDesc:
      "Controle a troca você mesmo: cote entre venues e depois execute a melhor rota.",
    coreFnsTitle: "Funções utilizadas",
    coreFnsIntro:
      "Todas são métodos do cliente retornado por getClient(): a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "getSwapConfig()",
        tag: "async",
        params:
          "Sem argumentos: lê a seleção do dashboard da app (Treasury → Swap), intersectada com a capacidade do servidor.",
        returns:
          "Promise<SwapVenue[]>: os venues habilitados (ex.: ['aquarius', 'sdex']); vazio significa que o swap está desabilitado, então oculte a UI.",
      },
      {
        fn: "getSwapQuote(params)",
        tag: "async",
        params:
          "params: SwapQuoteParams — { sellAsset, buyAsset, amount, provider?: 'auto' | 'aquarius' | 'soroswap' | 'sdex', slippageBps? }.",
        returns:
          "Promise<SwapQuote[]>: rotas ordenadas por output, a melhor primeiro; vazio quando não existe rota.",
      },
      {
        fn: "swap(quote, opts?)",
        tag: "async",
        params:
          "quote: SwapQuote (uma rota de getSwapQuote); opts?: { autoTrustline? } — adiciona primeiro a trustline do ativo a receber quando necessário.",
        returns:
          "Promise<SubmitOutcome>: roda o payload build da cotação pelo pipeline de tx (o minReceived on-chain aplica o slippage).",
      },
    ],
    reactFnsTitle: "Hook e valores utilizados",
    reactFnsIntro:
      "Todos vêm do hook usePollar(): a camada de react construída sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sem argumentos. Chame-o no nível superior de um componente: ele lê o contexto do React, então precisa rodar durante o render.",
        returns:
          "PollarContextValue: toda a superfície do SDK: valores de estado reativo, abridores de modais e getClient() para descer ao core.",
      },
      {
        fn: "getSwapConfig()",
        tag: "async",
        params:
          "Sem argumentos: resolve os venues que esta app expõe, a partir da sua seleção no dashboard (Treasury → Swap).",
        returns:
          "Promise<SwapVenue[]>: venues habilitados; vazio significa que o swap está desabilitado para esta app, então oculte a UI de swap.",
      },
      {
        fn: "openSwapModal()",
        tag: "sync",
        params:
          "Sem argumentos: os ativos, o valor e o venue são escolhidos dentro do modal.",
        returns: "void: abre o modal pré-montado; não há nada para aguardar.",
      },
    ],
  },

  earn: {
    title: "Earn",
    desc: "Coloque os saldos ociosos para trabalhar: deposite em vaults da DeFindex ou pools da Blend e gere rendimento on-chain. A Pollar lista cada provider habilitado com seu APY ao vivo e renderiza todo o fluxo de depósito e resgate dentro de um modal.",
    open: "Abrir modal de Earn",
    note: "não recebe argumentos: o provider, a oportunidade e o valor são escolhidos dentro do modal.",
    providersTitle: "Os providers são configurados no seu dashboard",
    providersBody:
      "O modal de Earn só oferece os providers que você habilitar em Treasury → Earn no dashboard da Pollar, intersectados com a capacidade do servidor: a Blend precisa de um endereço de pool e a DeFindex de uma API key. O SDK lê essa seleção em tempo de execução via getEarnProviders() (a resposta SDK_EARN_PROVIDERS). Uma lista vazia oculta totalmente a UI de Earn.",
    reactDesc:
      "Botão pronto que abre um modal pré-montado: todo o fluxo provider → oportunidade → depósito / resgate já vem renderizado.",
    coreDesc:
      "Controle o Earn você mesmo: liste oportunidades, leia a posição e depois deposite ou resgate.",
    coreFnsTitle: "Funções utilizadas",
    coreFnsIntro:
      "Todas são métodos do cliente retornado por getClient(): a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "getEarnProviders()",
        tag: "async",
        params:
          "Sem argumentos: lê a seleção do dashboard da app (Treasury → Earn), intersectada com a capacidade do servidor.",
        returns:
          "Promise<EarnProviderId[]>: os providers habilitados (ex.: ['blend', 'defindex']); vazio significa que o Earn está desabilitado, então oculte a UI.",
      },
      {
        fn: "getEarnOpportunities(provider)",
        tag: "async",
        params: "provider: EarnProviderId — 'blend' ou 'defindex'.",
        returns:
          "Promise<EarnOpportunity[]>: os vaults (DeFindex) / pools (Blend) nesta rede, cada um com id, kind, asset e APY ao vivo.",
      },
      {
        fn: "getEarnPosition(params)",
        tag: "async",
        params:
          "params: EarnPositionParams — { provider, opportunity } (o endereço é preenchido pelo cliente).",
        returns:
          "Promise<EarnPosition>: saldo, APY ao vivo, withdrawUnit ('asset' para Blend, 'shares' para DeFindex) e o máximo resgatável.",
      },
      {
        fn: "earnDeposit(params)",
        tag: "async",
        params:
          "params: EarnTxParams — { provider, opportunity, amount } (o valor é o ativo subjacente).",
        returns:
          "Promise<SubmitOutcome>: assina e envia o XDR construído pelo provider pelo pipeline de tx.",
      },
      {
        fn: "earnWithdraw(params)",
        tag: "async",
        params:
          "params: EarnTxParams — { provider, opportunity, amount } (o valor no withdrawUnit da posição).",
        returns:
          "Promise<SubmitOutcome>: assina e envia o XDR construído pelo provider pelo pipeline de tx.",
      },
    ],
    reactFnsTitle: "Hook e valores utilizados",
    reactFnsIntro:
      "Todos vêm do hook usePollar(): a camada de react construída sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sem argumentos. Chame-o no nível superior de um componente: ele lê o contexto do React, então precisa rodar durante o render.",
        returns:
          "PollarContextValue: toda a superfície do SDK: valores de estado reativo, abridores de modais e getClient() para descer ao core.",
      },
      {
        fn: "getEarnProviders()",
        tag: "async",
        params:
          "Sem argumentos: resolve os providers que esta app expõe, a partir da sua seleção no dashboard (Treasury → Earn).",
        returns:
          "Promise<EarnProviderId[]>: providers habilitados; vazio significa que o Earn está desabilitado para esta app, então oculte a UI de Earn.",
      },
      {
        fn: "openEarnModal()",
        tag: "sync",
        params:
          "Sem argumentos: o provider, a oportunidade e o valor são escolhidos dentro do modal.",
        returns: "void: abre o modal pré-montado; não há nada para aguardar.",
      },
    ],
  },

  kyc: {
    title: "KYC",
    desc: "Verifique a identidade do usuário. A Pollar renderiza todo o fluxo de seleção de provedor e verificação dentro de um modal.",
    countryLabel: "País (ISO 3166-1 alfa-2)",
    levelLabel: "Nível",
    currentStatus: "status atual",
    start: "Iniciar KYC",
    coreFnsTitle: "@pollar/core — funções utilizadas",
    coreFnsIntro:
      "Todas são métodos do cliente que getClient() retorna — a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "getKycProviders(country)",
        tag: "async",
        params: "country: string — um código ISO 3166-1 alfa-2 (ex. 'MX').",
        returns:
          "Promise<{ providers }>: os provedores de KYC disponíveis nesse país.",
      },
      {
        fn: "startKyc(body)",
        tag: "async",
        params:
          "body: KycStartBody — { providerId: string; level: 'basic' | 'intermediate' | 'enhanced' }.",
        returns:
          "Promise<KycStartResponse>: a sessão de verificação para entregar ao provedor.",
      },
      {
        fn: "pollKycStatus(providerId, opts?)",
        tag: "async",
        params:
          "providerId: string; opts?: { intervalMs?, timeoutMs? } controles de polling.",
        returns:
          "Promise: resolve quando o status chega a 'approved' | 'rejected' (a partir de 'none' | 'pending').",
      },
      {
        fn: "getKycStatus(providerId?)",
        tag: "async",
        params:
          "providerId?: string — omita para ler o status geral do usuário.",
        returns: "Promise<{ status, level?, providerId }>: uma leitura única.",
      },
    ],
    reactFnsTitle: "@pollar/react — hook e valores utilizados",
    reactFnsIntro:
      "Todos vêm do hook usePollar() — a camada do react construída sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sem argumentos. Chame-o no nível superior de um componente: ele lê o contexto do React, então precisa rodar durante o render.",
        returns:
          "PollarContextValue: toda a superfície do SDK: valores de estado reativo, abridores de modais e getClient() para descer ao core.",
      },
      {
        fn: "openKycModal(options?)",
        tag: "sync",
        params:
          "options?: { country?: string; level?: 'basic' | 'intermediate' | 'enhanced'; onApproved?: () => void } — envolve getKycProviders / startKyc / pollKycStatus.",
        returns: "void: abre o modal pré-montado; não há nada para aguardar.",
      },
      {
        fn: "<KycStatus status={…} />",
        tag: "component",
        params:
          "status: 'none' | 'pending' | 'approved' | 'rejected' — o badge a renderizar.",
        returns:
          "Um componente de badge de status pronto, exportado de @pollar/react.",
      },
    ],
  },

  balance: {
    title: "Saldo",
    desc: "Leia os saldos de uma conta Stellar: a da carteira conectada ou a de qualquer endereço pela chave pública.",
    reactDesc:
      "Botão pronto que abre um modal pré-montado com os saldos da carteira conectada, já renderizados.",
    coreDesc:
      "Busque os saldos você mesmo e renderize o response cru: a carteira conectada com refreshBalance(), ou qualquer endereço com getWalletBalance(pk).",
    open: "Abrir modal de saldo",
    modalNote:
      "não recebe argumentos — ele lê a carteira conectada e renderiza a tabela para você.",
    lookupLabel: "Consultar qualquer endereço",
    fetch: "Consultar",
    useMyWallet: "Usar minha carteira",
    coreNote:
      "a carteira conectada alimenta o estado reativo walletBalance; um endereço arbitrário retorna os dados diretamente.",
    idle: "Envie uma solicitação para carregar os saldos.",
    noBalances: "Nenhum saldo encontrado.",
    assetCol: "Ativo",
    balanceCol: "Saldo",
    availableCol: "Disponível",
    rawResponse: "Response cru",
    coreFnsTitle: "Funções utilizadas",
    coreFnsIntro:
      "Todas são métodos do cliente que getClient() retorna — a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "refreshBalance()",
        tag: "async",
        params:
          "Sem argumentos — a carteira e a rede são resolvidas no servidor a partir da sessão.",
        returns:
          "Promise<void>: grava os saldos da carteira conectada no estado reativo; leia-o com getWalletBalanceState().",
      },
      {
        fn: "getWalletBalance(publicKey, network?)",
        tag: "async",
        params:
          "publicKey: string (um endereço G…); network?: 'testnet' | 'mainnet', padrão é a rede atual do cliente.",
        returns:
          "Promise<WalletBalanceContent>: retorna os saldos diretamente (sem estado reativo); use-o para qualquer endereço arbitrário.",
      },
      {
        fn: "getWalletBalanceState()",
        tag: "sync",
        params: "Sem argumentos.",
        returns:
          "WalletBalanceState: uma união discriminada por step ('idle' | 'loading' | 'loaded' | 'error'). data.balances só existe quando step === 'loaded'.",
      },
      {
        fn: "onWalletBalanceStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: WalletBalanceState) => void — invocado a cada transição de estado.",
        returns:
          "() => void: uma função para cancelar a inscrição. O walletBalance do hook do react é construído sobre isto.",
      },
    ],
    reactFnsTitle: "Hook e valores utilizados",
    reactFnsIntro:
      "Todos vêm do hook usePollar() — a camada do react construída sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sem argumentos. Chame-o no nível superior de um componente: ele lê o contexto do React, então precisa rodar durante o render.",
        returns:
          "PollarContextValue: toda a superfície do SDK: valores de estado reativo, abridores de modais e getClient() para descer ao core.",
      },
      {
        fn: "openWalletBalanceModal()",
        tag: "sync",
        params:
          "Sem argumentos: lê a carteira conectada e renderiza a tabela de saldos dentro do modal.",
        returns: "void: abre o modal pré-montado; não há nada para aguardar.",
      },
      {
        fn: "walletBalance",
        tag: "reactive value",
        params:
          "Não é uma função: é um valor do tipo WalletBalanceState lido de usePollar().",
        returns:
          "Re-renderiza seu componente sempre que muda. Reflete getClient().getWalletBalanceState(): step e data quando carregado.",
      },
    ],
  },

  assets: {
    title: "Ativos habilitados",
    desc: "Os ativos habilitados no painel do app junto com o estado on-chain de trustline da carteira conectada — para saber quais trustlines a carteira ainda precisa adicionar. O XLM nativo está sempre presente.",
    reactDesc:
      "Botão pronto para usar que abre um modal pré-montado listando cada ativo habilitado e se a carteira conectada tem trustline para ele.",
    coreDesc:
      "Busque os ativos habilitados com refreshAssets() e renderize o estado reativo enabledAssets — sem saldos, apenas o estado de trustline.",
    open: "Abrir modal de Ativos",
    modalNote:
      "não recebe argumentos: lê a sessão da carteira conectada e renderiza a tabela de trustlines para você.",
    refresh: "Atualizar ativos",
    coreNote:
      "a carteira e a rede são resolvidas no servidor a partir da sessão; o resultado alimenta o estado reativo enabledAssets.",
    idle: "Atualize para carregar os ativos habilitados do app.",
    noAssets: "Nenhum ativo habilitado encontrado.",
    assetCol: "Ativo",
    typeCol: "Tipo",
    trustlineCol: "Trustline",
    established: "Estabelecida",
    missing: "Faltando",
    rawResponse: "Resposta crua",
    coreFnsTitle: "Funções usadas",
    coreFnsIntro:
      "Todas são métodos do cliente retornado por getClient() — a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "refreshAssets()",
        tag: "async",
        params:
          "Sem argumentos: a carteira e a rede são resolvidas no servidor a partir da sessão.",
        returns:
          "Promise<void>: grava os ativos habilitados e o estado de trustline no estado reativo; leia com getEnabledAssetsState().",
      },
      {
        fn: "getEnabledAssetsState()",
        tag: "sync",
        params: "Sem argumentos.",
        returns:
          "EnabledAssetsState: uma união discriminada por step: 'idle' | 'loading' | 'loaded' | 'error'. data.assets existe apenas quando step === 'loaded'.",
      },
      {
        fn: "onEnabledAssetsStateChange(cb)",
        tag: "sync",
        params:
          "cb: (state: EnabledAssetsState) => void: invocado a cada transição de estado.",
        returns:
          "() => void: uma função para cancelar a inscrição. O enabledAssets do hook do react é construído sobre isso.",
      },
    ],
    reactFnsTitle: "Hook e valores usados",
    reactFnsIntro:
      "Tudo isso vem do hook usePollar() — a camada do react construída sobre getClient().",
    reactFns: [
      {
        fn: "openEnabledAssetsModal()",
        tag: "sync",
        params:
          "Sem argumentos: lê a carteira conectada e renderiza a tabela de ativos habilitados / trustlines dentro do modal.",
        returns: "void: abre o modal pré-montado; não há nada para aguardar.",
      },
      {
        fn: "refreshAssets()",
        tag: "async",
        params:
          "Sem argumentos: a mesma chamada do método do core, reexportada no hook por conveniência.",
        returns:
          "Promise<void>: atualiza o valor reativo enabledAssets abaixo.",
      },
      {
        fn: "enabledAssets",
        tag: "reactive value",
        params:
          "Não é uma função: é um valor do tipo EnabledAssetsState lido de usePollar().",
        returns:
          "Re-renderiza seu componente sempre que muda. Reflete getClient().getEnabledAssetsState(): step e data quando carregado.",
      },
    ],
    trust: {
      title: "Habilitar / desabilitar uma trustline",
      desc: 'Uma trustline é uma operação change_trust. Habilitar adiciona o ativo (com um limite opcional); desabilitar envia limit "0", que a remove — e só funciona quando o saldo do ativo já é zero. O XLM nativo nunca precisa de trustline.',
      typeLabel: "Tipo de ativo",
      codeLabel: "Código do ativo",
      codePh: "USDC",
      issuerLabel: "Emissor",
      issuerPh: "G… (conta emissora)",
      limitLabel: "Limite",
      limitNote:
        'Valor máximo que você confiará. Deixe vazio para o máximo; Desabilitar força "0".',
      limitPh: "1000000",
      enable: "Habilitar trustline",
      disable: "Desabilitar trustline",
      running: "Enviando…",
      stateIdle: "Defina o ativo e então habilite ou desabilite sua trustline.",
      removedNote:
        "Após uma desabilitação bem-sucedida, a resposta de saldo reporta trustlineRemoved: true.",
      fnsTitle: "Funções de change_trust",
      fnsIntro:
        "runTx é o caminho de uma única chamada; o demo então re-renderiza a tabela com refreshAssets(). Ambas vêm de usePollar() (ou do PollarClient subjacente via getClient()).",
      fns: [
        {
          fn: "runTx(operation, params, options?)",
          tag: "async",
          params:
            "operation: 'change_trust'; params.asset: { type, code, issuer }; params.limit?: string ('0' remove a trustline, omitido = máximo).",
          returns:
            "Promise<SubmitOutcome>: build → assina → envia em uma única chamada; status: 'success' | 'pending' | 'error'. Alimenta o estado reativo tx.",
        },
        {
          fn: "buildTx(operation, params, options?)",
          tag: "async",
          params:
            "Os mesmos argumentos do runTx: use-o quando quiser inspecionar o XDR não assinado antes de assinar.",
          returns:
            "Promise<BuildOutcome>: retorna a tx construída sem enviá-la; combine com signAndSubmitTx().",
        },
        {
          fn: "refreshAssets()",
          tag: "async",
          params: "Sem argumentos.",
          returns:
            "Promise<void>: busca novamente a tabela de ativos habilitados para que trustlineEstablished reflita o change_trust que você acabou de enviar.",
        },
      ],
    },
  },

  escrow: {
    title: "Escrow",
    desc: "Adaptador da Trustless Work — o SDK assina e envia o XDR não assinado com a carteira conectada, então seu código só lida com os parâmetros de negócio.",
    tabs: {
      deploy: "Implantar",
      fund: "Financiar",
      milestone: "Marco",
      dispute: "Disputa",
    },
    engagementId: "ID de engagement",
    titleField: "Título",
    description: "Descrição",
    approver: "Aprovador",
    approverNote: "Por padrão, o endereço da sua carteira.",
    serviceProvider: "Prestador do serviço",
    platformAddress: "Endereço da plataforma",
    amountUsdc: "Valor (USDC)",
    platformFee: "Taxa da plataforma %",
    contractId: "ID do contrato",
    contractIdNote:
      "O endereço do contrato de escrow retornado após a implantação.",
    milestoneIndex: "Índice do marco",
    approverFunds: "Fundos do aprovador",
    serviceProviderFunds: "Fundos do prestador",
    signing: "Assinando…",
    approveMilestone: "Aprovar marco",
    releaseFunds: "Liberar fundos",
    initiateDispute: "Iniciar disputa",
    resolveDispute: "Resolver disputa",
    deployEscrow: "Implantar escrow",
    fundEscrow: "Financiar escrow",
    setupSummary: "configuração única do adaptador",
    txIdle: "Execute uma operação para ver o progresso da assinatura.",
    coreFnsTitle: "@pollar/core — funções utilizadas",
    coreFnsIntro:
      "Todas são métodos do cliente que getClient() retorna — a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "signAndSubmitTx(unsignedXdr?)",
        tag: "async",
        params:
          "unsignedXdr?: string — o XDR não assinado que o adaptador de escrow retorna da Trustless Work. Omita em fluxos custodiais.",
        returns:
          "Promise<SubmitOutcome>: assina o XDR com a carteira conectada e o transmite; { status, hash, … }.",
      },
      {
        fn: "getTransactionState()",
        tag: "sync",
        params: "Sem argumentos.",
        returns:
          "TransactionState: o progresso do auto-assinar-e-enviar; null antes de executar qualquer tx.",
      },
    ],
    reactFnsTitle: "@pollar/react — hook e valores utilizados",
    reactFnsIntro:
      "Todos vêm do hook usePollar() (mais a fábrica do adaptador) — a camada do react construída sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sem argumentos. Chame-o no nível superior de um componente: ele lê o contexto do React, então precisa rodar durante o render.",
        returns:
          "PollarContextValue: toda a superfície do SDK: valores de estado reativo, abridores de modais e getClient() para descer ao core.",
      },
      {
        fn: "createPollarAdapterHook(key)",
        tag: "factory",
        params:
          "key: string — o slot do adaptador registrado no provider (ex. 'escrow'). Chame-o uma vez no nível de módulo.",
        returns:
          "Um hook tipado (ex. useEscrow) cujos métodos retornam cada um Promise<SubmitOutcome>: adaptador → XDR não assinado → auto assinar + enviar.",
      },
      {
        fn: "openTxModal()",
        tag: "sync",
        params: "Sem argumentos.",
        returns:
          "void: abre o modal de revisão/assinatura para a tx de escrow em andamento.",
      },
      {
        fn: "tx",
        tag: "reactive value",
        params:
          "Não é uma função: é um valor do tipo TransactionState lido de usePollar().",
        returns:
          "Re-renderiza ao longo do fluxo auto assinar-e-enviar (building → signing → submitting → success).",
      },
    ],
  },

  transactions: {
    ops: {
      create_account: "Criar conta",
      payment: "Pagamento",
      path_payment_strict_send: "Path Payment (envio estrito)",
      change_trust: "Alterar trustline",
      invoke_contract: "[Contrato inteligente] Invocar função do contrato",
    },
    operationType: "Tipo de operação",
    destination: "Destino",
    startingBalance: "Saldo inicial",
    startingBalanceNote: "Quantidade de XLM para financiar a nova conta.",
    asset: "Ativo",
    amount: "Valor",
    sendingAsset: "Ativo de envio",
    sendingAssetNote: "Ativo debitado da conta do remetente.",
    sendAmount: "Valor a enviar",
    destAsset: "Ativo de destino",
    destAssetNote: "Ativo recebido pela conta de destino.",
    destMin: "Valor mínimo de destino",
    destMinNote: "Valor mínimo que o destino deve receber.",
    intermediatePath: "Rota intermediária",
    intermediatePathNote:
      "Ativos pelos quais rotear. Deixe vazio para uma rota direta.",
    pathAsset: (i: number) => `Ativo da rota ${i}`,
    addAsset: "+ Adicionar ativo",
    assetType: "Tipo de ativo",
    xlmNative: "XLM (nativo)",
    alphanum4: "Alfanumérico 4",
    alphanum12: "Alfanumérico 12",
    alphanum412: "Alfanumérico 4 / 12",
    poolShares: "Cotas de pool de liquidez",
    assetCodePh: (max: number) => `Código do ativo (máx. ${max} caracteres)`,
    issuerPh: "ID da conta emissora (G...)",
    trustLimit: "Limite de confiança",
    trustLimitNote:
      "Deixe vazio para o máximo int64. Use 0 para remover a trustline.",
    trustLimitPh: "Deixe vazio para o máximo",
    contractId: "ID do contrato",
    fetchMethods: "Buscar métodos",
    fetching: "Buscando…",
    fetchFailed: "Falha ao buscar os métodos",
    selectMethod: "Selecione um método",
    options: "Opções",
    timeout: "Tempo limite",
    timeoutNote: "Tempo limite da transação em segundos.",
    maxFee: "Taxa máxima em stroops",
    maxFeeNote: "Taxa máxima em stroops (1 XLM = 10.000.000 de stroops).",
    memo: "Memo",
    memoPhId: "ID numérico",
    memoPhText: "Memo de texto",
    building: "Construindo…",
    invalidParams: "Parâmetros inválidos",
    tipPre: "Dica: ",
    tipPost: " abre um modal integrado que cuida da etapa 2 para você.",
    buildStep: "construir transação",
    submitStep: "enviar transação assinada",
    stateLabel: "estado da transação",
    stateIdle: "Envie uma transação para ver o estado dela aqui.",
    coreFnsTitle: "@pollar/core — funções utilizadas",
    coreFnsIntro:
      "Todas são métodos do cliente que getClient() retorna — a instância subjacente de PollarClient.",
    coreFns: [
      {
        fn: "buildTx(operation, params, options?)",
        tag: "async",
        params:
          "operation: TxBuildBody['operation'] (ex. 'payment'); params: o corpo da operação; options?: flags de build opcionais (timeout, maxFee, memo).",
        returns:
          "Promise<BuildOutcome>: constrói a transação e retorna o XDR não assinado (ou uma tx custodial já montada) sem enviá-la.",
      },
      {
        fn: "signAndSubmitTx(unsignedXdr?)",
        tag: "async",
        params:
          "unsignedXdr?: string — o XDR de buildTx. Omita em fluxos custodiais, onde o SDK envia a tx montada por você.",
        returns:
          "Promise<SubmitOutcome>: { status: 'success' | 'pending' | 'error', hash, … }.",
      },
      {
        fn: "runTx(operation, params, options?)",
        tag: "async",
        params: "Mesmos argumentos que buildTx.",
        returns:
          "Promise<SubmitOutcome>: em um passo só build → sign → submit. Use quando não precisa do XDR não assinado no meio.",
      },
      {
        fn: "getTransactionState()",
        tag: "sync",
        params: "Sem argumentos.",
        returns:
          "TransactionState: o progresso atual de build/sign/submit; null antes de executar qualquer tx.",
      },
    ],
    reactFnsTitle: "@pollar/react — hook e valores utilizados",
    reactFnsIntro:
      "Todos vêm do hook usePollar() — a camada do react construída sobre getClient().",
    reactFns: [
      {
        fn: "usePollar()",
        tag: "hook",
        params:
          "Sem argumentos. Chame-o no nível superior de um componente: ele lê o contexto do React, então precisa rodar durante o render.",
        returns:
          "PollarContextValue: toda a superfície do SDK: valores de estado reativo, abridores de modais e getClient() para descer ao core.",
      },
      {
        fn: "buildTx(operation, params, options?)",
        tag: "async",
        params: "Igual a client.buildTx — operation, params, options?.",
        returns:
          "Promise<BuildOutcome>: constrói a tx e alimenta o estado reativo tx; o XDR não assinado fica em tx.buildData.",
      },
      {
        fn: "signAndSubmitTx(unsignedXdr?)",
        tag: "async",
        params:
          "unsignedXdr?: string — do buildTx anterior; omita em fluxos custodiais.",
        returns: "Promise<SubmitOutcome>: assina a tx montada e a transmite.",
      },
      {
        fn: "openTxModal()",
        tag: "sync",
        params: "Sem argumentos.",
        returns:
          "void: abre um modal integrado que assina e envia a tx montada por você.",
      },
      {
        fn: "tx",
        tag: "reactive value",
        params:
          "Não é uma função: é um valor do tipo TransactionState lido de usePollar().",
        returns:
          "Re-renderiza seu componente através de building → signing → submitting → success. Reflete getClient().getTransactionState().",
      },
    ],
  },

  activateWallet: {
    title: "Ativar carteira verificada por KYC",
    subtitle:
      "Simula a etapa de ativação no servidor depois que um usuário passa pelo KYC.",
    step1: "PASSO 1",
    step2: "PASSO 2",
    step1Title: "Insira sua chave de API secreta",
    warnStrong: "Apenas para a demo.",
    warnMid: " Em uma integração real, você ",
    warnNever: "nunca",
    warnEnd:
      " deve manusear chaves secretas no frontend. Esta chamada deve ser feita exclusivamente a partir do seu servidor backend.",
    edit: "editar",
    confirm: "confirmar",
    keySet: "✓ chave definida — não é persistida, será apagada ao recarregar",
    step2Title: "Ativar carteira",
    step2Desc:
      "Forneça a chave pública de uma carteira que já passou pelo KYC. O servidor a financiará com XLM na Stellar para que ela fique ativa.",
    publicKeyLabel: "Chave pública (G...)",
    activating: "Ativando…",
    activate: "Ativar carteira",
    activated: "✓ Carteira ativada",
    amountFunded: "valor financiado:",
    unexpectedError: "Ocorreu um erro inesperado.",
    endpointRef: "referência do endpoint",
    back: "← voltar para a demo principal",
    errors: {
      API_KEY_NOT_FOUND: "Chave secreta não encontrada ou inválida.",
      API_KEY_TYPE_NOT_ALLOWED:
        "Esta chave é uma chave publicável. Você deve usar uma chave secreta (sec_...).",
      WALLET_NOT_FOUND: "Carteira não encontrada no banco de dados.",
      FORBIDDEN: "Esta carteira não pertence ao seu aplicativo.",
      WALLET_ALREADY_FUNDED: "Esta carteira já está ativa na Stellar.",
      ACTIVATION_DISABLED:
        "A ativação de carteiras está desativada nesta demo; será movida para o SDK da Pollar quando o KYC estiver pronto.",
      APP_WALLET_NOT_FOUND:
        "Seu aplicativo não tem uma carteira de financiamento configurada.",
      FUND_XLM_FAILED: "Falha ao enviar XLM para a carteira. Tente novamente.",
    },
  },

  lumenwipe: {
    title: "LumenWipe",
    intro:
      "Planeje e construa as transações que encerram uma conta Stellar e transferem o XLM restante para um destino. A API retorna um plano ordenado e o XDR não assinado de cada passo — você assina localmente e envia.",
    creditPre: "Esta aba é uma demo ao vivo da API pública do ",
    creditApi: "LumenWipe",
    creditMid: ". Todo o crédito à equipe do LumenWipe — veja ",
    creditPost: " para o serviço original e a documentação.",

    network: "Rede",
    account: "Conta a encerrar",
    accountNote: "Conta de origem (G…). Ela deve existir na rede selecionada.",
    destination: "Destino",
    destinationNote:
      "Para onde vai o XLM — uma carteira ou endereço de exchange (G…).",
    memo: "Memo",
    memoNote: "Exigido por exchanges que requerem memo.",
    memoType: "Tipo de memo",
    getPlan: "Obter plano",
    gettingPlan: "Obtendo plano…",

    planTitle: "Plano",
    executable: "Executável",
    notExecutable: "Não executável",
    mediatorRequired: "Requer mediador",
    requiresMemo: "Requer memo",
    blockers: "Bloqueios",
    steps: "Passos",
    noSteps: "Sem passos — a conta já está encerrada.",
    buildXdr: "Construir XDR",
    building: "Construindo…",
    unsignedXdr: "XDR não assinado",
    copy: "Copiar",
    copied: "Copiado",
    fee: "taxa",
    ops: "ops",
    cosignNote: "Requer a coassinatura do mediador (merge para exchange).",
    fallbackNote:
      "Sem rota na DEX — o ativo é enviado de volta ao emissor em vez de trocado por XLM.",
    useMyWallet: "Usar minha carteira",
    myWallet: "Minha carteira",
    swap: "Trocar conta ↔ destino",
    signWithPollar: "Assinar e enviar com Pollar",
    signing: "Assinando…",
    submitted: "Enviado:",
    ownAccountHint:
      "Esta é a sua carteira conectada — assine cada passo com Pollar.",
    networkMismatch:
      "Sua carteira está em outra rede — ajuste o seletor para coincidir e poder assinar.",
    cosignManual:
      "Requer coassinatura do mediador — assine e envie este passo manualmente.",
    signNeedsPollarWallet:
      "Esta ação não é permitida — para assinar, a conta a fechar deve ser a carteira com a qual você entrou na Pollar.",

    safetyTitle: "Somente leitura e não custodial",
    safety1:
      "A API é somente leitura. Nunca envie uma chave secreta (S…) — apenas chaves públicas (G…).",
    safety2:
      "As respostas contêm envelopes de transação não assinados. Decodifique e verifique cada XDR antes de assiná-lo no seu próprio ambiente.",

    loopTitle: "O ciclo de encerramento",
    refTitle: "Tipos de passo",

    requestFailed:
      "A requisição falhou. Verifique a conta, o destino e a rede.",
    emptyFields: "Informe uma conta e um destino.",
  },

  twAbout: {
    eyebrow: "Trustless Work",
    title: "Escrows por marcos na Stellar",
    tagline: "Escrows para stablecoins, sem complicação.",
    body: [
      "A Trustless Work oferece infraestrutura de escrow não custodial e baseada em marcos, construída sobre a blockchain Stellar. Os fundos são bloqueados on-chain e liberados apenas quando condições predefinidas são cumpridas, eliminando o risco de contraparte nas transações com stablecoins.",
      "Em vez de escrever contratos inteligentes do zero, os desenvolvedores integram escrow por meio das APIs, SDKs e modelos open source da Trustless Work, viabilizando marketplaces, crowdfunding, freelancing e financiamento comercial sem um intermediário custodiante.",
      "Nesta demo, a aba Escrow usa o adaptador da Trustless Work do SDK da Pollar: você implanta, financia, aprova marcos e resolve disputas, e o SDK assina e envia o XDR não assinado com a sua carteira conectada automaticamente.",
    ],
    featuresTitle: "O que oferece",
    features: [
      {
        title: "Escrow não custodial",
        desc: "Os fundos são bloqueados on-chain e liberados por regras, nunca retidos por terceiros.",
      },
      {
        title: "Liberação por marcos",
        desc: "Divida um acordo em marcos e libere os fundos conforme cada um é aprovado.",
      },
      {
        title: "APIs, SDKs e modelos",
        desc: "Escrow pronto para uso sem escrever ou auditar contratos inteligentes.",
      },
      {
        title: "Feito para stablecoins",
        desc: "Projetado em torno de pagamentos com stablecoins na Stellar.",
      },
    ],
    resourcesTitle: "Recursos oficiais",
    websiteLabel: "Site",
    dappLabel: "Abrir o dApp",
    disclaimer:
      "Resumo baseado nas páginas oficiais da Trustless Work. A Pollar não é afiliada à Trustless Work; todo o crédito é da equipe deles.",
  },

  lwAbout: {
    eyebrow: "LumenWipe",
    title: "Encerre uma conta Stellar de forma limpa",
    tagline: "Recupere o XLM bloqueado nas reservas da conta.",
    body: [
      "Toda conta Stellar bloqueia uma reserva mínima — 1 XLM mais 0,5 XLM por subentrada (trustlines, ofertas, entradas de dados, signatários). O LumenWipe recupera essas reservas conduzindo a conta por um encerramento completo e auditável.",
      "Ele desfaz sistematicamente cada ônus — cancelando ofertas, saindo de posições DeFi na Soroban, removendo trustlines e entradas de dados —, converte os saldos restantes em XLM e então funde a conta em uma carteira de destino.",
      "O LumenWipe é não custodial: cada transação é assinada no seu navegador e as chaves nunca saem dele. A API é somente leitura e retorna XDRs não assinados, então você decodifica e verifica cada passo antes de assinar.",
      "Nesta demo, a aba LumenWipe chama a API pública do LumenWipe para planejar e construir o encerramento, e permite assinar cada passo com a sua carteira Pollar conectada.",
    ],
    featuresTitle: "O que faz",
    features: [
      {
        title: "Recupera reservas bloqueadas",
        desc: "Libera o XLM retido pela reserva mínima de uma conta.",
      },
      {
        title: "Ciclo de encerramento completo",
        desc: "Ofertas, trustlines, dados, signatários e posições DeFi, em ordem.",
      },
      {
        title: "Compatível com Soroban e DeFi",
        desc: "Sai das posições DeFi da Soroban compatíveis antes de encerrar.",
      },
      {
        title: "Não custodial e retomável",
        desc: "Assina no navegador; as sessões podem ser pausadas e retomadas.",
      },
    ],
    resourcesTitle: "Recursos oficiais",
    websiteLabel: "Site",
    docsLabel: "Documentação",
    disclaimer:
      "Resumo baseado no site e na documentação oficiais do LumenWipe. Todo o crédito é da equipe do LumenWipe.",
  },

  niriumAbout: {
    eyebrow: "Nirium",
    title: "Tesouraria e pagamentos para agentes na Stellar",
    tagline: "A Nirium monta as transações; você assina com sua carteira.",
    body: [
      "A Nirium é uma camada de tesouraria e pagamentos não custodial para a Stellar. Ela planeja e monta as transações — retornando XDR não assinado — enquanto a assinatura permanece inteiramente na carteira conectada. A Nirium pensa; você assina.",
      "É distribuída como um pacote npm (npm i nirium) que expõe um Agent que você pode usar a partir do navegador. A primeira integração é x402 (pagamentos programáticos), seguida de um audit trail, com tesouraria/CETES (rendimento via Etherfuse) como produto principal assim que chegar à mainnet.",
      "Nesta demo, a Nirium se conecta ao Pollar exatamente como os adaptadores DeFindex ou Blend: o adaptador roda no lado do cliente apenas com informações públicas, chama a Nirium para obter o XDR não assinado, e o SDK do Pollar o assina e envia com a sua carteira conectada. Nenhuma chave secreta toca o frontend — a sua assinatura é a autorização.",
    ],
    featuresTitle: "O que oferece",
    features: [
      {
        title: "Não custodial por design",
        desc: "A Nirium constrói XDR não assinado; a carteira Pollar conectada assina. Sem chaves secretas no frontend.",
      },
      {
        title: "Pagamentos x402",
        desc: "Pagamentos programáticos somente por software: a primeira integração, sem necessidade de API key.",
      },
      {
        title: "Audit trail",
        desc: "Um registro de atividade verificável e não custodial para conformidade e confiança.",
      },
      {
        title: "Tesouraria e CETES",
        desc: "Tesouraria com rendimento via Etherfuse: o produto principal, rumo à mainnet após a auditoria.",
      },
    ],
    resourcesTitle: "Recursos oficiais",
    websiteLabel: "Desenvolvedores",
    repoLabel: "SDK (GitHub)",
    disclaimer:
      "Resumo baseado nos materiais compartilhados pela equipe da Nirium. A Pollar não é afiliada à Nirium — todo o crédito é da equipe deles.",
  },

  rampAbout: {
    eyebrow: "Integração",
    title: "On/off-ramp com métodos de pagamento locais",
    tagline:
      "Compre e venda cripto via anchors regionais — um modal, um fluxo.",
    body: [
      "O Ramp conecta seus usuários ao fiat: eles compram cripto com um método de pagamento local (SPEI, PIX, PSE, ACH) ou fazem o cash-out no sentido inverso. A Pollar cota o anchor, cria o on/off-ramp e mostra as instruções de pagamento dentro de um único modal.",
      "Quais anchors e trilhos estão disponíveis é decidido no seu dashboard — o SDK lê essa seleção em tempo de execução a partir da config da app, então habilitar um novo anchor é um toggle no dashboard, não um redeploy. Se nada estiver habilitado, a UI de ramp fica oculta.",
      "Por baixo, o fluxo é cotar → criar ramp → fazer polling até liquidar, tudo com @pollar/core. Veja a aba Implementação para o demo ao vivo e as chamadas exatas.",
    ],
    featuresTitle: "Anchors e status",
    features: [
      {
        title: "Anclap — ativo",
        desc: "On/off-ramp de moeda local sobre trilhos regionais (SPEI, PIX, PSE…), liquidado na Stellar.",
      },
      {
        title: "Mais anchors — em andamento",
        desc: "Mais anchors e trilhos de pagamento regionais estão sendo integrados; habilite-os pelo dashboard conforme forem lançados.",
      },
      {
        title: "Configurado no seu dashboard",
        desc: "Ative anchors em Treasury — o SDK lê sua seleção em tempo de execução, sem alterar código.",
      },
      {
        title: "Um modal, core ou React",
        desc: "openRampModal() renderiza todo o fluxo cotação → pagamento → liquidação; ou controle você mesmo com @pollar/core.",
      },
    ],
    resourcesTitle: "Recursos",
    anclapLabel: "Anclap",
    docsLabel: "Anchors e SEPs da Stellar",
    disclaimer:
      "A disponibilidade de anchors depende da sua configuração no dashboard e da cobertura de cada anchor. A Anclap é um terceiro — todo o crédito é da equipe deles.",
  },

  swapAbout: {
    eyebrow: "Integração",
    title: "Swap entre venues on-chain",
    tagline: "Um modal, o melhor preço entre cada venue que você habilitar.",
    body: [
      "O Swap permite que seus usuários troquem um ativo por outro on-chain. A Pollar cota cada venue habilitado, ordena as rotas da melhor para a pior e renderiza todo o fluxo cotação → troca — trustline incluída — dentro de um único modal.",
      "Os venues disponíveis são decididos no seu dashboard (Treasury → Swap). O SDK lê essa seleção em tempo de execução via getSwapConfig() (a resposta SDK_SWAP_CONFIG), então ligar ou desligar um venue é um toggle no dashboard. Uma lista vazia oculta totalmente a UI de swap.",
      "Por baixo, o fluxo é getSwapQuote → swap, tudo com @pollar/core. Veja a aba Implementação para o demo ao vivo e as chamadas exatas.",
    ],
    featuresTitle: "Venues e status",
    features: [
      {
        title: "Aquarius — ativo",
        desc: "AMM da Soroban (pools de liquidez). Funciona para carteiras clássicas e smart.",
      },
      {
        title: "Stellar DEX — ativo",
        desc: "O order book nativo da Stellar via path payments. Somente carteiras clássicas.",
      },
      {
        title: "Soroswap — em andamento",
        desc: "Agregador de DEX sobre protocolos da Soroban. Precisa de uma API key de Soroswap da plataforma; é ignorado até configurá-la.",
      },
      {
        title: "Configurado no seu dashboard",
        desc: "Habilite venues em Treasury → Swap; o SDK lê getSwapConfig() em tempo de execução, sem alterar código.",
      },
    ],
    resourcesTitle: "Recursos",
    aquariusLabel: "Aquarius",
    soroswapLabel: "Soroswap",
    disclaimer:
      "A disponibilidade de venues depende da sua configuração no dashboard e da capacidade da plataforma. Aquarius e Soroswap são terceiros — todo o crédito é das equipes deles.",
  },

  earnAbout: {
    eyebrow: "Integração",
    title: "Gere rendimento on-chain",
    tagline:
      "Um modal, rendimento real entre cada provider que você habilitar.",
    body: [
      "O Earn permite que seus usuários coloquem os saldos ociosos para trabalhar: depositar em um vault da DeFindex ou um pool da Blend e gerar rendimento on-chain. A Pollar lista cada provider habilitado com seu APY ao vivo e renderiza todo o fluxo depósito → resgate dentro de um único modal.",
      "Os providers disponíveis são decididos no seu dashboard (Treasury → Earn) e intersectados com a capacidade do servidor: a Blend precisa de um endereço de pool e a DeFindex de uma API key. O SDK lê essa seleção em tempo de execução via getEarnProviders() (a resposta SDK_EARN_PROVIDERS), então ligar ou desligar um provider é um toggle no dashboard. Uma lista vazia oculta totalmente a UI de Earn.",
      "Por baixo, o fluxo é getEarnOpportunities → getEarnPosition → earnDeposit / earnWithdraw, tudo com @pollar/core. Veja a aba Implementação para o demo ao vivo e as chamadas exatas.",
    ],
    featuresTitle: "Providers e status",
    features: [
      {
        title: "DeFindex — ativo",
        desc: "Vaults de rendimento automatizado. Deposite um ativo e receba shares; os resgates são em shares. Montado via a API da DeFindex.",
      },
      {
        title: "Blend — ativo",
        desc: "Pools de lending. Deposite e resgate no ativo subjacente; o XDR é montado contract-direct.",
      },
      {
        title: "Configurado no seu dashboard",
        desc: "Habilite providers em Treasury → Earn; o SDK lê getEarnProviders() em tempo de execução, sem alterar código.",
      },
      {
        title: "Um modal, core ou React",
        desc: "openEarnModal() renderiza todo o fluxo oportunidade → depósito / resgate; ou controle você mesmo com @pollar/core.",
      },
    ],
    resourcesTitle: "Recursos",
    defindexLabel: "DeFindex",
    blendLabel: "Blend",
    disclaimer:
      "A disponibilidade de providers depende da sua configuração no dashboard e da capacidade da plataforma. DeFindex e Blend são terceiros — todo o crédito é das equipes deles.",
  },

  niriumX402: {
    title: "Pagamentos x402",
    desc: "Envie um pagamento x402 programático. A Nirium planeja e monta a transação; o SDK do Pollar assina e envia o XDR não assinado com a sua carteira conectada — sem secret key, sem API key.",
    destination: "Destino",
    destinationNote: "Endereço Stellar do destinatário (G…) na testnet.",
    asset: "Ativo",
    assetNote: "'XLM' para o nativo, ou 'CODE:ISSUER' para um ativo emitido.",
    amount: "Valor",
    reference: "Referência",
    referenceNote:
      "Id de recurso / fatura x402 opcional — salvo como memo da tx (máx. 28 caracteres).",
    pay: "Pagar com Pollar",
    signing: "Assinando…",
    setupSummary: "Setup: registre o adaptador da Nirium uma vez",
    txIdle: "Preencha destino, valor e ativo, depois pague.",
    coreFnsTitle: "@pollar/core — funções utilizadas",
    coreFnsIntro:
      "O adaptador retorna um XDR não assinado; o cliente core o assina e envia.",
    coreFns: [
      {
        fn: "niriumAdapter.pay(params)",
        tag: "async",
        params:
          "params: { to, amount, asset, reference?, signer }. A Nirium planeja o pagamento.",
        returns:
          "Promise<{ unsignedTransaction: string }> — o XDR não assinado, pronto para assinar.",
      },
      {
        fn: "client.signAndSubmitTx(xdr)",
        tag: "async",
        params:
          "xdr: string — a transação não assinada retornada pelo adaptador.",
        returns:
          "Promise<SubmitOutcome> — { status, hash, … }. Assina com a carteira conectada e então envia.",
      },
    ],
    reactFnsTitle: "@pollar/react — hook e valores utilizados",
    reactFnsIntro:
      "createPollarAdapterHook conecta o adaptador para o Pollar assinar sozinho; usePollar expõe o estado da tx ao vivo.",
    reactFns: [
      {
        fn: "useNiriumX402()",
        tag: "hook",
        params:
          "Sem argumentos. Retorna o adaptador encapsulado — chamar pay() constrói, assina e envia em um passo.",
        returns:
          "WrappedAdapter — { pay }. O XDR não assinado é assinado e enviado automaticamente.",
      },
      {
        fn: "usePollar().tx",
        tag: "reactive value",
        params: "Sem argumentos — leia durante o render.",
        returns:
          "TransactionState — o progresso ao vivo build → sign → submit (tx.step, tx.hash).",
      },
    ],
  },

  cosmosPayAbout: {
    eyebrow: "Cosmos Pay",
    title: "Intenções de pagamento SEP-7 para Stellar",
    tagline:
      "A Cosmos Pay monta o pagamento; você assina com sua própria carteira.",
    body: [
      "A Cosmos Pay é um SDK orientado a objetos para a API de pagamentos da Cosmos Pay. Sua metade de servidor cria intenções de pagamento SEP-7 da Stellar — além de webhooks, produtos, clientes e analytics — com sua chave secreta; sua metade de navegador as completa.",
      "As carteiras de navegador não consomem as URIs SEP-7 `web+stellar:` de uma dapp, então o cliente web da Cosmos Pay adapta cada intenção em uma transação Stellar concreta (XDR): constrói o pagamento para uma intenção `pay`, ou reutiliza o XDR para uma intenção `tx`.",
      "Nesta demo a Cosmos Pay se integra ao Pollar exatamente como os adapters da Trustless Work e da Nirium: o buildTransaction do cliente web transforma a intenção SEP-7 `pay` em um XDR não assinado — construído a partir da sua conta conectada como origem — e o SDK do Pollar o assina e o envia com sua carteira. Nenhuma chave secreta ou API key toca o frontend.",
    ],
    featuresTitle: "O que oferece",
    features: [
      {
        title: "Intenções de pagamento SEP-7",
        desc: "Crie intenções `pay` e `tx` no servidor; cada uma devolve uma URI SEP-7 + QR que qualquer carteira consome.",
      },
      {
        title: "Cliente web agnóstico",
        desc: "Detecta Freighter, xBull, Rabet, LOBSTR e Albedo — ou, aqui, entrega o XDR não assinado ao Pollar.",
      },
      {
        title: "Webhooks e catálogos",
        desc: "Entrega de webhooks assinados mais produtos, clientes e analytics — tudo atrás da sua chave secreta.",
      },
      {
        title: "Assinado pelo Pollar",
        desc: "A Cosmos Pay monta o pagamento; a carteira Pollar conectada assina. Sem chaves secretas no frontend.",
      },
    ],
    resourcesTitle: "Recursos oficiais",
    npmLabel: "Pacote npm",
    repoLabel: "SDK (GitHub)",
    disclaimer:
      "Resumo baseado no pacote publicado @cosmosapp/pay_sdk. O Pollar não é afiliado à Cosmos Pay — todo o crédito para a equipe deles.",
  },

  cosmosPay: {
    title: "Pagamento SEP-7",
    desc: "Envie um pagamento Stellar através de uma intenção SEP-7 da Cosmos Pay. A Cosmos Pay monta o pagamento e devolve um XDR não assinado; o SDK do Pollar o assina e o envia com sua carteira conectada — sem chave secreta, sem API key.",
    destination: "Destino",
    destinationNote: "Endereço Stellar do destinatário (G…) na testnet.",
    asset: "Ativo",
    assetNote: "'XLM' para o nativo, ou 'CODE:ISSUER' para um ativo emitido.",
    amount: "Valor",
    memo: "Memo",
    memoNote: "Nota opcional armazenada como MEMO_TEXT (máx. 28 caracteres).",
    message: "Mensagem",
    messageNote: "Mensagem opcional legível que a intenção SEP-7 carrega.",
    pay: "Pagar com Pollar",
    signing: "Assinando…",
    setupSummary: "Configuração — registre o adapter da Cosmos Pay uma vez",
    txIdle: "Preencha destino, valor e ativo, depois pague.",
    coreFnsTitle: "@pollar/core — funções usadas",
    coreFnsIntro:
      "O adapter devolve um XDR não assinado; o cliente core o assina e o envia.",
    coreFns: [
      {
        fn: "cosmosPayAdapter.pay(params)",
        tag: "async",
        params:
          "params: { destination, amount, asset, memo?, msg?, signer }. A Cosmos Pay monta o pagamento SEP-7.",
        returns:
          "Promise<{ unsignedTransaction: string }> — o XDR não assinado, pronto para assinar.",
      },
      {
        fn: "client.signAndSubmitTx(xdr)",
        tag: "async",
        params:
          "xdr: string — a transação não assinada devolvida pelo adapter.",
        returns:
          "Promise<SubmitOutcome> — { status, hash, … }. Assina com a carteira conectada e então envia.",
      },
    ],
    reactFnsTitle: "@pollar/react — hook e valores usados",
    reactFnsIntro:
      "createPollarAdapterHook conecta o adapter para o Pollar assinar automaticamente; usePollar expõe o estado da tx ao vivo.",
    reactFns: [
      {
        fn: "useCosmosPay()",
        tag: "hook",
        params:
          "Sem argumentos. Devolve o adapter encapsulado — chamar pay() constrói, assina e envia em um passo.",
        returns:
          "WrappedAdapter — { pay }. O XDR não assinado é assinado e enviado automaticamente.",
      },
      {
        fn: "usePollar().tx",
        tag: "valor reativo",
        params: "Sem argumentos — leia durante o render.",
        returns:
          "TransactionState — o progresso ao vivo construir → assinar → enviar (tx.step, tx.hash).",
      },
    ],
  },

  hedgepayAbout: {
    eyebrow: "HedgePay",
    title: "Banco self-custodial sobre stablecoins",
    tagline: "Seu app self-custodial. Suas regras.",
    body: [
      "A HedgePay é um app de banco self-custodial: guarde e gerencie stablecoins, converta de e para fiat, envie transferências internacionais com taxas mínimas e gaste no mundo todo com cartões de débito virtuais — sem abrir mão da custódia dos seus fundos.",
      "Esta aba é uma prévia da integração da HedgePay com o Pollar — em breve.",
    ],
    featuresTitle: "O que oferece",
    features: [
      {
        title: "Cartões de débito virtuais",
        desc: "Gaste stablecoins no mundo todo, onde aceitarem cartões.",
      },
      {
        title: "Fiat on/off e transferências",
        desc: "Converta fiat ↔ stablecoins e envie pagamentos internacionais de baixa taxa.",
      },
      {
        title: "Self-custodial",
        desc: "Você mantém a custódia dos seus fundos — suas chaves, suas regras.",
      },
      {
        title: "Poupe em moedas fortes",
        desc: "Mantenha saldos em stablecoins lastreadas em USD / EUR.",
      },
    ],
    resourcesTitle: "Recursos oficiais",
    websiteLabel: "Site",
    disclaimer:
      "Resumo baseado no site oficial da HedgePay. O Pollar não é afiliado à HedgePay — todo o crédito para a equipe deles.",
  },

  vaquitaAbout: {
    eyebrow: "Vaquita",
    title: "Poupança comunitária na Stellar",
    tagline: "O poder de poupar em comunidade.",
    body: [
      "A Vaquita é uma plataforma de poupança comunitária na Stellar: os membros contribuem regularmente e ganham juros por um sistema justo e descentralizado, com saques flexíveis — quanto mais você espera, maior o rendimento.",
      "Esta aba é uma prévia da integração da Vaquita com o Pollar — em breve.",
    ],
    featuresTitle: "O que oferece",
    features: [
      {
        title: "Poupe em comunidade",
        desc: "Junte contribuições regulares com outros e cresçam juntos.",
      },
      {
        title: "Rendimento justo e descentralizado",
        desc: "Os juros são distribuídos de forma justa via smart contracts.",
      },
      {
        title: "Saques flexíveis",
        desc: "Saque quando precisar; esperar mais rende mais.",
      },
      {
        title: "Protegido na Stellar",
        desc: "Roda em smart contracts da Stellar.",
      },
    ],
    resourcesTitle: "Recursos oficiais",
    websiteLabel: "Site",
    disclaimer:
      "Resumo baseado no site oficial da Vaquita. O Pollar não é afiliado à Vaquita — todo o crédito para a equipe deles.",
  },

  humanWebAbout: {
    eyebrow: "Human Web",
    title: "Compartilhe sua opinião, de forma anônima",
    tagline: "Sua opinião, sem revelar quem você é.",
    body: [
      "A Human Web é uma plataforma para opinar e votar de forma anônima: participe dos temas que importam para você e responda enquetes sem nunca expor sua identidade.",
      "Esta aba é uma prévia da integração da Human Web com o Pollar — em breve.",
    ],
    featuresTitle: "O que oferece",
    features: [
      {
        title: "Anônimo por design",
        desc: "Opine e vote sem revelar quem você é.",
      },
      {
        title: "Enquetes da comunidade",
        desc: "Crie e responda enquetes que importam para a comunidade.",
      },
      {
        title: "Faça sua voz ser ouvida",
        desc: "Participe dos temas e causas que importam para você.",
      },
      {
        title: "Construído sobre a Stellar",
        desc: "Funciona sobre a Stellar para resultados transparentes e imutáveis.",
      },
    ],
    resourcesTitle: "Recursos oficiais",
    websiteLabel: "Site",
    disclaimer:
      "Resumo baseado no site oficial da Human Web. O Pollar não é afiliado à Human Web — todo o crédito para a equipe deles.",
  },

  e4cAbout: {
    eyebrow: "E4C",
    title: "Educação na blockchain",
    tagline: "Aprendizado, impulsionado pela Stellar.",
    body: [
      "A E4C é uma plataforma de educação construída sobre a Stellar: acesse conteúdo de aprendizado e receba credenciais verificáveis on-chain pelo que concluir.",
      "Esta aba é uma prévia da integração da E4C com o Pollar — em breve.",
    ],
    featuresTitle: "O que oferece",
    features: [
      {
        title: "Aprenda em qualquer lugar",
        desc: "Acesse o conteúdo educacional de qualquer dispositivo.",
      },
      {
        title: "Credenciais on-chain",
        desc: "Receba uma prova verificável do que você concluiu.",
      },
      {
        title: "Aberto para todos",
        desc: "Reduza as barreiras à educação de qualidade.",
      },
      {
        title: "Construído sobre a Stellar",
        desc: "Funciona sobre a Stellar para registros transparentes e imutáveis.",
      },
    ],
    resourcesTitle: "Recursos oficiais",
    websiteLabel: "Site",
    disclaimer:
      "Resumo baseado no site oficial da E4C. O Pollar não é afiliado à E4C — todo o crédito para a equipe deles.",
  },

  ...nekoPt,
};

export const LOCALES = ["en", "es", "pt"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_COOKIE = "pollar-demo-locale";

export const DICTIONARIES: Record<Locale, Dictionary> = { en, es, pt };
