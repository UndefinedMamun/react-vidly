import React, { Component } from "react";
import { getMovies, deleteMovie } from "./../services/movieService";
import { getGenres } from "./../services/genreService";

import Pagination from "./common/pagination";
import { paginate } from "./../utils/paginate";
import ListGroup from "./common/listGroup";
import Search from "./common/search";
import MoviesTable from "./moviesTable";
import _ from "lodash";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currentPage: 1,
    sortColumn: { path: "title", order: "asc" },
    selectedGenre: null,
    searchQuery: ""
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ _id: "", name: "All Genres" }, ...data];

    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }

  handleDelete = async movie => {
    let originalMovies = this.state.movies;
    let movies = originalMovies.filter(m => m._id !== movie._id);
    this.setState({ movies });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie is already been deleted");

      this.setState({ movies: originalMovies });
    }
  };

  handleLike = movie => {
    let movies = [...this.state.movies];
    let index = movies.indexOf(movie);
    movies[index].liked = !movies[index].liked;
    this.setState(movies);
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({
      selectedGenre: genre,
      currentPage: 1,
      searchQuery: ""
    });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  search = query => {
    this.setState({ selectedGenre: null, searchQuery: query, currentPage: 1 });
  };

  getPageData = () => {
    const {
      pageSize,
      selectedGenre,
      sortColumn,
      currentPage,
      movies: allMovies,
      searchQuery
    } = this.state;

    let filtered = allMovies;

    if (searchQuery) {
      filtered = filtered.filter(m => {
        return m.title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    } else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const {
      pageSize,
      selectedGenre,
      sortColumn,
      currentPage,
      movies: allMovies,
      searchQuery
    } = this.state;

    const { user } = this.props;

    const { data: movies, totalCount } = this.getPageData();

    if (!allMovies.length) return <p>There is no Movie!</p>;

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            onItemSelect={this.handleGenreSelect}
            items={this.state.genres}
            selectedItem={selectedGenre}
          />
        </div>
        <div className="col">
          {user && (
            <Link to="/movies/new" className="btn btn-primary mb-2">
              New Movie
            </Link>
          )}
          <p>We have {totalCount} movie in the list.</p>
          <Search value={searchQuery} onChange={this.search} />
          <MoviesTable
            sortColumn={sortColumn}
            movies={movies}
            onDelete={this.handleDelete}
            onLike={this.handleLike}
            onSort={this.handleSort}
          />

          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
            itemsCount={totalCount}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
