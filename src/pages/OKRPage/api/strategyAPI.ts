import { HTTPTransport } from "@/shared/api/HTTPTransport";
import { ServerResponseType } from "@/shared/types/ServerResponseType";

const httpTransoprt = new HTTPTransport('strategy/');

export async function getStrategyList(request: any) {
    
    let response : ServerResponseType<any> = await httpTransoprt.get('?', request);
    if (!response) throw new Error('Ошибка сети');
    if (response.error) throw new Error(response.error);
    
    return response.data??[];
    
}



