import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
const bundled=await build({entryPoints:['src/utils/reading-state.ts'],bundle:true,write:false,format:'esm',platform:'node'});
const {safeReadingPath,normalizeReadingState}=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
test('reading URLs stay local and in a supported language',()=>{for(const bad of ['https://evil.test','//evil.test','/fr/../../x','/fr/../%2e%2e/x','/fr/\\evil','/fr/a\nb'])assert.equal(safeReadingPath(bad),null);assert.equal(safeReadingPath('/fr/blog/a/?x=1#section'),'/fr/blog/a/');});
test('corrupt state cannot create unsafe links or invalid progress',()=>{assert.deepEqual(normalizeReadingState(null),{version:1,saved:[],progress:[],completed:[]});const state=normalizeReadingState({saved:[{url:'/fr/blog/a/',title:'A'},{url:'/fr/blog/a/',title:'B'},{url:'javascript:alert(1)',title:'X'}],progress:[{url:'/fr/blog/a/',title:'A',ratio:20},{url:'/en/blog/a/',title:'B',ratio:'NaN'}],completed:['/fr/blog/a/','/fr/blog/a/','//evil.test']});assert.equal(state.saved.length,1);assert.equal(state.progress.length,1);assert.equal(state.progress[0].ratio,1);assert.deepEqual(state.completed,['/fr/blog/a/']);});
test('saved collections have a bounded size',()=>{const saved=Array.from({length:250},(_,i)=>({url:`/fr/blog/${i}/`,title:'A'.repeat(400)}));const state=normalizeReadingState({saved});assert.equal(state.saved.length,200);assert.equal(state.saved[0].title.length,300);});
