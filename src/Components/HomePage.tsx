/**
 * @module HomePage
 * @class
 * @description this class contains methods for retrieving all movies from collection, group them by genres and rener them in rows - it expects in props > auth which indicates user login state
 */

import React, { Component } from 'react'
import firebase from 'firebase';
import { Container } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import { Route, Switch, Redirect } from 'react-router-dom';

import GenreContainer from './GenreContainer';
import Genre from './Genre';
import Movie from './Movie';
import WatchList from './WatchList';
import NavBar from './NavBar';

interface hpProps {
  auth: boolean;
  location: {
    state: {
      id: string
    }
  }
}
interface movieSchema {
  genres: string[]
}
interface routerPropsG {
  match: {
    params: {
      name: string;
    }
  };
  id: string
}
interface routerPropsM {
  match: {
    params: {
      id: string;
    }
  };
  id: string;
}

export default class HomePage extends Component<hpProps> {

  state: {
    movies: object[];
    genres: object[];
    genreGroups: object[];
    redirect: boolean;
  }
  
  constructor(props: hpProps) {
    super(props);
    this.state = {
      movies: [],
      genres: [],
      genreGroups: [],
      redirect: false
    }
  };

  checkExistence = async (id: string, db: any) => {
    let watchlist = false;
    console.log(id, db)
      await db.doc(id).get()
        .then((cursor: any) => {
          if (cursor.exists) {
            console.log('YES')
              watchlist = true;
          }
          }).catch((err: object) => alert(err))
    return watchlist;
  }
  
  /**
   * @method addMovieToWatchlist
   * @param movie - movie to be added to watchlist array
   * @description - this method enables user to create its watchlist or add new one if not exist - this method will be assigned finally to 'Add to my Watchlist' button in MovieCard and Movie components but it's declared here as it may reach these components through different routes components [Genre, Homepage, Movie] - then it redirects user to his watchlist route
   * 
   * PLEASE GIVE THE APP PERMISSION TO ACCESS WATCHLIST COLLECTION
   * 
   */  
  addMovieToWatchlist = async (movie: object) => {
      const id = this.props.location.state.id;
      const db = firebase.firestore().collection("watchlist")
      try {
        const check = await this.checkExistence(id, db);
        if (!check) {
          db.doc(id)
            .set({
            list: [movie]
          })
            .then(() => {
              console.log('Successfully created');
              alert('Successfully Added')
            })
        } else {
          db.doc(id).update({
            list: firebase.firestore.FieldValue.arrayUnion(movie)
          }).then(() => {
              console.log('Successfully updated');
            alert('Successfully Added');
            })
        }
      } catch (err) {
        console.log(err)
      }
  };
  
  /**
   * @method groupMoviesByGenre
   * @param genres - array of all genres stored in database
   * @param movies - array of all retrieved movies
   * @returns array of key-value pairs where key is genre and value is array of its movies
   */
  
  groupMoviesByGenre = (genres: string[], movies: any): object[] => {
    
    let genreGroups: object[] =[];

    genres.forEach(genre => {
      /**
       * @callback filterFun
       * @param movie
       * @description this callback will be passed as an argument for movies array filter method
       */
      function filterFun(movie: movieSchema) { 
          if (movie.genres.indexOf(genre) > -1) {
          return true;
        } else {
          return false;
        }
      };
      const movieGroup = movies.filter(filterFun);
      genreGroups.push({
        [genre]: movieGroup
      })
    });

    return genreGroups;
  };
  
  /**
   * @method componentDidMount
   * @description in this method of component lifecycle we connect to database, retrieve all movies, add movie id to its data object, create genres array with no repetition and update component state
   */
  componentDidMount() { 
    if (!this.props.location.state) {
      return;
    }
    const db = firebase.firestore();
    let movies: object[];
    let genres: string[];
    movies = [];
    genres = [];

    db.collection('movies').get()
      .then(cursors => { 
        cursors.forEach(cursor => {
          const data = cursor.data();
          const movie = {...data}
          Object.defineProperty(movie, 'id', {
            value: cursor.id
          })
          movies.push(movie);
          movie.genres.forEach((ele: string) => {

            if (genres.indexOf(ele) > -1) {
              return;
            }

            genres.push(ele);
            
          });
        }); 
        const genreGrouping = this.groupMoviesByGenre(genres, movies);
        this.setState({
          movies: [...movies],
          genres: [...genres],
          genreGroups: [...genreGrouping]
        })
      })
      .catch(err => { 
        alert('Oops! Something went wrong');
      });
  };
  
  /**
   * @method render
   * @description we check user login status and redirect user to login page if not before rendering anything
   */
  render() {
    const user = firebase.auth().currentUser;
    if (!this.props.location.state) {
      if (!localStorage.getItem('userId')) {
        return (
          <Redirect to={{
            pathname: '/login'
          }} />
        )
      } else {
        const path = window.location.pathname;
        const id = localStorage.getItem('userId')
        return (
          <Redirect to={{
            pathname: path,
            state: {id}
          }} />
        )
      }
    } else {
      if (!this.state.movies) {
      return (
        <div>
          Loading
        </div>     
          )
      } else {
        let genres = this.state.genreGroups.map((genreGroup:any) => {
          let title:string = '';
          let movies: object[] = [];
          for (const genreTitle in genreGroup) {
            title = genreTitle;
            movies = genreGroup[genreTitle];
          }
          return (
            <GenreContainer title={title} movies={movies} key={uuidv4()} watchlist={this.addMovieToWatchlist} id={ this.props.location.state.id}/>
          )
        })
        return (
          <Switch>
            <Route path="/" exact component={() => {
              return (
              <div>
                <NavBar sort={null} search={null} auth={this.props.location.state.id? true : false} content={this.props.location.state.id? true : false} id={this.props.location.state.id} showDropdown={false} />
                <Container className="m-5" fluid >
                  {genres}
                </Container>
              </div>
              )
            }}/>  
          <Route path="/movies/genre/:name" exact component={(props:routerPropsG)=> <Genre {...props} id={this.props.location.state.id} watchlist={this.addMovieToWatchlist} auth={this.props.location.state.id? true : false}/>} />
          <Route path="/movies/:id" exact component={(props:routerPropsM)=> <Movie  {...props} id={this.props.location.state.id} watchlist={this.addMovieToWatchlist} auth={this.props.location.state.id? true : false}/>} />
          <Route path="/watchlist/:id" component={(props: routerPropsM)=> <WatchList {...props} id={this.props.location.state.id} auth={this.props.location.state.id? true : false}/>} />
          </Switch>
        ) 
      }
    }
      
    }
}
