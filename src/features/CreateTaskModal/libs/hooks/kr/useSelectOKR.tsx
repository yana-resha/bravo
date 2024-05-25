import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { showInfoAlert } from "@/shared/utils/showInfoAlert";
import { IFormResponsible } from "@/features/CreateTaskModal/types/IFormResponsible";
import { OKRItemType } from "@/entities/task/types/OKRItemType";
import { TaskType } from "@/features/CreateTaskModal/types/TaskType";
import taskService from "@/entities/task/services/TaskService";

export function useSelectOKR(responsibles : IFormResponsible[], respListInLoad : boolean, respError : undefined | string, taskType : TaskType | null) {
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);

    const [selectedOKR, setSelectedOKR] = useState<OKRItemType | null>(null);
    const [okrList, setOKRList] = useState<OKRItemType[] | []> ([]);
    const [okrListLoad, setOKRListLoad] = useState(false);
    const [okrError, setOKRError] = useState<undefined | string>(undefined);
    const [okrDisabled, setOKRDisabled] = useState(false); 
    const [countOKRListLoading, setCountOKRListLoading] = useState<number>(0);

    const loadOKRList = async () => {
        let request = {
            login: currentUser.login,
            shortList: true,
            // login: taskType?.id === 'KR' ? responsibles[0]?.login ?? "" : currentUser.login
            logins: [currentUser.login, ...responsibles.map(resp => resp.login)]
        }
        setOKRListLoad(true);
        try {
            let response = await taskService.getListInProgress(request);
            response ? setOKRList(response) : setOKRList([]);
            setOKRError(undefined);
            setCountOKRListLoading(prev => prev + 1)
        } catch (error: any) {
            console.log(error);
            setOKRError(error.message);
            showInfoAlert({
                format : 'full', 
                text: error.message, 
                type: 'error',
            });
        } finally {
            setOKRListLoad(false);
        }
    }
    
    useEffect(() => {
        if (taskType?.id === 'KR') {
            setSelectedOKR(null);
            
            if (responsibles.length > 0) {
                setOKRDisabled(false)
                setOKRList([]);
                loadOKRList();
            } else {
                setOKRList([]);
                setOKRDisabled(true);
            }
        }
        
    }, [responsibles]);

    useEffect(() => {
        setSelectedOKR(null);
        if (taskType?.id === 'OKR') {
            setOKRList([]);
            loadOKRList();
            setOKRDisabled(false);
        }
    }, [taskType]);

    useEffect(() => {
        setOKRListLoad(respListInLoad);
    }, [respListInLoad])
    
    const selectOKRHandler = (id: string | null) => {
        
        let target = null;
        if (id) target = okrList.find(item => item.id == id) ?? null;
        setSelectedOKR(target);
    }
    
    return {
        selectOKRHandler, selectedOKR, okrList, okrListLoad, okrError, okrDisabled, countOKRListLoading
    };
}