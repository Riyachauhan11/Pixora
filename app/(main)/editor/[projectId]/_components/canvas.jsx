"use client";

import { useCanvas } from "@/context/context";
import { api } from "@/convex/_generated/api";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { Canvas, FabricImage } from "fabric";
import { Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const CanvasEditor = ({ project }) => {
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef();
  const containerRef = useRef();

  const { canvasEditor, setCanvasEditor, activeTool, onToolChange } =
    useCanvas();

  const { mutate: updateProject } = useConvexMutation(
    api.projects.updateProject
  );

  const calculateViewportScale = () => {
    if (!containerRef.current || !project) return 1;
    const container = containerRef.current;
    const containerWidth = container.clientWidth - 40; //40 px padding
    const containerHeight = container.clientHeight - 40;
    const scaleX = containerWidth / project.width;
    const scaleY = containerHeight / project.height;
    return Math.min(scaleX, scaleY, 1);
  };

  useEffect(() => {
    if (!canvasRef.current || !project || canvasEditor) return;

    const initializeCanvas = async () => {
      setIsLoading(true);

      const viewportScale = calculateViewportScale();

      const canvas = new Canvas(canvasRef.current, {
        width: project.width,
        height: project.height,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true, // maintain object layer order
        controlsAboveOverlay: true, // show selection controls above overlay
        selection: true, // enable object selection
        hoverCursor: "move", // selecting type of cursor (move)
        moveCursor: "move",
        defaultCursor: "default",
        allowTouchScrolling: false, // Prevents the user from scrolling the page with touch gestures
        renderOnAddRemove: true, // Automatically re-renders the canvas when objects are added or removed
        skipTargetFind: false, // Enables detecting which object the pointer is over so interactions like selection & dragging work
      });

      canvas.setDimensions(
        {
          width: project.width * viewportScale, // Scaled Display Width
          height: project.height * viewportScale, // Scaled Display Height
        },
        { backstoreOnly: false } // as we are scaling our canvas (Updates both the internal canvas dimensions and the visible (DOM) dimensions.)
      );

      // apply zoom to scale the entire canvas content
      canvas.setZoom(viewportScale);

      // High DPI handling
      const scaleFactor = window.devicePixelRatio || 1;
      if (scaleFactor > 1) {
        // increase canvas resolution for high DPI displays
        canvas.getElement().width = project.width * scaleFactor;
        canvas.getElement().height = project.height * scaleFactor;
        // scale the drawing context to match
        canvas.getContext().scale(scaleFactor, scaleFactor);
      }

      // Load saved canvas state before loading the image
      if (project.canvasState) {
        try {
          await canvas.loadFromJSON(project.canvasState);
          canvas.requestRenderAll();
        } catch (error) {
          console.error("Error loading canvas state:", error);
        }
      } else {
        // Only load the image if there's no saved canvas state
        // (since the saved state should already include the image)

        if (project.currentImageUrl || project.originalImageUrl) {
          try {
            // use current image if available (may have transformations), else fallback to og
            const imageUrl =
              project.currentImageUrl || project.originalImageUrl;

            const fabricImage = await FabricImage.fromURL(imageUrl, {
              crossOrigin: "anonymous",
            });

            // calc fabricImage scaling to fit within canvas while maintaining aspect ratio
            const imgAspectRatio = fabricImage.width / fabricImage.height;
            const canvasAspectRatio = project.width / project.height;
            let scaleX, scaleY;

            if (imgAspectRatio > canvasAspectRatio) {
              // FabricImg is wider than canvas, we scale it down based on width
              scaleX = project.width / fabricImage.width;
              scaleY = scaleX;
            } else {
              // FabricImg is taller than canvas, we scale it down based on height
              scaleY = project.height / fabricImage.height;
              scaleX = scaleY;
            }

            fabricImage.set({
              left: project.width / 2, // center horizontally
              top: project.height / 2, // center vertically
              originX: "center", // transform origin at center
              originY: "center", // transform origin at center
              scaleX, // horizontal scale factor
              scaleY, // vertical scale factor
              selectable: true, // allow user to scale/move img
              evented: true, // enable mouse/touch events
            });

            canvas.add(fabricImage);
          } catch (error) {
            console.error("Error loading project image:", error);
          }
        }
      }

      // Also, make sure to call requestRenderAll after all setup is complete
      canvas.calcOffset();
      canvas.requestRenderAll();
      setCanvasEditor(canvas);

      setTimeout(() => {
        if (canvas) {
          window.dispatchEvent(new Event("resize"));
          canvas.requestRenderAll(); // Additional render after resize
        }
      }, 100); // Reduced timeout

      setIsLoading(false);
    };

    initializeCanvas();

    // cleaning up after the component is unmounted
    return () => {
      if (canvasEditor) {
        canvasEditor.dispose(); // fabric.js cleanup method
        setCanvasEditor(null);
      }
    };
  }, [project]);

  const saveCanvasState = async () => {
    if (!canvasEditor || !project) return;

    try {
      const canvasJSON = canvasEditor.toJSON();
      await updateProject({
        projectId: project._id,
        canvasState: canvasJSON,
      });
    } catch (error) {
      console.error("Error saving canvas state:", error);
    }
  };

  useEffect(() => {
    if (!canvasEditor) return;
    let saveTimeout;

    //debounced save function - waits 1 sec after last change
    const handleCanvasChange = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        saveCanvasState();
      }, 1000); // 1 sec delay
    };

    // listen for canvas modification events
    canvasEditor.on("object:modified", handleCanvasChange);
    canvasEditor.on("object:added", handleCanvasChange);
    canvasEditor.on("object:removed", handleCanvasChange);

    return () => {
      clearTimeout(saveTimeout);
      canvasEditor.off("object:modified", handleCanvasChange);
      canvasEditor.off("object:added", handleCanvasChange);
      canvasEditor.off("object:removed", handleCanvasChange);
    };
  }, [canvasEditor]);

  useEffect(() => {
    const handleResize = () => {
      if (!canvasEditor || !project) return;

      const newScale = calculateViewportScale();
      canvasEditor.setDimensions(
        {
          width: project.width * newScale,
          height: project.height * newScale,
        },
        { backstoreOnly: false }
      );
      canvasEditor.setZoom(newScale);
      canvasEditor.calcOffset();
      canvasEditor.requestRenderAll();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasEditor, project]);

  useEffect(() => {
    if (!canvasEditor) return;

    switch (activeTool) {
      case "crop":
        canvasEditor.defaultCursor = "crosshair";
        canvasEditor.hoverCursor = "crosshair";
        break;
      default:
        canvasEditor.defaultCursor = "default";
        canvasEditor.hoverCursor = "move";
    }
  }, [canvasEditor, activeTool]);

  // Handle automatic tab switching when text is selected
  useEffect(() => {
    if (!canvasEditor || !onToolChange) return;

    const handleSelection = (e) => {
      const selectedObject = e.selected?.[0]; // Get first selected object

      // switch to text tool if selected obj is text
      if (selectedObject && selectedObject.type === "i-text") {
        onToolChange("text");
      }
    };

    canvasEditor.on("selection:created", handleSelection); // new selection
    canvasEditor.on("selection:updated", handleSelection); // selection changed

    // clearing after unmounting
    return () => {
      canvasEditor.off("selection:created", handleSelection);
      canvasEditor.off("selection:updated", handleSelection);
    };
  }, [canvasEditor, onToolChange]);
  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center bg-secondary w-full h-full overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #64748b 25%, transparent 25%),
            linear-gradient(-45deg, #64748b 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #64748b 75%),
            linear-gradient(-45deg, transparent 75%, #64748b 75%)`,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
        }}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin h-8 w-8" />
            <p className="text-white/70 text-sm">Loading canvas...</p>
          </div>
        </div>
      )}
      <div className="px-5">
        <canvas id="canvas" className="border" ref={canvasRef} />
      </div>
    </div>
  );
};

export default CanvasEditor;
