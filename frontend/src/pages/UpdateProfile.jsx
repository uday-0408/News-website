import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    bio: "",
    gender: "",
    dob: "",
    profilePicture: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch current profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/user/me", {
        withCredentials: true,
      });
      const user = res.data.user;

      setForm({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.profile?.bio || "",
        gender: user.profile?.gender || "",
        dob: user.profile?.dob ? user.profile.dob.split("T")[0] : "",
        profilePicture: null,
      });

      if (user.profile?.profilePicture) {
        setPreview(
          `http://localhost:4000/${user.profile.profilePicture.replace(
            /\\/g,
            "/"
          )}`
        );
      }
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture") {
      setForm({ ...form, profilePicture: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Append text fields
      for (let key in form) {
        if (key === "profilePicture" && form[key]) {
          formData.append("file", form[key]); // 👈 Must be "file"
        } else if (form[key]) {
          formData.append(key, form[key]);
        }
      }

      const res = await axios.put(
        "http://localhost:4000/api/user/profile/update", // 👈 route
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile updated!");
      navigate("/profile");
    } catch (err) {
      console.error("Update error", err);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5 p-4 bg-white rounded shadow">
      <h2 className="text-center mb-4">✏️ Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label>Username</label>
            <input
              name="username"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label>Email</label>
            <input
              name="email"
              className="form-control"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label>Phone</label>
            <input
              name="phone"
              className="form-control"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Gender</label>
            <select
              name="gender"
              className="form-control"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option>male</option>
              <option>female</option>
              <option>other</option>
            </select>
          </div>

          <div className="col-md-6">
            <label>Date of Birth</label>
            <input
              name="dob"
              type="date"
              className="form-control"
              value={form.dob}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Bio</label>
            <textarea
              name="bio"
              className="form-control"
              value={form.bio}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label>Profile Picture</label>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              className="form-control"
              onChange={handleChange}
            />
          </div>

          {preview && (
            <div className="col-md-6 text-center">
              <label>Preview</label>
              <br />
              <img
                src={preview}
                alt="Preview"
                className="rounded shadow"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            </div>
          )}

          <div className="col-12 text-center mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-3"
              onClick={() => navigate("/profile")}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
