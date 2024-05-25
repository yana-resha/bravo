import { ServerResponseType } from "@/shared/types/ServerResponseType";
import { CheckinAPI } from "../api/checkInApi";
import { CheckINCreateRequest, CheckINIntensityStats, CheckINRead, CheckINReadResponse, CheckINUpdateRequest, CheckinItemType } from "../types/CheckinType";

export enum TypeCheckinList {
    IntensityStats = 'intensityStats',
}

class CheckinAPIService {
    api: CheckinAPI;

    constructor() {
        this.api = new CheckinAPI('checkin/');
    }

    async createCheckIN(request: CheckINCreateRequest): Promise<CheckinItemType|false> {
        let response : ServerResponseType<CheckinItemType> = await this.api.create('', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response?.data??false;
    }

    // дает либо последниюю запись либо все 
    async readCheckIN(request: CheckINRead) : Promise<CheckINReadResponse>  {
        let response : ServerResponseType<CheckINReadResponse>  = await this.api.read('?', request);
        if (!response) throw new Error('Ошибка сети, не удалось получить ответ от сервера');
        if (response.error) throw new Error(response.error);
        return response?.data??{list: [], count: 0};
    }

    async updateCheckIN(request: CheckINUpdateRequest): Promise<CheckinItemType|false> {
        let response : ServerResponseType<CheckinItemType>  = await this.api.update('', request);
        if (!response) throw new Error('Ошибка сети, не удалось получить ответ от сервера');
        if (response.error) throw new Error(response.error);
        return response?.data??false;
    }

    async deleteCheckIN(request: {login: string, id: string}) : Promise<string | boolean> {
        let response : ServerResponseType<string | boolean>  = await this.api.delete('', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response?.data??false;
    }

    async getList(type: TypeCheckinList, request: {login: string}): Promise<CheckINIntensityStats|null> {
        let response: ServerResponseType<CheckINIntensityStats>  = await this.api.read(`list/${type}/?`, request);
        if (!response) throw new Error('Ошибка сети, не удалось получить ответ от сервера');
        if (response.error) throw new Error(response.error);
        return response?.data??null;
    }
}

const checkinAPIService = new CheckinAPIService();
export default checkinAPIService;