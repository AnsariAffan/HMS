import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";

import axios from "axios";

// Define the async thunk to fetch data


export const login = createAsyncThunk(
  "auth/login",
  async ({ formvalue, history }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.post(
        "http://localhost:8888/.netlify/functions/api/login",
        formvalue,
        history
      );

      history.push("/");
      message.success("logged in");
      // window.alert("logged in")
      //   console.log(response)
      return response;
    } catch (e) {

      const err = rejectWithValue(e.response);
         window.alert("incorrect credential")
       
       
      // message.warning(err.payload.message);
      console.log("err -" + err.payload.message);

      return err;
    }
  }
);





// Define the slice of the store
export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: true,
    hasError: false,
    user: null,
    userCarts: null,
   
  },
  reducers: {},
  
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
        state.isLoading = false;
        state.hasError = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
    
  
      });

   


      // builder
      // .addCase(sendProductToCart.pending, (state) => {
      //   state.isLoading = true;
      //   state.hasError = false;
      // })
      
   

  },
});

// Export the reducer and the async thunk
export const { reducer: userLogin } = userSlice;
