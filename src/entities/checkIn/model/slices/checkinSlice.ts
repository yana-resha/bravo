import { createSlice } from "@reduxjs/toolkit";

type checkinSliceType = {
    selectedUser: {
        avatar: string | null,
        fio: string | null,
        login: string | null
    }
}

const initialState: checkinSliceType = {
    selectedUser: {
        avatar: null,
        fio: null,
        login: null
    },
}

const checkinSlice = createSlice({
    name: 'checkinsData',
    initialState,
    reducers: {
        setCheckinUser(state, action) {
            const { fio, login, avatar } = action.payload;
            state.selectedUser = {
                fio: fio ?? null,
                login: login ?? null,
                avatar: avatar ?? null
            };
        }
        // removeChildTask(state, action) {
        //     const id = action.payload;
        //     state.list = state.list.filter(el => el.id !== id);
        // },

        // addChildTask(state, action) {
        //     state.list = [action.payload, ...action.payload];
        // },
        // updateChildTask(state, action) {
        //     console.log(state, action, 'updateKRTask')
        //     state.list = state.list.map(task => {
        //         if (task.id == action.payload.id) task = action.payload;
        //         return task;
        //     })
        // },
    }
});

export const { setCheckinUser } =  checkinSlice.actions;
export default checkinSlice.reducer;