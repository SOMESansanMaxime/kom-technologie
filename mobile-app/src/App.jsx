import { useState } from 'react'
import EnginScan from './EnginScan.jsx'
import Catalogue from './Catalogue.jsx'

const C = { bitume: '#16140F', jaune: '#F2B705', laterite: '#B4541E', acier: '#5C6670', creme: '#EDE6D6' }

export default function App() {
  const [tab, setTab] = useState('scan')

  return (
    <div style={{ minHeight: '100vh', background: C.bitume, paddingBottom: 72 }}>
      {tab === 'scan'      ? <EnginScan />  : null}
      {tab === 'catalogue' ? <Catalogue />  : null}

      {/* Barre de navigation basse */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#211E16', borderTop: `2px solid #2E2A20`,
        display: 'flex', zIndex: 1000,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}>
        <TabBtn id="scan"      label="Scanner"   icon="📸" active={tab === 'scan'}      onClick={() => setTab('scan')} />
        <TabBtn id="catalogue" label="Catalogue" icon="📋" active={tab === 'catalogue'} onClick={() => setTab('catalogue')} />
      </nav>
    </div>
  )
}

function TabBtn({ id, label, icon, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: '12px 8px 10px',
      background: 'none', border: 'none', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      color: active ? C.jaune : C.acier,
      transition: 'color .15s'
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 11, fontFamily: 'Archivo, sans-serif', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</span>
      {active && <div style={{ width: 24, height: 3, background: C.jaune, borderRadius: 2 }} />}
    </button>
  )
}
