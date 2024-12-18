import { RequestMethod } from "./request.js";
export declare const HOSTNAME = "www.navigable.ai";
export declare const DEFAULT_TIMEOUT = 30000;
export declare const API_KEY_HEADER = "X-Api-Key";
interface IEndpointParams {
    path: string;
    method: RequestMethod;
}
type Endpoint = "SEND_MESSAGE" | "GET_MESSAGES";
export declare const ENDPOINTS: Record<Endpoint, IEndpointParams>;
export {};
