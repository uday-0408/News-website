import axios from 'axios';
import { user as User } from '../models/User.model.js';

export const fetchArticles = async (req, res) => {
  try {
    const userId = req.id;
    const { category = 'general', country = 'in', page = 1 } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const apiKey = process.env.NEWS_API_KEY;
    const apiUrl = `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&page=${page}&pageSize=20&apiKey=${apiKey}`;

    const response = await axios.get(apiUrl);

    res.status(200).json({
      success: true,
      articles: response.data.articles,
      totalResults: response.data.totalResults,
      message: "Articles fetched successfully",
    });

  } catch (error) {
    console.error("Error fetching articles:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching articles",
    });
  }
};
