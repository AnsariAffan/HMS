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
            <PrivateRoute path="/BillingForm/:id" component={BillingForm} />
            <Route path="/BillingForm" component={BillingForm} />
          </Switch>
        </Dashboard>
      </Switch>
    </Router>
  );
}

export default App;
