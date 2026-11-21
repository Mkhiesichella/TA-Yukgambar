// Menggambar latar template ke canvas 2D (id sesuai tabel templates)
export function drawTemplate(c, w, h, id) {
  c.fillStyle = id === 5 ? '#fff3d6' : '#fff';
  c.fillRect(0, 0, w, h);
  c.strokeStyle = '#c5cdf0';
  c.fillStyle = '#aab4e6';
  c.lineWidth = Math.max(1, w / 600);
  const s = w / 30;
  const line = (x1, y1, x2, y2) => {
    c.beginPath();
    c.moveTo(x1, y1);
    c.lineTo(x2, y2);
    c.stroke();
  };
  if (id === 2) for (let y = s * 2; y < h; y += s) line(0, y, w, y);
  if (id === 3) {
    for (let x = s; x < w; x += s) line(x, 0, x, h);
    for (let y = s; y < h; y += s) line(0, y, w, y);
  }
  if (id === 4)
    for (let x = s; x < w; x += s)
      for (let y = s; y < h; y += s) {
        c.beginPath();
        c.arc(x, y, Math.max(1, w / 450), 0, 6.3);
        c.fill();
      }
}
