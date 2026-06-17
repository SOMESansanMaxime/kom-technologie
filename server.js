require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const equipmentDatabase = require('./data/equipment.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// Build equipment index for fast lookup
const equipmentById = {};
const equipmentByKeyword = {};
equipmentDatabase.engins.forEach(engin => {
  equipmentById[engin.id] = engin;
  engin.mots_cles_identification.forEach(mot => {
    const key = mot.toLowerCase();
    if (!equipmentByKeyword[key]) equipmentByKeyword[key] = [];
    equipmentByKeyword[key].push(engin.id);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    ai_enabled: !!process.env.ANTHROPIC_API_KEY,
    equipment_count: equipmentDatabase.engins.length
  });
});

// List all equipment (for frontend dropdown)
app.get('/api/equipment', (req, res) => {
  const liste = equipmentDatabase.engins.map(e => ({
    id: e.id,
    nom: e.nom,
    categorie: e.categorie,
    description_courte: e.description_courte
  }));
  res.json({ categories: equipmentDatabase.categories, engins: liste });
});

// Get equipment detail by ID
app.get('/api/equipment/:id', (req, res) => {
  const engin = equipmentById[req.params.id];
  if (!engin) return res.status(404).json({ error: 'Engin non trouvé' });
  res.json(engin);
});

// Analyze photo with Claude AI
app.post('/api/analyze', async (req, res) => {
  const { image, media_type } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'Image manquante dans la requête' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({
      error: 'API IA non configurée',
      message: 'Veuillez configurer ANTHROPIC_API_KEY dans le fichier .env'
    });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const equipmentList = equipmentDatabase.engins.map(e =>
      `- ID: "${e.id}" | Nom: "${e.nom}" | Mots-clés: ${e.mots_cles_identification.slice(0, 5).join(', ')}`
    ).join('\n');

    const prompt = `Tu es un expert en engins et matériels de chantier pour les travaux d'infrastructures routières en Afrique de l'Ouest.

Analyse cette image et identifie l'engin ou le matériel de chantier visible.

Liste des engins disponibles dans la base de données :
${equipmentList}

Réponds UNIQUEMENT avec un objet JSON valide (sans texte avant ni après) :
{
  "identified": true ou false,
  "equipment_id": "l'id exact de l'engin le plus proche dans la liste, ou null",
  "nom_identifie": "nom de l'engin tel que tu le vois",
  "confiance": "haute" | "moyenne" | "faible",
  "description_visuelle": "description brève de ce que tu vois (2-3 phrases)",
  "caracteristiques_visibles": ["caractéristique 1", "caractéristique 2", "caractéristique 3"],
  "message": "message explicatif si non identifié"
}

Si l'image ne montre pas d'engin de chantier, mets identified: false.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: media_type || 'image/jpeg',
              data: image
            }
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      }]
    });

    let aiResult;
    try {
      const rawText = response.content[0].text.trim();
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      aiResult = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      return res.status(500).json({ error: "Erreur lors de l'analyse IA — réponse non exploitable" });
    }

    if (!aiResult.identified) {
      return res.json({
        identified: false,
        message: aiResult.message || "Aucun engin de chantier reconnu sur cette image.",
        description_visuelle: aiResult.description_visuelle || ""
      });
    }

    const enginData = aiResult.equipment_id ? equipmentById[aiResult.equipment_id] : null;

    res.json({
      identified: true,
      confiance: aiResult.confiance,
      nom_identifie: aiResult.nom_identifie,
      description_visuelle: aiResult.description_visuelle,
      caracteristiques_visibles: aiResult.caracteristiques_visibles || [],
      engin: enginData || null,
      equipment_id: aiResult.equipment_id
    });

  } catch (err) {
    console.error('Erreur API Anthropic:', err.message);
    const status = err.status || 500;
    res.status(status).json({
      error: "Erreur lors de l'analyse",
      message: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚧 KOM Technologie — Analyseur d'Engins BTP`);
  console.log(`   Serveur actif sur http://localhost:${PORT}`);
  console.log(`   Engins en base : ${equipmentDatabase.engins.length}`);
  console.log(`   Mode IA : ${process.env.ANTHROPIC_API_KEY ? '✅ Activé' : '⚠️  Désactivé (configurer .env)'}\n`);
});
