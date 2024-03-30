type Draw = {
  ctx: CanvasRenderingContext2D;
  currPt: Point;
  prevPt: Point | null;
  
};

type Point = {
  x: number;
  y: number;
};
