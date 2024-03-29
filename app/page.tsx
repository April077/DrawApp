"use client";

import { useDraw } from "@/hooks/useDraw";
import React, { useEffect, useState } from "react";
import { ChromePicker, SketchPicker } from "react-color";
import { Button } from "@/components/ui/button";

function page() {
  const { canvasRef, onMouseDown } = useDraw(drawLine);
  const [color, setColor] = useState<string>("#000");
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null | undefined>(
    null
  );

  function drawLine({ prevPt, currPt, ctx }: Draw) {
    const lineColor = color;
    const lineWidth = 5;

    let startPt = prevPt ?? currPt;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(startPt.x, startPt.y);
    ctx.lineTo(currPt.x, currPt.y);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPt.x, startPt.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    setCtx(context);
  });

  const clearCanvas = () => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };

  const handleDownload = ()=>{
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "drawing.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="p-5 flex justify-center items-center gap-5 bg-white  w-screen h-screen">
      <div className="flex justify-center flex-col space-y-5 items-center">
        <ChromePicker
          disableAlpha={true}
          color={color}
          onChange={(e) => setColor(e.hex)}
        />
        <Button size={"lg"} variant={"outline"} onClick={clearCanvas}>
          Clear
        </Button>
        <Button size={"lg"} variant={"outline"} onClick={handleDownload}>
          Download
        </Button>
      </div>

      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={500}
        height={500}
        className="border-[1px] rounded-md border-black"
      />
    </div>
  );
}

export default page;
