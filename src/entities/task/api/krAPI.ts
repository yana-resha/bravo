import { HTTPTransport } from "@/shared/api/HTTPTransport";
import { ServerResponseType } from "@/shared/types/ServerResponseType";
import { KRItemDeleteRequest, KRItemReadRequest, KRItemUpdateRequest, KRListByKRReadRequest, KRListByOKRReadRequest} from "../types/KRRequestType";
import { KRItemShortType, KRItemType } from "../types/KRItemType";
import { OKRItemCreateRequest } from "../types/OKRItemRequestType";

const httpTransoprt = new HTTPTransport('task/');

export async function createKR(request: OKRItemCreateRequest) : Promise <KRItemType | false> {
    let response : ServerResponseType<KRItemType>  = await httpTransoprt.post('', {...request, taskType: 'KR'});
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    
    return response.data??false;
}


export async function readKRById(request: KRItemReadRequest) : Promise <KRItemType | false> {
    let response : ServerResponseType<KRItemType>  = await httpTransoprt.get('?', request);
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    return response.data??false;
}

export async function readKRListByOKR(request: KRListByOKRReadRequest) : Promise <KRItemType[]> {
    let response : ServerResponseType<KRItemType[]>  = await httpTransoprt.get('byOKRList/?', request);
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    
    return response.data??[];
}

export async function readKRListByKR(request: KRListByKRReadRequest) : Promise <KRItemType[]> {
    let response: ServerResponseType<KRItemType[]>  = await httpTransoprt.get('byKRList/?', request);
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    
    return response.data??[];
}


export async function updateKRItem(request: KRItemUpdateRequest) : Promise <KRItemType | false> {
    let response : ServerResponseType<KRItemType>  = await httpTransoprt.patch('', request);
    if (!response) throw new Error('Ошибка сети, не удалось получить ответ от сервера');
    if (response.error) throw new Error(response.error);
    return response?.data??false;
}

// delete
export async function deleteKR(request: KRItemDeleteRequest) : Promise<string | boolean>{
    let response : ServerResponseType<string | boolean>  = await httpTransoprt.delete('', request);
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    return response?.data??false;
}