import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import strategyApiService from "@/entities/StrategyTarget/services/StrategyApiService";

type strategyTargetsStateType = {
    strategyTargetsList: {
        listLoading: boolean,
        listError: false | string | undefined,
        list: any[]
    }
}

const initialState: strategyTargetsStateType = {
    strategyTargetsList: {
        listLoading: false,
        listError: false,
        list: []
    }
}

export const fetchStrategyTargetList = createAsyncThunk(
    'strategyList',
    async function (request: any) {
        const response = await strategyApiService.getListStrategy(request);
        return response;
    }
)

const strategyTargetSlice = createSlice({
    name: 'okrPage',
    initialState,
    reducers: {
        addStrategyTarget(state, action) {
            state.strategyTargetsList.list.unshift(action.payload);
        },

        updateStrategyTarget(state, action) {
            state.strategyTargetsList.list = state.strategyTargetsList.list.map(target => {
                if (target.id == action.payload.id) target = action.payload;
                return target;
            });
        },
        deleteStrategyTarget(state, action) {
            state.strategyTargetsList.list = state.strategyTargetsList.list.filter(target => target.id !== action.payload);
        },
    },

    extraReducers: (builder) => {
        builder
            // inprogress
            .addCase(fetchStrategyTargetList.pending, (state) => {
                state.strategyTargetsList.listError = false;
                state.strategyTargetsList.listLoading = true;
            })
            .addCase(fetchStrategyTargetList.fulfilled, (state, action) => {
                state.strategyTargetsList.listLoading = false;
                state.strategyTargetsList.list = [...action.payload];
            })
            .addCase(fetchStrategyTargetList.rejected, (state, action) => {
                state.strategyTargetsList.listLoading = false;
                state.strategyTargetsList.listError = action.error.message;
            })
    }
});

export const { addStrategyTarget, deleteStrategyTarget, updateStrategyTarget} =  strategyTargetSlice.actions;
export default strategyTargetSlice.reducer;