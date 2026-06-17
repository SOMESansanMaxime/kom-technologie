import React, { useState, useRef, useCallback } from "react";
import {
  Camera, Loader2, Truck, Gauge, Fuel, TrendingUp, AlertCircle, X,
  ChevronRight, Wrench, Activity, Ruler, Settings, FileDown, FileSpreadsheet,
  GitCompare, Calculator, Copy, Check, Key, Server,
  ChevronDown, ChevronUp, History,
} from "lucide-react";

// ─── Polices ────────────────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600&display=swap');`;

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  bitume: "#16140F", bitume2: "#211E16", panel: "#2E2A20",
  laterite: "#B4541E", laterite2: "#8C3D14", jaune: "#F2B705",
  acier: "#5C6670", acierClair: "#A7AEB5", creme: "#EDE6D6",
  vert: "#3FA34D", rouge: "#D94F3D", orange: "#E8680A",
};

// ─── Sections de données ─────────────────────────────────────────────────────
const FIELDS = [
  { key: "categorie",       label: "Catégorie",                   icon: Truck },
  { key: "modeles_courants",label: "Modèles courants",            icon: Wrench },
  { key: "caracteristiques",label: "Caractéristiques techniques", icon: Ruler,    list: true },
  { key: "performances",    label: "Performances",                icon: Activity, list: true },
  { key: "consommation",    label: "Consommation",                icon: Fuel,     list: true },
  { key: "rendements",      label: "Rendements de production",    icon: TrendingUp, list: true },
  { key: "conditions_emploi", label: "Conditions d'emploi & conseils", icon: Settings, list: true },
];

// ─── Prompt IA ───────────────────────────────────────────────────────────────
const PROMPT = `Tu es un ingénieur expert en matériel de travaux publics et en infrastructures routières (contexte Afrique de l'Ouest — coûts en FCFA).
Analyse l'engin ou le matériel de chantier visible sur la photo. Identifie précisément le type d'engin (terrassement, compactage, revêtement, transport, levage, forage, etc.).

Réponds UNIQUEMENT avec un objet JSON valide, sans préambule, sans texte autour, sans balises Markdown. Structure exacte :
{
  "engin": "nom précis de l'engin identifié",
  "confiance": "élevée | moyenne | faible",
  "categorie": "famille d'engins",
  "modeles_courants": "marques et modèles typiques séparés par des virgules",
  "caracteristiques": ["caractéristique technique chiffrée avec unités", "..."],
  "performances": ["performance chiffrée avec unités et conditions", "..."],
  "consommation": ["consommation carburant en L/h avec fourchette selon intensité", "..."],
  "rendements": ["rendement de production chiffré avec unités (ex: m³/h, m²/h, km/j)", "..."],
  "conditions_emploi": ["conseil d'emploi ou contrainte opérationnelle", "..."],
  "conso_estimee_lh": 25,
  "rendement_estime": {"valeur": 80, "unite": "m³/h"}
}
Donne des valeurs chiffrées réalistes avec unités. Chaque liste contient 3 à 6 éléments.
"conso_estimee_lh" = consommation moyenne probable en L/h (nombre seul, sans unité).
"rendement_estime" = rendement de production moyen probable (nombre + unité).
Si ce n'est pas un engin de chantier, mets "engin": "Non identifié comme engin de chantier" et "confiance": "faible".`;

// ─── Persistance locale ──────────────────────────────────────────────────────
const CFG_KEY  = "enginScan_cfg";
const HIST_KEY = "enginScan_hist";

function loadLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── Appel vision ─────────────────────────────────────────────────────────────
async function callVision(mediaType, imageData, cfg) {
  // Mode 1 : proxy backend (clé API côté serveur — recommandé)
  if (cfg.backendUrl) {
    const res = await fetch(`${cfg.backendUrl.replace(/\/$/, "")}/api/analyze-full`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData, media_type: mediaType }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const code = res.status;
      if (code === 503) throw new Error("Serveur non configuré — ajoutez ANTHROPIC_API_KEY dans .env");
      throw new Error(err.message || `Erreur serveur ${code}`);
    }
    return res.json();
  }

  // Mode 2 : appel direct à l'API Anthropic (clé API dans le navigateur — dev seulement)
  if (!cfg.apiKey) {
    throw new Error("Configurez l'URL du serveur ou une clé API dans les paramètres ⚙️");
  }
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": cfg.apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1600,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: imageData } },
          { type: "text", text: PROMPT },
        ],
      }],
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) throw new Error("Clé API invalide ou expirée.");
    if (res.status === 429) throw new Error("Limite de taux dépassée — réessayez dans quelques instants.");
    throw new Error(err.error?.message || `Erreur API ${res.status}`);
  }
  const data = await res.json();
  const text = data.content.filter(b => b.type === "text").map(b => b.text).join("\n")
    .replace(/```json|```/g, "").trim();
  return JSON.parse(text);
}

