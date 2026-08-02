export const resolveHttpBaseUrl = (wsUrl: string): string => {
  try {
    const url = new URL(wsUrl);
    const protocol = url.protocol === "wss:" ? "https:" : "http:";
    return `${protocol}//${url.host}`;
  } catch {
    return window.location.origin;
  }
};
