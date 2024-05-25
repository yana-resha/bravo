import { UserStateType } from "@/entities/user/types/userTypes";
import { getUser } from "@/shared/api/User/UserAPI";
import { UserRequestType } from "@/shared/types/User/UserRequestType";
import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";


export const fetchUser = createAsyncThunk(
    'user/data',
    async function (request: UserRequestType) {
        const response = await getUser(request);
        return response;
    }
)

const initialState: UserStateType = {
    error: false,
    isLoading: false,
    user: {
        login: null,
        fio:null,
        avatar:null,
    },
};

const userSlice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        setUserLogin(state) {
            state.user = {...state.user, login: localStorage.getItem('token')};
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.error = false;
                state.isLoading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = {...action.payload};
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
                state.user = {...state.user};
            });
    }
});

export const {setUserLogin} =  userSlice.actions;
export default userSlice.reducer;