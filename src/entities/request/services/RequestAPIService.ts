import { RequestAPI } from "../api/RequestAPI";
import { ReadByTaskRequest, CreateRequest, UpdateRequest } from "../types/Request";
import { CreateResponse, ReadResponse } from "../types/Response";

class RequestAPIService {
    api: RequestAPI;

    constructor() {
        this.api = new RequestAPI('request/');
    }

    async create(request: CreateRequest): Promise<ReadResponse | null> {
        let response = await this.api.create('?', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response.data ?? null;
    }

    async delete(request: {id: string}): Promise<boolean> {
        let response = await this.api.delete('?', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response.data ?? null;
    }

    async readByTask(request: ReadByTaskRequest): Promise<ReadResponse[] | null> {
        let response = await this.api.read('list/byTask/?', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response.data ?? null;
    }

    async updateStatus(request: UpdateRequest): Promise<ReadResponse | null> {
        let response = await this.api.update('', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response.data ?? null;
    }
}

const requestAPIService = new RequestAPIService();

export default requestAPIService;
