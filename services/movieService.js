const Movie = require('../models/Movie');
const { client, subscriber } = require('../config/redis');

class MovieService {
  // async createMovie(movieData) {
  //   const movie = new Movie(movieData);
  //   await movie.save();
  //   await this.clearMoviesCache();
  //   return movie;
  // }
  async createMovie(movieData) {
  const { name, genre, price } = movieData;
  if (!name || !genre || !price) {
    throw new Error('Name, genre, and price are required');
  }
  const movie = new Movie({ name, genre, price });
  await movie.save();
  await this.clearMoviesCache();
  return movie;
}


  async updateMovie(id, updateData) {
    const movie = await Movie.findByIdAndUpdate(id, updateData, { new: true });
    if (!movie) {
      throw new Error('Movie not found');
    }
    await this.clearMoviesCache();
    return movie;
  }

  async deleteMovie(id) {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) {
      throw new Error('Movie not found');
    }
    await this.clearMoviesCache();
    return movie;
  }

  async getAllMovies() {
    try {
      const cached = await client.get('movies:all');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Redis error:', error);
    }

    const movies = await Movie.find();
    
    try {
      await client.setEx('movies:all', 300, JSON.stringify(movies));
    } catch (error) {
      console.error('Redis cache error:', error);
    }

    return movies;
  }

  async getMovieById(id) {
    const movie = await Movie.findById(id);
    if (!movie) {
      throw new Error('Movie not found');
    }
    return movie;
  }

  async clearMoviesCache() {
    try {
      await client.del('movies:all');
    } catch (error) {
      console.error('Redis cache clear error:', error);
    }
  }

  async subscribeToSeatUpdates() {
    await subscriber.subscribe('SEAT_BOOKED', async (message) => {
      try {
        const { movieId, seatsBooked } = JSON.parse(message);
        await this.updateAvailableSeats(movieId, seatsBooked);
      } catch (error) {
        console.error('Error processing seat update:', error);
      }
    });
  }

  async updateAvailableSeats(movieId, seatsBooked) {
    const movie = await Movie.findById(movieId);
    if (movie) {
      movie.availableSeats = Math.max(0, movie.availableSeats - seatsBooked);
      await movie.save();
      await this.clearMoviesCache();
      
      if (movie.availableSeats === 0) {
        await client.publish('MOVIE_FULL_HOUSE', JSON.stringify({ movieId, movieName: movie.name }));
      }
    }
  }
}

module.exports = new MovieService();