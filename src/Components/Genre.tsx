import React, { Component } from 'react'
import firebase from 'firebase';
import { Container } from 'react-bootstrap';

import GenreContainer from './GenreContainer';
import NavBar from './NavBar';

interface genreProps {
  match: {
    params: {
      name: string;
    }
  };
  watchlist: Function;
  auth: boolean;
  id: string
}

export default class Genre extends Component<genreProps> {

  state: {
    movies: any[],
    moviesToView: any[]
  }
  constructor(props: genreProps) {
    super(props);
    this.state = {
      movies: [],
      moviesToView: []
    }
  }
  
  /**
   * @method fetchGenreMovies
   * @description this method retrieve movies of certain genre then update states object by changing movies and moviesToView
   */
  
  fetchGenreMovies = () => { 
    const db = firebase.firestore()
    db.collection('movies').where('genres', 'array-contains', this.props.match.params.name)
      .get()
      .then(cursors => {
        let movies: object[] = [];
        cursors.forEach(cursor => {
          const data = cursor.data();
          const movie = {...data}
          Object.defineProperty(movie, 'id', {
            value: cursor.id
          })
          movies.push(movie);
        });
        this.setState({
          movies,
          moviesToView: movies
        })
      })
      .catch(err => {
        console.log(err);
      });

  };

  /**
   * @method onSearch
   * @description this method filter genre movies on changing the search box input value then update state moviesToView
   * @param e - event of changing search input box
   */

  onSearch = (e: React.ChangeEvent<HTMLInputElement>) => { 
    if (!e.target.value) {
      this.setState({
        moviesToView: this.state.movies
      })
    } else {
      const movies = this.state.movies;
      const filteredMovies = movies.filter((movie) => { 
        return movie.title.match(new RegExp(e.target.value, 'gi'));
      });
      this.setState({
        moviesToView: filteredMovies
      })
    }
  };

  /**
   * @method onSorting
   * @description this method expects event of changing dropdown list with values 'Ascend' | 'Descend' then update state moviesToView
   * @param e 
   */
  
  onSorting = (e: React.ChangeEvent<HTMLSelectElement>) => { 
    let type: string = e.target.value;
    const movies = this.state.moviesToView;
    let sortedMovies: object[] = [];
    if (type === 'Ascend') {
       sortedMovies = movies.sort((a, b) => { 
        return a.year - b.year;
      });
      
    } else if(type === 'Descend') {
      sortedMovies = movies.sort((a, b) => { 
        return b.year - a.year;
      });
    } else {
      sortedMovies = this.state.movies;
    }
    this.setState({
      moviesToView: sortedMovies
    })
  };

  componentDidMount() { 
    this.fetchGenreMovies();
  };


  render() {
      return (
        <div>
          <NavBar content={this.props.id? true : false} id={this.props.id} showDropdown={true} search={this.onSearch} sort={this.onSorting} auth={this.props.auth} />
          <Container className="m-5" fluid >
            <GenreContainer title={this.props.match.params.name} movies={this.state.moviesToView} watchlist={this.props.watchlist} id={ this.props.id}/>
          </Container>
        </div>
      ) 
  }
}
