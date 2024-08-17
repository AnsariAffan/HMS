import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import About from "./components/About";
import Usertable from "./components/Usertable";
import UserForm from "./components/UserForm";
import UserDashboard from "./components/UserDashboard";
import Login from "./components/Login";
import PrivateRoute from "./PrivateRoute";
import BillingForm from "./components/BillingForm";
import BillManager from "./components/BillManager";


import "./index.css";
import "./App.css";
import "./components/calendar.css";
import "./components/Dashboard.css";
import "./components/Usertable.css";
import "./components/UserDashboard.css";
import NewBillscreen from "./components/NewBillscreen";
import DoctorTable from "./components/DoctorTable";
import DoctorForm from "./components/DoctorForm";
import Appointment from "./components/Appointment";
import PaymentModal from "./components/PaymentModal";
import PaymentTable from "./components/PaymentTable";


function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route exact path="/" component={Login} />
        <Dashboard>
          <Switch>
            <PrivateRoute path="/dashboard" component={UserDashboard} />
            <PrivateRoute path="/usertable" component={Usertable} />
            <PrivateRoute path="/userForm" component={UserForm} />
            <PrivateRoute path="/pateint/:id" component={UserForm} />
            <PrivateRoute path="/billManager" component={BillManager} />
            <PrivateRoute path="/NewBillingForm/:id" component={NewBillscreen} />
            <Route path="/BillingForm" component={BillingForm} />
            <Route path="/NewBillingForm" component={BillingForm} />
            <Route path="/DoctorTable" component={DoctorTable} />
            <Route path="/DoctorForm" component={DoctorForm} />
            <Route path="/EditdoctorForm/:id" component={DoctorForm} />
            <Route path="/Appointment" component={Appointment} />
            <Route path="/Payment" component={PaymentModal} />
            <Route path="/Viewpayments" component={PaymentTable} />
           
          </Switch>
          
        </Dashboard>
      </Switch>
    </Router>
  );
}

export default App;
