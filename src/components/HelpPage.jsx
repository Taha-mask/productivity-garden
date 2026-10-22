import Dialog from './Dialog.jsx';
export default function HelpPage({ open, onClose, t }) {
  return <Dialog open={open} onClose={onClose} title={t.help}><div className="dialog-heading"><h2>{t.help}</h2><button onClick={onClose}>{t.close}</button></div><p>{t.helpIntro}</p><p>{t.experiment}</p><p>{t.helpPersistent}</p><details><summary>{t.urgent}</summary><p>{t.helpUrgent}</p></details></Dialog>;
}
