// Self-contained i18n for the Integrations → Anclap tab (coming soon).

import type { Locale } from "@/app/_i18n/translations";

type AnclapStrings = { title: string; desc: string; body: string };

const en: AnclapStrings = {
  title: "Anclap",
  desc: "On/off-ramp local currency through the Anclap anchor, settled on Stellar.",
  body: "This integration will let you buy and sell with local payment methods via the Anclap anchor, using Pollar core and the default ramp modals.",
};

const es: AnclapStrings = {
  title: "Anclap",
  desc: "Compra/venta de moneda local a través del anchor Anclap, liquidada en Stellar.",
  body: "Esta integración te permitirá comprar y vender con métodos de pago locales vía el anchor Anclap, usando Pollar core y los modales de ramp por defecto.",
};

const pt: AnclapStrings = {
  title: "Anclap",
  desc: "Compra/venda de moeda local através do anchor Anclap, liquidada na Stellar.",
  body: "Esta integração permitirá comprar e vender com métodos de pagamento locais via o anchor Anclap, usando o Pollar core e os modais de ramp padrão.",
};

export const anclapDict: Record<Locale, AnclapStrings> = { en, es, pt };
