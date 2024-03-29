"use client";

import React, { useRef, useEffect } from "react";
import rough from "roughjs";

function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapes = [
    {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      color: "red",
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
    },
    {
      x: 150,
      y: 100,
      width: 50,
      height: 50,
      color: "blue",
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
    },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawShapes = () => {
      shapes.forEach((shape) => {
        ctx.strokeStyle = shape.color; // Set outline color
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height); //
      });
    };

    const handleMouseDown = (event: MouseEvent) => {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;

      shapes.forEach((shape) => {
        if (
          mouseX >= shape.x &&
          mouseX <= shape.x + shape.width &&
          mouseY >= shape.y &&
          mouseY <= shape.y + shape.height
        ) {
          shape.isDragging = true;
          shape.dragStartX = mouseX - shape.x;
          shape.dragStartY = mouseY - shape.y;
        }
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      shapes.forEach((shape) => {
        if (shape.isDragging) {
          const mouseX = event.offsetX;
          const mouseY = event.offsetY;

          shape.x = mouseX - shape.dragStartX;
          shape.y = mouseY - shape.dragStartY;

          drawCanvas();
        }
      });
    };

    const handleMouseUp = () => {
      shapes.forEach((shape) => {
        shape.isDragging = false;
      });
    };

    const drawCanvas = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      drawShapes();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    drawCanvas();

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [shapes]);

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <canvas
        ref={canvasRef}
        width={450}
        height={450}
        className="border-[1px] rounded-md border-black"
      />
    </div>
  );
}

export default Page;
