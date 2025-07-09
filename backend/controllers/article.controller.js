import { article as Article } from "../models/article.model.js";
import { user as User } from "../models/User.model.js";

// VIEW ARTICLE
export const markArticleAsViewed = async (req, res) => {
  try {
    const {
      link,
      title,
      description,
      image_url,
      publishedAt,
      author,
      source_name,
      source_url,
      source_icon,
      category,
      country,
    } = req.body;

    const userId = req.id;

    if (!link) {
      return res.status(400).json({
        message: "Article link is required",
        success: false,
      });
    }

    const cleanAuthor = Array.isArray(author) ? author.join(", ") : author;
    const cleanCategory = Array.isArray(category)
      ? category.join(", ")
      : category;
    const cleanCountry = Array.isArray(country) ? country.join(", ") : country;

    let article = await Article.findOne({ link });

    if (!article) {
      article = await Article.create({
        link,
        title,
        description: description || null,
        image_url: image_url || null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        author: cleanAuthor || null,
        source_name: source_name || null,
        source_url: source_url || null,
        source_icon: source_icon || null,
        category: cleanCategory || null,
        country: cleanCountry || null,
        viewedBy: [{ user: userId }],
      });
    } else {
      const alreadyViewed = article.viewedBy.some((v) => v.user.equals(userId));
      if (!alreadyViewed) {
        article.viewedBy.push({ user: userId });
        await article.save();
      }
    }
    console.log("Article came to markArticleAsViewed: ", {
      link,
      title,
      description: description || null,
      image_url: image_url || null,
      publishedAt: publishedAt ? new Date(publishedAt) : null,
      author: cleanAuthor || null,
      source_name: source_name || null,
      source_url: source_url || null,
      source_icon: source_icon || null,
      category: cleanCategory || null,
      country: cleanCountry || null,
      viewedBy: [{ user: userId }],
    });
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const alreadyInHistory = user.history.some(
      (entry) => entry.article.toString() === article._id.toString()
    );

    if (!alreadyInHistory) {
      user.history.push({ article: article._id, viewedAt: new Date() });
      await user.save();
    }

    res.status(200).json({
      message: "Article marked as viewed",
      success: true,
      articleId: article._id,
    });
  } catch (error) {
    console.error("Error viewing article:", error);
    res.status(500).json({
      message: "Internal server error while viewing article",
      success: false,
    });
  }
};

// LIKE / UNLIKE
export const likeArticle = async (req, res) => {
  try {
    const { articleId } = req.body;
    const userId = req.id;

    const article = await Article.findById(articleId);
    const user = await User.findById(userId);

    if (!article || !user) {
      return res
        .status(404)
        .json({ message: "User or Article not found", success: false });
    }

    const alreadyLiked = article.likedBy.includes(userId);

    if (alreadyLiked) {
      article.likedBy.pull(userId);
      user.likedArticles.pull(articleId);
    } else {
      article.likedBy.push(userId);
      user.likedArticles.push(articleId);
    }

    await article.save();
    await user.save();

    res.status(200).json({
      message: alreadyLiked ? "Article unliked" : "Article liked",
      success: true,
    });
  } catch (error) {
    console.error("Error liking/unliking article:", error);
    res.status(500).json({
      message: "Internal server error while liking/unliking",
      success: false,
    });
  }
};

// BOOKMARK / UNBOOKMARK
export const bookmarkArticle = async (req, res) => {
  try {
    const { articleId } = req.body;
    const userId = req.id;

    const article = await Article.findById(articleId);
    const user = await User.findById(userId);

    if (!article || !user) {
      return res
        .status(404)
        .json({ message: "User or Article not found", success: false });
    }

    const alreadyBookmarked = article.savedBy.includes(userId);

    if (alreadyBookmarked) {
      article.savedBy.pull(userId);
      user.bookmarks.pull(articleId);
    } else {
      article.savedBy.push(userId);
      user.bookmarks.push(articleId);
    }

    await article.save();
    await user.save();

    res.status(200).json({
      message: alreadyBookmarked
        ? "Article unbookmarked"
        : "Article bookmarked",
      success: true,
    });
  } catch (error) {
    console.error("Error bookmarking/unbookmarking article:", error);
    res.status(500).json({
      message: "Internal server error while bookmarking/unbookmarking",
      success: false,
    });
  }
};

// GET LIKES
export const getLikes = async (req, res) => {
  try {
    const user = await User.findById(req.id).populate("likedArticles");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({
      success: true,
      articles: user.likedArticles,
      message: "Liked articles fetched successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching liked articles", success: false });
  }
};

// GET BOOKMARKS
export const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.id).populate("bookmarks");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({
      success: true,
      articles: user.bookmarks,
      message: "Bookmarked articles fetched successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching bookmarked articles", success: false });
  }
};

// GET HISTORY
export const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.id).populate("history.article");

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Filter out null or unpopulated articles
    const articles = user.history
      .filter((entry) => entry.article && entry.article._doc)
      .map((entry) => ({
        ...entry.article._doc,
        viewedAt: entry.viewedAt,
      }));

    res.status(200).json({
      success: true,
      articles,
      message: "History fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Error fetching history", success: false });
  }
};

export const addComment = async (req, res) => {
try {
  
} catch (error) {
  
}
}
