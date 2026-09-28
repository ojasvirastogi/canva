import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import {
  Canvas,
  Circle,
  IText,
  PencilBrush,
  Rect,
} from "fabric";

const CanvasBoard = forwardRef(
  function CanvasBoard(
    {
      onSelectionChange,
      onReady,
    },
    ref
  ) {
    const canvasElementRef =
      useRef(null);

    const fabricCanvasRef =
      useRef(null);

    useEffect(() => {
      const canvas =
        new Canvas(
          canvasElementRef.current,
          {
            width: 900,
            height: 600,
            backgroundColor:
              "#ffffff",
          }
        );

      const brush =
        new PencilBrush(canvas);

      brush.color = "#111827";
      brush.width = 3;

      canvas.freeDrawingBrush =
        brush;

      fabricCanvasRef.current =
        canvas;

      onReady?.();

      const handleSelectionCreated =
        (event) => {
          const selectedObject =
            event.selected?.[0] ||
            null;

          onSelectionChange?.(
            selectedObject
          );
        };

      const handleSelectionUpdated =
        (event) => {
          const selectedObject =
            event.selected?.[0] ||
            null;

          onSelectionChange?.(
            selectedObject
          );
        };

      const handleSelectionCleared =
        () => {
          onSelectionChange?.(
            null
          );
        };

      canvas.on(
        "selection:created",
        handleSelectionCreated
      );

      canvas.on(
        "selection:updated",
        handleSelectionUpdated
      );

      canvas.on(
        "selection:cleared",
        handleSelectionCleared
      );

      const handleKeyDown =
        (event) => {
          if (
            event.key !==
              "Delete" &&
            event.key !==
              "Backspace"
          ) {
            return;
          }

          const activeObject =
            canvas.getActiveObject();

          if (!activeObject) {
            return;
          }

          if (
            activeObject.isEditing
          ) {
            return;
          }

          canvas.remove(
            activeObject
          );

          canvas.discardActiveObject();

          onSelectionChange?.(
            null
          );

          canvas.requestRenderAll();
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

        canvas.off(
          "selection:created",
          handleSelectionCreated
        );

        canvas.off(
          "selection:updated",
          handleSelectionUpdated
        );

        canvas.off(
          "selection:cleared",
          handleSelectionCleared
        );

        canvas.dispose();

        fabricCanvasRef.current =
          null;
      };
    }, [
      onReady,
      onSelectionChange,
    ]);

    useImperativeHandle(
      ref,
      () => ({
        addRectangle() {
          const canvas =
            fabricCanvasRef.current;

          if (!canvas) return;

          canvas.isDrawingMode =
            false;

          canvas.selection = true;

          const rectangle =
            new Rect({
              left: 100,
              top: 100,
              width: 150,
              height: 100,
              fill: "#3b82f6",
            });

          canvas.add(rectangle);

          canvas.setActiveObject(
            rectangle
          );

          onSelectionChange?.(
            rectangle
          );

          canvas.requestRenderAll();
        },

        addCircle() {
          const canvas =
            fabricCanvasRef.current;

          if (!canvas) return;

          canvas.isDrawingMode =
            false;

          canvas.selection = true;

          const circle =
            new Circle({
              left: 300,
              top: 150,
              radius: 60,
              fill: "#ef4444",
            });

          canvas.add(circle);

          canvas.setActiveObject(
            circle
          );

          onSelectionChange?.(
            circle
          );

          canvas.requestRenderAll();
        },

        addText() {
          const canvas =
            fabricCanvasRef.current;

          if (!canvas) return;

          canvas.isDrawingMode =
            false;

          canvas.selection = true;

          const text =
            new IText(
              "Hello World",
              {
                left: 200,
                top: 300,
                fill: "#111827",
                fontSize: 32,
              }
            );

          canvas.add(text);

          canvas.setActiveObject(
            text
          );

          onSelectionChange?.(
            text
          );

          canvas.requestRenderAll();
        },

        enableSelectMode() {
          const canvas =
            fabricCanvasRef.current;

          if (!canvas) return;

          canvas.isDrawingMode =
            false;

          canvas.selection = true;

          canvas.requestRenderAll();
        },

        enablePenMode() {
          const canvas =
            fabricCanvasRef.current;

          if (!canvas) return;

          canvas.isDrawingMode =
            true;

          canvas.selection = false;

          canvas.discardActiveObject();

          onSelectionChange?.(
            null
          );

          canvas.requestRenderAll();
        },

        deleteSelectedObject() {
          const canvas =
            fabricCanvasRef.current;

          if (!canvas) return;

          const activeObject =
            canvas.getActiveObject();

          if (!activeObject) {
            return;
          }

          if (
            activeObject.isEditing
          ) {
            return;
          }

          canvas.remove(
            activeObject
          );

          canvas.discardActiveObject();

          onSelectionChange?.(
            null
          );

          canvas.requestRenderAll();
        },

        changeColor(color) {
          const canvas =
            fabricCanvasRef.current;

          if (!canvas) return;

          const activeObject =
            canvas.getActiveObject();

          if (!activeObject) {
            return;
          }

          activeObject.set(
            "fill",
            color
          );

          canvas.requestRenderAll();

          onSelectionChange?.(
            activeObject
          );
        },

        changeFontSize(
          fontSize
        ) {
          const canvas =
            fabricCanvasRef.current;

          if (!canvas) return;

          const activeObject =
            canvas.getActiveObject();

          if (!activeObject) {
            return;
          }

          if (
            activeObject.type !==
              "i-text" &&
            activeObject.type !==
              "text"
          ) {
            return;
          }

          activeObject.set(
            "fontSize",
            Number(fontSize)
          );

          canvas.requestRenderAll();

          onSelectionChange?.(
            activeObject
          );
        },

        saveCanvas() {
          const canvas =
            fabricCanvasRef.current;

          if (!canvas) {
            return null;
          }

          return canvas.toJSON();
        },

        loadCanvas(
          canvasData
        ) {
          const canvas =
            fabricCanvasRef.current;

          if (
            !canvas ||
            !canvasData
          ) {
            return;
          }

          return canvas
            .loadFromJSON(
              canvasData
            )
            .then(() => {
              canvas.requestRenderAll();
            });
        },
      }),
      [onSelectionChange]
    );

    return (
      <canvas
        ref={
          canvasElementRef
        }
      />
    );
  }
);

export default CanvasBoard;