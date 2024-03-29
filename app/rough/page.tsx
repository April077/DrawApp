"use client";import React, { useEffect, useRef } from "react";
import rough from "roughjs";

function RoughCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapes = useRef<any[]>([]);
  const isDragging = useRef<boolean>(false);
  const offsetX = useRef<number>(0);
  const offsetY = useRef<number>(0);
  const prevMousePos = useRef<{ x: number; y: number } | null>(null);
  const shapeIndex = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rc = rough.canvas(canvas);

    // Function to draw all shapes
    const drawShapes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapes.current.forEach((shape) => {
        if (shape.type === "rectangle") {
          rc.rectangle(shape.x, shape.y, shape.width, shape.height, shape.options);
        } else if (shape.type === "circle") {
          rc.circle(shape.x, shape.y, shape.diameter, shape.options);
        } else if (shape.type === "line") {
          rc.line(shape.x1, shape.y1, shape.x2, shape.y2, shape.options);
        }
      });
    };

    // Draw initial shapes
    const rectangle = { type: "rectangle", x: 10, y: 10, width: 200, height: 200, options: {} }; // x, y, width, height
    const circle = { type: "circle", x: 300, y: 150, diameter: 100, options: {} }; // centerX, centerY, diameter
    const line = { type: "line", x1: 450, y1: 50, x2: 550, y2: 150, options: {} }; // x1, y1, x2, y2

    shapes.current = [rectangle, circle, line];
    drawShapes();

    const handleMouseDown = (event: MouseEvent) => {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;

      shapes.current.forEach((shape, index) => {
        if (shape.type === "rectangle") {
          if (
            mouseX >= shape.x &&
            mouseX <= shape.x + shape.width &&
            mouseY >= shape.y &&
            mouseY <= shape.y + shape.height
          ) {
            isDragging.current = true;
            shapeIndex.current = index;
            prevMousePos.current = { x: mouseX, y: mouseY };
            offsetX.current = mouseX - shape.x;
            offsetY.current = mouseY - shape.y;
          }
        } else if (shape.type === "circle") {
          const distance = Math.sqrt(Math.pow(mouseX - shape.x, 2) + Math.pow(mouseY - shape.y, 2));
          if (distance <= shape.diameter / 2) {
            isDragging.current = true;
            shapeIndex.current = index;
            prevMousePos.current = { x: mouseX, y: mouseY };
            offsetX.current = mouseX - shape.x;
            offsetY.current = mouseY - shape.y;
          }
        } else if (shape.type === "line") {
          // For lines, we don't need to check for mouse inside the line for dragging
          isDragging.current = true;
          shapeIndex.current = index;
          prevMousePos.current = { x: mouseX, y: mouseY };
          offsetX.current = mouseX - shape.x1;
          offsetY.current = mouseY - shape.y1;
        }
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (
        isDragging.current &&
        shapeIndex.current !== null &&
        prevMousePos.current
      ) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        const dx = mouseX - prevMousePos.current.x;
        const dy = mouseY - prevMousePos.current.y;

        const shape = shapes.current[shapeIndex.current];
        if (shape.type === "rectangle" || shape.type === "circle") {
          shape.x += dx;
          shape.y += dy;
        } else if (shape.type === "line") {
          shape.x1 += dx;
          shape.y1 += dy;
          shape.x2 += dx;
          shape.y2 += dy;
        }

        prevMousePos.current = { x: mouseX, y: mouseY };

        drawShapes();
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      prevMousePos.current = null;
      shapeIndex.current = null;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={600} height={300}></canvas>
    </div>
  );
}

export default RoughCanvas;
