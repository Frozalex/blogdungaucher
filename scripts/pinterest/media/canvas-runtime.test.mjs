import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {animationHtml} from './motion.mjs';
import {createCanvasAnimation,digest} from './canvas-runtime.mjs';

const canvasModule=process.env.PINTEREST_CANVAS_MODULE;
const native={skip:!canvasModule&&'Set PINTEREST_CANVAS_MODULE to the temporary @napi-rs/canvas directory for native frame checks'};
const root=process.cwd();
const selected=JSON.parse(await fs.readFile('scripts/pinterest/video-storyboards.json','utf8')).find(card=>card.id==='echecs-alphazero-stockfish--angle-02');

test('native canvas frames are deterministic, animated and use the existing fonts and illustration',native,async()=>{
 const animation=await createCanvasAnimation({root,card:selected,html:animationHtml(selected),canvasModule});
 animation.draw(2);const first=await animation.png();animation.draw(2);assert.equal(digest(await animation.png()),digest(first));
 animation.draw(.1);assert.notEqual(digest(await animation.png()),digest(first),'the opening actually animates');
 let start=0;
 for(const scene of selected.scenes){for(const time of [start+.12,start+scene.duration/2,start+scene.duration-.12])assert.equal(animation.draw(time).overflow,false);start+=scene.duration}
 assert.equal(animation.canvas.width,1080);assert.equal(animation.canvas.height,1920);
 assert.equal(animation.provenance.backend,'@napi-rs/canvas');assert.ok(animation.provenance.fonts.regular);assert.ok(animation.provenance.fonts.bold);
 assert.ok(animation.provenance.images.some(image=>image.source==='embedded-svg'));
 assert.ok(animation.provenance.images.some(image=>image.source.includes(selected.slug)));
 assert.throws(()=>animation.draw(-1),/outside/);assert.throws(()=>animation.draw(animation.duration+1),/outside/);
});

test('a storyboard or timeline mismatch is refused before encoding',native,async()=>{
 await assert.rejects(createCanvasAnimation({root,card:{...selected,title:'Not reviewed'},html:animationHtml(selected),canvasModule}),/does not embed/);
 const changed={...selected,duration:selected.duration+1};
 await assert.rejects(createCanvasAnimation({root,card:changed,html:animationHtml(changed),canvasModule}),/timeline differs/);
});

test('the adapter refuses external images and unsupported document behavior',native,async()=>{
 const html=animationHtml(selected);
 await assert.rejects(createCanvasAnimation({root,card:selected,html:html.replace("hero.src='../assets/illustrations/'+card.slug+'.webp'","hero.src='https://example.invalid/forbidden.webp'"),canvasModule}),/local illustration/);
 await assert.rejects(createCanvasAnimation({root,card:selected,html:html.replace("document.querySelector('#film')","document.querySelector('#unsupported')"),canvasModule}),/Unsupported DOM/);
 await assert.rejects(createCanvasAnimation({root,card:selected,html:html.replace('</body>','<script src="https://example.invalid/script.js"></script></body>'),canvasModule}),/one inline/);
});

test('no implicit production dependency or browser fallback is accepted',async()=>{
 await assert.rejects(createCanvasAnimation({root,card:selected,html:animationHtml(selected)}),/explicit absolute Canvas module/);
});
