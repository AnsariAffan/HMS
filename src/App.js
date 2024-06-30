import "./App.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";

import About from "./components/About";
import Usercalender from "./components/Usercalender";
import Usertable from "./components/Usertable";
import UserForm from "./components/UserForm";
import UserDashboard from "./components/UserDashboard";
import "./index.css";
import "./components/calendar.css";
import "./components/Dashboard.css";
import "./components/Usertable.css";
import "./components/UserDashboard.css"
import "./components/Usertable.css"
import "./App.css"
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom";



function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
          <Dashboard><UserDashboard/></Dashboard>
          </Route>
          <Route path="/about">
            <About />
          </Route>
          
          <Route path="/Usertable">
            <Dashboard><Usertable/></Dashboard>
          </Route>
          <Route path="/UserForm">
            <Dashboard><UserForm/></Dashboard>
          </Route>
          <Route path={`/pateint/:id`}>
            <Dashboard><UserForm/></Dashboard>
          </Route>

        </Switch>
        </BrowserRouter>
    </>
  );
}

export default App;
