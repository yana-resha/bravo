import { SpecialSuccessAPI } from "../api/SpecialSuccessAPI";

class SpecialSuccessAPIService  {
    api: SpecialSuccessAPI;

    constructor() {
        this.api = new SpecialSuccessAPI('special-success/');
    }

}

const specialSuccessAPIService = new SpecialSuccessAPIService();
export default specialSuccessAPIService;