// ─── Hook : configuration ─────────────────────────────────────────────────────
function useConfig() {
  const [cfg, setCfg] = useState(() => loadLS(CFG_KEY, { backendUrl: "", apiKey: "" }));
  const save = useCallback(next => { setCfg(next); saveLS(CFG_KEY, next); }, []);
  return [cfg, save];
}

// ─── Hook : historique ────────────────────────────────────────────────────────
function useHistory() {
  const [hist, setHist] = useState(() => loadLS(HIST_KEY, []));
  const push = useCallback((entry) => {
    setHist(prev => {
      const next = [entry, ...prev].slice(0, 5);
      saveLS(HIST_KEY, next);
      return next;
    });
  }, []);
  return [hist, push];
}

// ─── Hook : slot engin ────────────────────────────────────────────────────────
function useEnginSlot(cfg, onResult) {
  const [image, setImage]     = useState(null);
  const [imageData, setImgD]  = useState(null);
  const [mediaType, setMT]    = useState(null);
  const [status, setStatus]   = useState("idle");
  const [result, setResult]   = useState(null);
  const [error, setError]     = useState("");

  const setFile = (file) => new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) { reject("type"); return; }
    const r = new FileReader();
    r.onload = () => {
      setImage(r.result);
      setImgD(r.result.split(",")[1]);
      setMT(file.type);
      setStatus("idle"); setResult(null); setError("");
      resolve();
    };
    r.onerror = () => reject("read");
    r.readAsDataURL(file);
  });

  const run = async () => {
    if (!imageData) return;
    setStatus("loading"); setError("");
    try {
      const res = await callVision(mediaType, imageData, cfg);
      setResult(res); setStatus("done");
      onResult?.({ id: Date.now(), name: res.engin, image, result: res, ts: new Date().toISOString() });
    } catch (err) {
      setError(err.message || "Analyse échouée. Vérifiez votre connexion ou la qualité de la photo.");
      setStatus("error");
    }
  };

  const reset = () => { setImage(null); setImgD(null); setMT(null); setStatus("idle"); setResult(null); setError(""); };
  return { image, imageData, status, result, error, setFile, run, reset };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
