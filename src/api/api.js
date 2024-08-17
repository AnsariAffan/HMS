import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import api from "./apiConfigurations";
const apiUrl = process.env.DEV_Env;
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
        `https://services-uk8v.onrender.com/api/createNewEntry`,
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
       `https://services-uk8v.onrender.com/api/updateNewEntry`,
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
        `https://services-uk8v.onrender.com/api/getAllPateints`
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
        `https://services-uk8v.onrender.com/api/createNewBill`,
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
        `https://services-uk8v.onrender.com/api/getAllBills`
      );
    
      console.log(response)
     
      return response;
      
    } catch (error) {
      console.error("Get all patients error:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const updateBill = createAsyncThunk(
  "api/updateBills",
  async (billData, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `https://services-uk8v.onrender.com/api/updateBill`,
        billData
       
      );
    
      console.log(response)
     
      return response;
      
    } catch (error) {
      console.error("Get all patients error:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Fetch all doctors
export const getAllDoctors = createAsyncThunk(
  'doctors/getAllDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('http://localhost:8000/api/getAlldoctors');
      return response.data; // Assuming your API returns the doctors under a 'data' field
    } catch (error) {
      console.error("Error fetching doctors:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Fetch doctor by ID
export const getDoctorById = createAsyncThunk(
  'doctors/getDoctorById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`http://localhost:8000/api/doctors/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching doctor by ID:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Create a new doctor
export const saveDoctor = createAsyncThunk(
  'doctors/createDoctor',
  async (doctorData, { rejectWithValue }) => {
    console.log(doctorData.values);
    try {
      const response = await api.post('http://localhost:8000/api/createDoctors', doctorData.values);
      return response.data;
    } catch (error) {
      console.error("Error creating doctor:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Update an existing doctor
export const updateDoctor = createAsyncThunk(
  'doctors/updateDoctor',
  async ({ id, doctorData }, { rejectWithValue }) => {
    console.log(doctorData);
    try {
      const response = await api.put(`http://localhost:8000/api/updateDoctors/${id}`, doctorData);
      return response.data;
    } catch (error) {
      console.error("Error updating doctor:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Delete a doctor
export const deleteDoctor = createAsyncThunk(
  'doctors/deleteDoctor',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`https://services-uk8v.onrender.com/api/doctors/${id}`);
      return response.data; // Return data or a success message, depending on your API
    } catch (error) {
      console.error("Error deleting doctor:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


// Create a new appointment
export const createAppointment = createAsyncThunk(
  'appointments/createAppointment',
  async (data, { rejectWithValue }) => {
    try {
      // Send the data as is to the backend
      const response = await axios.post('http://localhost:8000/api/createAppointment', data);
      return response.data; // Return the created appointment
    } catch (error) {
      console.error("Error creating appointment:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


// Create a new appointment
export const getAllAppointment = createAsyncThunk(
  'appointments/getAllAppointment',
  async (data, { rejectWithValue }) => {
    try {
      // Send the data as is to the backend
      const response = await axios.get('http://localhost:8000/api/getAllAppointments');
      return response.data; // Return the created appointment
    } catch (error) {
      console.error("Error creating appointment:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Update an existing appointment
export const updateAppointment = createAsyncThunk(
  'appointments/updateAppointment',
  async ({ id, appointmentData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/appointments/${id}`, appointmentData);
      return response.data;
    } catch (error) {
      console.error("Error updating appointment:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);



// Delete an appointment
export const deleteAppointment = createAsyncThunk(
  'appointments/deleteAppointment',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting appointment:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


// Create a new payment
export const createpayment = createAsyncThunk(
  'appointments/createpayment',
  async (data, { rejectWithValue }) => {
    try {
      // Send the data as is to the backend
      const response = await axios.post('http://localhost:8000/api/createPayment', data);
      return response.data; // Return the created appointment
    } catch (error) {
      console.error("Error creating appointment:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


// Create a new payment
export const getAllPayments = createAsyncThunk(
  'appointments/getAllPayments',
  async (data, { rejectWithValue }) => {
    try {
      // Send the data as is to the backend
      const response = await axios.get('http://localhost:8000/api/getPayments');
      return response.data; // Return the created appointment
    } catch (error) {
      console.error("Error creating appointment:", error);
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Create a delete payment
export const deletePayment = createAsyncThunk(
  'appointments/deletPayment',
  async (id, { rejectWithValue }) => {
    try {
      // Send the data as is to the backend
      const response = await axios.delete(`http://localhost:8000/api/payments/${id}`);
      return response.data; // Return the created appointment
    } catch (error) {
      console.error("Error creating appointment:", error);
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
    BillDetails:[],
    allDoctors: [],
    appointments: [],  
    payments: [],
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
  
  //Billing update

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

 //save Doctor
 builder
 .addCase(saveDoctor.pending, (state) => {
  state.isLoading = true;
  state.hasError = false;
})
.addCase(saveDoctor.fulfilled, (state, action) => {
  state.isLoading = false;
  state.hasError = false;
  state.allDoctors= action.payload;
  state.successData = true;
  state.responseMessage = action.payload.message || "Doctor added successfully";
})
.addCase(saveDoctor.rejected, (state, action) => {
  state.isLoading = false;
  state.hasError = true;
  state.responseMessage = action.payload;
});

// Get All Doctors
builder
.addCase(getAllDoctors.pending, (state) => {
  state.isLoading = true;
  state.hasError = false;
})
.addCase(getAllDoctors.fulfilled, (state, action) => {
  state.isLoading = false;
  state.hasError = false;
  state.allDoctors = action.payload;
  state.successData = true;
})
.addCase(getAllDoctors.rejected, (state) => {
  state.isLoading = false;
  state.hasError = true;
  state.allDoctors = [];
});

// // Update Doctor
// builder
// .addCase(updateDoctor.pending, (state) => {
//   state.isLoading = true;
//   state.hasError = false;
// })
// .addCase(updateDoctor.fulfilled, (state, action) => {
//   state.isLoading = false;
//   state.hasError = false;
//   const index = state.allDoctors.findIndex(
//     (doctor) => doctor._id === action.payload._id
//   );
//   if (index !== -1) {
//     state.allDoctors[index] = action.payload;
//   }
//   state.successData = true;
//   state.responseMessage = action.payload.message || "Doctor updated successfully";
// })
// .addCase(updateDoctor.rejected, (state, action) => {
//   state.isLoading = false;
//   state.hasError = true;
//   state.responseMessage = action.payload;
// });

// Delete Doctor
builder
.addCase(deleteDoctor.pending, (state) => {
  state.isLoading = true;
  state.hasError = false;
})
.addCase(deleteDoctor.fulfilled, (state, action) => {
  state.isLoading = false;
  state.hasError = false;
  state.allDoctors = state.allDoctors.filter(
    (doctor) => doctor._id !== action.payload._id
  );
  state.successData = true;
  state.responseMessage = action.payload.message || "Doctor deleted successfully";
})
.addCase(deleteDoctor.rejected, (state, action) => {
  state.isLoading = false;
  state.hasError = true;
  state.responseMessage = action.payload;
})


builder
      // Handle Create Appointment
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      builder
      // Handle getAll Appointment
      .addCase(getAllAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments=action.payload;
      })
      .addCase(getAllAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

   
      builder
       // getAllPayments 
      .addCase(getAllPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments=action.payload;
      })
      .addCase(getAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    },
});

// Export the reducer and the async thunk
export const { reducer: pateinReducer } = pateintSlice;
