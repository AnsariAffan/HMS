import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

// Define the async thunk to fetch data
export const savePateint = createAsyncThunk(
  "api/savePateint",
  async ( {values,history}, { rejectWithValue }) => {
  
    try {
      const response = await axios.post(
        "https://services-uk8v.onrender.com/api/createNewEntry",
        {
          "data": values,
          
      }
      );
      console.log(response.data.message);
      // await history.push("/UserTableController");
      // window.alert(response.data.message)
      history.push("/Usertable")
      return response.data
    } catch (error) {
      console.error("Save patient error:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const updatePateint = createAsyncThunk(
  "api/updatePatient",
  async ({values,history}, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "https://services-uk8v.onrender.com/api/updateNewEntry",
        {
          data: values
        }
      );
      history.push("/Usertable")
      console.log(response);
    
      return response.data;
          
    } catch (error) {
      console.error("Update patient error:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);



// 

export const getAllPateints = createAsyncThunk(
  "api/getAllPateints",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://services-uk8v.onrender.com/api/getAllPateints`);
    
      console.log(response)
     
      return response;
      
    } catch (error) {
      console.error("Get all patients error:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);



// Define the slice of the store
export const pateintSlice = createSlice({
  name: "products",
  initialState: {
    isLoading: false,
    hasError: null,
    allPateint: [],
    

    successData:null
  },
  reducers: {
  },
  extraReducers:async (builder) => {
    //fetch Single Product
     builder
      .addCase(savePateint.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(savePateint.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.allPateint = action.payload;
 
        state.successData = true
      })
      .addCase(savePateint.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
        state.allPateint = {};
      });


      //getAllPateints
      builder
      .addCase(getAllPateints.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(getAllPateints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.allPateint = action.payload;

        state.successData = true
      })
      .addCase(getAllPateints.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
        state.allPateint = [];
      });
  },
});

// Export the reducer and the async thunk
export const { reducer: pateinReducer } = pateintSlice;
