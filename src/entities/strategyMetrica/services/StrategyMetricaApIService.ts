import { ServerResponseType } from "@/shared/types/ServerResponseType";
import { StrategyMetricaAPI } from "../api/strategyMetricaAPI";
import { StrategyMetricaItemType } from "../types/StrategyMetricaItemType";
import { MetricItemByIdRequest, MetricListRequest, StrategyMetricDeleteRequest, StrategyMetricaCreateRequest, StrategyMetricaUpdateRequest } from "../types/StrategyMetricaRequestType";

class StrategyMetricaServiceAPI  {
    api: StrategyMetricaAPI;

    constructor() {
        this.api = new StrategyMetricaAPI('strategy-metric/');
    }

    async readStrategyMetrica(request: MetricItemByIdRequest) :  Promise <false | StrategyMetricaItemType> {
        let response : ServerResponseType<StrategyMetricaItemType> = await this.api.read('?', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        
        return response.data??false;
    }

    async readStrategyMetricListByStrategy(request: MetricListRequest) : Promise<StrategyMetricaItemType[]> {
        let response : ServerResponseType<StrategyMetricaItemType[]>  = await this.api.read('list/byStrategy/?', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response.data??[];
    }
    
    async readStrategyMetricList(request: MetricListRequest) : Promise<StrategyMetricaItemType[]> {
        let response : ServerResponseType<StrategyMetricaItemType[]>  = await this.api.read('?', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response.data??[];
    }
    
    async createStrategyMetric(request: StrategyMetricaCreateRequest) : Promise<StrategyMetricaItemType | false> {
        let response :  ServerResponseType<StrategyMetricaItemType>  = await this.api.create('', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        
        return response.data??false;
    }
    
    
    async updateStrategyMetrica(request: StrategyMetricaUpdateRequest) : Promise<false | StrategyMetricaItemType> {
        let response :  ServerResponseType<StrategyMetricaItemType> = await this.api.update('', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        
        return response.data??false;
    }
    
    // delete
    async deleteStrategyMetrica(request: StrategyMetricDeleteRequest ) : Promise<string | boolean>{
        let response : ServerResponseType<string | boolean>  = await this.api.delete('', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response?.data??false;
    }
    
}

const strategyMetricaServiceAPI = new StrategyMetricaServiceAPI();
export default strategyMetricaServiceAPI;