import { useEffect, useRef } from 'react';
export default function Dialog({ open, onClose, title, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement;
    ref.current.showModal();
    return () => { ref.current?.close(); if (opener?.isConnected) opener.focus(); };
  }, [open]);
  return <dialog className="garden-dialog" ref={ref} aria-label={title} onCancel={e => { e.preventDefault(); onClose(); }}>
    {open && children}
  </dialog>;
}
