export type Kind = 'System' | 'Scene' | 'Asset' | 'AI task';
export type Status = 'Backlog' | 'Ready' | 'In progress' | 'Done';
export type Item = {id:string;title:string;kind:Kind;status:Status;description:string;priority:'High'|'Medium'|'Low';milestone:string;dependencies:string[];effort:number;criteria:string;notes:string};
export type Milestone = {id:string;title:string;target:string;description:string};
export type Project = {id:string;name:string;idea:string;dimension:string;platform:string;items:Item[];milestones:Milestone[]};
export type Workspace = {projects:Project[];activeId:string};
export const kinds:Kind[]=['System','Scene','Asset','AI task'];
export const statuses:Status[]=['Backlog','Ready','In progress','Done'];
export const uid=()=>typeof crypto.randomUUID==='function'?crypto.randomUUID():Array.from(crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,'0')).join('');
export function cycleExists(items:Item[],id:string,deps:string[]):boolean {
 const map=new Map(items.map(i=>[i.id,i.id===id?deps:i.dependencies]));
 const path=new Set<string>(),visited=new Set<string>();
 function visit(n:string):boolean{if(path.has(n))return true;if(visited.has(n))return false;path.add(n);for(const d of map.get(n)||[])if(visit(d))return true;path.delete(n);visited.add(n);return false;}
 return items.some(i=>visit(i.id));
}
export const blockedBy=(item:Item,items:Item[])=>items.filter(i=>item.dependencies.includes(i.id)&&i.status!=='Done');
export function moveItem(project:Project,id:string,status:Status,before?:string):Project {
 const item=project.items.find(i=>i.id===id);if(!item)return project;
 const items=project.items.filter(i=>i.id!==id);const at=before?items.findIndex(i=>i.id===before):-1;
 items.splice(at<0?items.length:at,0,{...item,status});return {...project,items};
}
export function makeProject(name:string,idea:string,dimension='3D',platform='PC'):Project{
 const id=uid();const mids=['m1','m2','m3','m4'].map(x=>id+x);
 const milestones:Milestone[]=[{id:mids[0],title:'Foundation',target:'',description:'Establish the project and prove the core interaction.'},{id:mids[1],title:'Playable prototype',target:'',description:'Connect the core loop in one playable scene.'},{id:mids[2],title:'Vertical slice',target:'',description:'Bring a short, polished experience to target quality.'},{id:mids[3],title:'Release candidate',target:'',description:'Validate performance, save compatibility and a distributable build.'}];
 const items:Item[]=[];
 const add=(title:string,kind:Kind,m:number,description:string,dependencies:string[]=[],criteria='Behavior is verified in Play Mode; no new Console errors.',effort=3)=>{const item:Item={id:uid(),title,kind,status:'Backlog',description,priority:m<2?'High':'Medium',milestone:mids[m],dependencies,effort,criteria,notes:''};items.push(item);return item.id;};
 const bootstrap=add('Unity project foundation','AI task',0,`Prepare a ${dimension} Unity project for ${platform}. Inspect the installed Editor version, render pipeline and packages first. Propose folder structure, assemblies and an input approach appropriate to this game.`,[],'Project opens and compiles cleanly. A test build launches on the selected platform. Document package and pipeline choices.',2);
 const player=add('Player movement & camera','System',0,`Define responsive ${dimension} movement, input mapping and camera behavior for: ${idea}`,[bootstrap],'Movement and camera are usable at different frame rates. Input can be disabled during menus.');
 const codePlayer=add('Implement player controller','AI task',0,'Create a controller and camera implementation that matches the movement design. Inspect existing input and physics conventions; expose tuning parameters in the Inspector.',[player],'Test movement, collision boundaries, camera limits and pausing. Provide setup instructions and modified file paths.',4);
 const main=add('Core gameplay loop','System',1,`Turn this idea into a repeatable player action, feedback and progression loop: ${idea}`,[codePlayer],'A player can complete a full loop, understand feedback, and start the next loop.',5);
 const text=idea.toLowerCase();
 const specs:[RegExp,string,string][]=[[/combat|shoot|fight|enemy|enemies|battle|rogue/,'Combat & enemy behavior','Specify damage, targeting, enemy states, spawning and feedback.'],[/craft|resource|salvag|mining|inventory|collect/,'Inventory & resource economy','Define item data, collection, capacity, crafting or exchange rules.'],[/farm|crop|garden/,'Farming & growth cycle','Define planting, growth stages, harvesting and time progression.'],[/puzzle|riddle|logic/,'Puzzle state & interactions','Define puzzle rules, reset behavior, hints and win conditions.'],[/platform|jump/,'Platforming & traversal','Define jumping, grounded checks, hazards, checkpoints and level traversal.'],[/rac(e|ing)|vehicle|driv/,'Vehicle handling & race flow','Define driving, checkpoints, laps, timing and race completion.'],[/dialog|story|narrative|quest/,'Quests & dialogue','Define quest states, dialogue branches and progression conditions.'],[/surviv|hunger|thirst/,'Survival & world simulation','Define survival resources, depletion, recovery and failure conditions.'],[/multiplayer|co.?op|online/,'Multiplayer session architecture','Decide authority, replication, ownership and reconnect behavior before implementation.']];
 const features=specs.filter(s=>s[0].test(text)).slice(0,4);
 if(!features.length)features.push([/./,'Progression & game rules','Define goals, progression, rewards and failure or restart behavior.']);
 const featureIds=features.map(([,title,desc])=>{const sys=add(title,'System',1,`${desc}\nGame context: ${idea}`,[main],'Rules and edge cases are documented. A player can exercise the feature in a test scene.');add(`Implement ${title.toLowerCase()}`,'AI task',1,`${desc} Keep responsibilities separate, use data-driven configuration where useful, and integrate with the core loop.`,[sys],'Feature meets the design criteria, handles invalid input, and passes a focused Play Mode test.',5);return sys;});
 const world=add('Prototype gameplay scene','Scene',1,'Build a small graybox environment that demonstrates one complete loop. Include spawn, camera, lighting and reset flow.',[codePlayer,main],'Spawn, play, complete or fail, then restart without errors.',4);
 add('Main menu & onboarding','Scene',2,'Create an entry scene with play, settings and a concise first-time explanation. Select UI framework from the existing project.',[world],'Menu works with target input devices. Scene transitions and return flow work.',3);
 add('Test sandbox','Scene',0,'Create an isolated scene for controller, interaction and system edge cases.',[bootstrap],'A developer can reproduce and verify core mechanics without playing the entire game.',2);
 const art=add('Environment kit','Asset',2,`Plan a cohesive ${dimension} environment kit for this game. List modular pieces, scale, palette and visual references. Use AI for concepts or base assets, then review topology, colliders, materials and licensing.`,[world],'Assets meet a documented scale and art direction. Materials, collisions and platform budgets are checked.',5);
 add('Player & interaction assets','Asset',2,`Specify ${dimension==='2D'?'sprites, sprite sheets and animations':'models, rigs and animation clips'} needed for player actions and interactive objects. Define consistent naming and import settings.`,[player],'All gameplay states have suitable visuals. Animation transitions and import settings are verified.',4);
 add('Audio & interface kit','Asset',2,'List sound effects, music direction, HUD elements and icons. Create AI generation briefs with consistent style and technical export requirements.',[main],'UI remains legible and audio feedback covers major actions. Source and license records are retained.',3);
 const save=add('Save, settings & recovery','System',2,'Define versioned save data and settings. Handle missing, corrupt or outdated saves with clear recovery behavior.',[...featureIds],'Progress persists after restart. Invalid saves fail safely. Settings apply correctly.',4);
 add('Polish the playable slice','AI task',2,'Integrate approved art and sound. Refine feedback, transitions, onboarding and difficulty around a short representative play session.',[art,world,save],'A fresh player can finish the slice without developer help. Record playtest findings.',5);
 add('Build & performance validation','AI task',3,`Validate a ${platform} build on representative hardware. Inspect Console, memory, frame time, input, save/load and scene transitions. Document actual evidence and remaining issues.`,[save,art],'A clean build launches. Core loop and save/load work. Performance meets a chosen budget. Blocking defects are resolved.',4);
 items[0].status='Ready';
 return {id,name:name.trim(),idea:idea.trim(),dimension,platform,items,milestones};
}
export function demoWorkspace():Workspace{
 const p=makeProject('Orbit Salvager','A cozy space exploration game where you salvage abandoned stations, collect resources, craft upgrades and restore your little spaceship.','3D','PC');
 p.items[0].status='Done';p.items[1].status='Done';p.items[2].status='In progress';p.items[3].status='Ready';
 p.milestones[0].target='2026-11-02';p.milestones[1].target='2026-11-16';p.milestones[2].target='2026-12-07';p.milestones[3].target='2026-12-21';
 return {projects:[p],activeId:p.id};
}
export function codingPrompt(p:Project,i:Item):string {
 const deps=p.items.filter(d=>i.dependencies.includes(d.id));
 return `You are implementing a scoped task in an existing Unity project.\n\nPROJECT\n${p.name} · ${p.dimension} · ${p.platform}\n${p.idea}\n\nTASK\n${i.title}\n${i.description}\n\nDEPENDENCIES\n${deps.map(d=>`- ${d.title} [${d.status}]`).join('\n')||'None'}\n\nACCEPTANCE CRITERIA\n${i.criteria}\n\nWORKFLOW\n1. Inspect Unity version, render pipeline, input system, assemblies, scene structure and existing conventions. Identify missing decisions before coding.\n2. Summarize the approach and make the smallest cohesive implementation. Avoid inventing APIs or replacing working systems.\n3. Include scene/prefab setup steps and Inspector configuration. Do not modify unrelated assets.\n4. Run available compilation and focused tests; validate in Play Mode and on ${p.platform} when possible. Clearly distinguish tested evidence from unverified assumptions.\n5. Report changed paths, setup steps, validation results and remaining risks.\n\nNOTES\n${i.notes||'No additional constraints.'}`;
}
