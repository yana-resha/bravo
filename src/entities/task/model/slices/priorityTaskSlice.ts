import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import taskService from "../../services/TaskService";
import { OKRItemType } from "../../types/OKRItemType";

export const fetchPriorityList = createAsyncThunk(
    'tasks/priority',
    async (request: any) => await taskService.getListByPriority(request)
)

type priorityListStateType = {
    loading: boolean,
    error: string | false | undefined,
    list: OKRItemType[],
}

const initialState: priorityListStateType = {
    loading: false,
    error: false,
    list: [],
};

const priorityListSlice = createSlice({
    name: 'taskPriorityList',
    initialState,
    reducers: {
        addTask(state, action) {
            state.list.unshift(action.payload);
        },
        removeTask(state, action) {
            const id = action.payload;
            state.list = state.list.filter((el: OKRItemType) => el.id !== id);
        },
        updateList(state, action) {
            state.list = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchPriorityList.pending, (state) => {
                state.error = false;
                state.loading = true;
            })
            .addCase(fetchPriorityList.fulfilled, (state, action) => {
                state.loading = false;
                state.list = [...action.payload];
            })
            .addCase(fetchPriorityList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    }
});

export const {addTask, removeTask, updateList} =  priorityListSlice.actions;
export default priorityListSlice.reducer;
