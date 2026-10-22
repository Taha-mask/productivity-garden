import { useEffect, useRef, useState } from 'react';
import { usePreferences } from './game/usePreferences.js';
import SeedBank from './components/SeedBank.jsx';
import Garden from './components/Garden.jsx';
import Catalogue from './components/Catalogue.jsx';
import MeaningfulStepPanel from './components/MeaningfulStepPanel.jsx';
import TaskDrawer from './components/TaskDrawer.jsx';
import HelpPage from './components/HelpPage.jsx';
import DataControls from './components/DataControls.jsx';
import Dialog from './components/Dialog.jsx';
import HarvestReveal from './components/HarvestReveal.jsx';
import { useGarden, useNow } from './game/useGarden.js';
import { isStuck } from './game/reducer.js';
import { useMeaningfulStep } from './meaningfulStep/useMeaningfulStep.js';
import { messages } from './i18n/messages.js';
import { browserStorage, exportGardens } from '../shared/persistence/gardenStores.js';
import { exportMeaningfulStep } from '../shared/persistence/meaningfulStepStore.js';
import { downloadBackup } from '../ui/backup.js';

export default function App() {
  const [state, dispatch, persistence] = useGarden(), now = useNow();
  const step = useMeaningfulStep(state.plants);
  const [preferences, updatePreferences] = usePreferences();
  const language = preferences.language;
  const setLanguage = language => updatePreferences({ language });
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [drawer, setDrawer] = useState(false), [help, setHelp] = useState(false), [data, setData] = useState(false), [catalogue, setCatalogue] = useState(false);
  const [pendingChoice, setPendingChoice] = useState(null);
  const [drawerPrimary, setDrawerPrimary] = useState(false);
  const reopenRef = useRef(null);
  const focusPanelOnMount = useRef(false);
  const [plantRequest, setPlantRequest] = useState({ sequence: 0, primary: false }), [panelVisible, setPanelVisible] = useState(true), [exportError, setExportError] = useState(false);
  const t = messages(language);
  useEffect(()=>{if(!panelVisible)reopenRef.current?.focus()},[panelVisible]);
  useEffect(() => { document.documentElement.lang=language; document.documentElement.dir=language==='ar'?'rtl':'ltr'; document.title=t.brand; }, [language]);
  const slot = selectedSlot !== null && state.bank[selectedSlot] ? selectedSlot : state.bank.findIndex(Boolean);
  const canPlant = slot !== -1 && !persistence.error;
  const busy = persistence.saving || step.busy;
  async function plant(title,x,y,primary) {
    const next = await dispatch({type:'PLANT',slot,title,x,y,now:Date.now()});
    if (!next) return false;
    setSelectedSlot(null);
    if (primary) { const saved=next.plants.at(-1); if (!await step.choose(saved.id,saved)) setPendingChoice(saved.id); setPanelVisible(true); }
    return true;
  }
  function exportData() {
    try { const storage=browserStorage(); downloadBackup({...exportGardens(storage),meaningfulStep:exportMeaningfulStep(storage)}); setExportError(false); }
    catch { setExportError(true); }
  }
  const [freshSlot, setFreshSlot] = useState(null), [revealResult, setRevealResult] = useState(null);
  async function complete(id) {
    const before = state.bank;
    const next = await dispatch({type:'COMPLETE',id});
    // Briefly highlight the slot that received the reward seed (idea from the reference app).
    const slotIndex = next ? next.bank.findIndex((seed, i) => seed && !before[i]) : -1;
    if (slotIndex >= 0) { setFreshSlot(slotIndex); setTimeout(() => setFreshSlot(null), 3000); }
    // Optional reveal, only when the user turned it on; the result is already saved.
    const reward = next?.lastReward, grown = reward && next.plants.find(p => p.id === reward.plantId);
    if (preferences.reveal && grown) setRevealResult({ matureId: reward.matureId, tier: grown.tier, seed: slotIndex >= 0 ? reward.seed : null });
    return next;
  }
  return <div className="app">
    <header className="app-header"><a className="brand" href="#">✳ <span>{t.brand}<small>{t.tagline}</small></span></a>
      <nav aria-label={t.brand}><button onClick={()=>setCatalogue(true)}>{t.catalog}</button><button onClick={()=>setData(true)}>{t.data}</button><button onClick={()=>setHelp(true)}>{t.help}</button><button lang={language==='ar'?'en':'ar'} onClick={()=>setLanguage(language==='ar'?'en':'ar')}>{language==='ar'?'English':'العربية'}</button></nav>
    </header>
    {(persistence.error||step.error||exportError) && <div className="save-alert" role="alert"><p>{t.saveError}</p><button disabled={busy} onClick={()=>{persistence.retry();step.retry();setExportError(false)}}>{t.retry}</button><button onClick={exportData}>{t.export}</button></div>}
    {pendingChoice !== null && <div className="save-alert" role="alert"><p>{t.partial}</p><button disabled={busy} onClick={async()=>{step.retry();if(await step.choose(pendingChoice))setPendingChoice(null)}}>{t.retryChoice}</button></div>}
    <main className="garden-layout">
      <section className="garden-column" aria-label={t.brand}>
        <Garden mode={preferences.mode} onModeChange={mode=>updatePreferences({mode})} onRename={(id,title)=>dispatch({type:'RENAME',id,title})} onArchive={()=>dispatch({type:'ARCHIVE_COMPLETED'})} onRestore={()=>dispatch({type:'RESTORE_ARCHIVED'})} plants={state.plants} now={now} canPlant={canPlant} busy={busy||Boolean(persistence.error)} onPlant={plant} onComplete={complete} onUproot={id=>dispatch({type:'UPROOT',id})} plantRequest={plantRequest} t={t}/>
        <div className="bank-row"><div><p className="eyebrow">{t.seedBank}</p><p>{t.noPressure}</p></div><SeedBank bank={state.bank} selected={slot} fresh={freshSlot} onSelect={setSelectedSlot} t={t}/></div>
        {!canPlant && !persistence.error && <p className="quiet">{t.noSeeds}</p>}
        {isStuck(state) && <div className="save-alert"><p>{t.stuck}</p><button disabled={busy||Boolean(persistence.error)} onClick={()=>dispatch({type:'RESTART'})}>{t.restart}</button></div>}
      </section>
      <aside className="step-column">
        {panelVisible ? <MeaningfulStepPanel focusOnMount={focusPanelOnMount.current} task={step.task} active={step.state.active} completed={step.state.active?.entry==='react' && state.plants.some(p=>p.id===step.state.active.taskId && p.plantedAt===step.state.active.taskCreatedAt && p.matureId)} busy={step.busy} gameBusy={persistence.saving||Boolean(persistence.error)} error={step.error}
          onChoose={()=>{setDrawerPrimary(true);setDrawer(true)}} onChange={()=>{setDrawerPrimary(false);setDrawer(true)}} onStart={step.start} onClear={step.clear} onEdit={step.edit} onComplete={complete} onDismiss={()=>setPanelVisible(false)} t={t}/>
        : <button ref={reopenRef} onClick={()=>{focusPanelOnMount.current=true;setPanelVisible(true)}}>{t.choose}</button>}
        <button className="other-tasks" onClick={()=>{setDrawerPrimary(false);setDrawer(true)}}>{t.otherTasks} ↗</button>
      </aside>
    </main>
    <TaskDrawer open={drawer} onClose={()=>setDrawer(false)} plants={state.plants} disabled={busy||Boolean(step.error)||Boolean(persistence.error)} canPlant={canPlant} t={t}
      onChoose={async p=>{if(await step.choose(p.id)){setDrawer(false);setPanelVisible(true);setPendingChoice(null)}}}
      onPlant={()=>{setDrawer(false);setPlantRequest(request=>({sequence:request.sequence+1,primary:drawerPrimary}))}}/>
    <HelpPage open={help} onClose={()=>setHelp(false)} t={t}/>
    <DataControls open={data} onClose={()=>setData(false)} onExport={exportData} onDelete={async()=>{const erased=await step.erase();if(erased)setPendingChoice(null);return erased}} busy={busy} error={step.error||exportError} reveal={preferences.reveal} onRevealChange={reveal=>updatePreferences({reveal})} t={t}/>
    <HarvestReveal result={revealResult} onClose={()=>setRevealResult(null)} t={t} language={language}/>
    <Dialog open={catalogue} onClose={()=>setCatalogue(false)} title={t.catalog}><div className="dialog-heading"><h2>{t.catalog}</h2><button onClick={()=>setCatalogue(false)}>{t.close}</button></div><Catalogue matured={state.matured} t={t} language={language}/></Dialog>
  </div>;
}