export default function EnginScan() {
  const [mode, setMode]           = useState("single");
  const [cfg, saveCfg]            = useConfig();
  const [hist, pushHist]          = useHistory();
  const [showCfg, setShowCfg]     = useState(false);
  const [showHist, setShowHist]   = useState(false);
  const [errorMsg, setErrorMsg]   = useState("");

  const A = useEnginSlot(cfg, pushHist);
  const B = useEnginSlot(cfg, pushHist);

  const handleFile = async (slot, file) => {
    try { await slot.setFile(file); setErrorMsg(""); }
    catch { setErrorMsg("Veuillez choisir un fichier image (JPG, PNG, WEBP)."); }
  };

  const isConfigured = cfg.backendUrl || cfg.apiKey;

  return (
    <div style={{ minHeight: "100vh", background: C.bitume, color: C.creme, fontFamily: "Inter, sans-serif" }}>
      <style>{FONTS}{`
        *{box-sizing:border-box;}
        @keyframes plateIn{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:none;}}
        @keyframes scan{0%{transform:translateY(-100%);}100%{transform:translateY(420%);}}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes confIn{from{width:0;}to{}}
        .rivet::before,.rivet::after{content:"";position:absolute;width:7px;height:7px;border-radius:50%;background:radial-gradient(circle at 30% 30%,${C.acierClair},${C.acier});top:12px;}
        .rivet::before{left:12px;}.rivet::after{right:12px;}
        .drop:hover{border-color:${C.jaune};background:${C.bitume2};}
        .btn:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px);}
        .btn:active:not(:disabled){transform:translateY(0);}
        button:focus-visible,input:focus-visible,textarea:focus-visible{outline:2px solid ${C.jaune};outline-offset:2px;}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;}}
      `}</style>

      {/* Bande de chantier */}
      <div style={{ height: 8, background: `repeating-linear-gradient(45deg,${C.jaune} 0 18px,${C.bitume} 18px 36px)` }} />

      <div style={{ maxWidth: mode === "compare" ? 1040 : 880, margin: "0 auto", padding: "clamp(20px,5vw,48px) 20px 80px", transition: "max-width .3s" }}>

        {/* En-tête */}
        <header style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "JetBrains Mono, monospace", fontSize: 12, letterSpacing: 2, color: C.jaune, textTransform: "uppercase", marginBottom: 12 }}>
              <Gauge size={14} /> Reconnaissance matériel TP — Cellule Projet
            </div>
            <h1 style={{ fontFamily: "Archivo, sans-serif", fontWeight: 900, fontSize: "clamp(38px,8vw,68px)", lineHeight: 0.92, margin: 0, letterSpacing: "-0.02em" }}>
              ENGIN<span style={{ color: C.laterite }}>·</span>SCAN
            </h1>
            <p style={{ color: C.acierClair, maxWidth: 560, marginTop: 14, fontSize: 15.5, lineHeight: 1.55 }}>
              Identifiez le matériel par photo. Obtenez caractéristiques, performances, consommation,
              rendements, coût horaire, et exportez la fiche.
            </p>
          </div>

          {/* Boutons outils */}
          <div style={{ display: "flex", gap: 8, paddingTop: 16 }}>
            {hist.length > 0 && (
              <ToolBtn icon={History} label={`Historique (${hist.length})`} active={showHist} onClick={() => setShowHist(v => !v)} />
            )}
            <ToolBtn icon={Settings} label="Paramètres" active={showCfg} onClick={() => setShowCfg(v => !v)}
              warn={!isConfigured} />
          </div>
        </header>

        {/* Bandeau d'alerte configuration */}
        {!isConfigured && !showCfg && (
          <div style={{ marginBottom: 18, padding: "14px 16px", borderRadius: 4, background: "#2A2010", border: `1px solid ${C.jaune}40`, display: "flex", gap: 12, alignItems: "center", fontSize: 13.5 }}>
            <AlertCircle size={18} color={C.jaune} style={{ flexShrink: 0 }} />
            <span style={{ color: C.acierClair }}>
              <strong style={{ color: C.jaune }}>Configuration requise</strong> — Ouvrez les paramètres ⚙️ pour saisir l'URL du serveur ou une clé API Anthropic.
            </span>
            <button className="btn" onClick={() => setShowCfg(true)}
              style={{ marginLeft: "auto", border: `1px solid ${C.jaune}`, background: "transparent", color: C.jaune, padding: "6px 14px", borderRadius: 3, cursor: "pointer", fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", transition: "all .15s", flexShrink: 0 }}>
              Configurer
            </button>
          </div>
        )}

        {/* Panneau de configuration */}
        {showCfg && <ConfigPanel cfg={cfg} onChange={saveCfg} onClose={() => setShowCfg(false)} />}

        {/* Historique */}
        {showHist && hist.length > 0 && <HistoryPanel hist={hist} onSelect={(h) => { A.reset(); /* restore result */ }} onClose={() => setShowHist(false)} />}

        {/* Sélecteur de mode */}
        <div style={{ display: "inline-flex", background: C.bitume2, borderRadius: 4, padding: 4, marginBottom: 26, border: `1px solid ${C.panel}` }}>
          {[{ id: "single", label: "Analyse simple", icon: Truck }, { id: "compare", label: "Comparaison A/B", icon: GitCompare }].map(m => {
            const Icon = m.icon; const on = mode === m.id;
            return (
              <button key={m.id} className="btn" onClick={() => setMode(m.id)}
                style={{ border: "none", background: on ? C.jaune : "transparent", color: on ? C.bitume : C.acierClair, padding: "9px 16px", borderRadius: 3, cursor: "pointer", fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 7, transition: "all .15s" }}>
                <Icon size={16} /> {m.label}
              </button>
            );
          })}
        </div>

        {errorMsg && (
          <div style={{ marginBottom: 18, padding: "14px 16px", borderRadius: 4, background: C.laterite2, display: "flex", gap: 12, alignItems: "center", fontSize: 14.5 }}>
            <AlertCircle size={20} /> <span>{errorMsg}</span>
          </div>
        )}

        {mode === "single" ? (
          <EnginPanel slot={A} onFile={f => handleFile(A, f)} showExport showCost />
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18 }}>
              <EnginPanel slot={A} onFile={f => handleFile(A, f)} tag="ENGIN A" compact />
              <EnginPanel slot={B} onFile={f => handleFile(B, f)} tag="ENGIN B" compact />
            </div>
            {A.result && B.result && <CompareTable a={A.result} b={B.result} />}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Bouton outil (header) ────────────────────────────────────────────────────
function ToolBtn({ icon: Icon, label, active, onClick, warn }) {
  return (
    <button className="btn" onClick={onClick} title={label}
      style={{ border: `1px solid ${active ? C.jaune : warn ? C.laterite : C.panel}`, background: active ? C.jaune + "22" : "transparent", color: active ? C.jaune : warn ? C.laterite : C.acierClair, padding: "8px 14px", borderRadius: 3, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontFamily: "Archivo, sans-serif", fontWeight: 600, transition: "all .15s" }}>
      <Icon size={15} /> <span style={{ display: "none", "@media(min-width:480px)": { display: "inline" } }}>{label}</span>
    </button>
  );
}

// ─── Panneau de configuration ─────────────────────────────────────────────────
function ConfigPanel({ cfg, onChange, onClose }) {
  const [local, setLocal] = useState({ ...cfg });
  const upd = k => e => setLocal(p => ({ ...p, [k]: e.target.value }));
  const apply = () => { onChange(local); onClose(); };

  const inp = { width: "100%", padding: "10px 12px", borderRadius: 3, border: `1px solid ${C.acier}`, background: C.bitume, color: C.creme, fontFamily: "JetBrains Mono, monospace", fontSize: 13.5, outline: "none" };
  const lbl = { fontSize: 11, color: C.acierClair, fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 5 };

  return (
    <section style={{ marginBottom: 24, background: C.bitume2, borderRadius: 4, border: `1px solid ${C.jaune}44`, padding: "22px 22px 20px", animation: "plateIn .25s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Settings size={17} color={C.jaune} />
          <h3 style={{ margin: 0, fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15, textTransform: "uppercase", letterSpacing: 0.5 }}>Paramètres de connexion IA</h3>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.acierClair, cursor: "pointer", padding: 4 }}><X size={18} /></button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 18 }}>
        <div>
          <label style={lbl}><Server size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />URL serveur backend (recommandé)</label>
          <input type="url" value={local.backendUrl} onChange={upd("backendUrl")} placeholder="http://localhost:3000" style={inp} />
          <div style={{ fontSize: 11, color: C.acier, marginTop: 4, fontFamily: "JetBrains Mono, monospace" }}>Le serveur doit tourner avec ANTHROPIC_API_KEY configurée.</div>
        </div>
        <div>
          <label style={lbl}><Key size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />Clé API Anthropic (dev uniquement)</label>
          <input type="password" value={local.apiKey} onChange={upd("apiKey")} placeholder="sk-ant-api03-…" style={inp} />
          <div style={{ fontSize: 11, color: C.acier, marginTop: 4, fontFamily: "JetBrains Mono, monospace" }}>Ne pas utiliser en production — clé visible dans le navigateur.</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn" onClick={onClose} style={{ border: `1px solid ${C.acier}`, background: "transparent", color: C.acierClair, padding: "9px 18px", borderRadius: 3, cursor: "pointer", fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 13.5, transition: "all .15s" }}>Annuler</button>
        <button className="btn" onClick={apply} style={{ border: "none", background: C.jaune, color: C.bitume, padding: "9px 24px", borderRadius: 3, cursor: "pointer", fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 13.5, transition: "all .15s" }}>Enregistrer</button>
      </div>
    </section>
  );
}

