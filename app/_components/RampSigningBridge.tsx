"use client";

import { useEffect } from "react";
import { usePollar } from "@pollar/react";
import { createStellarRampSigner } from "../_lib/stellar-ramp-signer";

export function RampSigningBridge() {
  const { getClient } = usePollar();
  const client = getClient();
  useEffect(
    () =>
      client.registerRampSigningHandler(
        "STELLAR",
        "xdr",
        createStellarRampSigner(client),
      ),
    [client],
  );
  return null;
}
