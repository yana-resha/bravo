import { BaseAPI } from "@/shared/api/BaseAPI";
import { ServerResponseType } from "@/shared/api/types/serverResponseType";

export class TaskAPI extends BaseAPI {
    constructor(endpoint: string) {
        super(endpoint);
    }

    async getList(endpoint: string, request: any) {
        const response: ServerResponseType = await this.http.get(`list/${endpoint}/?`, request);

        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);

        return response ?? {};
    }
}