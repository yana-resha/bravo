
import metricaApiService from "@/entities/metrica/services/MetricaApiService";
import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";



export const fetchMetricList = createAsyncThunk(
    'metric/list',
    async function (request: any) {
        const response = await metricaApiService.readMetricList(request);
        return response;
    }
)
export type MetricListStateType = {
    list: any[],
    error: undefined | string,
    isLoading: boolean,
}

const initialState: MetricListStateType = {
    
    list : [],
    error: undefined,
    isLoading: false
};

const metricListSlice = createSlice({
    name: 'metricList',
    initialState,
    reducers: {

        updateMetricInList(state, action) {
            state.list = state.list.map(item => {
                if (item.id == action.payload.id) {
                    item = action.payload;
                }
                return item;
            }); 
        },

        addMetric(state, action) {
            state.list.unshift(action.payload);
        },

        removeMetric(state, action) {
            const id = action.payload;
            state.list = state.list.filter(el => el.id !== id);
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchMetricList.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchMetricList.fulfilled, (state, action) => {
                state.isLoading = false;
                state.list = [...action.payload];
            })
            .addCase(fetchMetricList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            
    }
});

export const {addMetric, removeMetric, updateMetricInList} =  metricListSlice.actions;
export default metricListSlice.reducer;
