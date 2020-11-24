/**
 * @module WatchList
 * @class
 * @description it's render user watchlist so expecting its id injected to url
 * 
 * 
 * PLEASE GIVE THE APP PERMISSION TO ACCESS WATCHLIST COLLECTION
 * 
 * 
 */

import React, { Component } from 'react'
import { Container } from 'react-bootstrap';
import firebase from 'firebase';

import NavBar from './NavBar';
import GenreContainer from './GenreContainer';

interface wlProps {
  match: {
    params: {
      id: string;
    }
  };
  auth: boolean;
  id: string
}

export default class WatchList extends Component<wlProps> {

  state: {
    movies: any[];
  }

  constructor(props: wlProps) {
    super(props);
    this.state = {
      movies: []
    }
  }

  /**
   * @method
   * @description - this method connects to database, check watchlist existence for this user, if user doesn't have watchlist it returns, else it updates state movies with watchlist movies array
   */
  fetchWatchlistMovies = () => { 
    const user = firebase.auth().currentUser;
    const id = this.props.id;
    if (typeof id === 'string') {
      const db = firebase.firestore().collection("watchlist").doc(id);
      db.get()
        .then(watchList => {
          console.log(watchList);
          if (!watchList.exists) {

            return;
          } else {
            const data = watchList.data();
            let movies: any[];
            if (typeof data === 'object') {
              movies = [...data.list]
              this.setState({
                movies: [...movies]
              })
            }
          }
        })
        .catch(err => {
            alert('Oops! something went wrong.');
        });
    } else {
      return;
    }
  };
  
  componentDidMount() { 
    this.fetchWatchlistMovies();
  };
  
  render() {
    const user = firebase.auth().currentUser;
    let show;
    if (this.state.movies.length > 0) {
      show = (
        <Container className="m-5" fluid >
            <GenreContainer title={'My watchlist'} movies={this.state.movies} id ={this.props.id} watchlist={() => { }} />
        </Container>  
      )
    } else {
      show = (
        <h1 className = "m-5">You don't have a watchlist yet</h1>
      )
    }
    return (
      <div>
        <NavBar auth={this.props.auth} sort={null} search={null} content={this.props.id? true : false} id={this.props.id} showDropdown={false} />
        {show}
      </div>
    )
  }
}