// ─── Historique ───────────────────────────────────────────────────────────────
function HistoryPanel({ hist, onClose }) {
  return (
    <section style={{ marginBottom: 24, background: C.bitume2, borderRadius: 4, border: `1px solid ${C.panel}`, padding: "18px 20px", animation: "plateIn .25s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <History size={16} color={C.jaune} />
          <h3 style={{ margin: 0, fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>Analyses récentes</h3>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.acierClair, cursor: "pointer", padding: 4 }}><X size={16} /></button>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
        {hist.map(h => (
          <div key={h.id} style={{ flexShrink: 0, width: 130, background: C.bitume, borderRadius: 3, border: `1px solid ${C.panel}`, overflow: "hidden" }}>
            {h.image && <img src={h.image} alt={h.name} style={{ width: "100%", height: 75, objectFit: "cover", display: "block" }} />}
            <div style={{ padding: "8px 10px" }}>
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 12, color: C.creme, lineHeight: 1.3, marginBottom: 3 }}>{h.name}</div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: C.acier }}>
                {new Date(h.ts).toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Panneau engin ────────────────────────────────────────────────────────────
function EnginPanel({ slot, onFile, tag, compact, showExport, showCost }) {
  const fileRef = useRef(null);
  const { image, status, result, error } = slot;

  return (
    <div>
      {tag && (
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, letterSpacing: 2, color: C.jaune, marginBottom: 10, fontWeight: 700 }}>{tag}</div>
      )}

      {!image && (
        <div className="drop" role="button" tabIndex={0}
          onClick={() => fileRef.current?.click()}
          onKeyDown={e => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}
          style={{ border: `2px dashed ${C.acier}`, borderRadius: 4, padding: compact ? "40px 18px" : "clamp(36px,9vw,72px) 24px", textAlign: "center", cursor: "pointer", background: C.bitume2, transition: "all .2s" }}>
          <div style={{ width: 56, height: 56, margin: "0 auto 16px", borderRadius: 4, background: C.laterite, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Camera size={26} color={C.creme} />
          </div>
          <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: compact ? 16 : 19 }}>Déposer ou choisir une photo</div>
          <div style={{ color: C.acierClair, fontSize: 13, marginTop: 6, fontFamily: "JetBrains Mono, monospace" }}>JPG · PNG · WEBP</div>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" capture="environment"
        onChange={e => onFile(e.target.files[0])} style={{ display: "none" }} />

      {image && (
        <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", border: `1px solid ${C.acier}` }}>
          <img src={image} alt="Engin à analyser" style={{ width: "100%", display: "block", maxHeight: compact ? 240 : 420, objectFit: "cover" }} />
          {status === "loading" && (
            <>
              <div style={{ position: "absolute", inset: 0, background: "rgba(22,20,15,.55)" }} />
              <div style={{ position: "absolute", left: 0, right: 0, height: 3, top: 0, background: `linear-gradient(90deg,transparent,${C.jaune},transparent)`, animation: "scan 1.6s ease-in-out infinite" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
                <Loader2 size={36} color={C.jaune} style={{ animation: "spin 1s linear infinite" }} />
                <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, letterSpacing: 2, color: C.jaune, textTransform: "uppercase" }}>Analyse en cours…</span>
              </div>
            </>
          )}
          <button onClick={slot.reset} aria-label="Retirer la photo"
            style={{ position: "absolute", top: 10, right: 10, width: 34, height: 34, borderRadius: 3, border: "none", background: "rgba(22,20,15,.75)", color: C.creme, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={18} />
          </button>
        </div>
      )}

      {image && status !== "done" && (
        <button className="btn" onClick={slot.run} disabled={status === "loading"}
          style={{ marginTop: 14, width: "100%", padding: "15px", border: "none", borderRadius: 4, background: status === "loading" ? C.acier : C.jaune, color: C.bitume, cursor: status === "loading" ? "wait" : "pointer", fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 15.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all .15s" }}>
          {status === "loading"
            ? <><Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Analyse…</>
            : <>Analyser l'engin <ChevronRight size={20} /></>
          }
        </button>
      )}

      {status === "error" && error && (
        <div style={{ marginTop: 14, padding: "13px 15px", borderRadius: 4, background: C.laterite2, display: "flex", gap: 11, alignItems: "flex-start", fontSize: 14 }}>
          <AlertCircle size={19} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{error}</span>
        </div>
      )}

      {status === "done" && result && (
        <Results result={result} image={image} compact={compact} showExport={showExport} showCost={showCost} onReset={slot.reset} />
      )}
    </div>
  );
}

// ─── Barre de confiance ───────────────────────────────────────────────────────
function ConfidenceBar({ value }) {
  const map = { élevée: { pct: 90, color: C.vert }, moyenne: { pct: 60, color: C.jaune }, faible: { pct: 28, color: C.rouge } };
  const c = map[value] || map.faible;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11.5, letterSpacing: 1.5, textTransform: "uppercase", color: c.color }}>Confiance : {value}</span>
      <div style={{ flex: 1, height: 4, background: C.panel, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${c.pct}%`, background: c.color, borderRadius: 2, animation: "confIn .8s ease both" }} />
      </div>
    </div>
  );
}

// ─── Résultats ────────────────────────────────────────────────────────────────
function Results({ result, image, compact, showExport, showCost, onReset }) {
  return (
    <div style={{ marginTop: compact ? 14 : 24 }}>
      <div className="rivet" style={{ position: "relative", background: C.laterite, borderRadius: 4, padding: compact ? "16px 18px" : "22px 24px", animation: "plateIn .4s ease both" }}>
        <ConfidenceBar value={result.confiance} />
        <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 900, fontSize: compact ? "clamp(18px,4vw,24px)" : "clamp(24px,5vw,34px)", lineHeight: 1.05, marginTop: 8 }}>
          {result.engin}
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
        {FIELDS.map((f, i) => {
          const val = result[f.key]; if (!val) return null;
          const Icon = f.icon;
          return (
            <section key={f.key} style={{ background: C.bitume2, borderRadius: 4, border: `1px solid ${C.panel}`, padding: "16px 18px", animation: "plateIn .4s ease both", animationDelay: `${i * 50}ms` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: f.list ? 12 : 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: 3, background: C.bitume, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={16} color={C.jaune} />
                </div>
                <h3 style={{ margin: 0, fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 14.5, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</h3>
              </div>
              {f.list ? (
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {(Array.isArray(val) ? val : [val]).map((item, k) => (
                    <li key={k} style={{ display: "flex", gap: 10, alignItems: "flex-start", lineHeight: 1.5 }}>
                      <span style={{ color: C.jaune, fontFamily: "JetBrains Mono, monospace", fontSize: 12.5, flexShrink: 0, marginTop: 1 }}>{String(k + 1).padStart(2, "0")}</span>
                      <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: C.creme }}>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13.5, color: C.acierClair, paddingLeft: 38 }}>{val}</div>
              )}
            </section>
          );
        })}
      </div>

      {showCost && <CostCalculator result={result} />}
      {showExport && <ExportBar result={result} image={image} />}

      {showExport && (
        <button className="btn" onClick={onReset}
          style={{ marginTop: 14, width: "100%", padding: "14px", border: "none", borderRadius: 4, background: C.jaune, color: C.bitume, cursor: "pointer", fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .15s" }}>
          <Camera size={18} /> Nouvelle analyse
        </button>
      )}

      <p style={{ marginTop: 16, fontSize: 11.5, color: C.acier, lineHeight: 1.5, fontFamily: "JetBrains Mono, monospace" }}>
        ⚠ Valeurs indicatives générées par IA — à confronter aux fiches constructeur avant usage en métré, planning ou DPGF.
      </p>
    </div>
  );
}

// ─── Calculateur de coût ──────────────────────────────────────────────────────
function CostCalculator({ result }) {
  const [prixGasoil,   setPrix]  = useState(750);
  const [conso,        setConso] = useState(result.conso_estimee_lh || 20);
  const [amort,        setAmort] = useState(8000);
  const [mainOeuvre,   setMO]    = useState(2500);
  const [entretien,    setEnt]   = useState(1500);
  const [joursParMois, setJPM]   = useState(22);
  const [hParJour,     setHPJ]   = useState(8);
  const [open,         setOpen]  = useState(true);

  const rendVal   = result?.rendement_estime?.valeur || 0;
  const rendUnite = result?.rendement_estime?.unite  || "u/h";
  const unitBase  = rendUnite.replace("/h", "");

  const coutCarbH  = prixGasoil * conso;
  const coutHTotal = coutCarbH + amort + mainOeuvre + entretien;
  const coutUnit   = rendVal > 0 ? coutHTotal / rendVal : 0;
  const coutJour   = coutHTotal * hParJour;
  const coutMois   = coutJour * joursParMois;
  const prodJour   = rendVal * hParJour;
  const prodMois   = prodJour * joursParMois;

  const fmt  = n  => Math.round(n).toLocaleString("fr-FR");
  const inp  = { width: "100%", padding: "9px 11px", borderRadius: 3, border: `1px solid ${C.acier}`, background: C.bitume, color: "#FF6B5C", fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 700 };
  const lbl  = { fontSize: 11.5, color: C.acierClair, fontFamily: "JetBrains Mono, monospace", marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: 0.5 };

  return (
    <section style={{ marginTop: 12, background: C.bitume2, borderRadius: 4, border: `1px solid ${C.panel}` }}>
      <button onClick={() => setOpen(v => !v)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "16px 20px", background: "none", border: "none", cursor: "pointer", color: C.creme, textAlign: "left" }}>
        <div style={{ width: 30, height: 30, borderRadius: 3, background: C.bitume, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Calculator size={17} color={C.jaune} />
        </div>
        <h3 style={{ margin: 0, fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 15.5, textTransform: "uppercase", letterSpacing: 0.5, flex: 1 }}>Coût horaire d'exploitation</h3>
        {open ? <ChevronUp size={18} color={C.acierClair} /> : <ChevronDown size={18} color={C.acierClair} />}
      </button>

      {open && (
        <div style={{ padding: "0 20px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 12, marginBottom: 20 }}>
            <div><label style={lbl}>Prix gasoil (FCFA/L)</label><input type="number" value={prixGasoil} onChange={e => setPrix(+e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Conso. (L/h)</label><input type="number" value={conso} onChange={e => setConso(+e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Amortissement (FCFA/h)</label><input type="number" value={amort} onChange={e => setAmort(+e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Main-d'œuvre (FCFA/h)</label><input type="number" value={mainOeuvre} onChange={e => setMO(+e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Entretien (FCFA/h)</label><input type="number" value={entretien} onChange={e => setEnt(+e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Heures/jour</label><input type="number" value={hParJour} min={1} max={24} onChange={e => setHPJ(+e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Jours/mois</label><input type="number" value={joursParMois} min={1} max={31} onChange={e => setJPM(+e.target.value)} style={inp} /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10, marginBottom: 14 }}>
            <Stat label="Coût carburant / h"   value={`${fmt(coutCarbH)} F`} />
            <Stat label="Coût horaire total"    value={`${fmt(coutHTotal)} F/h`} big />
            <Stat label={`Coût unitaire / ${unitBase}`} value={rendVal > 0 ? `${fmt(coutUnit)} F` : "—"} big accent />
            <Stat label="Rendement estimé / h"  value={`${rendVal} ${rendUnite}`} />
            <Stat label={`Production / jour (${hParJour}h)`} value={prodJour > 0 ? `${fmt(prodJour)} ${unitBase}` : "—"} />
            <Stat label="Coût journalier"        value={`${fmt(coutJour)} F`} />
            <Stat label={`Production / mois (${joursParMois}j)`} value={prodMois > 0 ? `${fmt(prodMois)} ${unitBase}` : "—"} />
            <Stat label="Coût mensuel"           value={`${fmt(coutMois)} F`} />
          </div>

          <p style={{ fontSize: 11, color: C.acier, fontFamily: "JetBrains Mono, monospace", lineHeight: 1.5, margin: 0 }}>
            Saisies en rouge · Résultats en vert · Coût unitaire = coût horaire ÷ rendement
          </p>
        </div>
      )}
    </section>
  );
}

function Stat({ label, value, big, accent }) {
  return (
    <div style={{ background: C.bitume, borderRadius: 3, padding: "12px 14px", border: `1px solid ${accent ? C.vert : C.panel}` }}>
      <div style={{ fontSize: 10.5, color: C.acierClair, fontFamily: "JetBrains Mono, monospace", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>{label}</div>
      <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: big ? 20 : 15.5, color: C.vert }}>{value}</div>
    </div>
  );
}

// ─── Comparaison A / B ────────────────────────────────────────────────────────
function CompareTable({ a, b }) {
  const numOf = s => parseFloat(String(s || "").replace(/[^\d.]/g, "")) || 0;

  const rows = [
    { label: "Catégorie",              va: a.categorie,               vb: b.categorie },
    { label: "Modèles courants",        va: a.modeles_courants,        vb: b.modeles_courants },
    { label: "Conso. moy. (L/h)",       va: a.conso_estimee_lh ?? "—", vb: b.conso_estimee_lh ?? "—",  numLower: true },
    { label: "Rendement estimé",        va: a.rendement_estime ? `${a.rendement_estime.valeur} ${a.rendement_estime.unite}` : "—",
                                        vb: b.rendement_estime ? `${b.rendement_estime.valeur} ${b.rendement_estime.unite}` : "—", numHigher: true },
    { label: "Confiance identification",va: a.confiance,               vb: b.confiance },
    ...(a.caracteristiques?.length ? [{ label: "1re caractéristique",  va: a.caracteristiques[0], vb: b.caracteristiques?.[0] ?? "—" }] : []),
    ...(a.performances?.length     ? [{ label: "1re performance",       va: a.performances[0],     vb: b.performances?.[0] ?? "—"     }] : []),
    ...(a.consommation?.length     ? [{ label: "Conso. détaillée",      va: a.consommation[0],     vb: b.consommation?.[0] ?? "—"     }] : []),
    ...(a.rendements?.length       ? [{ label: "1er rendement",         va: a.rendements[0],       vb: b.rendements?.[0] ?? "—"       }] : []),
  ];

  const winner = (r) => {
    if (r.numLower)  { const na = numOf(r.va), nb = numOf(r.vb); if (na && nb) return na < nb ? "a" : "b"; }
    if (r.numHigher) { const na = numOf(r.va), nb = numOf(r.vb); if (na && nb) return na > nb ? "a" : "b"; }
    return null;
  };

  const cell = (val, side, row) => {
    const w = winner(row);
    const isWin = w === side;
    return (
      <td style={{ padding: "10px", color: isWin ? C.vert : C.creme, fontWeight: isWin ? 700 : 400, background: isWin ? `${C.vert}12` : "transparent" }}>
        {isWin && <span style={{ marginRight: 5 }}>▲</span>}{val}
      </td>
    );
  };

  return (
    <section style={{ marginTop: 22, background: C.bitume2, borderRadius: 4, border: `1px solid ${C.panel}`, padding: "20px 22px", animation: "plateIn .4s ease both" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <GitCompare size={18} color={C.jaune} />
        <h3 style={{ margin: 0, fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 16, textTransform: "uppercase", letterSpacing: 0.5 }}>Comparaison A / B</h3>
        <span style={{ fontSize: 11.5, color: C.acier, fontFamily: "JetBrains Mono, monospace", marginLeft: "auto" }}>▲ = meilleur pour le critère</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "JetBrains Mono, monospace", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.jaune}` }}>
              <th style={{ textAlign: "left", padding: "8px 10px", color: C.acierClair, fontWeight: 500, minWidth: 170 }}></th>
              <th style={{ textAlign: "left", padding: "8px 10px", color: C.jaune }}>{a.engin}</th>
              <th style={{ textAlign: "left", padding: "8px 10px", color: C.jaune }}>{b.engin}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${C.panel}` }}>
                <td style={{ padding: "10px", color: C.acierClair, whiteSpace: "nowrap", fontSize: 11.5, textTransform: "uppercase", letterSpacing: 0.3 }}>{r.label}</td>
                {cell(r.va, "a", r)}
                {cell(r.vb, "b", r)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ─── Barre d'export ───────────────────────────────────────────────────────────
function ExportBar({ result, image }) {
  const [copied, setCopied] = useState(false);
  const dateStr = new Date().toLocaleDateString("fr-FR");

  const copyJSON = async () => {
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    const lines = [];
    lines.push(["Fiche technique matériel TP — Cellule Projet"]);
    lines.push([`Émis le ${dateStr}`]);
    lines.push([]);
    lines.push(["Engin",           result.engin]);
    lines.push(["Catégorie",       result.categorie]);
    lines.push(["Confiance",       result.confiance]);
    lines.push(["Modèles courants",result.modeles_courants]);
    lines.push(["Conso. estimée (L/h)", result.conso_estimee_lh ?? ""]);
    lines.push(["Rendement estimé", result.rendement_estime ? `${result.rendement_estime.valeur} ${result.rendement_estime.unite}` : ""]);
    const block = (title, k) => {
      lines.push([]); lines.push([title]);
      (Array.isArray(result[k]) ? result[k] : [result[k]]).forEach(x => lines.push(["", x]));
    };
    block("Caractéristiques techniques", "caracteristiques");
    block("Performances",                "performances");
    block("Consommation",                "consommation");
    block("Rendements de production",    "rendements");
    block("Conditions d'emploi",         "conditions_emploi");
    const csv = "﻿" + lines.map(r => r.map(c => `"${String(c ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    Object.assign(document.createElement("a"), { href: url, download: `fiche_${result.engin.replace(/[^a-z0-9]/gi, "_").slice(0, 30)}.csv` }).click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const listHtml = k => Array.isArray(result[k])
      ? `<ul>${result[k].map(x => `<li>${esc(x)}</li>`).join("")}</ul>`
      : `<p>${esc(result[k])}</p>`;
    const confColor = { élevée: "#3FA34D", moyenne: "#F2B705", faible: "#D94F3D" }[result.confiance] || "#888";
    const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Fiche engin — ${esc(result.engin)}</title>
<style>
@page{margin:18mm;}
body{font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;font-size:12px;line-height:1.5;margin:0;}
.hdr{border-bottom:3px solid #B4541E;padding-bottom:12px;margin-bottom:20px;display:flex;gap:20px;align-items:flex-start;}
.hdr-text{flex:1;}
.hdr .lab{font-size:10px;letter-spacing:2px;color:#B4541E;text-transform:uppercase;margin-bottom:4px;}
.hdr h1{margin:0 0 6px;font-size:22px;line-height:1.1;}
.hdr .sub{color:#666;font-size:11px;}
.hdr .conf{display:inline-block;padding:3px 10px;border-radius:10px;background:${confColor}22;color:${confColor};border:1px solid ${confColor};font-size:11px;font-weight:700;margin-top:6px;}
img{max-width:180px;max-height:130px;border:1px solid #ccc;border-radius:4px;object-fit:cover;}
h2{font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#B4541E;border-bottom:1px solid #e0e0e0;padding-bottom:3px;margin:18px 0 8px;}
ul{margin:4px 0;padding-left:18px;} li{margin:3px 0;font-size:11.5px;}
p{margin:4px 0;font-size:11.5px;}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:10px;}
.kpi{background:#f7f3ee;border-radius:4px;padding:10px 12px;border-left:3px solid #B4541E;}
.kpi .k{font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px;}
.kpi .v{font-size:16px;font-weight:800;color:#B4541E;margin-top:2px;}
.foot{margin-top:28px;border-top:1px solid #ccc;padding-top:8px;font-size:10px;color:#888;display:flex;justify-content:space-between;}
.sig{margin-top:32px;font-size:11px;}
.sig .line{border-top:1px solid #333;width:200px;margin-top:28px;padding-top:4px;color:#555;}
</style></head><body>
<div class="hdr">
  ${image ? `<img src="${image}" alt="engin"/>` : ""}
  <div class="hdr-text">
    <div class="lab">Cellule Projet — Fiche technique matériel TP</div>
    <h1>${esc(result.engin)}</h1>
    <div class="sub">Catégorie : ${esc(result.categorie)} · Émis le ${dateStr}</div>
    <div class="conf">Confiance : ${esc(result.confiance)}</div>
  </div>
</div>
<div class="grid2">
  <div class="kpi"><div class="k">Consommation moyenne</div><div class="v">${result.conso_estimee_lh ?? "—"} L/h</div></div>
  <div class="kpi"><div class="k">Rendement estimé</div><div class="v">${result.rendement_estime ? `${result.rendement_estime.valeur} ${result.rendement_estime.unite}` : "—"}</div></div>
</div>
<h2>Modèles courants</h2><p>${esc(result.modeles_courants)}</p>
<h2>Caractéristiques techniques</h2>${listHtml("caracteristiques")}
<h2>Performances</h2>${listHtml("performances")}
<h2>Consommation</h2>${listHtml("consommation")}
<h2>Rendements de production</h2>${listHtml("rendements")}
<h2>Conditions d'emploi &amp; conseils</h2>${listHtml("conditions_emploi")}
<div class="sig">Visa Cellule Projet :<div class="line">Nom, fonction &amp; signature</div></div>
<div class="foot"><span>ENGIN·SCAN — Cellule Projet</span><span>Valeurs indicatives IA — confronter aux fiches constructeur</span></div>
<script>window.onload=()=>window.print();<\/script>
</body></html>`;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
  };

  const btnBase = { flex: 1, minWidth: 130, padding: "13px", border: "none", borderRadius: 4, cursor: "pointer", fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .15s" };

  return (
    <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
      <button className="btn" onClick={exportPDF}  style={{ ...btnBase, background: C.creme,    color: C.bitume }}><FileDown size={17} /> Exporter PDF</button>
      <button className="btn" onClick={exportCSV}  style={{ ...btnBase, background: C.acierClair, color: C.bitume }}><FileSpreadsheet size={17} /> Excel/CSV</button>
      <button className="btn" onClick={copyJSON}
        style={{ ...btnBase, flex: "0 0 auto", background: copied ? C.vert : C.panel, color: copied ? C.bitume : C.acierClair }}>
        {copied ? <><Check size={16} /> Copié !</> : <><Copy size={16} /> JSON</>}
      </button>
    </div>
  );
}
