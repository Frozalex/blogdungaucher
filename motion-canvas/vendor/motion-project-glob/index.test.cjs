const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const glob = require('./index.cjs');

test('Motion Canvas discovers explicit files and wildcard project lists', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'motion-project-glob-'));
  try {
    fs.mkdirSync(path.join(dir, 'src'));
    fs.writeFileSync(path.join(dir, 'src/project.ts'), '');
    fs.writeFileSync(path.join(dir, 'src/other.ts'), '');
    fs.mkdirSync(path.join(dir, 'src/not-a-file.ts'));
    const options = { cwd: dir, onlyFiles: true };
    assert.equal(glob.isDynamicPattern('src/project.ts'), false);
    assert.equal(glob.isDynamicPattern('src/*.ts'), true);
    assert.deepEqual(glob.sync('src/project.ts', options), ['src/project.ts']);
    assert.deepEqual(glob.sync('src/*.ts', options).sort(), ['src/other.ts', 'src/project.ts']);
    assert.deepEqual((await glob(['src/*.ts', '!src/other.ts'], options)), ['src/project.ts']);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('the actual Motion Canvas plugin uses the installed compatibility package', () => {
  const { createRequire } = require('node:module');
  const pluginRequire = createRequire(require.resolve('@motion-canvas/vite-plugin'));
  assert.equal(fs.realpathSync(pluginRequire.resolve('fast-glob')), fs.realpathSync(require.resolve('./index.cjs')));
  const { getProjects } = pluginRequire('./utils.js');
  const dir = path.resolve(__dirname, '../..');
  assert.equal(getProjects(path.join(dir, 'src/project.ts')).length, 1);
  assert.equal(getProjects(path.join(dir, 'src/*.ts')).some(p => p.fileName === 'project'), true);
});
