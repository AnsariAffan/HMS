import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";


// Define the async thunk to fetch data
export const savePateint = createAsyncThunk(
  "api/savePateint",
  async ( values, { rejectWithValue }) => {
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/createNewEntry",
        {
          "data": values
      }
      );
      console.log(response);
      // await history.push("/UserTableController");

      return response.data
    } catch (error) {
      console.error("Save patient error:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


// 

export const getAllPateints = createAsyncThunk(
  "api/getAllPateints",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/getAllPateints`);
    
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
