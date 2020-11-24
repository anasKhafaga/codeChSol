/**
 * @module MovieCard
 * @class
 * @description - this component renders single movie card which will be building block of GenreRow component > GenreContainer, it expects props of movie, [genre title or watchlist title] to prevent rendering 'Add to my Watchlist' button with watchlist itself and watchlist function to be assigned to 'Add to my Watchlist' button if exists.
 */

import React, { Component } from 'react'
import { Card, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';

interface movieCaProps {
  movie: any;
  watchlist: Function;
  title: string;
  id: string;
}

export default class MovieCard extends Component<movieCaProps> {

  state: {
    redirect: boolean;
  }
  
  constructor(props: movieCaProps) {
    super(props);
    this.state = {
      redirect: false
    }
  }

  remove = (movie: object) => {
    const id = this.props.id;
    const db = firebase.firestore().collection("watchlist")
    db.doc(id).update({
      list: firebase.firestore.FieldValue.arrayRemove(movie)
    }).then(() => {
      this.setState({
        redirect: true
      })
    })
  }
  
  render() {
    if (this.state.redirect) {
      const id = this.props.id;
      return (
        <Redirect to={{
          pathname: `/watchlist/${this.props.id}`,
          state: { id }
        }}/>
      )
    }
    let show;
    if (this.props.title === 'My watchlist') {
      show = <Button variant="danger" onClick={this.remove.bind(this, this.props.movie)}>Remove from my Watchlist</Button>;
    } else {
      show = (
        <Button variant="primary" onClick={this.props.watchlist.bind(this, this.props.movie)}>Add to my Watchlist</Button>
      )
    }
    return (
      <Col style={{marginRight: '10'}} >
        <Card style={{ width: '250px', height: '400px', marginRight: '200px' }} >
          <Link to={{
            pathname: `/movies/${this.props.movie.id}`,
            state: {id: this.props.id}
          }}>
          <Card.Img height="250px" width="250px" variant="top" src={this.props.movie.posterurl} />
          <Card.Body>
            <Card.Title>{ this.props.movie.title}</Card.Title>
            <Card.Text>
              { this.props.movie.year}
            </Card.Text>
          </Card.Body>
          </Link>
          {show}
        </Card>
      </Col>
    )
  }
}
