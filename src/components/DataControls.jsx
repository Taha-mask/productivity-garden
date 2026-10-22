import { useEffect, useState } from 'react';
import Dialog from './Dialog.jsx';
export default function DataControls({ open, onClose, onExport, onDelete, busy, error, reveal = false, onRevealChange, legacyImported, reserveCount=0, canClaim, onLegacyImport, onClaimLegacy, t }) {
  const [confirming, setConfirming] = useState(false), [legacyMessage,setLegacyMessage] = useState('');
  useEffect(() => { if (!open) setConfirming(false); }, [open]);
  return <Dialog open={open} onClose={onClose} title={t.data}>
    <div className="dialog-heading"><h2>{t.data}</h2><button onClick={onClose}>{t.close}</button></div>
    {onRevealChange && <><label className="checkbox-label"><input type="checkbox" checked={reveal} onChange={e => onRevealChange(e.target.checked)}/>{t.revealToggle}</label><p className="quiet">{t.revealNote}</p><hr/></>}
    <section><h3>{t.legacyTitle}</h3><p>{t.legacyNote}</p>
      {legacyImported ? <p>{t.legacyDone}</p> : <button disabled={busy} onClick={async()=>{try {const next=await onLegacyImport();setLegacyMessage(next?t.legacyDone:t.legacyEmpty)} catch {setLegacyMessage(t.saveError)}}}>{t.legacyImport}</button>}
      {legacyMessage && <p role="status">{legacyMessage}</p>}
      {reserveCount>0 && <><p>{t.legacyReserve}: {reserveCount}</p><button disabled={busy||!canClaim} onClick={onClaimLegacy}>{t.legacyClaim}</button></>}
    </section><hr/>
    <p>{t.privacy}</p><button onClick={onExport}>{t.export}</button><hr/><p>{t.deleteNote}</p>
    {error && <p role="alert">{t.saveError}</p>}
    {confirming ? <><p>{t.eraseConfirm}</p><div className="button-row"><button disabled={busy} onClick={async () => { if (await onDelete()) { setConfirming(false); onClose(); } }}>{t.erase}</button><button onClick={() => setConfirming(false)}>{t.cancel}</button></div></> : <button className="danger" disabled={busy} onClick={() => setConfirming(true)}>{t.erase}</button>}
  </Dialog>;
}
