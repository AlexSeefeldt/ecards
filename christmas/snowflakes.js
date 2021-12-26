(function(global){
  if (!Array.isArray(global.animations)) {
    global.animations = [];
  }
  let animations = global.animations;

  const SNOWFLAKE_SIZE = 16;
  let state;
  let canvas;
  animations.push({
    name: 'snow',
    after: '#backdrop',
    canvas: () => canvas,
    init: (_canvas) => {
      canvas = _canvas;

      state = Array.from({ length: canvas.width * canvas.height / 1024 }, () => ({
        dx: 0,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      }));

      canvas.snowflake = document.createElement('canvas');
      canvas.snowflake.width = SNOWFLAKE_SIZE * 2;
      canvas.snowflake.height = SNOWFLAKE_SIZE * 2;

      const snowflake_context = canvas.snowflake.getContext('2d');
      snowflake_context.fillStyle = '#DDEEFF';
      snowflake_context.shadowColor = '#DDEEFF';
      snowflake_context.shadowBlur = SNOWFLAKE_SIZE / 4;
      snowflake_context.beginPath();
      snowflake_context.ellipse(SNOWFLAKE_SIZE / 2, SNOWFLAKE_SIZE / 2, SNOWFLAKE_SIZE / 8, SNOWFLAKE_SIZE / 8, 0, 0, Math.PI * 2);
      snowflake_context.closePath();
      snowflake_context.fill();
    },
    on_resize: (width, height) => {
      state = state.map(s => ({
        dx: s.dx,
        x: s.x / canvas.width * width,
        y: s.y / canvas.height * height,
      }));
    },
    integrate: (elapsed) => {
      state = state.map(s => {
        let dx = s.dx + (perlin.noise(s.x / 1024, s.y / 1024, elapsed / 4096) - 0.5) / 64;
        dx *= (s.dx * s.dx / 4096);
        let x = s.x + dx;
        if (x > canvas.width) x -= canvas.width + SNOWFLAKE_SIZE;
        if (x < -SNOWFLAKE_SIZE) x += canvas.width + SNOWFLAKE_SIZE;
        let y = s.y + 2 * perlin.noise(elapsed / 4096, s.x / 16);
        if (y > canvas.height) y -= canvas.height + SNOWFLAKE_SIZE;
        return { dx, x, y }
      });
    },
    render: () => {
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      state.forEach((s, i) => {
        context.drawImage(canvas.snowflake, s.x + (perlin.noise(s.x / 256, s.y / 256) - 0.5) * 64, s.y)
      });
    },
  });
})(this);
