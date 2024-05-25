import { ProgressAPI } from "../api/ProgressAPI";
import { CurrentProgressRequest, HistoryProgressRequest } from "../types/ProgressRequest";
import { CurrentProgressData, HistoryProgressData } from "../types/ProgressResponse";

class ProgressAPIService {
    api: ProgressAPI;

    constructor() {
        this.api = new ProgressAPI('progress/');
    }

    async readCurrent(request: CurrentProgressRequest): Promise<CurrentProgressData | null> {
        let response = await this.api.read('?', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response.data ?? null;
    }

    async readHistory(request: HistoryProgressRequest): Promise<HistoryProgressData | null> {
        let response = await this.api.read('list/progressHistory/?', request);
        if (!response) throw new Error('Ошибка сети');
        if (response.error) throw new Error(response.error);
        return response.data ?? null;
    }
}

const progressAPIService = new ProgressAPIService();
export default progressAPIService;
