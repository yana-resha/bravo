
import strategyMetricaServiceAPI from "@/entities/strategyMetrica/services/StrategyMetricaApIService";
import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";



export const fetchStrategyMetricList = createAsyncThunk(
    'strategyMetric/list',
    async function (request: any) {
        const response = await strategyMetricaServiceAPI.readStrategyMetricList(request);
        return response;
    }
)


type StrategicMetricStateType = {
    list: any[],
    error: undefined | string,
    isLoading: boolean,
}



const initialState: StrategicMetricStateType = {
    
    list : [],
    error: undefined,
    isLoading: false
};

const strategyMetricSlice = createSlice({
    name: 'strategyMetric',
    initialState,
    reducers: {

        updateStrategyMetric(state, action) {
            state.list = state.list.map(item => {
                if (item.id == action.payload.id) {
                    item = action.payload;
                }
                
                return item;
            }); 
        },

        addStrategyMetric(state, action) {
            state.list.unshift(action.payload);
        },

        removeStrategyMetric(state, action) {
            const id = action.payload;
            state.list = state.list.filter(el => el.id !== id);
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchStrategyMetricList.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchStrategyMetricList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = [...action.payload];
            })
            .addCase(fetchStrategyMetricList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            
    }
});

export const {addStrategyMetric, removeStrategyMetric, updateStrategyMetric} =  strategyMetricSlice.actions;
export default strategyMetricSlice.reducer;
