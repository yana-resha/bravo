import { useEffect, useState } from "react"
import { TaskType } from "../../types/TaskType"
import { useSelector } from "react-redux";
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { showInfoAlert } from "@/shared/utils/showInfoAlert";
import { ModalActionType } from "../../types/ModalActionType";
import { OKRItemType } from "@/entities/task/types/OKRItemType";
import { ResponsibleType } from "@/shared/types/responsibleType";
import { readKRById } from "@/entities/task/api/krAPI";
import { StrategyMetricaItemType } from "@/entities/strategyMetrica/types/StrategyMetricaItemType";
import { KRItemType } from "@/entities/task/types/KRItemType";
import { MetricaItemType } from "@/entities/metrica/types/MetricaItemType";
import taskService from "@/entities/task/services/TaskService";
import metricaApiService from "@/entities/metrica/services/MetricaApiService";
import strategyMetricaServiceAPI from "@/entities/strategyMetrica/services/StrategyMetricaApIService";


type props = {
    id: string | null,
    taskType: TaskType | null,
    modalType: ModalActionType;
}

export function useEditForm(id: props['id'], taskType: props['taskType'], modalType: props ['modalType']) {  
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const [editData, setEditData] = useState<OKRItemType | StrategyMetricaItemType | KRItemType | MetricaItemType |null>(null);
    const [editDataLoading, setEditDataLoading] = useState(false);
    const [editDataError, setEditDataError] = useState<false | string>(false);
    const [taskResponsibles, setTaskResponsibles] = useState< ResponsibleType[]>([]);
    const getTaskData = async () => {
        setEditDataLoading(true);
        setEditDataError(false);
        const request: any = {
            login: currentUser.login,
            id: id??""
        }
        try {
            let response;
            if (taskType) {
                if (taskType.id == 'OKR') {
                    request.taskType = 'OKR';
                    response = await taskService.readOKR(request);
                } else if (taskType.id == 'KR') {
                    response = await readKRById(request);
                } else if (taskType.id == 'strategyMetric') {
                    response = await strategyMetricaServiceAPI.readStrategyMetrica(request);
                } else if (taskType.id == 'metric') {
                    response = await metricaApiService.readMetrica(request);
                }
            }
            if (response) {
                setEditData(response);
                if (response.responsibles) {
                    setTaskResponsibles(response.responsibles)
                }
            }
        } catch (error: any) {
            setEditDataError(error.message);
            showInfoAlert({
                type: 'error',
                text: error.message,
                format: 'full',
            })
        } finally {
            setEditDataLoading(false);
        }
        
    };

    useEffect(() => {
        if (modalType == 'edit' && id) getTaskData();
    }, [modalType])

    return {
        editData, editDataLoading, editDataError, taskResponsibles
    }
}

