import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,

    // `link` replaces `url`, allows nulls and enforces uniqueness when present
    link: {
      type: String,
      unique: true,
      sparse: true,   // allows multiple nulls
      default: null,
    },

    image_url: String,
    publishedAt: Date,
    author: String,

    source_name: String,
    source_url: String,
    source_icon: String,

    category: String,
    country: String,

    // User interactions
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    viewedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const article = mongoose.models.Article || mongoose.model('Article', articleSchema);
