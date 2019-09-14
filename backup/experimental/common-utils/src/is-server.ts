
// A nice helper to tell us if we're on the server
export const isServer = !(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);
