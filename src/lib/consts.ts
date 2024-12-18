import { RequestMethod } from "./request.js";

export const HOSTNAME = "www.navigable.ai";
export const DEFAULT_TIMEOUT = 30000;
export const API_KEY_HEADER = "X-Api-Key";

interface IEndpointParams {
  path: string;
  method: RequestMethod;
}

type Endpoint = "SEND_MESSAGE" | "GET_MESSAGES";

// API Endpoints
export const ENDPOINTS: Record<Endpoint, IEndpointParams> = {
  SEND_MESSAGE: {
    path: "/api/v1/chat",
    method: "POST",
  },
  GET_MESSAGES: {
    path: "/api/v1/chat",
    method: "GET",
  },
};
