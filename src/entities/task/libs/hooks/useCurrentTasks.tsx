import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTaskByParent } from "@/entities/task/model/slices/childTaskSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";
import { KRItemType } from "../../types/KRItemType";
import { OKRItemType } from "@/entities/task/types/OKRItemType";

export function useCurrentTasks(parentID: string, responsibleLogin: string | null) {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const [toLoadTasks, setLoadTasks] = useState<boolean>(false);
    const [isLoadingTasklist, setLoadingTaskList] = useState<boolean>(false);
    const [errorTaskList, setErrorTaskList] = useState<undefined | string>(undefined);

    const tasksList : (KRItemType | OKRItemType)[] = useSelector((state : StoreReducerType) => state.childTaskList.list).filter((item:KRItemType | OKRItemType) => item.idParent == parentID);
    
    
    // Не нужно
    // useEffect(() => {
    //     if (!toLoadTasks) return;
    //     loadTaskList()
    // }, [toLoadTasks]);

    // const loadTaskList = async () => {
    //     const request = {
    //         login: responsibleLogin ?? "",
    //         idParent: parentID,
    //     }
    //     dispatch(fetchTaskByParent({request, setLoading: setLoadingTaskList, setError: setErrorTaskList}));

    //     setLoadTasks(false);
    // }

    return { 
        tasksList,
        setLoadTasks,
        isLoadingTasklist, 
        errorTaskList,
    };
}