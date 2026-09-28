import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../services/firebase";

function Home() {
  const navigate = useNavigate();

  const [isCreating, setIsCreating] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleCreateCanvas = async () => {
    try {
      setIsCreating(true);
      setError("");

      const docRef = await addDoc(
        collection(db, "canvases"),
        {
          canvasData: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );

      navigate(`/canvas/${docRef.id}`);
    } catch (error) {
      console.error(
        "Failed to create canvas:",
        error
      );

      setError(
        "Failed to create canvas. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="home-page">
      <div className="home-card">
        <div className="home-icon">
          ✦
        </div>

        <h1>
          Simple Canvas Editor
        </h1>

        <p>
          Create, edit and save your
          designs directly in your
          browser.
        </p>

        <button
          className="create-canvas-button"
          onClick={handleCreateCanvas}
          disabled={isCreating}
        >
          {isCreating
            ? "Creating..."
            : "Create New Canvas"}
        </button>

        {error && (
          <p className="home-error">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;