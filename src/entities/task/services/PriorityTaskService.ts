/* Redux */
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

/* State */
import { removeTask } from "@/entities/task/model/slices/priorityTaskSlice";

/* Service */
import taskService from "@/entities/task/services/TaskService";

export default class PriorityTaskService {
    private _taskID: string;
    private _userLogin: string;

    constructor(taskID: string, userLogin: string) {
        this._taskID = taskID;
        this._userLogin = userLogin;
    }

    async removeTaskFromPriority() {
        try {
            const response = await taskService.updateOKR({ login: this._userLogin, id: this._taskID, priority: 0});
            if (!response) {
                throw new Error('Произошла ошибка при удалении задачи из списка приоритетных');
            }
            return Boolean(response);
        } catch (error: any) {
            console.error(error.message);
            throw new Error('Произошла ошибка при удалении задачи из списка приоритетных');
        }
    }
}