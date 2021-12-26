// TREE
(function(global){
  if (!Array.isArray(global.animations)) {
    global.animations = [];
  }
  const LIGHT_SIZE = 32;

  let animations = global.animations;
  let canvas;
  let state = light_data;

  animations.push({
    name: 'tree',
    after: '#snow',
    canvas: () => canvas,
    init: (_canvas) => {
      canvas = _canvas;
      canvas.tree = load_image('tree.png');
      canvas.lights = load_image('lights.png');
    },
    on_resize: (window) => {},
    integrate: (elapsed) => {
      state.forEach(l => l.bright = (Math.sin((elapsed / 512) + (l.cycle * 2 * Math.PI)) + 1) / 2);
    },
    render: () => {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(canvas.tree, (canvas.width - canvas.tree.width) / 2, canvas.height - canvas.tree.height);
      state.forEach(l => {
        context.globalAlpha = l.bright;
        context.drawImage(canvas.lights, 0, l.color * LIGHT_SIZE, LIGHT_SIZE, LIGHT_SIZE, (canvas.width / 2) + l.x, canvas.height - l.y, LIGHT_SIZE, LIGHT_SIZE);
      });
      context.globalAlpha = 1;
    },
  });
})(this);
