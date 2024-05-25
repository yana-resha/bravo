import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { readGuidingPurpose } from "../../api/read";
import { createGuidingPurpose } from "../../api/create";
import { EditRequest, FetchRequest } from "../../types/GuidingPurposeRequest";

export const fetchGuidingPurposeName = createAsyncThunk(
  'guidingPurpose/fetch',
  async function (request: FetchRequest) {
    const response = await readGuidingPurpose(request);
    return response;
  }
);

export const editGuidingPurposeName = createAsyncThunk(
  'guidingPurpose/edit',
  async function (request: EditRequest) {
    const response = await createGuidingPurpose(request);
    console.log(response);
    return response;
  }
);

export type GuidingPurposeSlice = {
  name: string;
};

const initialState: GuidingPurposeSlice = {
  name: 'test'
};

const guidingPurposeSlice = createSlice({
  name: 'guidingPurpose',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuidingPurposeName.fulfilled, (state, action) => {
        state.name = action.payload.title;
      })
      .addCase(editGuidingPurposeName.fulfilled, (state, action) => {
        state.name = action.payload.title;
      })
  },
});

export default guidingPurposeSlice.reducer;
