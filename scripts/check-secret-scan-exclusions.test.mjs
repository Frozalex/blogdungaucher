import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {checkedExclusions} from './check-secret-scan-exclusions.mjs';

test('only reviewed blobs are excluded, including history before a revert', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'generated-scan-'));
  const file = 'media/article-videos/html/test.html', original = '<html>reviewed image bytes</html>';
  const files = {[file]: createHash('sha256').update(original).digest('hex')};
  const git = args => execFileSync('git', args, {cwd: root, stdio: 'pipe'});
  const commit = message => {git(['add', '.']); git(['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-m', message]);};
  try {
    git(['init']);
    await fs.mkdir(path.dirname(path.join(root, file)), {recursive: true});
    await fs.writeFile(path.join(root, file), original); commit('Reviewed generated file');
    assert.equal(await checkedExclusions(root, files), '^media/article-videos/html/test\\.html$\n');
    await fs.writeFile(path.join(root, file), 'unexpected new credentials');
    await assert.rejects(checkedExclusions(root, files), /changed in working tree/);
    commit('Unreviewed change');
    await fs.writeFile(path.join(root, file), original); commit('Revert change');
    await assert.rejects(checkedExclusions(root, files), /changed in Git history/);
    await assert.rejects(checkedExclusions(root, {'scripts/config.js': files[file]}), /Invalid generated-image exception/);
    await assert.rejects(checkedExclusions(root, {[file]: '.*'}), /Invalid generated-image exception/);
  } finally {
    await fs.rm(root, {recursive: true, force: true});
  }
});

test('a merge retaining the original file cannot hide an unreviewed side-branch blob', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'generated-scan-merge-'));
  const file = 'media/article-videos/html/test.html', original = '<html>reviewed image bytes</html>';
  const files = {[file]: createHash('sha256').update(original).digest('hex')};
  const git = args => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', ...args], {cwd: root, stdio: 'pipe'});
  const commit = message => {git(['add', '.']); git(['commit', '-m', message]);};
  try {
    git(['init', '-b', 'main']);
    await fs.mkdir(path.dirname(path.join(root, file)), {recursive: true});
    await fs.writeFile(path.join(root, file), original); commit('Reviewed generated file');
    git(['checkout', '-b', 'side']);
    await fs.writeFile(path.join(root, file), 'unexpected side-branch credentials'); commit('Unreviewed side branch');
    git(['checkout', 'main']); git(['merge', '-s', 'ours', '--no-ff', 'side', '-m', 'Keep original file']); git(['branch', '-D', 'side']);
    assert.equal(await fs.readFile(path.join(root, file), 'utf8'), original);
    await assert.rejects(checkedExclusions(root, files), /changed in Git history/);
  } finally {
    await fs.rm(root, {recursive: true, force: true});
  }
});
