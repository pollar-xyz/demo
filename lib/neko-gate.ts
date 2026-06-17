// Runtime gate for the Neko Protocol section. Instead of a build-time env flag,
// the section is unlocked by visiting any URL with `?neko=<passcode>`. The
// passcode is validated server-side in middleware.ts against the server-only
// NEKO_PASSCODE env, which then sets the cookie below. The cookie is just a
// boolean marker — the passcode itself never reaches the client.

export const NEKO_COOKIE = "neko_unlocked";
export const NEKO_COOKIE_VALUE = "1";
export const NEKO_PARAM = "neko";
