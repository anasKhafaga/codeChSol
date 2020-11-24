/**
 * @module GenreContainer
 * @class
 * @description this class occupies a space for single row which contains four movies of the genre, it expects genre titles, watchlist function to be passed finally to single movie card and assigned to its button and movieRow array which contains 4 movies.
 */

import React, { Component } from 'react'
import MovieCard from './MovieCard';
import { Row } from 'react-bootstrap';

interface grProps {
  movieRow: any[]
  watchlist: Function;
  title: string;
  id: string;
}

export default class GenreRow extends Component<grProps> {
  render() {
    let movieCols = this.props.movieRow.map((movie) => {
      return (
        <MovieCard title={this.props.title} movie={movie} key={movie.id} watchlist={this.props.watchlist} id={this.props.id}/>
      )
     });
    return (
      <Row className='mb-3' >
        {movieCols}
      </Row>
    )
  }
}
