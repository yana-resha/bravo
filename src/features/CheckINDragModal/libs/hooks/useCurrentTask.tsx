import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { fetchTaskByParent, updateChildTask } from "@/entities/task/model/slices/childTaskSlice";
import { updateOKRTask } from "@/entities/task/model/slices/okrListSlice";
import taskService from "@/entities/task/services/TaskService";
import TaskService from "@/entities/task/services/TaskService";
import { KRItemType } from "@/entities/task/types/KRItemType";
import { OKRListTypesEnum } from "@/entities/task/types/OKREnums";
import { OKRItemType, OKRItemTypeShort } from "@/entities/task/types/OKRItemType";
import { showInfoAlert } from "@/shared/utils/showInfoAlert";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export function useCurrentTask({parentID = null} : {parentID: string | null}) {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const [currentTask, setCurrentTask] = useState<OKRItemType | KRItemType | null>(null);
    const [taskList, setTaskList] = useState<(OKRItemType | KRItemType) []>([]);
    const [taskListLoading, setTaskListLoading] = useState<boolean>(false);
    const currentUser = useSelector((state : StoreReducerType) => state.userData.user);
    const reduxChildList: (KRItemType | OKRItemType)[] = useSelector((state: StoreReducerType) => state.childTaskList.list)
        .filter((item: KRItemType | OKRItemType) => {
            if (parentID && item.idParent == parentID && item.responsibles.find(resp => resp.login == currentUser.login)) {
                return item;
            }

        })
    

    useEffect(() => {

    }, [taskList])
    const changeCurrentTask = (item: OKRItemType | KRItemType) => {
        let newValue = taskList.find((el: { id: string; }) => el.id == item?.id);
        if (newValue) {
            setCurrentTask(newValue)
        } else {
            setCurrentTask(null);
        }

    }

    const getTaskList = async () => {
        if (parentID) {
            setTaskList(reduxChildList);
        } else {
            setTaskListLoading(true);
            setTaskList([]);
            let request = {
                login: currentUser.login,
                shortList: true,
            }
            try {
                let response = await TaskService.getListOKR(request, OKRListTypesEnum.inProgress);
                if (response) {
                    setTaskList(response);
                }
    
            } catch(error: any) {
    
                showInfoAlert({
                    type: 'error',
                    text: error.message,
                    format: 'full',
                });
    
            } finally {
                setTaskListLoading(false);
            }
        }   
    }
    
    const updateTask = async () => {
        if (currentTask?.id) {
            const request = {
                id: currentTask?.id,
                login: currentUser.login,
            }
    
            await taskService.updateOKR(request)
                .then((response) => {
                if (response) {
                    if (parentID) {
                        dispatch(updateChildTask(response))
                    } else {
                        dispatch(updateOKRTask(response));
                    }
                    
                }
                })
                .catch((err) => {
                console.log(err);
                showInfoAlert({
                    format : 'full', 
                    text: err.message, 
                    type: 'error',
                });
                });
        }
    }

    useEffect(() => {
        getTaskList();
    }, [])

    return {
        currentTask, taskList, taskListLoading, changeCurrentTask, updateTask
    }
}