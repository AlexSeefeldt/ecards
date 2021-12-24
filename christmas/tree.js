// TREE
(function(global){
  if (!Array.isArray(global.animations)) {
    global.animations = [];
  }
  let animations = global.animations;
  let canvas;
  let rendered = false;
  animations.push({
    name: 'tree',
    after: '#snow',
    canvas: () => canvas,
    init: (_canvas) => {
      canvas = _canvas;

      canvas.tree = document.createElement('canvas');
      canvas.tree.width = 310;
      canvas.tree.height = 605;

      const tree_context = canvas.tree.getContext('2d');
      let image = new Image();
      image.addEventListener('load', () => {
        tree_context.drawImage(image, 0, 0);
        rendered = false;
        render();
      });
      image.src = 'tree.png';
    },
    on_resize: (window) => {
      rendered = false;
    },
    integrate: (elapsed) => {},
    render: () => {
      if (!rendered) {
        const context = canvas.getContext('2d');
        context.drawImage(canvas.tree, (canvas.width - canvas.tree.width) / 2, canvas.height - canvas.tree.height);
        rendered = true;
      }
    },
  });
})(this);
