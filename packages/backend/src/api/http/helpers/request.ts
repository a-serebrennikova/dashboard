import type http from "node:http";

export const isApiRequest = (url: string | undefined): boolean => {
  return Boolean(url?.startsWith("/api/"));
};

export const readJsonBody = async (
  req: http.IncomingMessage,
): Promise<unknown> => {
  const chunks: Uint8Array[] = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  const body = Buffer.concat(chunks).toString("utf8").trim();
  return body.length === 0 ? null : JSON.parse(body);
};
