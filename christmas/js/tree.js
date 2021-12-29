import { light_data } from './light_data.js';
import { load_image } from './load_image.js';

let canvas;
let state = light_data;
let tree_loaded = false;
let light_size;

export const tree = {
  name: 'tree',
  after: '#snow',
  canvas: () => canvas,
  init: (_canvas) => {
    canvas = _canvas;
    canvas.tree = load_image('tree.webp', () => tree_loaded = true);
    canvas.lights = load_image('lights.png', () => light_size = canvas.lights.width);
  },
  on_resize: (width, height) => {},
  integrate: (elapsed) => {
    state.forEach(l => l.bright = (Math.sin((elapsed / 512) + (l.cycle * 2 * Math.PI)) + 1) / 2);
  },
  render: () => {
    if (!tree_loaded || !light_size) {
      return;
    }
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(canvas.tree, (canvas.width - canvas.tree.width) / 2, canvas.height - canvas.tree.height);
    state.forEach(l => {
      context.globalAlpha = l.bright;
      context.drawImage(
        canvas.lights,
        0,
        l.color * light_size,
        light_size, light_size,
        (canvas.width / 2) + l.x - (light_size / 2),
        canvas.height - l.y - (light_size / 2),
        light_size,
        light_size
      );
    });
    context.globalAlpha = 1;
  },
};
