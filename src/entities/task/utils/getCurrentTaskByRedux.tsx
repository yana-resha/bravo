import { StoreReducerType, store } from "@/app/providers/storeProvider/config/storeConfig";
import { OKRItemType } from "../types/OKRItemType";
import { OKRReduxListTypes } from "../model/slices/okrListSlice";
import { useEffect, useState } from "react";

export function getParentDueDate(taskID: string) : string | undefined {
    let task = findCurrentTask(taskID);
    let parentTask = task.idParent ?  findCurrentTask(task.idParent) : null;
    if (parentTask && parentTask.dueDate) {
        return parentTask.dueDate;
    } else if (parentTask && !parentTask.dueDate && parentTask.idParent) {
        getParentDueDate(parentTask.idParent);
    } else if (parentTask && !parentTask.dueDate && !parentTask.idParent) {
        return undefined;
    }
}

export function useRootTask(taskID: string) {
    let [task, setTask] = useState(findCurrentTask(taskID));

    useEffect(() => {
        if (task && task.idParent) {
            const newTask = findCurrentTask(task.idParent);

            if (newTask) {
                setTask(newTask);
            }
        }
    }, [task]);

    return task;
}


export function getRootTaskID(taskID: string) {
    let item = findCurrentTask(taskID);
    if (item && item.idParent) {
        getRootTaskID(item.idParent)
    } else {
        if (!item) {
            return undefined;
        } else {
            return item.id;
        }
    }
}

// ищу задачу в редаксе по всем спискам где она может быть
export function findCurrentTask (taskID: string)  {
    const reduxParentTasks = store.getState().okrList as StoreReducerType['okrList'];
    const reduxChildTask = store.getState().childTaskList as StoreReducerType['childTaskList'];

    let newItem = reduxChildTask.list.find((el: OKRItemType) => el.id == taskID);
    if (!newItem) {
        for (let key of (Object.keys(OKRReduxListTypes))) {
            newItem = reduxParentTasks[`${key}`].list.find((el: OKRItemType) => el.id == taskID);
            if (newItem) {
                break;
            }
        }
    }
    return newItem;
}