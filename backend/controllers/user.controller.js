import {user as User} from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required (username, email, password)",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already in use",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log(`Register Error: ${error}`);
    return res.status(500).json({
      message: "Internal server error during registration",
      error: error.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required (email, password)",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials (email)",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid credentials (password)",
        success: false,
      });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        message: `Login successful. Welcome back, ${user.username}!`,
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        token, // optional, can remove if not needed in frontend
      });
  } catch (error) {
    console.log(`Login Error: ${error}`);
    return res.status(500).json({
      message: "Internal server error during login",
      error: error.message,
    });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: true,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({
        message: "Logout successful",
        success: true,
      });
  } catch (error) {
    console.log(`Logout Error: ${error}`);
    return res.status(500).json({
      message: "Internal server error during logout",
      error: error.message,
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { username, email, phone, bio, gender, dob } = req.body;
    const file = req.file; // profile picture
    const userId = req.id; // from middleware

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Update username and phone
    if (username) user.username = username;
    if (phone) user.phone = phone;

    // Handle email update with duplicate check
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          message: "Email is already in use by another account",
          success: false,
        });
      }
      user.email = email;
    }

    // Ensure profile object exists
    if (!user.profile) user.profile = {};

    // Update profile subfields
    if (bio) user.profile.bio = bio;
    if (gender) user.profile.gender = gender;

    if (dob) {
      const parsedDob = new Date(dob);
      if (isNaN(parsedDob)) {
        return res.status(400).json({ message: "Invalid DOB format" });
      }
      user.profile.dob = parsedDob;
    }

    if (file) {
      user.profile.profilePicture = file.path;
    }

    await user.save();

    const updatedUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      profile: {
        bio: user.profile.bio || "",
        gender: user.profile.gender || "",
        dob: user.profile.dob || null,
        profilePicture: user.profile.profilePicture || "",
      },
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      message: "Internal server error during profile update",
      success: false,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        profile: user.profile,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching user profile", error: err.message });
  }
};

