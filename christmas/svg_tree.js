// svg_tree
(function(global){
  if (!Array.isArray(global.animations)) {
    global.animations = [];
  }
  let animations = global.animations;
  // let state;
  const create_paths = (x, y, size) => {
    const trunk = new Path2D(`M ${x - 4*size} ${y} q ${size} ${-4*size} ${size} ${-10*size} l ${6*size} 0 q 0 ${4*size} ${size} ${10*size}`);
    const tree = new Path2D(`M ${x - 12*size} ${y - 9*size} q ${3*size} ${-1*size} ${6*size} ${-5*size} q ${-2*size} ${1*size} ${-4*size} 0 q ${3*size} ${-2*size} ${6*size} ${-7*size} q ${-2*size} ${1*size} ${-4*size} 0 q ${3*size} ${-1*size} ${6*size} ${-9*size} q ${-2*size} ${1*size} ${-4*size} 0 q ${3*size} ${-1*size} ${6*size} ${-11*size} q ${3*size} ${10*size} ${6*size} ${11*size} q ${-2*size} ${1*size} ${-4*size} 0 q ${3*size} ${8*size} ${6*size} ${9*size} q ${-2*size} ${1*size} ${-4*size} 0 q ${3*size} ${6*size} ${6*size} ${7*size} q ${-2*size} ${1*size} ${-4*size} 0 q ${3*size} ${4*size} ${6*size} ${5*size} q ${-12*size} ${2*size} ${-24*size} 0`);
    return { trunk, tree };
  }
  let canvas;
  let rendered = false;
  let paths;
  animations.push({
    name: 'tree_lights',
    canvas: () => canvas,
    init: (_canvas) => {
      canvas = _canvas;
      paths = create_paths(canvas.width / 2, canvas.height, 20);
    },
    on_resize: (window) => {
      rendered = false;
      paths = create_paths(window.innerWidth / 2, window.innerHeight, 20);
    },
    integrate: (elapsed) => {},
    render: () => {
      if (!rendered) {
        const context = canvas.getContext('2d');
        context.fillStyle = '#663322';
        context.fill(paths.trunk);
        context.fillStyle = '#337744';
        context.fill(paths.tree);
        rendered = true;
      }
    },
  });
})(this);
