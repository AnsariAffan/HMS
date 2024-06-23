import { configureStore } from "@reduxjs/toolkit";
import { pateinReducer, savePateint } from "./api";
import { userLogin } from "./userCredential";
import persistStore from "redux-persist/es/persistStore";
import storage from 'redux-persist/lib/storage';
import persistReducer from "redux-persist/es/persistReducer";



const persistConfig = {
  key: 'root',
   storage,
}



const persistedReducer = persistReducer(persistConfig, userLogin)
// Configure the store
export const store = configureStore({
    reducer: {
      products: pateinReducer,
      user:persistedReducer
    },

     middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: userLogin,
      },
      serializableCheck: false,
    }),
  });
  
  // Dispatch the async thunk to fetch data
  store.dispatch(savePateint());

  export const persistor = persistStore(store)