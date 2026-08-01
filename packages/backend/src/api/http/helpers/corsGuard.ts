import type http from "node:http";
import { isOriginAllowed } from "../cors";
import { respondOriginNotAllowed } from "./responses";

const applyCorsHeaders = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
): boolean => {
  const origin = req.headers.origin;
  if (!isOriginAllowed(origin)) {
    return false;
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin, Access-Control-Request-Headers");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  const requestedHeaders = req.headers["access-control-request-headers"];
  const allowedHeaders =
    typeof requestedHeaders === "string" && requestedHeaders.length > 0
      ? requestedHeaders
      : "Content-Type,Authorization";
  res.setHeader("Access-Control-Allow-Headers", allowedHeaders);
  res.setHeader("Access-Control-Max-Age", "86400");

  return true;
};

export const passesApiCorsGuard = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  isApi: boolean,
): boolean => {
  if (!isApi) {
    return true;
  }

  const hasOrigin = typeof req.headers.origin === "string";
  const hasCorsHeaders = hasOrigin && applyCorsHeaders(req, res);

  if (req.method === "OPTIONS" && !hasCorsHeaders) {
    respondOriginNotAllowed(res);
    return false;
  }

  if (hasOrigin && !hasCorsHeaders) {
    respondOriginNotAllowed(res);
    return false;
  }

  return true;
};
