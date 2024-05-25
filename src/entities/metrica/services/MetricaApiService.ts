import { ServerResponseType } from "@/shared/types/ServerResponseType";
import { MetricaAPI } from "../api/metricaAPI";
import { MetricDeleteRequest, MetricItemByIdRequest, MetricListRequest, MetricaCreateRequest, MetricaUpdateRequest } from "../types/MetricaRequestType";
import { MetricaItemType } from "../types/MetricaItemType";

class MetricaServiceAPI  {
    api: MetricaAPI ;

    constructor() {
        this.api = new MetricaAPI('metric/');
    }

    async readMetricList(request: MetricListRequest) : Promise<MetricaItemType[]> {
        let response : ServerResponseType<MetricaItemType[]> = await this.api.read('?', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response.data??[];
    }

    async readMetricListByStrategyMetric(request: MetricListRequest) : Promise<MetricaItemType[]> {
        let response : ServerResponseType<MetricaItemType[]> = await this.api.read('list/byStrategyMetric/?', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response.data??[];
    }
    
    async readMetrica(request: MetricItemByIdRequest): Promise<MetricaItemType | false> {
        let response: ServerResponseType<MetricaItemType> = await this.api.read('?', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        
        return response.data??false;
    }
    
    async createMetrica(request: MetricaCreateRequest): Promise<MetricaItemType | false> {
        let response: ServerResponseType<MetricaItemType> = await this.api.create('', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response.data??false;
        
    }
    
    async updateMetric(request: MetricaUpdateRequest) : Promise<MetricaItemType|false> {
        let response: ServerResponseType<MetricaItemType> = await this.api.update('', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response.data??false;
    }
    
    // delete
    async deleteMetrica(request: MetricDeleteRequest ) : Promise<string | boolean>{
        let response: ServerResponseType<string | boolean>  = await this.api.delete('', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response?.data??false;
    }
}

const metricaApiService = new MetricaServiceAPI();
export default metricaApiService;