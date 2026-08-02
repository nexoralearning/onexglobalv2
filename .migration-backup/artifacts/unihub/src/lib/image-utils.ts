/**
 * image-utils.ts
 * Pick / capture / compress images and run them through the moderation API.
 */

const MAX_DIM = 1024; // px — longest edge
const MAX_KB  = 150;  // target file size before base64 overhead

/** Open the OS file picker (or native camera on mobile when capture=true). */
export function pickImage(capture = false): Promise<string | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    if (capture) input.setAttribute('capture', 'environment');
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) { resolve(null); return; }
      try {
        const compressed = await compressImage(file);
        resolve(compressed);
      } catch {
        resolve(null);
      }
    };
    // Handle cancel without selecting
    window.addEventListener('focus', () => {
      setTimeout(() => { if (!input.files?.length) resolve(null); }, 400);
    }, { once: true });
    input.click();
  });
}

/** Canvas-based JPEG compression. Returns a base64 data URL ≤ MAX_KB (approx). */
export function compressImage(file: File, maxKB = MAX_KB): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      let { naturalWidth: w, naturalHeight: h } = img;
      if (w > MAX_DIM || h > MAX_DIM) {
        const r = Math.min(MAX_DIM / w, MAX_DIM / h);
        w = Math.round(w * r);
        h = Math.round(h * r);
      }
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      // Reduce quality until size target is met
      let quality = 0.85;
      let dataUrl  = canvas.toDataURL('image/jpeg', quality);
      while (dataUrl.length > maxKB * 1400 && quality > 0.15) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }
      resolve(dataUrl);
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Load failed')); };
    img.src = objectUrl;
  });
}

export interface ModerationResult {
  safe: boolean;
  reason?: string;
}

/**
 * Send a base64 data-URL to the moderation API.
 * Defaults to SAFE if the request fails (so users aren't blocked by a network issue).
 */
export async function moderateImage(dataUrl: string): Promise<ModerationResult> {
  try {
    const res = await fetch('/api/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl }),
    });
    if (!res.ok) return { safe: true };
    return (await res.json()) as ModerationResult;
  } catch {
    return { safe: true };
  }
}
