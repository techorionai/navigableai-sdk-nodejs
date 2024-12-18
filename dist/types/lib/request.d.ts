export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
export interface RequestOptions {
    hostname: string;
    path: string;
    method: RequestMethod;
    headers?: {
        [key: string]: string;
    };
}
declare function request<T>(options: RequestOptions, data?: any): Promise<T>;
export default request;
