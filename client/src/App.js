import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Register from "./components/Register";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";
import Portfolio from "./components/Portfolio";
import History from "./components/History";

class App extends Component {
  render() {
    return (
      <Router>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Switch>
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/history" component={History} />
          <PrivateRoute exact path="/portfolio" component={Portfolio} />
        </Switch>
      </Router>
    );
  }
}
export default App;
