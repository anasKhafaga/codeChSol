/**
 * @module GenreContainer
 * @class
 * @description this class expects props of genre title, movies and function for retrieving user watchlist movies to be passed finally to single movie card to be assigned to add movie to my watchlist, the class occupy a space for single genre representation
 */

import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap';
import GenreRow from './GenreRow';
import { Link } from 'react-router-dom';

interface gCProps {
  title: string;
  movies: any[];
  watchlist: Function;
  id: string
}

export default class GenreContainer extends Component<gCProps> {
  constructor(props:gCProps) { 
    super(props);
  };

  /**
   * @method render
   * @description this method divide retrieved movies array into arrays each is 4 elements to be passed and viewd per row
   */
  render() {
    let genreRows: any[] = [];
    let i: number = 0;
    let editableMovies = [...this.props.movies];

    if (window.matchMedia("(max-width: 400px)").matches) {
      while ( i < editableMovies.length) {
        genreRows.push(editableMovies.splice(0, 1) );
        i++
      }
    } else if (window.matchMedia("(max-width: 600px)").matches) {
      while ( i < editableMovies.length) {
        genreRows.push(editableMovies.splice(0, 2) );
        i++
      }
    } else {
      while ( i < editableMovies.length) {
        genreRows.push(editableMovies.splice(0, 4) );
        i++
      }
    }
    let movieRows = genreRows.map((genreRow) => {
      return (
        <GenreRow movieRow={genreRow} watchlist={ this.props.watchlist} title={this.props.title} id = {this.props.id} />
      )
    });
    return (
      <Row className="mb-5">
        <h2 className="mb-4 mt-4">
          <Link to={{
            pathname: `/movies/genre/${this.props.title}`,
            state: {id: this.props.id}
          }}>
            {this.props.title}
          </Link>
        </h2>
        {movieRows}
      </Row>
    )
  }
}
