import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ArticleCard from "../shared/ArticleCard.jsx"; // adjust path as needed
import ArticleModal from "../shared/ArticleModal.jsx"; // adjust path as needed
import "../css/ArticleModal.css";

const TABS = ["profile", "bookmarks", "likes", "history"];

const Profile = () => {
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredArticle, setHoveredArticle] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/api/user/me", {
        withCredentials: true,
      });
      setProfile(res.data.user);
      console.log("User:", res.data.user);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTabData = async (tab) => {
    const endpointMap = {
      bookmarks: "bookmarks",
      likes: "likes",
      history: "history",
    };

    if (!endpointMap[tab]) return;

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:4000/api/article/${endpointMap[tab]}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setData(res.data.articles);
      console.log("Data: ", res.data.articles);
    } catch (error) {
      console.error(`Failed to fetch ${tab}`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    setData([]);
    if (activeTab !== "profile") {
      fetchTabData(activeTab);
    }
  }, [activeTab]);

  if (!token) {
    return (
      <div className="container my-5 p-5 bg-light rounded shadow text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-3">Access Denied</h2>
        <p className="text-gray-600">
          Please login or register to view your profile.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-20">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-gray-500">Loading...</p>
      </div>
    );
  }

  const profilePicURL = profile?.profile?.profilePicture
    ? `http://localhost:4000/${profile.profile.profilePicture.replace(
        /\\/g,
        "/"
      )}`
    : null;

  return (
    <div className="container my-5 p-4 bg-white rounded shadow-lg">
      <h2 className="text-3xl font-bold mb-5 text-center text-dark">
        👤 User Dashboard
      </h2>

      <div className="d-flex justify-content-center mb-4 gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`btn ${
              activeTab === tab ? "btn-primary" : "btn-outline-secondary"
            } text-uppercase px-4`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "profile" && profile && (
        <div className="row bg-light p-4 rounded align-items-center">
          <div className="col-md-4 text-center mb-3">
            {profilePicURL ? (
              <img
                src={profilePicURL}
                alt="Profile"
                className="rounded-circle shadow"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{ width: "150px", height: "150px" }}
              >
                No Image
              </div>
            )}
            <h4 className="mt-3">{profile.username}</h4>
          </div>
          <div className="col-md-8">
            <div className="row g-3">
              <div className="col-sm-6">
                <strong>Email:</strong> <br /> {profile.email}
              </div>
              <div className="col-sm-6">
                <strong>Phone:</strong> <br /> {profile.phone || "N/A"}
              </div>
              <div className="col-sm-6">
                <strong>Gender:</strong> <br />{" "}
                {profile.profile?.gender || "N/A"}
              </div>
              <div className="col-sm-6">
                <strong>Date of Birth:</strong> <br />{" "}
                {profile.profile?.dob
                  ? new Date(profile.profile.dob).toLocaleDateString()
                  : "N/A"}
              </div>
              <div className="col-12">
                <strong>Bio:</strong> <br /> {profile.profile?.bio || "N/A"}
              </div>
            </div>
          </div>
        </div>
      )}

      {["bookmarks", "likes", "history"].includes(activeTab) && (
        <div className={`row mt-4 ${hoveredArticle ? "blurred" : ""}`}>
          {data.length > 0 ? (
            data.map((article, idx) => (
              <div key={idx} className="col-md-4 mb-4">
                <ArticleCard article={article} onHover={setHoveredArticle} />
              </div>
            ))
          ) : (
            <div className="text-center text-muted">No articles found.</div>
          )}
          <ArticleModal
            article={hoveredArticle}
            onClose={() => setHoveredArticle(null)}
          />
        </div>
      )}
    </div>
  );
};

export default Profile;
