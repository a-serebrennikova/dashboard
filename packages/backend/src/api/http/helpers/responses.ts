import type http from "node:http";

export const respondJson = (
  res: http.ServerResponse,
  statusCode: number,
  payload: unknown,
): void => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
};

export const respondOriginNotAllowed = (res: http.ServerResponse): void => {
  respondJson(res, 403, { error: "Origin is not allowed" });
};
