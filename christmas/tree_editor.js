// TREE
(function(global){
  if (!Array.isArray(global.animations)) {
    global.animations = [];
  }
  const LIGHT_SIZE = 32;

  let animations = global.animations;
  let canvas;
  let state = [];
  let last_picked_color = 0;
  let color_count = 0;
  let is_dragging = false;

  function convert_coords(_x, _y) {
    // coords must be made relative to bottom-aligned, horizontally centered axes
    return {
      x: (_x - 16) - (canvas.width / 2),
      y: canvas.height - (_y - 16),
    }
  }

  animations.push({
    name: 'tree',
    after: '#snow',
    canvas: () => canvas,
    init: (_canvas) => {
      canvas = _canvas;

      canvas.tree = load_image('tree.png');

      canvas.lights = load_image('lights.png', () => {
        color_count = canvas.lights.height / LIGHT_SIZE;
      });

      canvas.addEventListener('mousedown', e => {
        const { x, y } = convert_coords(e.x, e.y);
          
        if (state.length > 0) {
          const latest_light = state[state.length - 1];
          if (Math.abs(x - latest_light.x) < 16
           && Math.abs(y - latest_light.y) < 16) {
            is_dragging = true;
            return;
          }
        }

        state.push({
          ...convert_coords(e.x, e.y),
          // [0,1]
          bright: 0,
          // [0,1) representing displacement in sine cycle
          cycle: e.timeStamp % 4 / 4,
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
