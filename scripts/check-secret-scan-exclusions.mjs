import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

// A path exception is allowed only while EVERY reachable historical blob matches
// its reviewed fingerprint. Reverting a newly introduced secret cannot bypass it.
export async function checkedExclusions(root, files) {
  const git = args => execFileSync('git', args, {cwd: root, maxBuffer: 16 * 1024 * 1024});
  const patterns = [];
  for (const [file, expected] of Object.entries(files)) {
    if (!/^media\/article-videos\/html\/[a-z0-9-]+\.html$/.test(file) || !/^[a-f0-9]{64}$/.test(expected)) {
      throw Error('Invalid generated-image exception');
    }
    const objects = git(['rev-list', '--full-history', '--objects', '--all', '--', file]).toString().trim().split('\n').filter(Boolean);
    for (const object of objects) {
      const oid = object.split(' ', 1)[0];
      if (git(['cat-file', '-t', oid]).toString().trim() !== 'blob') continue;
      const digest = createHash('sha256').update(git(['cat-file', 'blob', oid])).digest('hex');
      if (digest !== expected) throw Error('Generated HTML changed in Git history; review its secret-scan exception: ' + file);
    }
    // Check the working copy too; an uncommitted replacement is not trusted.
    try {
      const digest = createHash('sha256').update(await fs.readFile(path.join(root, file))).digest('hex');
      if (digest !== expected) throw Error('Generated HTML changed in working tree: ' + file);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    patterns.push('^' + file.replaceAll('.', '\\.') + '$');
  }
  return patterns.join('\n') + '\n';
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const output = process.argv.slice(2).find(arg => arg.startsWith('--output='))?.slice(9);
  if (!output) throw Error('An exclusion output path is required');
  const {files} = JSON.parse(await fs.readFile('.github/trufflehog-generated-images.json', 'utf8'));
  const patterns = await checkedExclusions(process.cwd(), files);
  await fs.writeFile(output, patterns);
  console.log(`${Object.keys(files).length} exact generated HTML exceptions verified across Git history.`);
}
