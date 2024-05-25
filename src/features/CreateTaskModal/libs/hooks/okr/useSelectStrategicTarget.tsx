/* Redux */
import { useSelector } from "react-redux";

/* Hooks */
import { useEffect, useState } from "react";

/* Types */
import { TaskType } from "@/features/CreateTaskModal/types/TaskType";
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { StrategicItemType } from "../../../types/StrategicTypes";

/* Utils */
import { showInfoAlert } from "@/shared/utils/showInfoAlert";

/* API */
import { getStrategyList } from "@/pages/OKRPage/api/strategyAPI";


export function useSelectStrategicTarget(taskType: TaskType | null) {
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const [strategicTarget, setStrategicTarget] = useState<StrategicItemType | null>(null);
    const [strategicList, setStrategicList] = useState <StrategicItemType[]> ([]);
    const [strategicListLoad, setStrategicListLoad] = useState(false);
    const [strategicError, setStrategicError] = useState<undefined | string>(undefined);
    
    const [listIsLoad, setListIsLoad] = useState<boolean>(false);

    const loadStrategyList = async () => {
        let request = {
            login: currentUser.login,
            shortList: true,
        }
        setStrategicListLoad(true);
        try {
            let response  = await getStrategyList(request);
            response ? setStrategicList(response) : setStrategicList([]);
            setStrategicError(undefined);
            setListIsLoad(true);
        } catch (error: any) {
            setStrategicError(error.message);
            showInfoAlert({
                format : 'full', 
                text: error.message, 
                type: 'error',
            });
        } finally {
            setStrategicListLoad(false)
        }
    }
    
    useEffect(() => {
        if (taskType && taskType.id === 'OKR' && listIsLoad === false) {
            loadStrategyList();
        }
    }, [taskType]);

    
    const strategicHandler = (id: string | null) => {
        let target = null;
        if (id) target = strategicList.find(item => item.id === id) ?? null;
        setStrategicTarget(target);
    }
    
    return {
        strategicHandler, strategicTarget, strategicList, strategicListLoad, strategicError,
    };
}