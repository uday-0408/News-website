# News Website 📰

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for browsing, saving, and managing news articles with user authentication and commenting features.

## 🚀 Features

- **User Authentication**: Secure user registration and login system with JWT tokens
- **Article Management**: Browse, search, and save news articles
- **User Profiles**: Personalized user profiles with update functionality
- **Comments System**: Users can comment on articles
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Image Upload**: Support for uploading and managing images
- **Admin Panel**: Administrative interface for managing content

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Lucide React** - Icon library
- **Radix UI** - Accessible UI components

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
News_website/
├── admin/                 # Admin panel files
├── backend/              # Server-side application
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── uploads/         # Uploaded files
│   └── utils/           # Utility functions
├── frontend/            # Client-side application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── assets/      # Static assets
│   │   └── lib/         # Utility libraries
│   └── public/          # Public assets
└── package.json         # Root package configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/uday-0408/News-website.git
   cd News-website
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Environment Setup

1. **Backend Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/news_website
   JWT_SECRET=your_jwt_secret_key
   PORT=4000
   NODE_ENV=development
   ```

2. **Frontend Environment Variables (if needed)**
   
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:4000
   ```

### Running the Application

#### Development Mode

1. **Start both frontend and backend concurrently**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:4000`
   - Frontend development server on `http://localhost:5173`

#### Start Services Individually

1. **Backend only**
   ```bash
   npm run server
   ```

2. **Frontend only**
   ```bash
   npm run client
   ```

### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout

### Articles
- `GET /api/articles` - Get all articles
- `POST /api/articles` - Create new article
- `GET /api/articles/:id` - Get article by ID
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

### Comments
- `GET /api/comments/:articleId` - Get comments for article
- `POST /api/comments` - Create new comment
- `DELETE /api/comments/:id` - Delete comment

### User Profile
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🎨 UI Components

The project includes several reusable components:

- **ArticleCard** - Display article previews
- **ArticleModal** - Detailed article view
- **CommentCard** - Individual comment display
- **Navbar** - Navigation component
- **Profile** - User profile component

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in HTTP-only cookies
- Protected routes require authentication
- Middleware validates tokens on protected endpoints

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Uday Chauhan**
- GitHub: [@uday-0408](https://github.com/uday-0408)

## 🐛 Issues

If you encounter any issues, please report them [here](https://github.com/uday-0408/News-website/issues).

## 🙏 Acknowledgments

- Thanks to all contributors who helped build this project
- Inspired by modern news platforms and social media interfaces
- Built with love using the MERN stack

---

⭐ Star this repository if you found it helpful!
