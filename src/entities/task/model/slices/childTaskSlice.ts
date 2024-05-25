import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { KRListByOKRReadRequest } from "../../types/KRRequestType";
import { KRItemType } from "../../types/KRItemType";
import taskService from "@/entities/task/services/TaskService";
import { OKRItemType } from "@/entities/task/types/OKRItemType";

type fetchPropsType<T> = {
    setLoading: (value: boolean) => void,
    setError: (value: string | undefined) => void, 
    request: T,
}

export const fetchTaskByParent = createAsyncThunk(
    'taskByParent',
    async function ({setLoading = () => {}, setError = () => {}, request} : fetchPropsType<KRListByOKRReadRequest>) {
        const response = await taskService.getListByParent(request);
        return response;
    }
)

type KRStateType = {
    list: any [],
}

const initialState : KRStateType = {
    list: [],
}

const childTaskSlice = createSlice({
    name: 'taskList',
    initialState,

    reducers: {

        setNewWaitForChildTask(state, action: {payload: {id: string , newWaitfor: number}}) {
            state.list = state.list.map(el => {
                if (el.id == action.payload.id) {
                    if (!el.waitfor) el.waitfor = 0;
                    el.waitfor = action.payload.newWaitfor;
                }
                return el;
            })
        },

        addChldrnChildTask(state, action) {
            state.list = state.list.map(el => {
                if (el.id == action.payload.id) {
                    el.chldrn = el.chldrn ? el.chldrn + 1 : 1;
                }
                return el;
            });
        },
        removeChildTask(state, action) {
            const id = action.payload;
            state.list = state.list.filter(el => el.id !== id);
        },

        addChildTask(state, action) {
            state.list = [action.payload, ...state.list];
        },
        updateChildTask(state, action) {
            state.list = state.list.map(task => {
                if (task.id == action.payload.id) task = {
                    ...task,
                    ...action.payload,
                };
                return task;
            })
        },

        updateChildTaskList(state, action) {
            state.list = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchTaskByParent.pending, (state,action) => {
                
                action.meta.arg.setLoading(true);
                action.meta.arg.setError(undefined);
            })
            .addCase(fetchTaskByParent.fulfilled, (state, action) => {
                action.meta.arg.setLoading(false);
                action.meta.arg.setError(undefined);
                let filterList = state.list.filter((item: KRItemType | OKRItemType) => {
                    if (action.payload.every((el: KRItemType | OKRItemType) => el.id !== item.id)) return item;
                });
                state.list = [...action.payload, ...filterList]
            })
            .addCase(fetchTaskByParent.rejected, (state, action) => {
                action.meta.arg.setLoading(false);
                action.meta.arg.setError(action.error.message);
            })
    }
});

export const {addChildTask, updateChildTask, removeChildTask, addChldrnChildTask, setNewWaitForChildTask, updateChildTaskList} =  childTaskSlice.actions;
export default childTaskSlice.reducer;