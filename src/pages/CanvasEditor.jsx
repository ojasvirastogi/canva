import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { useParams } from "react-router-dom";

import { db } from "../services/firebase";

import CanvasBoard from "../components/Canvas/CanvasBoard";
import Toolbar from "../components/Toolbar/Toolbar";

function CanvasEditor() {
  const { canvasId } = useParams();

  const canvasRef = useRef(null);

  const [selectedObject, setSelectedObject] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [saveStatus, setSaveStatus] =
    useState("loading");

  const [loadError, setLoadError] =
    useState("");

  const handleSelectionChange =
    useCallback((object) => {
      setSelectedObject(object);
    }, []);

  const handleCanvasReady =
    useCallback(async () => {
      try {
        setLoadError("");
        setSaveStatus("loading");

        const canvasDocumentRef = doc(
          db,
          "canvases",
          canvasId
        );

        const timeoutPromise =
          new Promise((_, reject) => {
            setTimeout(() => {
              reject(
                new Error(
                  "Firestore request timed out"
                )
              );
            }, 10000);
          });

        const snapshot =
          await Promise.race([
            getDoc(
              canvasDocumentRef
            ),
            timeoutPromise,
          ]);

        if (!snapshot.exists()) {
          setLoadError(
            "Canvas not found."
          );

          return;
        }

        const data = snapshot.data();

        if (data.canvasData) {
          await canvasRef.current?.loadCanvas(
            data.canvasData
          );
        }

        setSaveStatus("saved");
      } catch (error) {
        console.error(
          "Failed to load canvas:",
          error
        );

        setLoadError(
          "Unable to load the canvas. Please check your Firebase connection and try again."
        );

        setSaveStatus("error");
      } finally {
        setIsLoading(false);
      }
    }, [canvasId]);

  const handleSelect =
    useCallback(() => {
      canvasRef.current?.enableSelectMode();
    }, []);

  const handleAddRectangle =
    useCallback(() => {
      canvasRef.current?.addRectangle();
      setSaveStatus("unsaved");
    }, []);

  const handleAddCircle =
    useCallback(() => {
      canvasRef.current?.addCircle();
      setSaveStatus("unsaved");
    }, []);

  const handleAddText =
    useCallback(() => {
      canvasRef.current?.addText();
      setSaveStatus("unsaved");
    }, []);

  const handlePen =
    useCallback(() => {
      canvasRef.current?.enablePenMode();
      setSaveStatus("unsaved");
    }, []);

  const handleDelete =
    useCallback(() => {
      canvasRef.current?.deleteSelectedObject();
      setSelectedObject(null);
      setSaveStatus("unsaved");
    }, []);

  const handleColorChange =
    useCallback((color) => {
      canvasRef.current?.changeColor(color);
      setSaveStatus("unsaved");
    }, []);

  const handleFontSizeChange =
    useCallback((fontSize) => {
      canvasRef.current?.changeFontSize(
        fontSize
      );

      setSaveStatus("unsaved");
    }, []);

  const handleSave =
    useCallback(async () => {
      if (isSaving) {
        return;
      }

      try {
        setIsSaving(true);
        setSaveStatus("saving");

        const canvasData =
          canvasRef.current?.saveCanvas();

        if (!canvasData) {
          throw new Error(
            "Canvas is not initialized"
          );
        }

        await updateDoc(
          doc(
            db,
            "canvases",
            canvasId
          ),
          {
            canvasData,
            updatedAt:
              serverTimestamp(),
          }
        );

        setSaveStatus("saved");
      } catch (error) {
        console.error(
          "Failed to save canvas:",
          error
        );

        setSaveStatus("error");
      } finally {
        setIsSaving(false);
      }
    }, [canvasId, isSaving]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() === "s"
      ) {
        event.preventDefault();
        handleSave();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [handleSave]);

  if (loadError) {
    return (
      <div className="error-page">
        <div className="error-card">
          <h2>{loadError}</h2>

          <p>
            Canvas ID: {canvasId}
          </p>

          <button
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-page">
      <header className="editor-header">
        <div>
          <h1>Canvas Editor</h1>

          <p>
            Canvas ID: {canvasId}
          </p>
        </div>

        <div className="save-status">
          {saveStatus === "loading" && (
            <span>Loading...</span>
          )}

          {saveStatus === "saving" && (
            <span>Saving...</span>
          )}

          {saveStatus === "saved" && (
            <span className="status-saved">
              ✓ Saved
            </span>
          )}

          {saveStatus === "unsaved" && (
            <span className="status-unsaved">
              ● Unsaved changes
            </span>
          )}

          {saveStatus === "error" && (
            <span className="status-error">
              ⚠ Error
            </span>
          )}
        </div>
      </header>

      <div
        className={
          isLoading
            ? "editor-content loading-content"
            : "editor-content"
        }
      >
        <div className="canvas-wrapper">
          <CanvasBoard
            ref={canvasRef}
            onReady={handleCanvasReady}
            onSelectionChange={
              handleSelectionChange
            }
          />

          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>

              <p>
                Loading canvas...
              </p>
            </div>
          )}
        </div>

        {!isLoading && (
          <>
            <Toolbar
              onSelect={handleSelect}
              onAddRectangle={
                handleAddRectangle
              }
              onAddCircle={
                handleAddCircle
              }
              onAddText={
                handleAddText
              }
              onPen={handlePen}
              onDelete={handleDelete}
              onColorChange={
                handleColorChange
              }
              onFontSizeChange={
                handleFontSizeChange
              }
              selectedObject={
                selectedObject
              }
              onSave={handleSave}
              isSaving={isSaving}
            />

            <div className="editor-hint">
              <span>
                Drag objects to move them
              </span>

              <span>•</span>

              <span>
                Delete or Backspace to
                remove
              </span>

              <span>•</span>

              <span>
                Ctrl/Cmd + S to save
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CanvasEditor;