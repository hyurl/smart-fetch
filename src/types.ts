import { Method } from "axios";

export type Headers = Record<string, string | string[]>;
export type MessageType = string | object | Buffer;

export interface HttpMessage {
    url: string;
    headers?: Headers;
    cookies?: string[];
    data?: MessageType;
}

export interface Request extends HttpMessage {
    /**
     * @default "GET"
     */
    method?: Method;
    /**
     * Enforce finishing the request after timeout even if it is not complete.
     * @default 30000 ms
     */
    timeout?: number;
    /**
     * Retry the request when it failed with retry-able status or reasons, till
     * the maximum times being reached.
     */
    retries?: number;
    /**
     * Maximum number of allowed redirects.
     * @default 5
     */
    maxRedirects?: number;
    /**
     * Be default, the program will automatically detect the response type and
     * decode the content, however, sometimes this strategy may fail due to
     * unknown or unsupported types, provide this option to enforce the program
     * decoding the response to the relevant type and report an type error when
     * failed.
     */
    responseType?: "text" | "json" | "buffer";
    /**
     * By default, the program will automatically detect the response charset
     * and decode the content, however, sometimes this strategy may fail due to
     * an unknown charset, provide this option to enforce the program decoding
     * the response by the relevant charset and report an type error when
     * failed.
     */
    responseCharset?: string;
    /**
     * Fetch the resource via a proxy server.
     */
    proxy?: string | {
        protocol?: "http:" | "https:";
        host: string;
        port: number;
        auth?: {
            username: string;
            password: string;
        };
    };
}

export interface Response<T extends MessageType = MessageType> extends Required<HttpMessage> {
    /** A request is seemed OK when the status code is 200-299 or 304. */
    ok: boolean;
    /** HTTP status code. */
    status: number;
    /**
     * if an HTTP/2 request is encountered, the `statusText` will be empty.
     */
    statusText: string;
    /**
     * If `type` is `json`, the `data` will be automatically parse to JavaScript
     * object via `JSON.parse`. 
     */
    type: T extends Buffer ? "buffer" : T extends string ? "text" : "json";
    data: T;
}

export interface FetcherConfig {
    /**
     * Whether or not to support magic variables in the URL, if set, the
     * following variables will be replaced with respective values when
     * fetching.
     * 
     * - `{ts}` UNIX timestamp.
     * - `{ms}` timestamp in milliseconds
     * - `{date}` simple date string in format of `YYYY-MM-DD`
     * - `{date:<format>}` custom date format, eg. `{date:YYYY-MM-DD HH:mm:ss}`
     * - `{rand}` random number generated by `Math.random()`
     * 
     * This functionality is very useful when your requests are queued, it
     * can resolve the URL in order to meet the current time or state.
     * @default false
     */
    magicVars?: boolean,
    /**
     * The default timeout for each request.
     * @default 30000 ms
     */
    timeout?: number;
}