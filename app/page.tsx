"use client";

import { useDraw } from "@/hooks/useDraw";
import React, { useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { Button } from "@/components/ui/button";
import { drawLine } from "@/util/draw";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

type DrawLineProps = {
  currPt: Point;
  prevPt: Point | null;
  color: string;
};

function Home() {
  const { canvasRef, onMouseDown, clearCanvas } = useDraw(creatLine);
  const [color, setColor] = useState<string>("#000");

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    socket.emit("new-client");

    socket.on("get-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      socket.emit("canvas-data", canvasRef.current?.toDataURL());
    });

    socket.on("data-from-server", (state: string) => {
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
    });

    socket.on("clear", () => {
      clearCanvas();
    });

    socket.on("draw-line", ({ prevPt, currPt, color }: DrawLineProps) => {
      drawLine({ prevPt, currPt, ctx, color });
    });

    return () => {
      socket.off("get-state");
      socket.off("data-from-server");
      socket.off("clear");
      socket.off("draw-line");
    };
  }, [canvasRef]);

  function creatLine({ ctx, currPt, prevPt }: Draw) {
    socket.emit("draw-line", { prevPt, currPt, color });
    drawLine({ prevPt, currPt, ctx, color });
  }

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "drawing.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-5 flex justify-center items-center gap-5 bg-white  w-screen h-screen">
      <div className="flex justify-center flex-col space-y-5 items-center">
        <ChromePicker
          disableAlpha={true}
          color={color}
          onChange={(e) => setColor(e.hex)}
        />
        <Button
          size={"lg"}
          variant={"outline"}
          onClick={() => {
            socket.emit("clear");
          }}
        >
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

export default Home;
