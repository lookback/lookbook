const chokidar = require('chokidar');
const { spawn } = require('child_process');

const buildCss = () => {
  spawn('./build-css.sh', {
    stdio: 'inherit',
  });
};

chokidar.watch(['gen']).on('change', () => {
  buildCss();
});
