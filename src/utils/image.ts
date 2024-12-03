export const preventImageCopy = (e: React.MouseEvent) => {
  e.preventDefault();
  console.log("Tentative de copie d'image bloquée");
};

export const addWatermark = (imageUrl: string, username: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(imageUrl);

      canvas.width = img.width;
      canvas.height = img.height;

      // Dessiner l'image
      ctx.drawImage(img, 0, 0);

      // Ajouter le filigrane
      ctx.font = "20px Arial";
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillText(`@${username}`, 20, canvas.height - 20);

      resolve(canvas.toDataURL("image/jpeg"));
    };
  });
};