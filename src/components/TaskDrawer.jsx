import Dialog from './Dialog.jsx';
export default function TaskDrawer({ open, onClose, plants, onChoose, onPlant, t, disabled, canPlant }) {
  return <Dialog open={open} onClose={onClose} title={t.drawerTitle}>
    <div className="dialog-heading"><h2>{t.drawerTitle}</h2><button onClick={onClose}>{t.close}</button></div>
    <div className="task-options">
      {plants.filter(p => !p.matureId).map(p => <button disabled={disabled} key={p.id} onClick={() => onChoose(p)} dir="auto">🌱 {p.title}</button>)}
      {!plants.some(p => !p.matureId) && <p>{t.noTasks}</p>}
    </div>
    <button className="primary" disabled={disabled || !canPlant} onClick={onPlant}>＋ {t.plantNew}</button>{!canPlant && <p>{t.noSeeds}</p>}
  </Dialog>;
}
