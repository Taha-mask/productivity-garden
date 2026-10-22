import { useEffect, useRef, useState } from 'react';
import GrowthStage from '../art/GrowthStage.jsx';
import MaturePlant from '../art/MaturePlant.jsx';
import Garden3D from './Garden3D.jsx';
import Dialog from './Dialog.jsx';
import { stageAt, growthProgress } from '../game/rules.js';

export default function Garden({ plants, now, canPlant, onPlant, onComplete, onUproot, plantRequest, t, busy, mode, onModeChange, onRename, onArchive, onRestore }) {
  const ref = useRef(null);
  const [draft, setDraft] = useState(null), [openId, setOpenId] = useState(null);
  const [editing, setEditing] = useState(false), [title, setTitle] = useState('');
  const visiblePlants = plants.filter(p => !p.archived);
  useEffect(() => { setEditing(false); }, [openId]);
  function startDraft(x, y, primary = false) {
    if (!canPlant || busy) return;
    setOpenId(null); setDraft({ x, y, title: '', primary });
  }
  useEffect(() => { if (plantRequest.sequence) startDraft(50, 50, plantRequest.primary); }, [plantRequest.sequence]);
  const open = plants.find(p => p.id === openId);
  const growth = open && growthProgress(open.plantedAt, now);
  return <div className="garden-wrap">
    <div className="garden-toolbar"><p>{t.gardenHint}</p><div className="view-toggle">
      {['3d', '2d'].map(m => <button key={m} aria-pressed={mode === m} onClick={() => onModeChange(m)}>{m.toUpperCase()}</button>)}
      <button disabled={!canPlant || busy} onClick={() => startDraft(50, 50)}>＋ {t.plantTask}</button>
    </div></div>
    {mode === '3d' ? <div className="garden garden-3d"><Garden3D plants={visiblePlants} now={now} onGroundClick={(x,y) => startDraft(x,y)} onPlantClick={id => { setDraft(null); setOpenId(id); }} t={t}/></div>
    : <div className="garden" ref={ref} onClick={e => {
      if (e.target !== ref.current) return;
      const rect=ref.current.getBoundingClientRect(); startDraft((e.clientX-rect.left)/rect.width*100,(e.clientY-rect.top)/rect.height*100);
    }}>{visiblePlants.map(p => <div className="plant" key={p.id} style={{left:`${p.x}%`,top:`${p.y}%`,transform:'translate(-50%, -100%)'}}>
      <button className="plant-btn" aria-label={p.title} onClick={() => setOpenId(p.id)}>{p.matureId ? <MaturePlant id={p.matureId} size={64}/> : <GrowthStage stage={stageAt(p.plantedAt, now)} size={64}/>}</button>
      <span className="plant-label" dir="auto">{p.title}</span></div>)}</div>}
    <div className="archive-controls">
      {plants.some(p => p.matureId && !p.archived) && <button disabled={busy} onClick={onArchive}>{t.archiveCompleted}</button>}
      {plants.some(p => p.archived) && <button disabled={busy} onClick={onRestore}>{t.restoreArchived}</button>}
      {plants.some(p => p.matureId) && <small>{t.archiveHint}</small>}
    </div>
    <Dialog open={Boolean(draft)} onClose={() => setDraft(null)} title={t.plantTask}>
      {draft && <form onSubmit={async e => { e.preventDefault(); if (!draft.title.trim()) return; if (await onPlant(draft.title,draft.x,draft.y,draft.primary)) setDraft(null); }}>
        <h2>{t.plantTask}</h2><label htmlFor="new-task">{t.taskTitle}</label><input autoFocus id="new-task" dir="auto" value={draft.title} required maxLength={120} placeholder={t.taskPlaceholder} onChange={e => setDraft({...draft,title:e.target.value})}/>
        <label className="checkbox-label"><input type="checkbox" checked={draft.primary} onChange={e=>setDraft({...draft,primary:e.target.checked})}/>{t.makePrimary}</label>
        <div className="button-row"><button className="primary" disabled={busy}>{t.plant}</button><button type="button" onClick={()=>setDraft(null)}>{t.cancel}</button></div>
      </form>}
    </Dialog>
    <Dialog open={Boolean(open)} onClose={()=>setOpenId(null)} title={open?.title || t.growing}>
      {open && <><div className="dialog-heading"><h2 dir="auto">{open.title}</h2><button onClick={()=>setOpenId(null)}>{t.close}</button></div>
        <p>{open.matureId ? t.matured : `${t.stage} ${stageAt(open.plantedAt,now)} ${t.of} 5`}</p>
        {!open.matureId && <div className="growth-detail">
          <progress max="1" value={growth.fraction} aria-label={t.stage}/>
          <p>{growth.remainingMs ? `${t.nextStage} ${Math.ceil(growth.remainingMs / 1000)} ${t.seconds}` : t.growthReady}</p>
          <small>{t.growthNote}</small>
        </div>}
        {editing ? <form onSubmit={async e=>{e.preventDefault();if(await onRename(open.id,title))setEditing(false)}}>
          <label htmlFor="rename-task">{t.taskTitle}</label><input id="rename-task" autoFocus dir="auto" value={title} maxLength={120} required onChange={e=>setTitle(e.target.value)}/>
          <div className="button-row"><button disabled={busy||!title.trim()}>{t.save}</button><button type="button" onClick={()=>setEditing(false)}>{t.cancel}</button></div>
        </form> : <button className="text-button" onClick={()=>{setTitle(open.title);setEditing(true)}}>{t.rename}</button>}
        {!open.matureId && <button className="primary" disabled={busy} onClick={async()=>{if(await onComplete(open.id))setOpenId(null)}}>✓ {t.done}</button>}
        <button className="text-button danger" disabled={busy} onClick={async()=>{if(await onUproot(open.id))setOpenId(null)}}>{t.uproot}</button>
      </>}
    </Dialog>
  </div>;
}
