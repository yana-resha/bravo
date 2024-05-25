import { queryStringify } from "../utils";
import { APIPath } from "@/shared/const/apiPath";

enum METHODS {
    GET = 'GET',
    POST =  'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

type Options = {
    method: string,
    data?: any
}

export type OptionsWithoutMethod = Omit<Options, 'method'>;

export class HTTPTransport {
    API_URL = APIPath;
    protected endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = `${this.API_URL}${endpoint}`;
    }

    public get<Response>(path: string, data?: unknown): Promise<Response> {
        return this.request<Response>(this.endpoint + path, {method: METHODS.GET, data});
    }

    public put<Response = void>(path: string, data: unknown): Promise<Response> {
        return this.request<Response>(this.endpoint + path, {method: METHODS.PUT, data});
    }

    public post<Response = void>(path: string, data?: unknown): Promise<Response> {
        return this.request<Response>(this.endpoint + path, {method: METHODS.POST, data});
    }

    public delete<Response>(path: string, data?: any): Promise<Response> {
        data.action = 'delete';
        return this.request<Response>(this.endpoint + path, { method: METHODS.PATCH, data });
    }

    public patch<Response = void>(path: string, data: unknown): Promise<Response> {
        return this.request<Response>(this.endpoint + path, {method: METHODS.PATCH, data});
    }

    private request<Response>(url: string, options: Options = { method: METHODS.GET }, timeout: number | null = null): Promise<Response> {
        const { method, data } = options;

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            if (method === METHODS.GET && data) {
                url += queryStringify(data);
            }

            xhr.open(method, url);

            xhr.onload = function() {
                resolve(xhr.response);
            }

            if (timeout !== null) {
                xhr.timeout = timeout;
            }

            xhr.onabort = () => reject({reason: 'abort'});
            xhr.onerror = () => reject({reason: 'network error'});
            xhr.ontimeout = () => reject({reason: 'timeout'});

            xhr.withCredentials = false;
            xhr.responseType = 'json';

            if (method === METHODS.GET || !data) {
                xhr.send();
            } else if (data instanceof FormData) {
                xhr.send(data);
            } else {
                xhr.setRequestHeader('Content-type', 'application/json');
                xhr.send(JSON.stringify(data));
            }
        });
    }
}