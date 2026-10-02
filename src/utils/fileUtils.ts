// Safe file processing and image compression for Firestore real-time storage
export async function processFileForChat(file: File): Promise<{ url: string; name: string; size: string; type: string }> {
  // If it's an image, resize and compress to JPEG to stay well within Firestore's 1MB limit
  if (file.type.startsWith('image/')) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDimension = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        const approxSizeKb = Math.round((compressedBase64.length * 3) / 4 / 1024);

        resolve({
          url: compressedBase64,
          name: file.name.replace(/\.[^/.]+$/, "") + '.jpg',
          size: `${approxSizeKb} KB`,
          type: 'image/jpeg'
        });
      };

      img.onerror = () => reject(new Error('Failed to load image for compression'));
      reader.readAsDataURL(file);
    });
  }

  // Non-image document: ensure size < 700KB for Firestore doc safety
  if (file.size > 700 * 1024) {
    throw new Error('Documents must be under 700 KB for direct escrow synchronization.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      resolve({
        url: reader.result as string,
        name: file.name,
        size: sizeStr,
        type: file.type || 'application/octet-stream'
      });
    };
    reader.onerror = () => reject(new Error('Failed to read document'));
    reader.readAsDataURL(file);
  });
}
