import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import api from "./apiConfigurations";
const apiUrl = process.env.REACT_APP_ENV;
// Define the async thunk to fetch data
// export const savePateint = createAsyncThunk(
//   "api/savePateint",
//   async ( {values,history}, { rejectWithValue }) => {
  
//     try {
//       const response = await axios.post(
//         "https://services-uk8v.onrender.com/api/createNewEntry",
//         {
//           "data": values,
          
//       }
//       );

//       // await history.push("/UserTableController");
//       // window.alert(response.data.message)
//       // message.success(response.data.message);
//       history.push("/Usertable")
//       console.log(response.data.message);
    
//       return response.data
//     } catch (error) {
//       console.error("Save patient error:", error);
//       return rejectWithValue(error.response ? error.response.data : error.message);
//     }
//   }
// );

export const savePateint = createAsyncThunk(
  "api/savePateint",
  async ({ values, history }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${apiUrl}/api/createNewEntry`,
        {
          data: values,
        }
      );

      history.push("/Usertable");
      console.log(response.data.message);

      return response; // Return the message from the responsfde
    } catch (error) {
      console.error("Save patient error:", error);
      // Handle specific error when user is already added
      if (error.response && error.response.status === 409) {
        return rejectWithValue("User is already added.");
      } else {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  }
);

export const updatePateint = createAsyncThunk(
  "api/updatePatient",
  async ({values,history}, { rejectWithValue }) => {
    try {
      const response = await api.put(
       `${apiUrl}/api/updateNewEntry`,
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



export const getAllPateints = createAsyncThunk(
  "api/getAllPateints",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${apiUrl}/api/getAllPateints`
      );
    
      console.log(response)
     
      return response;
      
    } catch (error) {
      console.error("Get all patients error:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const saveBill = createAsyncThunk(
  "api/saveBill",
  async ( billData , { rejectWithValue }) => {
    try {
      console.log(billData);
      const response = await api.post(
        `${apiUrl}/api/createNewBill`,
        billData
      );

      // history.push("/BillManager");
      console.log(response.data.message);

      return response; // Return the message from the response
    } catch (error) {
      console.error("Save patient error:", error);
      // Handle specific error when user is already added
      if (error.response && error.response.status === 409) {
        return rejectWithValue("User is already added.");
      } else {
        return rejectWithValue(error.response ? error.response.data : error.message);
      }
    }
  }
);

export const getAllBills = createAsyncThunk(
  "api/getAllBills",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${apiUrl}api/getAllBills`
      );
    
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
    successData:null,
    responseMessage:"",
    BillDetails:[]
  },
  reducers: {
  },
  extraReducers:async (builder) => {
    //fetch Single Product
     builder
      // .addCase(savePateint.pending, (state) => {
      //   state.isLoading = true;
      //   state.hasError = false;
      // })
      // .addCase(savePateint.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.hasError = false;
      //   state.allPateint = action.payload;
      //   state.responseMessage=action.payload
      //   state.successData = true
      // })
      // .addCase(savePateint.rejected, (state) => {
      //   state.isLoading = false;
      //   state.hasError = true;
      //   state.allPateint = {};
      // });

      .addCase(savePateint.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(savePateint.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasError = false;
        state.allPateint = action.payload;
        state.successData = true;

        // Check the response message to determine if user is already added
        if (action.payload.message === "User is already added.") {
          state.responseMessage = "User is already added."; // Set responseMessage state
        } else {
          state.responseMessage = action.payload.message; // Set responseMessage state from API response

        }
      })
      .addCase(savePateint.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.responseMessage = action.payload; // Assign the error message from rejectWithValue
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
  
  //Billing

  builder
  .addCase(saveBill.pending, (state) => {
    state.isLoading = true;
    state.hasError = false;
  })
  .addCase(saveBill.fulfilled, (state, action) => {
    state.isLoading = false;
    state.hasError = false;
    state.BillDetails = action.payload;
    state.successData = true
  })
  .addCase(saveBill.rejected, (state) => {
    state.isLoading = false;
    state.hasError = true;
    state.BillDetails = [];

  });
  
 //getAllPateints
 builder
 .addCase(getAllBills.pending, (state) => {
   state.isLoading = true;
   state.hasError = false;
 })
 .addCase(getAllBills.fulfilled, (state, action) => {
   state.isLoading = false;
   state.hasError = false;
   state.BillDetails = action.payload;
   state.successData = true
 })
 .addCase(getAllBills.rejected, (state) => {
   state.isLoading = false;
   state.hasError = true;
   state.BillDetails = [];
 });

    },
});

// Export the reducer and the async thunk
export const { reducer: pateinReducer } = pateintSlice;
