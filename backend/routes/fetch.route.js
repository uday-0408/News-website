import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { fetchArticles } from '../controllers/fetch.controller.js';

const router = express.Router();

router.get('/fetch', isAuthenticated, fetchArticles);

export default router;
