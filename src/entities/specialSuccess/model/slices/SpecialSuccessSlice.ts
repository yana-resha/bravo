import { createSlice } from "@reduxjs/toolkit"

const initialState: any = {

}

const specialSuccessSlice = createSlice({
    name: 'specialSuccess',
    initialState,
    reducers: {
        addSuccess(state, action) {

            console.log(state, action);
        },

        removeSuccess(state, action) {

            console.log(state, action);
        },

        updateSuccess(state, action) {

            console.log(state, action);
        },
    },

    extraReducers: (builder) => {
        builder
    }
});

export const {addSuccess, removeSuccess, updateSuccess} =  specialSuccessSlice.actions;
export default specialSuccessSlice.reducer;