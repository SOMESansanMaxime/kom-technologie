import { useState } from 'react'
import equipmentDatabase from './data/equipment.js'

const C = { bitume: '#16140F', bitume2: '#211E16', panel: '#2E2A20', laterite: '#B4541E', jaune: '#F2B705', acier: '#5C6670', acierClair: '#A7AEB5', creme: '#EDE6D6', vert: '#3FA34D' }
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600&display=swap');`

export default function Catalogue() {
  const [selected, setSelected] = useState(null)
  const [catFilter, setCatFilter] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = equipmentDatabase.engins.filter(e => {
    const matchCat = catFilter === 'all' || e.categorie === catFilter
    const q = query.toLowerCase()
    const matchQ = !q || e.nom.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
    return matchCat && matchQ
  })

  if (selected) return <EnginDetail engin={selected} onBack={() => setSelected(null)} />

  return (
    <div style={{ minHeight: '100vh', background: C.bitume, color: C.creme, fontFamily: 'Inter, sans-serif' }}>
      <style>{FONTS}</style>

      {/* En-tête */}
      <div style={{ padding: '60px 20px 20px', background: C.bitume2, borderBottom: `1px solid ${C.panel}` }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, letterSpacing: 2, color: C.jaune, textTransform: 'uppercase', marginBottom: 8 }}>
          📋 Base de données
        </div>
        <h1 style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 28, margin: '0 0 16px', lineHeight: 1 }}>
          CATALOGUE<span style={{ color: C.laterite }}>.</span>
        </h1>

        {/* Recherche */}
        <input
          type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder="🔍  Rechercher un engin…"
          style={{ width: '100%', padding: '12px 16px', borderRadius: 4, border: `1px solid ${C.panel}`, background: C.bitume, color: C.creme, fontFamily: 'JetBrains Mono, monospace', fontSize: 13.5, outline: 'none', marginBottom: 12 }}
        />

        {/* Filtres catégories */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          <CatBtn id="all" label="Tous" active={catFilter === 'all'} onClick={() => setCatFilter('all')} />
          {equipmentDatabase.categories.map(cat => (
            <CatBtn key={cat.id} id={cat.id} label={`${cat.icone} ${cat.label}`} active={catFilter === cat.id} onClick={() => setCatFilter(cat.id)} />
          ))}
        </div>
      </div>

      {/* Liste */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: C.acier, fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>
            Aucun engin trouvé
          </div>
        )}
        {filtered.map(engin => {
          const cat = equipmentDatabase.categories.find(c => c.id === engin.categorie)
          return (
            <button key={engin.id} onClick={() => setSelected(engin)}
              style={{ background: C.bitume2, border: `1px solid ${C.panel}`, borderRadius: 4, padding: '16px 18px', cursor: 'pointer', textAlign: 'left', transition: 'border-color .15s' }}>
              <div style={{ fontSize: 11, color: C.jaune, fontFamily: 'JetBrains Mono, monospace', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 5 }}>
                {cat ? `${cat.icone} ${cat.label}` : engin.categorie}
              </div>
              <div style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 800, fontSize: 17, color: C.creme, marginBottom: 5 }}>{engin.nom}</div>
              <div style={{ fontSize: 13, color: C.acierClair, lineHeight: 1.4, fontFamily: 'Inter, sans-serif' }}>{engin.description}</div>
              <div style={{ marginTop: 10, fontSize: 12, color: C.acier, fontFamily: 'JetBrains Mono, monospace' }}>
                {engin.modeles.join(' · ')}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function CatBtn({ id, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 20, border: `1px solid ${active ? C.jaune : C.panel}`, background: active ? `${C.jaune}22` : 'transparent', color: active ? C.jaune : C.acierClair, fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s' }}>
      {label}
    </button>
  )
}

function EnginDetail({ engin, onBack }) {
  const [tab, setTab] = useState('caracteristiques')
  const tabs = [
    { id: 'caracteristiques', label: '⚙️ Caract.' },
    { id: 'performances',     label: '📈 Perf.' },
    { id: 'consommations',    label: '⛽ Conso.' },
    { id: 'rendements',       label: '🏭 Rendm.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: C.bitume, color: C.creme, fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ background: C.laterite, padding: '52px 20px 20px' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: C.creme, padding: '8px 14px', borderRadius: 3, cursor: 'pointer', fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 13, marginBottom: 14 }}>
          ← Retour
        </button>
        <h2 style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 900, fontSize: 'clamp(20px,6vw,30px)', margin: '0 0 8px', lineHeight: 1.1 }}>{engin.nom}</h2>
        <p style={{ fontSize: 13.5, color: 'rgba(237,230,214,.8)', lineHeight: 1.5, margin: 0 }}>{engin.description}</p>
        <div style={{ marginTop: 10, fontSize: 12, color: 'rgba(237,230,214,.6)', fontFamily: 'JetBrains Mono, monospace' }}>{engin.modeles.join(' · ')}</div>
      </div>

      {/* Onglets */}
      <div style={{ display: 'flex', background: C.bitume2, borderBottom: `1px solid ${C.panel}`, overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: '14px 8px', background: 'none', border: 'none', borderBottom: `3px solid ${tab === t.id ? C.jaune : 'transparent'}`, color: tab === t.id ? C.jaune : C.acierClair, fontFamily: 'Archivo, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Données */}
      <div style={{ padding: '20px 16px' }}>
        {Object.entries(engin[tab] || {}).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '12px 0', borderBottom: `1px solid ${C.panel}` }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.acierClair, flex: '0 0 45%' }}>{key}</span>
            <span style={{ fontSize: 13, color: C.creme, fontFamily: 'JetBrains Mono, monospace', textAlign: 'right', flex: 1 }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
