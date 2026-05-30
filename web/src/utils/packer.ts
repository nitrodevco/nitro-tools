export interface ImageToPack {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
}

export interface PackedFrameInfo {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PackResult {
  sheetDataUrl: string;
  frames: PackedFrameInfo[];
  sheetWidth: number;
  sheetHeight: number;
}

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

function nextPow2(n: number): number {
  if (n <= 0) return 1;
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

export async function packImages(images: ImageToPack[], padding = 2): Promise<PackResult | null> {
  if (!images.length) return null;

  const loaded = await Promise.all(images.map((img) => loadImg(img.dataUrl)));

  // Shelf-based packing: row wraps at maxW
  const maxW = Math.min(4096, Math.max(512, nextPow2(Math.max(...images.map((i) => i.width)) * 2)));

  const placed: PackedFrameInfo[] = [];
  let cx = padding;
  let cy = padding;
  let rowH = 0;
  let usedW = 0;

  for (let i = 0; i < images.length; i++) {
    const { name, width: w, height: h } = images[i];
    if (cx + w + padding > maxW && cx > padding) {
      cy += rowH + padding;
      cx = padding;
      rowH = 0;
    }
    placed.push({ name, x: cx, y: cy, w, h });
    rowH = Math.max(rowH, h);
    usedW = Math.max(usedW, cx + w + padding);
    cx += w + padding;
    void loaded[i]; // ensure loaded
  }

  const sheetW = nextPow2(usedW);
  const sheetH = nextPow2(cy + rowH + padding);

  const canvas = document.createElement('canvas');
  canvas.width = sheetW;
  canvas.height = sheetH;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, sheetW, sheetH);

  for (let i = 0; i < images.length; i++) {
    const f = placed[i];
    ctx.drawImage(loaded[i], f.x, f.y, f.w, f.h);
  }

  return {
    sheetDataUrl: canvas.toDataURL('image/png'),
    frames: placed,
    sheetWidth: sheetW,
    sheetHeight: sheetH,
  };
}

export async function readImageFile(file: File): Promise<ImageToPack> {
  const dataUrl = await new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res(e.target!.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

  const { width, height } = await new Promise<{ width: number; height: number }>((res, rej) => {
    const img = new Image();
    img.onload = () => res({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = rej;
    img.src = dataUrl;
  });

  const name = file.name.replace(/\.[^.]+$/, '');
  return { id: `${name}_${Date.now()}`, name, dataUrl, width, height };
}
