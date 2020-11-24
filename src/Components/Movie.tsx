/**
 * @module Movie  
 * @class
 * @description this class expects props with dynamic value in url [movieId] and auth boolean to guard the route against unauthorized requests it render single movie details
 */

import React, { Component } from 'react'
import firebase from 'firebase';
import { Card, Button } from 'react-bootstrap';
import NavBar from './NavBar';

interface movieProps {
  match: {
    params: {
      id: string;
    }
  };
  watchlist: Function;
  auth: boolean;
  id: string;
}

export default class Movie extends Component<movieProps> {

  state: {
    movie: any;
  }
  
  constructor(props: movieProps) {
    super(props);
    this.state = {
      movie: {}
    }
  }
  
  /**
   * @method fetchMovieById
   * @param id - id injected with the url
   * @description - this method connect to firebase and retrieve a single movie from it then update state movie key with movie value
   */
  fetchMovieById = (id: string) => { 
    const db = firebase.firestore()
    db.collection('movies').doc(id).get()
      .then(cursor => {
        const data = cursor.data();
        const movie = { ...data };
        movie['id'] = cursor.id;
        this.setState({
          movie
        })
      })
      .catch(err => console.log(err));
  };
  
  componentDidMount() { 
    this.fetchMovieById(this.props.match.params.id)
  };

  
  render() {
      let headers: string[] = [];
      for (const key in this.state.movie) {
        headers.push(key);
      }
      const data = headers.map((header: string) => { 
        const value = this.state.movie[header];
        return (
          <Card.Text key={header}>
            {header}: {value}
          </Card.Text>
        )
      });
      return (
        <div>
          <NavBar auth={this.props.auth} sort={null} search={null} content={this.props.id? true : false} id={this.props.id} showDropdown={false} />
          <Card style={{ width: '50%', height: '100%', margin: 'auto' }} >
              <Card.Img variant="top" src={this.state.movie.posterurl} />
              <Card.Body>
                <Card.Title><h1>{ this.state.movie.title}</h1></Card.Title>
              {data}
                <Button variant="primary" onClick={this.props.watchlist.bind(this, this.state.movie)}>Add to my Watchlist</Button>
              </Card.Body>
            </Card>
        </div>
      )
      
  }
}
