// Self-contained i18n for the Integrations → Soroswap tab (coming soon).

import type { Locale } from "@/app/_i18n/translations";

type SoroswapStrings = { title: string; desc: string; body: string };

const en: SoroswapStrings = {
  title: "Soroswap",
  desc: "Swap tokens on Soroban through the Soroswap DEX.",
  body: "This integration will let you quote and execute token swaps via the Soroswap DEX, built and signed through Pollar core and the default modals.",
};

const es: SoroswapStrings = {
  title: "Soroswap",
  desc: "Intercambia tokens en Soroban a través del DEX Soroswap.",
  body: "Esta integración te permitirá cotizar y ejecutar swaps de tokens vía el DEX Soroswap, construidos y firmados con Pollar core y los modales por defecto.",
};

const pt: SoroswapStrings = {
  title: "Soroswap",
  desc: "Troque tokens na Soroban através da DEX Soroswap.",
  body: "Esta integração permitirá cotar e executar swaps de tokens via a DEX Soroswap, construídos e assinados com o Pollar core e os modais padrão.",
};

export const soroswapDict: Record<Locale, SoroswapStrings> = { en, es, pt };
