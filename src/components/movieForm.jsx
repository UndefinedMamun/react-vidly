import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { getGenres } from "./../services/genreService";
import * as MovieService from "./../services/movieService";

class MovieForm extends Form {
  state = {
    data: {
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: ""
    },
    genres: [],
    errors: {}
  };
  schema = {
    _id: Joi.string(),
    title: Joi.string()
      .required()
      .label("Titile"),
    genreId: Joi.string()
      .required()
      .label("Genre"),
    numberInStock: Joi.number()
      .greater(-1)
      .required()
      .label("Number In Stock"),
    dailyRentalRate: Joi.number()
      .greater(0)
      .required()
      .label("Daily Rental Rate")
  };

  doSubmit = async () => {
    await MovieService.saveMovie(this.state.data);

    this.props.history.replace("/movies");
  };

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async populateMovies() {
    const movieId = this.props.match.params.id;
    if (movieId === "new") return;

    try {
      const { data: movie } = await MovieService.getMovie(movieId);
      this.setState({ data: this.mapToViewModel(movie) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  componentDidMount() {
    this.populateGenres();
    this.populateMovies();
  }

  mapToViewModel(movie) {
    return {
      _id: movie._id,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate
    };
  }

  render() {
    return (
      <div>
        <h2>Movie Forms</h2>
        <form onSubmit={this.handleSubmit}>
          {this.createInput("title", "Title")}
          {this.createSelect("genreId", "Genre", this.state.genres)}
          {this.createInput("numberInStock", "Number in stock")}
          {this.createInput("dailyRentalRate", "Daily Rental Rate")}
          {this.createSubmit("Save")}
        </form>
      </div>
    );
  }
}

export default MovieForm;
