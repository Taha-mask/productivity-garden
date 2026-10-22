import { createGarden3D } from './garden3d.js';
import './data.js';
import { STANDALONE } from './shared/game/profiles.js';
import { stageAt } from './shared/game/rules.js';
import { createInitialState, transition } from './shared/game/transitions.js';
import { createGardenStore, browserStorage, exportGardens } from './shared/persistence/gardenStores.js';
import { downloadBackup } from './ui/backup.js';
const PLANTS = window.PLANTS;
const $=s=>document.querySelector(s);
const store=createGardenStore(browserStorage(),STANDALONE,PLANTS);
let loaded=store.load(()=>createInitialState(STANDALONE,Math.random,PLANTS));
let state=loaded.state, storageError=loaded.error, saving=false;
let selected=state.seeds.findIndex(Boolean),position={x:50,y:50}, gardenScene=null;
const plantById=id=>PLANTS.find(p=>p.id===id);
const stage=p=>stageAt(p.created,Date.now(),STANDALONE)-1;
async function commit(action){
 if(storageError||saving){toast(storageError?.message||'Saving your last change.');return false;}
 saving=true;
 try{const next=transition(state,action,STANDALONE,Math.random,PLANTS);await store.commitAsync(next);state=next;render();return true;}
 catch(error){storageError=error;showStorageStatus();toast(error.message);return false;}
 finally{saving=false;}
}
function showStorageStatus(){
 $('#storageStatus').hidden=!storageError;
 $('#storageMessage').textContent=storageError?.message||'';
}
$('#retryStorage').onclick=()=>{loaded=store.load(()=>createInitialState(STANDALONE,Math.random,PLANTS));state=loaded.state;storageError=loaded.error;selected=state.seeds.findIndex(Boolean);showStorageStatus();render()};
$('#exportData').onclick=()=>{try{downloadBackup(exportGardens(browserStorage()))}catch{toast('Your browser could not read saved data for export.')}};
window.addEventListener('storage',event=>{if(event.key===store.key||event.key===null){storageError=new Error('This garden changed in another tab. Retry to load the latest progress.');showStorageStatus()}});
function toast(msg){$('#toast').textContent=msg;$('#toast').style.display='block';clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>$('#toast').style.display='none',4000)}
function render(){
 $('#date').textContent=new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}).toUpperCase();
 $('#completed').textContent=Object.values(state.counts).reduce((a,b)=>a+b,0);$('#found').textContent=Object.keys(state.counts).length+'/15';
 $('#empty').hidden=state.garden.length>0;
 gardenScene?.setPlants(state.garden.map(p=>({...p,stage:stage(p)+1,tier:plantById(p.seed).tier,variant:PLANTS.filter(q=>q.tier===plantById(p.seed).tier).findIndex(q=>q.id===p.seed)})));
 $('#taskList').replaceChildren();state.garden.forEach(p=>{const b=document.createElement('button');b.className='task-chip';b.textContent=(p.done?'✓ ':'◦ ')+p.title;b.onclick=()=>showTask(p.id);$('#taskList').append(b)});
 $('#seeds').replaceChildren();Array.from({length:5},(_,i)=>{const id=state.seeds[i],b=document.createElement('button');b.className='seed'+(selected===i?' selected':'');b.disabled=!id;b.setAttribute('aria-label',id?plantById(id).tier+' mystery seed '+(i+1):'Empty seed slot');const icon=document.createElement('span');icon.textContent=id?'🫘':'·';const small=document.createElement('small');small.textContent=id?plantById(id).tier:'empty';b.append(icon,small);b.onclick=()=>{selected=i;render()};$('#seeds').append(b)});
 renderCatalog();
}
function renderCatalog(){$('#catalog').replaceChildren();PLANTS.forEach(p=>{const n=state.counts[p.id]||0,b=document.createElement('button');b.className='card'+(!n?' locked':'');const icon=document.createElement('span');icon.className='sprite';icon.textContent=p.emoji;const tier=document.createElement('small');tier.textContent=p.tier+' · '+n+' grown';const name=document.createElement('h3');name.textContent=n?p.name:'Undiscovered';const hint=document.createElement('p');hint.textContent=n?'A little magic, earned by you.':'Complete a task to reveal this plant.';b.append(icon,tier,name,hint);b.onclick=()=>showPlant(p,n);$('#catalog').append(b)})}
function startPlant(x=50,y=50){if(selected<0||!state.seeds[selected])return toast('Choose an available seed first.');position={x,y};if(!$('#plantDialog').open)$('#plantDialog').showModal();$('#taskTitle').focus()}
$('#plantCenter').onclick=()=>startPlant();
$('#garden').onkeydown=e=>{if(e.target===$('#garden')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();startPlant()}};
$('#cancel').onclick=()=>$('#plantDialog').close();
$('#plantForm').onsubmit=async e=>{e.preventDefault();const title=$('#taskTitle').value.trim();if(!title||!state.seeds[selected])return;
if(await commit({type:'PLANT',slot:selected,title,...position,now:Date.now(),id:crypto.randomUUID()})){selected=state.seeds.findIndex(Boolean);render();$('#plantDialog').close();$('#plantForm').reset();toast('A small beginning. Your task is planted. 🌱')}};

