export const preventImageCopy = (e: React.MouseEvent) => {
  e.preventDefault();
  console.log("Tentative de copie d'image bloquée");
};