export const DEFAULT_AUTHOR = 'Muhammad Khiesichella Putra Yudanto';

export const slug = (t) =>
  (t || 'gambar').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').slice(0, 40) || 'gambar';

export const fmt = (s) =>
  new Date(s).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });

// Gabungkan layer latar (template) + layer gambar di atas dasar putih
export function flatten(bg, cv) {
  const c = document.createElement('canvas');
  c.width = cv.width;
  c.height = cv.height;
  const x = c.getContext('2d');
  x.fillStyle = '#fff';
  x.fillRect(0, 0, c.width, c.height);
  x.drawImage(bg, 0, 0);
  x.drawImage(cv, 0, 0);
  return c;
}

export function thumbOf(canvas) {
  const t = document.createElement('canvas');
  t.width = 300;
  t.height = 200;
  const x = t.getContext('2d');
  x.fillStyle = '#fff';
  x.fillRect(0, 0, 300, 200);
  const k = Math.min(300 / canvas.width, 200 / canvas.height);
  const w = canvas.width * k, h = canvas.height * k;
  x.drawImage(canvas, (300 - w) / 2, (200 - h) / 2, w, h);
  return t.toDataURL('image/jpeg', 0.7);
}

export function savePng(canvas, name) {
  canvas.toBlob((b) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(b);
    a.download = `${slug(name)}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }, 'image/png');
}

export function dataUrlToCanvas(url) {
  return new Promise((resolve) => {
    const im = new Image();
    im.onload = () => {
      const c = document.createElement('canvas');
      c.width = im.width;
      c.height = im.height;
      c.getContext('2d').drawImage(im, 0, 0);
      resolve(c);
    };
    im.src = url;
  });
}

// Cat / isi warna: area ditentukan dari gabungan template + gambar,
// hasilnya ditulis ke layer gambar.
export function floodFill(bg, cv, px, py, hex) {
  const W = cv.width, H = cv.height;
  const sx = Math.floor(px), sy = Math.floor(py);
  const d = flatten(bg, cv).getContext('2d').getImageData(0, 0, W, H).data;
  const m = new Uint8Array(W * H);
  const i0 = (sy * W + sx) * 4;
  const r = d[i0], g = d[i0 + 1], b = d[i0 + 2];
  const diff = (i) => Math.abs(d[i] - r) + Math.abs(d[i + 1] - g) + Math.abs(d[i + 2] - b);
  const near = (i) => diff(i) <= 100;
  const st = [sx, sy];
  while (st.length) {
    const y = st.pop();
    let x = st.pop();
    while (x > 0 && !m[y * W + x - 1] && near((y * W + x - 1) * 4)) x--;
    let up = false, dn = false;
    while (x < W && !m[y * W + x] && near((y * W + x) * 4)) {
      m[y * W + x] = 1;
      if (y > 0) {
        const k = (y - 1) * W + x, ok = !m[k] && near(k * 4);
        if (ok && !up) st.push(x, y - 1);
        up = ok;
      }
      if (y < H - 1) {
        const k = (y + 1) * W + x, ok = !m[k] && near(k * 4);
        if (ok && !dn) st.push(x, y + 1);
        dn = ok;
      }
      x++;
    }
  }
  const cr = parseInt(hex.slice(1, 3), 16), cg = parseInt(hex.slice(3, 5), 16), cb = parseInt(hex.slice(5, 7), 16);
  const ctx = cv.getContext('2d');
  const o = ctx.getImageData(0, 0, W, H), od = o.data;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const k = y * W + x, q = k * 4;
      const edge =
        !m[k] && ((x > 0 && m[k - 1]) || (x < W - 1 && m[k + 1]) || (y > 0 && m[k - W]) || (y < H - 1 && m[k + W])) && diff(q) <= 300;
      if (m[k] || edge) {
        od[q] = cr; od[q + 1] = cg; od[q + 2] = cb; od[q + 3] = 255;
      }
    }
  ctx.putImageData(o, 0, 0);
}
