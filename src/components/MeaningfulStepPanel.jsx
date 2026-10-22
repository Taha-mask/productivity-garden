import { useEffect, useRef, useState } from 'react';
export default function MeaningfulStepPanel({ focusOnMount, task, active, completed, busy, gameBusy, error, onChoose, onChange, onStart, onClear, onEdit, onComplete, onDismiss, t }) {
  const [editing, setEditing] = useState(false), [text, setText] = useState('');
  const fieldRef=useRef(null), editRef=useRef(null), startRef=useRef(null), chooseRef=useRef(null);
  const wasEditing=useRef(false), previousTask=useRef(task?.id);
  useEffect(()=>{if(focusOnMount)(task?startRef:chooseRef).current?.focus({preventScroll:true})},[]);
  useEffect(()=>{
    if(editing)fieldRef.current?.focus();
    else if(wasEditing.current)editRef.current?.focus();
    wasEditing.current=editing;
  },[editing]);
  useEffect(()=>{
    if(previousTask.current!==task?.id){(task?startRef:chooseRef).current?.focus();previousTask.current=task?.id;}
  },[task?.id]);
  useEffect(() => { setEditing(false); setText(active?.step || ''); }, [active?.taskId]);
  return <section className="meaningful-panel" aria-labelledby="step-heading">
    <p className="eyebrow">{t.forNow}</p>
    <h2 id="step-heading" dir="auto">{task ? task.title : completed ? t.completed : t.emptyTitle}</h2>
    {!task ? <><p>{active?.taskCreatedAt===undefined&&active ? t.reconfirm : t.emptyText}</p><button ref={chooseRef} className="primary" onClick={onChoose}>{t.choose}</button><button className="text-button" onClick={onDismiss}>{t.notNow}</button><p className="quiet">{t.noPressure}</p></>
      : <>
        {editing ? <form onSubmit={async e => { e.preventDefault(); if (await onEdit(text)) setEditing(false); }}>
          <label htmlFor="small-step">{t.stepLabel}</label>
          <textarea ref={fieldRef} id="small-step" dir="auto" value={text} onChange={e => setText(e.target.value)} maxLength={240} placeholder={t.stepHint} rows={3}/>
          <div className="button-row"><button disabled={busy} type="submit">{t.save}</button><button type="button" onClick={() => setEditing(false)}>{t.cancel}</button></div>
        </form> : <>
          {active?.step.trim() && <p className="first-step" dir="auto">{active.step}</p>}
          <button ref={editRef} className="text-button" onClick={() => { setText(active?.step || ''); setEditing(true); }}>{active?.step.trim() ? t.editStep : t.addStep}</button>
        </>}
        <button ref={startRef} className="primary start-button" disabled={busy || Boolean(error)} onClick={onStart}>{t.start} ↗</button>
        <p className="start-note" role="status">{active?.startedAt !== null ? t.started : '\u00a0'}</p>
        <div className="button-row"><button disabled={busy} onClick={onChange}>{t.change}</button><button disabled={busy} onClick={onClear}>{t.later}</button></div>
        <button className="text-button complete-button" disabled={busy||gameBusy} onClick={() => onComplete(task.id)}>✓ {t.done}</button>
      </>}
  </section>;
}
