/* Hooks */
import { useState } from "react";
import { useSelector } from "react-redux";

/* Types */
import { userRoles } from "@/entities/user/types/userTypes";
import { TaskIDType, TaskType } from "../../types/TaskType";
import { StoreReducerType } from "@/app/providers/storeProvider/config/storeConfig";

/* Data */
import { taskItemsObj, taskItemsDefult } from "../../data/okr/taskItems";


export function useTaskType () {
    const currentUser = useSelector((state: StoreReducerType) => state.userData.user);
    
    const [taskType, setTaskType] = useState<TaskType| null>(null);

    const userRole: userRoles | null = currentUser.role;
    const taskTypeList: TaskType[] = userRole ? taskItemsObj[userRole] : taskItemsDefult;

    const changeTaskType = (type: TaskIDType | null) => {
        if (type) {
            let actualType = taskTypeList.find(el => el.id === type);
            actualType ? setTaskType(actualType) : setTaskType(null);
        } else {
            setTaskType(null);
        }
    };
    return {
        taskTypeList, taskType, changeTaskType
    }
}