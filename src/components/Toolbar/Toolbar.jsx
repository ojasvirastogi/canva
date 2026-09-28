function Toolbar({
  onSelect,
  onAddRectangle,
  onAddCircle,
  onAddText,
  onPen,
  onDelete,
  onColorChange,
  onFontSizeChange,
  selectedObject,
  onSave,
  isSaving,
}) {
  const isTextSelected =
    selectedObject?.type ===
      "i-text" ||
    selectedObject?.type ===
      "text";

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button
          onClick={onSelect}
        >
          Select
        </button>

        <button
          onClick={
            onAddRectangle
          }
        >
          Rectangle
        </button>

        <button
          onClick={onAddCircle}
        >
          Circle
        </button>

        <button
          onClick={onAddText}
        >
          Text
        </button>

        <button
          onClick={onPen}
        >
          Pen
        </button>
      </div>

      <div className="toolbar-group">
        <label>
          Color

          <input
            type="color"
            value={
              selectedObject?.fill ||
              "#111827"
            }
            onChange={(event) =>
              onColorChange(
                event.target.value
              )
            }
          />
        </label>

        {isTextSelected && (
          <label>
            Font Size

            <input
              type="number"
              min="8"
              max="120"
              value={
                selectedObject?.fontSize ||
                32
              }
              onChange={(event) =>
                onFontSizeChange(
                  event.target.value
                )
              }
            />
          </label>
        )}
      </div>

      <div className="toolbar-group">
        <button
          onClick={onDelete}
          disabled={!selectedObject}
        >
          Delete
        </button>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="save-button"
        >
          {isSaving
            ? "Saving..."
            : "Save"}
        </button>
      </div>
    </div>
  );
}

export default Toolbar;