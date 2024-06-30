import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import "./components/calendar.css";
import "./components/Dashboard.css";
import "./components/Usertable.css";
import "./components/UserDashboard.css"
import "./components/Usertable.css"
import "./App.css"



import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from "./api/store";
import SuccessfullPopUp from "./components/SuccessfullPopUp";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}> 
   <PersistGate loading={null} persistor={persistor}>
        <App />
        {/* <SuccessfullPopUp/> */}
 </PersistGate>
 </Provider> 
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
