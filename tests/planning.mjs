import assert from 'node:assert/strict';
import {makeProject,cycleExists,blockedBy,moveItem,codingPrompt,demoWorkspace} from '../src/planner-model.ts';
const p=makeProject('Test orchard','A 2D farming game where players plant crops, collect resources and craft new tools.','2D','Mobile');
assert.equal(p.milestones.length,4);assert.ok(p.items.some(i=>i.title==='Farming & growth cycle'));assert.ok(p.items.some(i=>i.title==='Inventory & resource economy'));
for(const kind of ['System','Scene','Asset','AI task'])assert.ok(p.items.some(i=>i.kind===kind));
assert.equal(new Set(p.items.map(i=>i.id)).size,p.items.length);
for(const i of p.items){assert.equal(cycleExists(p.items,i.id,i.dependencies),false);for(const d of i.dependencies)assert.ok(p.items.some(x=>x.id===d));}
const [first,second,third]=p.items;
assert.equal(cycleExists(p.items,first.id,[third.id]),true);assert.equal(blockedBy(second,p.items).length,1);
const done=moveItem(p,first.id,'Done');assert.equal(blockedBy(done.items.find(i=>i.id===second.id),done.items).length,0);
const moved=moveItem(p,third.id,'Ready',first.id);assert.equal(moved.items[0].id,third.id);assert.equal(moved.items[0].status,'Ready');assert.equal(p.items[2].status,'Backlog');
const prompt=codingPrompt(p,third);for(const text of ['Test orchard','Mobile','ACCEPTANCE CRITERIA','DEPENDENCIES','Unity version','validation results'])assert.ok(prompt.includes(text));
const multi=makeProject('Coop racer','An online multiplayer racing game with vehicle upgrades and combat.');assert.ok(multi.items.some(i=>i.title==='Multiplayer session architecture'));assert.ok(multi.items.some(i=>i.title==='Vehicle handling & race flow'));
const demo=demoWorkspace();assert.ok(demo.projects.some(p=>p.id===demo.activeId));assert.equal(demo.projects[0].items.filter(i=>i.status==='Done').length,2);
console.log('PASS: generation, genre-specific systems, all item types, valid dependencies, cycle detection, blockers, status/reorder, immutable updates, coding briefs and sample state.');
