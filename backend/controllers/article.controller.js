import { article as Article } from "../models/article.model.js";
import { user as User } from "../models/User.model.js";

export const markArticleAsViewed = async (req, res) => {
  try {
    const {
      url,
      title,
      description,
      content,
      imageUrl,
      publishedAt,
      author,
      source,
      category,
      country,
    } = req.body;

    const userId = req.id;

    let article = await Article.findOne({ url });

    if (!article) {
      article = await Article.create({
        url,
        title,
        description,
        content,
        imageUrl,
        publishedAt: new Date(publishedAt),
        author,
        source,
        category,
        country,
        viewedBy: [{ user: userId }],
      });
    } else {
      const alreadyViewed = article.viewedBy.some((v) => v.user.equals(userId));
      if (!alreadyViewed) {
        article.viewedBy.push({ user: userId });
        await article.save();
      }
    }

    const user = await User.findById(userId);
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
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
