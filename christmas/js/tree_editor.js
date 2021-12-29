const BLINK_CYCLE_STEPS = 4;

let canvas;
let state = [];
let last_picked_color = 0;
let color_count = 0;
let is_dragging = false;
let light_size;

function convert_coords(_x, _y) {
  // coords must be made relative to bottom-aligned, horizontally centered axes
  return {
    x: _x - (canvas.width / 2),
    y: canvas.height - _y,
  }
}

export const tree = {
  name: 'tree',
  after: '#snow',
  canvas: () => canvas,
  init: (_canvas) => {
    canvas = _canvas;
    canvas.tree = load_image('tree.webp');
    canvas.lights = load_image('lights.png', () => {
      light_size = canvas.lights.width;
      color_count = canvas.lights.height / light_size;
    });

    canvas.addEventListener('mousedown', e => {
      const { x, y } = convert_coords(e.x, e.y);
        
      if (state.length > 0) {
        const latest_light = state[state.length - 1];
        if (Math.abs(x - latest_light.x) < light_size / 2
          && Math.abs(y - latest_light.y) < light_size / 2) {
          is_dragging = true;
          return;
        }
      }

      state.push({
        ...convert_coords(e.x, e.y),
        // [0,1]
        bright: 0,
        // [0,1) representing displacement in sine cycle
        cycle: e.timeStamp % BLINK_CYCLE_STEPS / BLINK_CYCLE_STEPS,
        // an index into the possible colors in lights.png
        color: last_picked_color,
      });
      is_dragging = true;
    });
    canvas.addEventListener('mouseup', e => {
      if (is_dragging && e.button === 0) {
        is_dragging = false;
      }
    });
    canvas.addEventListener('mousemove', e => {
      if (is_dragging) {
        const latest_light = state[state.length - 1];
        const { x, y } = convert_coords(e.x, e.y);
        latest_light.x = x;
        latest_light.y = y;
      }
    });

    canvas.addEventListener('wheel', e => {
      if (state.length > 0) {
        // change the color of the most recently added light
        const latest_light = state[state.length - 1];
        const change = e.deltaY > 0
          ? 1
          : e.deltaY < 0
            ? -1
            : 0;
        latest_light.color = (latest_light.color + change + color_count) % color_count;
        last_picked_color = latest_light.color;
      }
    });
  },
  on_resize: (width, height) => {},
  integrate: (elapsed) => {
    state.forEach(l => l.bright = (Math.sin((elapsed / 512) + (l.cycle * 2 * Math.PI)) + 1) / 8 + 0.75);
  },
  render: () => {
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

export const get_light_data = () => {
  // set bright values to zero for the data
  const serialized_state = JSON.stringify(state.map(s => ({ ...s, bright: 0 })), undefined, 2);

  const link = document.createElement('a');
  link.setAttribute('href', 'data:text/javascript,' + encodeURIComponent(`const light_data = ${serialized_state}`));
  link.setAttribute('download', 'light_data.js');
  link.click();
}
