import { BaseAPI } from "@/shared/api/BaseAPI";

export class RequestAPI extends BaseAPI {
    constructor(endpoint: string) {
        super(endpoint);
    }
}