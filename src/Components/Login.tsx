/**
 * @module Login
 * @class
 * @description it's login route handler, expects auth status sothat any logged in user will be redirected to homepage route instead
 */

import React, { Component } from 'react'
import firebase from 'firebase';
import { Form, Button } from 'react-bootstrap';
import NavBar from './NavBar';
import { Redirect } from 'react-router-dom';


type loginProps = {
  auth: boolean;
};

export default class Login extends Component<loginProps> {

  state: {
    email: string;
    password: string;
    redirect: boolean;
    id: string;
  }
  
  constructor(props: loginProps) { 
    super(props);
    this.state = {
      email: '',
      password: '',
      redirect: false,
      id: ''
    }
  };

  /**
   * @method emailChange
   * @param e - event of email input change
   * @description updates email state with every change
   */
  emailChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    this.setState({
      email: e.target.value
    })
  }
  /**
   * @method passChange
   * @param e - event of password input change
   * @description updates password state with every change
   */
  passChange = (e: React.ChangeEvent<HTMLInputElement>) => { 
    this.setState({
      password: e.target.value
    })
  };
  
  /**
   * @method loginFirebaseUser
   * @param e - click event of login button 
   * @description this method connect to database and login with credintials using component state email and password then redirect the user to homepage, if there's authentication error it shows alert message
   */
  loginFirebaseUser = (e: React.MouseEvent<HTMLButtonElement>) => { 
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => { 
        if (user) {
          const id = user.user?.uid;
          if (typeof id === 'string') {
            localStorage.setItem('userId', id);
            this.setState({
              id,
              redirect: true
            })
          } else {
          } 
        } else {
          window.location.reload();
        }
      })
      .catch(err => { 
        alert(err.message);
      });
  };
  
  render() {
    if (this.props.auth || this.state.redirect) {
      let id;
      if (!this.state.id) {
        id = localStorage.getItem('userId');
      } else {
        id = this.state.id;
      }
      return (
        <Redirect to={{
          pathname: '/',
          state: { id: id },
          }}/>
      )
    } else {
      return (
        <div>
        <NavBar auth={this.props.auth} sort={null} search={null} content={localStorage.getItem('userId')? true : false} id={localStorage.getItem('userId')} showDropdown={false} />
          <div className="row justify-content-md-center mt-5">
          <Form className="col-md-4">
            <Form.Group  controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange ={this.emailChange} />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
  
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange = {this.passChange} />
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" type="submit" onClick = {this.loginFirebaseUser}>
              Login
            </Button>
          </Form>
        </div>
        </div>
      )
    }
  }
}
