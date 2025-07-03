import axios from "axios";
import { user as User } from "../models/User.model.js";
import { VALID_CATEGORIES } from "../utils/sample_parameters.js";
import { COUNTRY_CODES } from "../utils/sample_parameters.js";
import { LANGUAGE_CODES } from "../utils/sample_parameters.js"; // optional, if you plan to use it

export const fetchArticles = async (req, res) => {
  try {
    const userId = req.id;
    const {
      category = "top",
      country = "in",
      articleSize = 10,
      language = "en", // optional
    } = req.query;

    // ✅ Validate category
    if (!VALID_CATEGORIES.includes(category.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid category: "${category}". Valid categories: ${VALID_CATEGORIES.join(", ")}`,
      });
    }

    // ✅ Validate country
    const validCountryCodes = Object.values(COUNTRY_CODES);
    if (!validCountryCodes.includes(country.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid country code: "${country}".`,
      });
    }

    // ✅ Optional: Validate language if you use it
    const validLangCodes = Object.values(LANGUAGE_CODES);
    if (language && !validLangCodes.includes(language.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid language code: "${language}".`,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const apiKey = process.env.API_KEY;
    let fetchedArticles = [];
    let nextPageToken = null;

    while (fetchedArticles.length < articleSize) {
      let apiUrl = `https://newsdata.io/api/1/latest?apikey=${apiKey}&country=${country}&category=${category}&language=${language}`;
      if (nextPageToken) {
        apiUrl += `&page=${nextPageToken}`;
      }

      const response = await axios.get(apiUrl);
      const results = response.data.results || [];

      if (results.length === 0) break;

      fetchedArticles.push(...results);
      nextPageToken = response.data.nextPage;

      if (!nextPageToken || results.length < 10) break;
    }

    fetchedArticles = fetchedArticles.slice(0, articleSize);

    res.status(200).json({
      success: true,
      articles: fetchedArticles,
      totalResults: fetchedArticles.length,
      message: "Articles fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching articles:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching articles",
      error: error.message,
    });
  }
};
