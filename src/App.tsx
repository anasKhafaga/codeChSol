/**
 * @module App
 * @class
 * @description in this module we intialize firebase app, list all app routes using react router dom
 */

import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import firebase from 'firebase';

import {firebaseConfig} from './constants/firebase';
import {Genre, HomePage, Login, Movie, WatchList, Signup} from './Components';


import "./styles.css";

firebase.initializeApp(firebaseConfig);


interface hpProps {
  location: {
    state: {
      id: string;
    }
  }
}

export default class App extends Component { 

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login" component={(props: object)=> <Login {...props} auth={localStorage.getItem('userId')? true : false}/>} />
          <Route path="/signup" component={(props: object)=> <Signup {...props} auth={localStorage.getItem('userId')? true : false}/>} />
          <Route path="/" component={(props: hpProps) => <HomePage {...props} auth={localStorage.getItem('userId') ? true : false} />} />
        </Switch>
      </Router>
    )
  }
};
