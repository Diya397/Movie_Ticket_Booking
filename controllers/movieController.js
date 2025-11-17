const movieService = require('../services/movieService');

class MovieController {
  async createMovie(req, res, next) {
    try {
      const movie = await movieService.createMovie(req.body);
      res.status(201).json(movie);
    } catch (error) {
      next(error);
    }
  }

  async updateMovie(req, res, next) {
    try {
      const movie = await movieService.updateMovie(req.params.id, req.body);
      res.json(movie);
    } catch (error) {
      next(error);
    }
  }

  async deleteMovie(req, res, next) {
    try {
      await movieService.deleteMovie(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getAllMovies(req, res, next) {
    try {
      const movies = await movieService.getAllMovies();
      res.json(movies);
    } catch (error) {
      next(error);
    }
  }

  async getMovieById(req, res, next) {
    try {
      const movie = await movieService.getMovieById(req.params.id);
      res.json(movie);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MovieController();