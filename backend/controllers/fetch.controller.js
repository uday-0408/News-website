import axios from "axios";
import { user as User } from "../models/User.model.js";
import {
  VALID_CATEGORIES,
  COUNTRY_CODES,
  LANGUAGE_CODES,
} from "../utils/sample_parameters.js";

export const fetchArticles = async (req, res) => {
  try {
    const userId = req.id;
    const {
      category = "top",
      country = "in",
      articleSize = 10,
      language = "en",
      page_id = null,
    } = req.query;

    // Validate
    if (!VALID_CATEGORIES.includes(category.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid category: "${category}". Valid: ${VALID_CATEGORIES.join(
          ", "
        )}`,
      });
    }

    const validCountryCodes = Object.values(COUNTRY_CODES);
    if (!validCountryCodes.includes(country.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid country code: "${country}".`,
      });
    }

    const validLangCodes = Object.values(LANGUAGE_CODES);
    if (language && !validLangCodes.includes(language.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid language code: "${language}".`,
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const apiKey = process.env.API_KEY;
    let fetchedArticles = [];
    let nextPageToken =
      typeof page_id === "string" && page_id !== "true" && page_id.length > 0
        ? page_id
        : null;

    while (fetchedArticles.length < articleSize) {
      let apiUrl = `https://newsdata.io/api/1/latest?apikey=${apiKey}&country=${country}&category=${category}&language=${language}`;
      if (nextPageToken) apiUrl += `&page=${nextPageToken}`;

      console.log("Fetching from:", apiUrl);
      const response = await axios.get(apiUrl);
      const results = response.data.results || [];

      if (results.length === 0) break;

      fetchedArticles.push(...results);
      nextPageToken = response.data.nextPage;

      if (!nextPageToken || results.length < 10) break;
    }

    const normalizedArticles = fetchedArticles
      .slice(0, articleSize)
      .map((a) => ({
        link: a.link || null,
        title: a.title || "",
        description: a.description || "",
        image_url: a.image_url || null,
        publishedAt: a.pubDate ? new Date(a.pubDate) : null,
        author: a.creator
          ? Array.isArray(a.creator)
            ? a.creator.join(", ")
            : a.creator
          : null,
        source_name: a.source_name || a.source_id || null,
        source_url: a.source_url || a.link || null,
        source_icon: a.source_icon || null,
        category: Array.isArray(a.category)
          ? a.category.join(", ")
          : a.category || category,
        country: Array.isArray(a.country)
          ? a.country.join(", ")
          : a.country || country,
      }));

    res.status(200).json({
      success: true,
      articles: normalizedArticles,
      totalResults: normalizedArticles.length,
      message: "Articles fetched successfully",
      page_id: nextPageToken || null,
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
