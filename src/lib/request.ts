import { IncomingMessage } from "http";
import * as https from "https";

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestOptions {
  hostname: string;
  path: string;
  method: RequestMethod;
  headers?: { [key: string]: string };
}

function request<T>(options: RequestOptions, data?: any): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const req = https.request({ ...options }, (res: IncomingMessage) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        try {
          const parsedBody: T = JSON.parse(body);
          resolve({
            ...parsedBody,
            statusCode: res.statusCode || 500,
          });
        } catch (e) {
          reject(new Error("Failed to parse response body"));
        }
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

export default request;
