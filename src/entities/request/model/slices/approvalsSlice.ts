import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import requestAPIService from "../../services/RequestAPIService";


type approvalsFetchType = {
    login: string,
    taskID: string
}

export const fetchApprovalsList = createAsyncThunk(
    'fecthApprovals',
    async (request: approvalsFetchType) => await requestAPIService.readByTask({login: request.login, idTask: request.taskID}) 
)


type ApprovalsStateType = {
    taskID: string | null,
    list: any[] | [] | null,
    error: string | null | undefined,
    loading: boolean | null
}

const initialState: ApprovalsStateType = {
    taskID: null,
    list: [],
    error: null,
    loading: null
};

const approvalsSlice = createSlice({
    name: 'approvalsList',
    initialState,
    reducers: {

        deleteApproval(state, action: {payload: {id: string}, type: string}) {
            if (state.list === null) {
                state.list = [];
            }
            state.list = state.list?.filter(item => item.id != action.payload.id);
        },

        addApproval(state, action) {
            if (state.list === null) {
                state.list = [];
            }
            state.list = [action.payload, ...state.list];
        },

        updateApproval(state, action) {
            if (state.list === null) {
                state.list = [];
            }
            state.list = state.list.map(item => {
                if (item.id == action.payload.id) {
                    item = {
                        ...item,
                        ...action.payload
                    }; 
                }
                return item;
            });
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchApprovalsList.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(fetchApprovalsList.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchApprovalsList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })        
    }
});

export const { updateApproval, addApproval, deleteApproval} =  approvalsSlice.actions;
export default approvalsSlice.reducer;
