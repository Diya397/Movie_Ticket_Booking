const express = require('express');
const movieController = require('../controllers/movieController');
const { extractUser, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// PUBLIC ROUTES - NO TOKEN REQUIRED
router.get('/', movieController.getAllMovies);
router.get('/movies/:id', movieController.getMovieById);

// ADMIN ROUTES (TOKEN + ADMIN ONLY)
router.post('/', extractUser, requireAdmin, movieController.createMovie);
router.put('/:id', extractUser, requireAdmin, movieController.updateMovie);
router.delete('/:id', extractUser, requireAdmin, movieController.deleteMovie);

module.exports = router;
