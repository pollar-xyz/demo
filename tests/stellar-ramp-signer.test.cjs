const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  Account,
  Asset,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
  WebAuth,
} = require("@stellar/stellar-sdk");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");
const signerPath = path.join(__dirname, "../app/_lib/stellar-ramp-signer.ts");
const signerModule = new Module(signerPath, module);
signerModule.paths = Module._nodeModulePaths(path.dirname(signerPath));
signerModule._compile(
  ts.transpileModule(fs.readFileSync(signerPath, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText,
  signerPath,
);
const { createStellarRampSigner } = signerModule.exports;

function fixture() {
  const server = Keypair.random();
  const wallet = Keypair.random();
  let address = wallet.publicKey();
  let network = "mainnet";
  let signs = 0;
  let refusal = false;
  let replacement;
  async function sign(xdr) {
    signs++;
    if (refusal) return { status: "error", details: "Wallet declined" };
    const tx = TransactionBuilder.fromXDR(replacement ?? xdr, Networks.PUBLIC);
    tx.sign(wallet);
    return { status: "signed", signedXdr: tx.toXDR() };
  }
  const client = {
    getWallet: () => ({ custody: "external", address }),
    getNetwork: () => network,
    stellar: { sep10: { sign: ({ challengeXdr }) => sign(challengeXdr) } },
    signTx: sign,
    submitTx: () => {
      throw new Error("The signer must never broadcast");
    },
  };
  const trust = {
    signingKey: server.publicKey(),
    homeDomains: ["anclap.com"],
    webAuthDomain: "api.anclap.com",
  };
  const signer = createStellarRampSigner(client, async () => trust);
  const action = (xdr, purpose = "authentication") => ({
    kind: "sign_transaction",
    actionId: "auth",
    challengeRef: "challenge",
    purpose,
    chain: "STELLAR",
    network: "mainnet",
    payload: { encoding: "xdr", value: xdr },
    expiresAt: new Date(
      Number(
        TransactionBuilder.fromXDR(xdr, Networks.PUBLIC).timeBounds.maxTime,
      ) * 1000,
    ).toISOString(),
  });
  const challenge = (account = wallet.publicKey(), source = server) =>
    WebAuth.buildChallengeTx(
      source,
      account,
      "anclap.com",
      300,
      Networks.PUBLIC,
      "api.anclap.com",
    );
  const payment = (
    source = wallet.publicKey(),
    operations = [
      Operation.payment({
        destination: server.publicKey(),
        asset: Asset.native(),
        amount: "0.125",
      }),
    ],
  ) => {
    const builder = new TransactionBuilder(new Account(source, "11"), {
      fee: "100",
      networkPassphrase: Networks.PUBLIC,
    }).setTimeout(300);
    for (const op of operations) builder.addOperation(op);
    return builder.build().toXDR();
  };
  return {
    signer,
    wallet,
    server,
    action,
    challenge,
    payment,
    get signs() {
      return signs;
    },
    setAddress: (value) => {
      address = value;
    },
    setNetwork: (value) => {
      network = value;
    },
    decline: () => {
      refusal = true;
    },
    replace: (xdr) => {
      replacement = xdr;
    },
  };
}

test("Anclap SEP-10 signs a valid challenge without broadcasting", async () => {
  const f = fixture();
  const signed = await f.signer(f.action(f.challenge()));
  assert.deepEqual(
    WebAuth.verifyChallengeTxSigners(
      signed,
      f.server.publicKey(),
      Networks.PUBLIC,
      [f.wallet.publicKey()],
      ["anclap.com"],
      "api.anclap.com",
    ),
    [f.wallet.publicKey()],
  );
  assert.equal(f.signs, 1);
});

test("wrong network, wallet, server, validity, encoding and unsupported purpose fail before signing", async () => {
  const f = fixture();
  const valid = f.action(f.challenge());
  for (const action of [
    { ...valid, network: "testnet" },
    { ...valid, chain: "POLYGON" },
    { ...valid, payload: { ...valid.payload, encoding: "other" } },
    { ...valid, expiresAt: "2000-01-01T00:00:00Z" },
    { ...valid, expiresAt: new Date(Date.now() + 100000).toISOString() },
    { ...valid, purpose: "onramp_claim" },
    f.action(f.challenge(Keypair.random().publicKey())),
    f.action(f.challenge(f.wallet.publicKey(), Keypair.random())),
    f.action(f.payment()),
  ])
    await assert.rejects(f.signer(action));
  assert.equal(f.signs, 0);
});

test("withdrawals sign only a payment sourced by the connected account", async () => {
  const f = fixture();
  const xdr = f.payment();
  const signed = await f.signer(f.action(xdr, "withdrawal_payment"));
  assert.equal(
    TransactionBuilder.fromXDR(signed, Networks.PUBLIC).hash().toString("hex"),
    TransactionBuilder.fromXDR(xdr, Networks.PUBLIC).hash().toString("hex"),
  );
  await assert.rejects(
    f.signer(
      f.action(f.payment(Keypair.random().publicKey()), "withdrawal_payment"),
    ),
  );
  const op = Operation.manageData({ name: "unexpected", value: "operation" });
  await assert.rejects(
    f.signer(
      f.action(f.payment(f.wallet.publicKey(), [op]), "withdrawal_payment"),
    ),
  );
  assert.equal(f.signs, 1);
});

test("wallet rejection and changed signed payload do not produce a continuation payload", async () => {
  const f = fixture();
  f.decline();
  await assert.rejects(f.signer(f.action(f.challenge())), /Wallet declined/);
  const other = fixture();
  other.replace(other.payment());
  await assert.rejects(
    other.signer(other.action(other.challenge())),
    /different transaction/,
  );
});
