function load_image(url, callback) {
  const canvas = document.createElement('canvas');
  let image = new Image();
  image.addEventListener('load', () => {
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    if (callback !== undefined) callback();
  });
  image.src = url;
  return canvas;
}
