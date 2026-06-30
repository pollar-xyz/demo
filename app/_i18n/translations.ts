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
    sessions: "Sessions",
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
    anclap: "Anclap",
    soroswap: "Soroswap",
    setup: "Setup",
    groups: {
      pollarWallet: "Wallet",
      transactions: "Transactions",
      sessions: "Sessions",
      distribution: "Distribution",
      integrations: "Integrations",
      trustlessWork: "Trustless Work",
      lumenwipe: "LumenWipe",
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
    products: "Products & integrations",
    walletAdapters: walletAdaptersNavLabel,
    builtWith: "Built with Pollar",
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
      sessions: "Review active sessions and revoke devices.",
      distribution: "List distribution rules and claim your share.",
      lumenwipe: "Close a Stellar account and merge its balance out.",
      stellarWalletsKit:
        "Register Stellar Wallets Kit wallets (Freighter, Albedo, xBull…) as Pollar adapters.",
      privy: "Email / Google login backed by a Privy embedded Stellar wallet.",
      acceslyAdapter:
        "Sign Pollar transactions with an Accesly smart account (passkey + Shamir-MPC).",
      anclap: "On/off-ramp local currency through the Anclap anchor.",
      soroswap: "Swap tokens on Soroban through the Soroswap DEX.",
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
    desc: "Buy and sell crypto with local payment methods (SPEI, PIX, PSE, ACH). Pollar renders the entire quote-and-payment flow inside a modal.",
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
    sessions: "Sesiones",
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
    anclap: "Anclap",
    soroswap: "Soroswap",
    setup: "Setup",
    groups: {
      pollarWallet: "Billetera",
      transactions: "Transacciones",
      sessions: "Sesiones",
      distribution: "Distribución",
      integrations: "Integraciones",
      trustlessWork: "Trustless Work",
      lumenwipe: "LumenWipe",
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
    products: "Productos e integraciones",
    walletAdapters: walletAdaptersNavLabel,
    builtWith: "Hecho con Pollar",
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
      sessions: "Revisa las sesiones activas y revoca dispositivos.",
      distribution: "Lista las reglas de distribución y reclama tu parte.",
      lumenwipe: "Cierra una cuenta Stellar y transfiere su saldo restante.",
      stellarWalletsKit:
        "Registra wallets de Stellar Wallets Kit (Freighter, Albedo, xBull…) como adaptadores de Pollar.",
      privy:
        "Login con email / Google respaldado por una billetera Stellar embebida de Privy.",
      acceslyAdapter:
        "Firma transacciones de Pollar con una smart account de Accesly (passkey + Shamir-MPC).",
      anclap: "Compra/venta de moneda local a través del anchor Anclap.",
      soroswap: "Intercambia tokens en Soroban a través del DEX Soroswap.",
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
    desc: "Compra y vende cripto con métodos de pago locales (SPEI, PIX, PSE, ACH). Pollar renderiza todo el flujo de cotización y pago dentro de un modal.",
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
    sessions: "Sessões",
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
    anclap: "Anclap",
    soroswap: "Soroswap",
    setup: "Setup",
    groups: {
      pollarWallet: "Carteira",
      transactions: "Transações",
      sessions: "Sessões",
      distribution: "Distribuição",
      integrations: "Integrações",
      trustlessWork: "Trustless Work",
      lumenwipe: "LumenWipe",
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
    products: "Produtos e integrações",
    walletAdapters: walletAdaptersNavLabel,
    builtWith: "Feito com Pollar",
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
      sessions: "Revise as sessões ativas e revogue dispositivos.",
      distribution: "Liste as regras de distribuição e resgate sua parte.",
      lumenwipe: "Encerre uma conta Stellar e transfira o saldo restante.",
      stellarWalletsKit:
        "Registre carteiras do Stellar Wallets Kit (Freighter, Albedo, xBull…) como adaptadores da Pollar.",
      privy:
        "Login com e-mail / Google com uma carteira Stellar embutida da Privy.",
      acceslyAdapter:
        "Assine transações da Pollar com uma smart account da Accesly (passkey + Shamir-MPC).",
      anclap: "Compra/venda de moeda local através do anchor Anclap.",
      soroswap: "Troque tokens na Soroban através da DEX Soroswap.",
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
    desc: "Compre e venda cripto com métodos de pagamento locais (SPEI, PIX, PSE, ACH). A Pollar renderiza todo o fluxo de cotação e pagamento dentro de um modal.",
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

  ...nekoPt,
};

export const LOCALES = ["en", "es", "pt"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_COOKIE = "pollar-demo-locale";

export const DICTIONARIES: Record<Locale, Dictionary> = { en, es, pt };
