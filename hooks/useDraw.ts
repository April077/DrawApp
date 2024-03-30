"use client";

import { useEffect, useRef, useState } from "react";

export const useDraw = (onDraw: ({ ctx, currPt, prevPt }: Draw) => void) => {
  const [mouseDown, setMouseDown] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPt = useRef<null | Point>(null);

  const onMouseDown = () => setMouseDown(true);
  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!mouseDown) return;
      const currPt = computePointInCanvas(e);

      const ctx = canvasRef.current?.getContext("2d");

      if (!ctx || !currPt) return;

      onDraw({ ctx, currPt, prevPt: prevPt.current });
      prevPt.current = currPt;
    };

    const computePointInCanvas = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    };

    const mouseuphandler = () => {
      setMouseDown(false);
      prevPt.current = null;
    };

    canvasRef.current?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", mouseuphandler);
    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", mouseuphandler);
    };
  }, [onDraw]);
  return { canvasRef, onMouseDown, clearCanvas };
};
