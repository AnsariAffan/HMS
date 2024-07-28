import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { message } from "antd";
import axios from "axios";
const apiUrl = process.env.PROD_ENV;
// Define the async thunk to fetch data
export const login = createAsyncThunk(
  "auth/login",
  async ({ values, history }, { rejectWithValue }) => {
    console.log(values);
    console.log(history);
    
    try {

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const response = await axios.post(
        `https://services-uk8v.onrender.com/api/login`,
        {
          username: values.username,
          password: values.password,
        }
      );

      const { token, user } = response.data;
      console.log(token);
      console.log(user);

      // Save token in local storage
      localStorage.setItem("token", token);

      history.push("/dashboard");
      message.success("Logged in");
      return { token, user };
    } catch (e) {
      if (e.response) {
        const errorMessage = e.response.data.message || "Incorrect credentials";
        window.alert(errorMessage);
        console.log("Error:", errorMessage);
        return rejectWithValue(e.response.data);
      } else {
        window.alert("Network error");
        console.log("Network error:", e);
        return rejectWithValue({ message: "Network error" });
      }
    }
  }
);


export const logout = createAsyncThunk('auth/logout', async (history, { rejectWithValue }) => {
  try {
    // Clear JWT from local storage
    localStorage.removeItem('token');
history.push("/")
    // Optionally, call your API endpoint to handle server-side logout if needed
    // await api.post('/logout');

    return true;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Define the slice of the store
export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    hasError: false,
    user: null,
    token: null,
  },
  reducers: {
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const { reducer: userLogin } = userSlice;
