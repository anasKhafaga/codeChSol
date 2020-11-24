/**
 * @module NavBar
 * @class
 * @description this component rener custom navigation bar according to auth status - [genre page to render search and dropdown box / not], it expects props of userId [to terminate its session], showDropdown boolean [to render search and dropdown boxes], sort - search [functions passed from Genre component], auth boolean
 */

import React, { Component } from 'react'
import { Nav, Form, FormControl, Navbar } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import firebase from 'firebase'

type NavProps = {
  content: boolean;
  id: (string | null);
  showDropdown: boolean;
  sort: any;
  search: any;
  auth: boolean;
}

export default class NavBar extends Component<NavProps> {

  state: {
    logout: boolean;
  }
  constructor(props:NavProps) {
    super(props)
    this.state = {
      logout: false
    }
  }

  /**
   * @method logout
   * @description this method implements logout flow
   */
  logout = () => { 
    firebase.auth().signOut()
      .then(() => {
        localStorage.removeItem("userId");
        this.setState({
          logout: true
        })
      })
      .catch(function (error) {
        console.log(error)
        alert('Oops! something went wrong.');
    });
  };
  
  render() {
    if (this.state.logout) {
      return (
        <Redirect to={{
          pathname: '/login'
        }} />
      )
    }
    let show;
    let showDropdown = null;
    if (!this.props.content) {
      show = (
          <Nav className="mr-auto">
            <Nav.Link>
              <Link to="/login">Login</Link>
            </Nav.Link>
          </Nav>
      )
    } else {
      if (this.props.showDropdown) {
        if (typeof this.props.sort === 'function' && typeof this.props.search === 'function') {
          showDropdown = (
            <Form inline className="ml-5">
              <select name="order" className="custom-select mr-3" onChange={this.props.sort}  >
                <option value="order" selected>order...</option>
                <option value="Ascend">Ascend</option>
                <option value="Descend">Descend</option>
              </select>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={this.props.search} />
              </Form>
          )
        }
      }
      show = (
        <div>
          <Nav className="mr-auto">
            <Nav.Link>
              <Link to={{
              pathname: `/watchlist/${this.props.id}`,
              state: {id: this.props.id}
            }}>Watchlist</Link>
            </Nav.Link>
            {showDropdown}
          </Nav>
        </div>
      )
    }
    if (this.props.auth) {
      return (
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>
            <Link to={{
              pathname: '/',
              state: {id: this.props.id}
            }}>Home Page</Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {show}
            <Nav.Link onClick={this.logout}>
              Logout
            </Nav.Link>
          </Navbar.Collapse>
        </Navbar>
      ); 
    } else {
      return (
         <Navbar bg="light" expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link>
              <Link to="/login">Login</Link>
            </Nav.Link>
            <Nav.Link >
              <Link to="/signup">Signup</Link>
            </Nav.Link>
          </Nav>
          </Navbar.Collapse>
        </Navbar>
      )
    }
  }
}
