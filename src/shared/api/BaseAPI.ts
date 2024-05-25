import { HTTPTransport } from "@/shared/api/HTTPTransport";
import { ServerResponseType } from "@/shared/api/types/serverResponseType";
 
export class BaseAPI {
    protected http: HTTPTransport;

    constructor(endpoint: string) {
        this.http = new HTTPTransport(endpoint);
    }

    async create(path: string, request: any) {
        const response: ServerResponseType = await this.http.post(path, request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);

        return response ?? {};
    }

    async read(path: string, request: any) {
        const response: ServerResponseType = await this.http.get(path, request);

        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        
        return response ?? {};
    }

    async update(path: string, request: any) {
        const response: ServerResponseType = await this.http.patch(path, request);

        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        
        return response ?? {};
    }

    async delete(path: string, request: any) {
        const response: ServerResponseType = await this.http.delete(path, request);

        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        
        return response ?? {};
    }
}