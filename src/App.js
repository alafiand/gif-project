import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Editor from "./components/Editor";
import Welcome from "./components/Welcome";

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route path="/editor" component={Editor} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
