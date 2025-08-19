// src/components/common/Toaster.jsx
import { useEffect, useState } from "react";
export function useToast() {
  const [msg, setMsg] = useState(null);
  useEffect(()=>{ if(!msg) return; const t=setTimeout(()=>setMsg(null), 1800); return ()=>clearTimeout(t); },[msg]);
  return {
    toast: (text)=>setMsg({ type:"ok", text }),
    oops:  (text)=>setMsg({ type:"err", text }),
    node: msg && (
      <div className={`tw:fixed tw:bottom-5 tw:right-5 tw:px-3 tw:py-2 tw:rounded-md tw:text-white tw:shadow-lg ${msg.type==='ok'?'tw:bg-emerald-600':'tw:bg-rose-600'}`}>
        {msg.text}
      </div>
    )
  };
}