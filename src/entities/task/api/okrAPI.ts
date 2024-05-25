import { HTTPTransport } from "@/shared/api/HTTPTransport";
import { ServerResponseType } from "@/shared/types/ServerResponseType";
import { OKRItemCreateRequest, OKRItemDeleteRequest, OKRItemReadRequest, OKRItemUpdateRequest, OKRListReadRequest } from "../types/OKRItemRequestType";
import { OKRItemType } from "../types/OKRItemType";
import IResponsible from "@/entities/user/types/IResponsible";

const httpTransoprt = new HTTPTransport('task/');

// create
export async function createOKR(request: OKRItemCreateRequest) : Promise<OKRItemType|false> {
  
    let response : ServerResponseType<OKRItemType>  = await httpTransoprt.post('', request);
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    return response?.data??false;
}

// OKRItemUpdateRequest
export async function updateOKRItem(request: OKRItemUpdateRequest) : Promise<OKRItemType|false> {
    let response : ServerResponseType<OKRItemType>  = await httpTransoprt.patch('', request);
    if (!response) throw new Error('Ошибка сети, не удалось получить ответ от сервера');
    if (response.error) throw new Error(response.error);
    return response?.data??false;
}

// read
export async function readOKRInProgressList(request: OKRListReadRequest): Promise<OKRItemType[]> {
    let response : ServerResponseType<OKRItemType[]>  = await httpTransoprt.get('list/inProgress/?', request);
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    return response?.data??[];
}


export async function readOKRDoneList(request: OKRListReadRequest) : Promise<OKRItemType[]>  {
    let response : ServerResponseType<OKRItemType[]> = await httpTransoprt.get('list/done/?', request);
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    
    return response?.data??[];
}

export async function readOKRCancelList(request: OKRListReadRequest) : Promise<OKRItemType[]>  {
    let response : ServerResponseType<OKRItemType[]> = await httpTransoprt.get('list/cancel/?', request);
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    
    return response?.data??[];
}

export async function readOKRbyUserList(request: OKRListReadRequest) : Promise<OKRItemType[]>  {
    let response : ServerResponseType<OKRItemType[]>  = await httpTransoprt.get('list/byUser/?', request);
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    
    return response?.data??[];
}

export async function countClosedComplexityByQuartal(request: {login: IResponsible['login'], quartal: string}) : Promise<OKRItemType[]>  {
    let response : ServerResponseType<OKRItemType[]>  = await httpTransoprt.get('list/success/?', request);
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    
    return response?.data??[];
}

export async function readOKRItem(request: OKRItemReadRequest) : Promise<OKRItemType | false>  {
    let response : ServerResponseType<OKRItemType>  = await httpTransoprt.get('?', request);
    if (!response) throw new Error('Ошибка сети, не удалось получить ответ от сервера');
    if (response.error) throw new Error(response.error);
    return response?.data??false;
}


// delete
export async function deleteOKR(request: OKRItemDeleteRequest) : Promise<string | boolean>{
    let response : ServerResponseType<string | boolean>  = await httpTransoprt.delete('', request);
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    return response?.data??false;
}