// Runs before every Vitest file. Tests and CI never call the real Claude API
// (AGENTS.md); they use recorded responses.
delete process.env.ANTHROPIC_API_KEY;

const realFetch = globalThis.fetch;

globalThis.fetch = (input, init) => {
  const url = new URL(input instanceof Request ? input.url : input);
  if (url.hostname === "anthropic.com" || url.hostname.endsWith(".anthropic.com")) {
    return Promise.reject(new Error("Tests must not call the real Claude API"));
  }
  return realFetch(input, init);
};
