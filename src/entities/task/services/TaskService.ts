import { TaskAPI } from "@/entities/task/api/TaskAPI";
import { ServerResponseType } from "@/shared/types/ServerResponseType";
import { OKRItemCreateRequest, OKRItemDeleteRequest, OKRItemReadRequest, OKRItemUpdateRequest, OKRListReadRequest } from "../types/OKRItemRequestType";
import { OKRItemType } from "../types/OKRItemType";
import { OKRListTypesEnum } from "../types/OKREnums";



class TaskService {
    api: TaskAPI;

    constructor() {
        this.api = new TaskAPI('task/');
    }

    async createOKR(request: OKRItemCreateRequest): Promise<OKRItemType|false> {
        let response : ServerResponseType<OKRItemType> = await this.api.create('', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response?.data??false;
    }

    async readOKR(request: OKRItemReadRequest) : Promise<OKRItemType | false>  {
        let response : ServerResponseType<OKRItemType>  = await this.api.read('?', request);
        if (!response) throw new Error('Ошибка сети, не удалось получить ответ от сервера');
        if (response.error) throw new Error(response.error);
        return response?.data??false;
    }

    async updateOKR(request: OKRItemUpdateRequest): Promise<OKRItemType|false> {
        let response : ServerResponseType<OKRItemType>  = await this.api.update('', request);
        if (!response) throw new Error('Ошибка сети, не удалось получить ответ от сервера');
        if (response.error) throw new Error(response.error);
        return response?.data??false;
    }

    async deleteOKR(request: OKRItemDeleteRequest) : Promise<string | boolean> {
        let response : ServerResponseType<string | boolean>  = await this.api.delete('', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response?.data??false;
    }

    async getListOKR(request: OKRListReadRequest, typeList: OKRListTypesEnum): Promise<OKRItemType[]>  {
        let response : ServerResponseType<OKRItemType[]>  = await this.api.read(`list/${typeList}/?`, request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response?.data??[];
    }

    async getListInProgress(request: any) {
        let response : ServerResponseType<OKRItemType[]>  = await this.api.getList('inProgress', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response?.data??[];
    }

    async getListByParent(request: any) {
        let response : ServerResponseType<OKRItemType[]>  = await this.api.getList('byParent', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response?.data??[];
    }
    
    async getListByStrategy(request: any) {
        let response : ServerResponseType<OKRItemType[]>  = await this.api.getList('byStrategy', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response?.data??[];
    }

    async getListByPriority(request: any) {
        let response : ServerResponseType<OKRItemType[]>  = await this.api.getList('byPriority', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response?.data??[];
    }
}

const taskService = new TaskService();
export default taskService;