function detail(title,text,emoji){const wrap=document.createElement('div');wrap.className='reveal';const icon=document.createElement('div');icon.className='big';icon.textContent=emoji;const h=document.createElement('h2');h.textContent=title;const p=document.createElement('p');p.textContent=text;wrap.append(icon,h,p);$('#detail').replaceChildren(wrap);return wrap}
function showPlant(p,n){detail(p.name,p.description+' '+(n?'You have grown '+n+'.':'You haven’t grown this plant yet.'),p.emoji);$('#detailDialog').showModal()}
function showTask(id){const p=state.garden.find(x=>x.id===id),info=plantById(p.seed);if(p.done){showPlant(info,state.counts[info.id]);return}const wrap=detail(p.title,'Growth stage '+(stage(p)+1)+' of 5. Complete your task whenever you’re ready to reveal your plant.',['🫘','🌱','🌿','☘️','🪴'][stage(p)]);const b=document.createElement('button');b.className='primary';b.textContent='✓ I completed this task';b.onclick=()=>complete(id);wrap.append(b);$('#detailDialog').showModal()}
async function complete(id){const p=state.garden.find(x=>x.id===id);if(!p||p.done)return;if(!state.seeds.includes(null))return toast('Your seed bank is full. Plant a seed first.');
const before=state.seeds.slice();if(!await commit({type:'COMPLETE',id}))return;
const issued=state.seeds.find((seed,i)=>seed&&before[i]===null),reward=plantById(issued).tier;
if(selected<0)selected=state.seeds.findIndex(Boolean);render();const info=plantById(p.seed);detail(info.name,info.description+' A new '+reward+' seed is waiting in your seed bank.',info.emoji);toast('Task complete. Meet your new plant! ✨')}

$('#closeDetail').onclick=()=>$('#detailDialog').close();
function view(catalog){$('#gardenView').hidden=catalog;$('#catalogView').hidden=!catalog;$('#gardenNav').classList.toggle('active',!catalog);$('#catalogNav').classList.toggle('active',catalog);$('#pageTitle').textContent=catalog?'A collection of little wonders.':'Your focus. In bloom.';$('#subtitle').textContent=catalog?'Fifteen magical plants. Each one has a story waiting to be discovered.':'Plant a task, give it your attention, and watch something wonderful grow.'}
$('#gardenNav').onclick=()=>view(false);$('#catalogNav').onclick=()=>view(true);$('#sound').onclick=()=>{detail('A growing guide','Click the island to plant. Drag to rotate, scroll or pinch to zoom. Click a growing plant or its task below to complete it. Plants grow through five stages, advancing every 5 minutes. Basic seeds reward basic or rare equally. Rare and extinct seeds reward 25% basic, 50% rare, 25% extinct.','🌿');$('#detailDialog').showModal()};
try{gardenScene=createGarden3D($('#scene'),{onGroundClick:(x,y)=>startPlant(x,y),onPlantClick:showTask,onError:()=>{$('#sceneStatus').textContent='3D unavailable on this device. Use “Plant a task” and the task buttons below.'}})}catch(error){$('#sceneStatus').textContent='3D unavailable on this device. Use “Plant a task” and the task buttons below.';console.error(error)}
$('#resetView').onclick=()=>gardenScene?.resetView();
// A page kept in the back/forward cache must retain its live scene.
window.addEventListener('pagehide',event=>{if(!event.persisted)gardenScene?.dispose()});
setInterval(render,30000);showStorageStatus();render();
