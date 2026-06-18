// Runtime gate for the Accesly section. Instead of a build-time env flag,
// the section is unlocked by visiting any URL with `?accesly=<passcode>`. The
// passcode is validated server-side in middleware.ts against the server-only
// ACCESLY_PASSCODE env, which then sets the cookie below. The cookie is just a
// boolean marker — the passcode itself never reaches the client.

export const ACCESLY_COOKIE = "accesly_unlocked";
export const ACCESLY_COOKIE_VALUE = "1";
export const ACCESLY_PARAM = "accesly";
