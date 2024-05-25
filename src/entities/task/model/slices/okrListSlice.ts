import { ThunkDispatch, createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { OKRListReadRequest } from "@/entities/task/types/OKRItemRequestType";
import taskService from "../../services/TaskService";
import { OKRListTypesEnum, OKRStatusItem } from "../../types/OKREnums";
import { useDispatch } from "react-redux";
import { updateChildTaskList } from "./childTaskSlice";
import { store as Store } from "@/app/providers/storeProvider/config/storeConfig";

export const fetchInProgressList = createAsyncThunk(
    'okr/inprogressList',
    async (request: OKRListReadRequest, {dispatch}) => {
        let response = await taskService.getListOKR(request, OKRListTypesEnum.inProgress);

        try {
            const childTasks = response.filter(item => item.idParent !== null);
            dispatch(updateChildTaskList(childTasks));

            return response.filter(item => item.idParent === null);
        } catch {
            return [];
        }
    }
)

export const fetchDoneList = createAsyncThunk(
    'okr/doneList',
    async (request: OKRListReadRequest) => await taskService.getListOKR(request, OKRListTypesEnum.done)
)

export const fetchCancelList = createAsyncThunk(
    'okr/cancelList',
    async (request: OKRListReadRequest) => await taskService.getListOKR(request, OKRListTypesEnum.cancel)
)

export const fetchByUserList = createAsyncThunk(
    'okr/byUserList',
    async (request: OKRListReadRequest) => await taskService.getListOKR(request, OKRListTypesEnum.byUser)
)

export enum OKRReduxListTypes {
    doneList = 'doneList',
    cancelList = 'cancelList',
    inprogressList = 'inprogressList',
    byUserList = 'byUserList'
}

/* 
При получении задач в списки inprogressList/doneList/cancelList отфильтровывать задачи с parentID в 

*/

type OKRStateType = {
    
    // activeListType: 'active' | 'done' | 'cancelled',
    doneList:  {
        loading: boolean,
        error: false | string | undefined,
        list: any[],
    },
    cancelList: {
        loading: boolean,
        error: false | string | undefined,
        list: any[],
    },
    inprogressList: {
        loading: boolean,
        error: false | string | undefined,
        list: any[],
    },
    byUserList: {
        loading: boolean,
        error: false | string | undefined,
        list: any[],
    },
    listsTypes: OKRReduxListTypes [],
}

const initialState: OKRStateType = {
    listsTypes: [
        OKRReduxListTypes.doneList, OKRReduxListTypes.cancelList, OKRReduxListTypes.inprogressList, OKRReduxListTypes.byUserList,
    ],
    doneList: {
        loading: false,
        error: false,
        list: [],
    },
    cancelList: {
        loading: false,
        error: false,
        list: [],
    },
    inprogressList: {
        loading: false,
        error: false,
        list: [],
        
    },
    byUserList: {
        loading: false,
        error: false,
        list: [],
    },
};

const okrListSlice = createSlice({
    name: 'okrList',
    initialState,
    reducers: {

        setNewWaitForOKRTask(state, action: {payload: {id: string , newWaitfor: number}}) {
            state.inprogressList.list = state.inprogressList.list.map(el => {
                
                if (el.id == action.payload.id) {
                    if (!el.waitfor) el.waitfor = 0;
                    el.waitfor = action.payload.newWaitfor;
                }
                return el;
            })
        },
        
        addChldrnOKRTask(state, action) {
            state.inprogressList.list = state.inprogressList.list.map(el => {
                if (el.id == action.payload.id) {
                    el.chldrn = el.chldrn ? el.chldrn + 1 : 1;
                }
                return el;
            })
        },
        
        addOKRTask(state, action) {
            state.inprogressList.list.unshift(action.payload);
        },

        removeOKRTask(state, action) {
            const id = action.payload;
            state.inprogressList.list = state.inprogressList.list.filter(el => el.id !== id);
            state.cancelList.list = state.cancelList.list.filter(el => el.id !== id);
            state.doneList.list = state.doneList.list.filter(el => el.id !== id);
        },

        shiftOKRTaskFromListToList(state, action: {payload: {id: string | number,from: OKRReduxListTypes, to: OKRReduxListTypes}, type: string}) {
            const id = action.payload.id;
            state[`${action.payload.from}`].list = state[`${action.payload.from}`].list.filter(el => {
                if (el.id == id) {
                    if (action.payload.to == OKRReduxListTypes.cancelList) {
                        el.status = OKRStatusItem.cancel;
                    } else if (action.payload.to == OKRReduxListTypes.doneList) {
                        el.status = OKRStatusItem.done;
                        el.progress = 100;
                    } else if (action.payload.to == OKRReduxListTypes.inprogressList) {
                        el.status = null;
                    }
                    state[`${action.payload.to}`].list = [el, ...state[`${action.payload.to}`].list];
                    
                }
                return el.id !== id
            });
            
        },

        updateOKRTask(state, action) {
            state.inprogressList.list = state.inprogressList.list.map(item => {
                if (item.id == action.payload.id) {
                    item = {
                        ...item,
                        ...action.payload,
                    };   
                }

                return item;
            });
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchInProgressList.pending, (state) => {
                state.inprogressList.error = false;
                state.inprogressList.loading = true;
            })
            .addCase(fetchInProgressList.fulfilled, (state, action) => {
                state.inprogressList.loading = false;
                state.inprogressList.list = action.payload;
            })
            .addCase(fetchInProgressList.rejected, (state, action) => {
                state.inprogressList.loading = false;
                state.inprogressList.error = action.error.message;
            })

            // done
            .addCase(fetchDoneList.pending, (state) => {
                state.doneList.error = false;
                state.doneList.loading = true;
            })
            .addCase(fetchDoneList.fulfilled, (state, action) => {
                state.doneList.loading = false;
                state.doneList.error = false;
                state.doneList.list = action.payload;
            })
            .addCase(fetchDoneList.rejected, (state, action) => {
                state.doneList.loading = false;
                state.doneList.error = action.error.message;
            })

            // cancelList
            .addCase(fetchCancelList.pending, (state) => {
                state.cancelList.error = false;
                state.cancelList.loading = true;
            })
            .addCase(fetchCancelList.fulfilled, (state, action) => {
                state.cancelList.loading = false;
                state.cancelList.list = action.payload;
            })
            .addCase(fetchCancelList.rejected, (state, action) => {
                state.cancelList.loading = false;
                state.cancelList.error = action.error.message;
            })

            // byUser
            .addCase(fetchByUserList.pending, (state) => {
                
                state.byUserList.error = false;
                state.byUserList.loading = true;
            })
            .addCase(fetchByUserList.fulfilled, (state, action) => {
                state.byUserList.loading = false;
                state.byUserList.list = action.payload;
            })
            .addCase(fetchByUserList.rejected, (state, action) => {
                state.byUserList.loading = false;
                state.byUserList.error = action.error.message;
            })
        
    }
});

export const {addOKRTask, removeOKRTask, updateOKRTask, addChldrnOKRTask, shiftOKRTaskFromListToList, setNewWaitForOKRTask} =  okrListSlice.actions;
export default okrListSlice.reducer;

