import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import UserServices from "../services/user.services";

interface userSigninParams {
	email_address?: string;
	password?: string;
}

export const userSignin = createAsyncThunk<{}, {}>(
  `users/signin`,
  async (params: userSigninParams) => {
    return await UserServices.userSignin(params);
  }
)

export interface User {
  user_id?: number;
  first_name?: string;
  last_name?: string;
  email_address?: string;
}

interface UserState {
  user_info: User
}

const initialState:UserState = {
  user_info: {}
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  // reducers: {
  //   userSignin: (state, action: PayloadAction<{ email_address: string, password: string }>) => {
  //     // state.user_info = 
  //     console.log("USER SIGNIN: ", action.payload);
  //   }
  // },
  extraReducers: (builder) => {
    builder
      .addCase(userSignin.pending, (state) => {
        console.log("USER SIGNIN | PENDING");
      })
      .addCase(userSignin.fulfilled, (state, action) => {
        console.log("USER SIGNIN | FULLFILLED");
        console.log(action.payload);
      })
      .addCase(userSignin.rejected, (state, action) => {
        console.log("USER SIGNIN | REJECTED");
      })
  }
});

// export const userActions = {...userSlice.actions};
// export const { userSignin } = userSlice.actions;
export default userSlice.reducer;