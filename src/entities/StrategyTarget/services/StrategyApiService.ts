import { ServerResponseType } from "@/shared/types/ServerResponseType";
import { StrategyTargetAPI } from "../api/StrategyTargetAPI";
import { IStrategyCreateRequest, IStrategyReadRequest, IStrategyTarget, IStrategyUpdateRequest } from "../types/StrategyTargetTypes";

class StrategyApiService {
    api: StrategyTargetAPI;

    constructor() {
        this.api = new StrategyTargetAPI('strategy/');
    }

    async createIStrategy(request: IStrategyCreateRequest): Promise<IStrategyTarget|false> {
        let response : ServerResponseType<IStrategyTarget> = await this.api.create('', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response?.data??false;
    }

    async readIStrategy(request: IStrategyReadRequest) : Promise<IStrategyTarget | false>  {
        let response : ServerResponseType<IStrategyTarget>  = await this.api.read('?', request);
        if (!response) throw new Error('Ошибка сети, не удалось получить ответ от сервера');
        if (response.error) throw new Error(response.error);
        return response?.data??false;
    }

    async updateIStrategy(request: IStrategyUpdateRequest): Promise<IStrategyTarget|false> {
        let response : ServerResponseType<IStrategyTarget>  = await this.api.update('', request);
        if (!response) throw new Error('Ошибка сети, не удалось получить ответ от сервера');
        if (response.error) throw new Error(response.error);
        return response?.data??false;
    }

    async deleteIStrategy(request: IStrategyReadRequest) : Promise<string | boolean> {
        let response : ServerResponseType<string | boolean>  = await this.api.delete('', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response?.data??false;
    }

    async getListStrategy(request: {login: string}): Promise<IStrategyTarget[]>  {
        let response : ServerResponseType<IStrategyTarget[]>  = await this.api.read(`?`, request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response?.data??[];
    }
}

const strategyApiService = new StrategyApiService();
export default strategyApiService;