type DrawLine = Draw & { color: string };

export function drawLine({ prevPt, currPt, ctx, color }: DrawLine) {
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
