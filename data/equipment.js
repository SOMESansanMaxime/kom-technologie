/**
 * Base de données des engins et matériels pour travaux d'infrastructures routières
 * Données techniques issues des constructeurs (Caterpillar, Komatsu, Volvo, etc.)
 * Contexte d'utilisation : Afrique de l'Ouest / Burkina Faso
 */

const equipmentDatabase = {
  categories: [
    { id: "terrassement", label: "Terrassement", icone: "🏗️" },
    { id: "extraction", label: "Extraction & Chargement", icone: "⛏️" },
    { id: "compactage", label: "Compactage", icone: "🔄" },
    { id: "transport", label: "Transport", icone: "🚛" },
    { id: "revetement", label: "Revêtement Bitumineux", icone: "🛣️" },
    { id: "concassage", label: "Concassage & Criblage", icone: "🪨" },
    { id: "divers", label: "Matériel Divers", icone: "🔧" }
  ],

  engins: [
    // =====================================================================
    // TERRASSEMENT
    // =====================================================================
    {
      id: "bulldozer-d6",
      nom: "Bulldozer D6",
      categorie: "terrassement",
      description_courte: "Bulldozer de puissance moyenne — engin polyvalent pour terrassements courants et ouverture de pistes",
      modeles_courants: ["Caterpillar D6T XW", "Komatsu D65EX-18", "John Deere 850L", "Liebherr PR 726"],
      mots_cles_identification: [
        "bulldozer", "bull", "d6", "tracteur à chenilles", "lame frontale", "poussoir",
        "angledozer", "lame droite", "engin de terrassement", "tracteur chenillé"
      ],
      caracteristiques: {
        "Masse opérationnelle": "19 000 – 22 000 kg",
        "Puissance moteur": "174 kW (235 ch) à 1 800 tr/min",
        "Moteur": "Diesel 6 cylindres turbocompressé (CAT C9.3 ACERT)",
        "Cylindrée": "9,3 L",
        "Norme émissions": "Tier 4 Final / Stage V",
        "Lame (type SU)": "Largeur 3,76 m × Hauteur 1,24 m",
        "Capacité lame (SU)": "4,90 m³",
        "Ripper (standard)": "Dent unique, profondeur max 730 mm",
        "Vitesse avant max": "10,7 km/h (6 rapports avant)",
        "Vitesse arrière max": "13,6 km/h (6 rapports arrière)",
        "Pression au sol": "0,59 bar (59 kPa)",
        "Réservoir carburant": "416 L",
        "Longueur hors tout": "5,18 m",
        "Largeur hors tout": "3,00 m (lame 3,76 m)",
        "Hauteur hors tout": "3,11 m",
        "Garde au sol": "430 mm"
      },
      performances: {
        "Productivité poussage (distance 20 m)": "400 – 600 m³/h",
        "Productivité poussage (distance 40 m)": "250 – 400 m³/h",
        "Productivité poussage (distance 60 m)": "150 – 250 m³/h",
        "Distance de poussage optimale": "< 50 m",
        "Décapage couche végétale": "0,8 – 1,5 ha/h",
        "Rippabilité max (roche)": "Roche tendre à moyenne (compressive < 25 MPa)",
        "Coefficient de foisonnement matériaux": "1,10 – 1,35 selon sol",
        "Production journalière estimée (8h)": "2 000 – 4 500 m³/jour (sol meuble)"
      },
      consommations: {
        "Carburant (marche à vide)": "10 – 12 L/h",
        "Carburant (travail léger)": "15 – 20 L/h",
        "Carburant (travail moyen — référence)": "20 – 25 L/h",
        "Carburant (travail intensif)": "25 – 32 L/h",
        "Consommation journalière (8h, travail normal)": "160 – 200 L/j",
        "Carburant par m³ terrassé": "0,05 – 0,10 L/m³",
        "Lubrifiants moteur": "0,4 – 0,6 L/h",
        "Lubrifiants transmission/hydraulique": "0,2 – 0,3 L/h",
        "Graisse mécanique journalière": "0,5 – 0,8 kg/j"
      },
      rendements: {
        "Déblaiement sol meuble (latérite/sable)": "350 – 550 m³/h",
        "Déblaiement sol compact (argile, grave)": "200 – 350 m³/h",
        "Déblaiement sol rocheux rippé": "100 – 200 m³/h",
        "Remblaiement et régalage": "300 – 500 m³/h",
        "Décapage végétal (h < 20 cm)": "0,8 – 1,5 ha/h",
        "Journée type productive (8h)": "2 400 – 4 000 m³/j",
        "Coefficient d'utilisation moyen": "0,75 – 0,85"
      },
      applications_routes: [
        "Décapage et débroussaillage de l'emprise",
        "Terrassement général (déblais / remblais)",
        "Ouverture et élargissement de routes et pistes",
        "Création de plateformes de travail",
        "Mise en place et étalement de remblais",
        "Nivelage grossier avant la niveleuse",
        "Démolition de structures légères"
      ],
      notes_importantes: "Rendement fortement influencé par la distance de poussage, la pente longitudinale et la nature du sol. Au-delà de 80 m, préférer la décapeuse. Vérifier quotidiennement le niveau d'huile, les chenilles et les lames."
    },

    {
      id: "bulldozer-d8",
      nom: "Bulldozer D8 / D9",
      categorie: "terrassement",
      description_courte: "Grand bulldozer haute puissance pour travaux de terrassement intensifs, défonçage de rochers et grands mouvements de terre",
      modeles_courants: ["Caterpillar D8T", "Caterpillar D9T", "Komatsu D155AX-8", "Dressta TD-40E"],
      mots_cles_identification: [
        "bulldozer", "d8", "d9", "grand bulldozer", "gros tracteur", "ripper",
        "défonceuse", "scarificateur", "lame large", "terrassement lourd"
      ],
      caracteristiques: {
        "Masse opérationnelle (D8T)": "38 100 kg",
        "Masse opérationnelle (D9T)": "49 700 kg",
        "Puissance moteur (D8T)": "231 kW (310 ch)",
        "Puissance moteur (D9T)": "302 kW (405 ch)",
        "Moteur (D8T)": "CAT C15 ACERT 6 cylindres",
        "Moteur (D9T)": "CAT C18 ACERT 6 cylindres",
        "Lame SU (D8T)": "Largeur 4,56 m × Hauteur 1,56 m",
        "Capacité lame SU (D8T)": "10,5 m³",
        "Ripper": "Multi-dents ou dent unique, profondeur max 1 100 mm",
        "Vitesse avant max": "11,4 km/h",
        "Pression au sol": "0,69 bar (D8T)",
        "Réservoir carburant": "1 090 L (D8T)",
        "Longueur hors tout": "7,0 m (D8T)",
        "Largeur hors tout": "3,60 m (D8T)"
      },
      performances: {
        "Productivité poussage (distance 30 m)": "600 – 1 200 m³/h",
        "Productivité poussage (distance 60 m)": "350 – 700 m³/h",
        "Défonçage roche (ripper)": "Roche jusqu'à 55 MPa (roche dure)",
        "Production journalière estimée (8h)": "4 000 – 9 000 m³/j",
        "Décapage végétal": "1,5 – 2,5 ha/h"
      },
      consommations: {
        "Carburant (travail moyen — D8T)": "35 – 50 L/h",
        "Carburant (travail moyen — D9T)": "50 – 70 L/h",
        "Consommation journalière (8h, D8T)": "280 – 400 L/j",
        "Consommation journalière (8h, D9T)": "400 – 560 L/j",
        "Carburant par m³ terrassé": "0,05 – 0,09 L/m³",
        "Lubrifiants moteur": "0,8 – 1,2 L/h"
      },
      rendements: {
        "Déblaiement sol meuble": "700 – 1 200 m³/h",
        "Déblaiement sol compact": "400 – 700 m³/h",
        "Défonçage et terrassement rocheux (ripper + bull)": "200 – 500 m³/h",
        "Journée productive (8h)": "4 000 – 8 000 m³/j",
        "Coefficient d'utilisation": "0,75 – 0,85"
      },
      applications_routes: [
        "Grands terrassements (gros volumes de déblais/remblais)",
        "Défonçage de roches tendres à dures au ripper",
        "Travaux de mines et carrières associées aux routes",
        "Construction de barrages et retenues d'eau",
        "Terrassement de zones de forte altitude",
        "Démolition et déblayage massif"
      ],
      notes_importantes: "Engin très consommateur en carburant. Réserver aux travaux nécessitant une forte puissance. Le D9 est réservé aux travaux rocheux ou aux très grands volumes. Entretien des chenilles critique (inspection quotidienne)."
    },

    {
      id: "niveleuse-140m",
      nom: "Niveleuse (Grader) 140M",
      categorie: "terrassement",
      description_courte: "Niveleuse articulée pour profilage, finition et entretien de chaussées — engin indispensable sur tout chantier routier",
      modeles_courants: ["Caterpillar 140M3", "Komatsu GD655-6", "Volvo G946B", "John Deere 772GP"],
      mots_cles_identification: [
        "niveleuse", "grader", "motor grader", "lame de nivellement", "profiler",
        "coffre central", "longue lame", "finisseur de terrassement", "réglage fin"
      ],
      caracteristiques: {
        "Masse opérationnelle": "14 615 – 16 200 kg",
        "Puissance moteur": "164 kW (220 ch) à 2 000 tr/min",
        "Moteur": "CAT C9.3 ACERT diesel 6 cylindres",
        "Lame": "Largeur 4,27 m, réglable en angle (0°–90°)",
        "Tilt de lame": "±15°",
        "Angle de lame": "0° – 90°",
        "Vitesse de translation max": "47,5 km/h (avance) / 32 km/h (recul)",
        "Vitesse de travail": "3 – 15 km/h",
        "Pression de contact pneus": "2,0 – 2,5 bar",
        "Réservoir carburant": "280 L",
        "Longueur hors tout": "9,2 m",
        "Largeur hors tout": "2,59 m (barre d'attelage)",
        "Hauteur hors tout": "3,35 m",
        "Empattement": "6,10 m"
      },
      performances: {
        "Vitesse optimale de travail (réglage fin)": "3 – 8 km/h",
        "Couverture (profilage de plate-forme)": "4 000 – 12 000 m²/h",
        "Épaisseur de coupe maximale": "0,25 m",
        "Largeur de travail effective": "3,5 – 4,0 m",
        "Précision de nivellement": "± 5 mm (GPS automatique) / ± 20 mm (manuel)",
        "Production journalière (profilage)": "2,5 – 5 km de route/jour",
        "Production journalière (entretien courant)": "10 – 25 km de piste/jour"
      },
      consommations: {
        "Carburant (travail normal)": "12 – 18 L/h",
        "Carburant (travail intensif)": "18 – 24 L/h",
        "Carburant (transit/déplacement)": "8 – 12 L/h",
        "Consommation journalière (8h)": "100 – 160 L/j",
        "Carburant par km profilé": "35 – 60 L/km",
        "Lubrifiants": "0,3 – 0,5 L/h"
      },
      rendements: {
        "Profilage plate-forme (sol meuble)": "5 000 – 12 000 m²/h",
        "Reprofilage chaussée existante": "8 000 – 20 000 m²/h",
        "Talutage des accotements": "1 – 2 km/h",
        "Entretien piste latéritique": "15 – 30 km/j",
        "Réglage couche de base (précision)": "2 – 5 km/j",
        "Coefficient d'utilisation": "0,75 – 0,85"
      },
      applications_routes: [
        "Profilage et finition de la plate-forme routière",
        "Réglage des couches de chaussée (sous-couche, couche de base)",
        "Entretien et reprofilage de routes en terre et pistes",
        "Talutage et profilage des fossés",
        "Ouverture des fossés de drainage",
        "Réglage du bombement transversal de chaussée",
        "Entretien courant de routes latéritiques"
      ],
      notes_importantes: "Engin de précision — le rendement dépend fortement de la qualification de l'opérateur. Indispensable sur tout chantier routier. En sol sec et poussiéreux, arroser la surface avant nivellement. Les lames s'usent rapidement sur latérite — prévoir stocks de lames de rechange."
    },

    {
      id: "decapeuse-657",
      nom: "Décapeuse / Scraper 657",
      categorie: "terrassement",
      description_courte: "Décapeuse automotrice pour transport de terres sur longues distances — productive pour mouvements de masse",
      modeles_courants: ["Caterpillar 657G", "Caterpillar 657E", "Komatsu WS23S-2"],
      mots_cles_identification: [
        "décapeuse", "scraper", "automoteur", "benne à ouverture", "transport de terres",
        "pusher", "push-pull", "engin de déblai-remblai", "coupeur de terre"
      ],
      caracteristiques: {
        "Masse opérationnelle": "49 900 – 52 000 kg",
        "Puissance moteur tracteur avant": "388 kW (520 ch)",
        "Puissance moteur pousseur arrière": "388 kW (520 ch)",
        "Puissance totale (push-pull)": "776 kW (1 040 ch)",
        "Capacité de la benne (rase)": "24,9 m³",
        "Capacité de la benne (comble)": "30,6 m³",
        "Profondeur de coupe max": "400 mm",
        "Vitesse transport chargé max": "52 km/h",
        "Vitesse transport vide max": "60 km/h",
        "Réservoir carburant (avant)": "851 L",
        "Réservoir carburant (arrière)": "568 L",
        "Longueur hors tout": "17,0 m",
        "Largeur hors tout": "4,25 m",
        "Largeur de coupe": "3,63 m"
      },
      performances: {
        "Productivité (distance 200 m)": "1 200 – 2 000 m³/h",
        "Productivité (distance 500 m)": "600 – 1 000 m³/h",
        "Productivité (distance 1 000 m)": "300 – 500 m³/h",
        "Distance économique optimale": "200 – 1 500 m",
        "Temps de chargement": "1 – 2 min/cycle",
        "Charge utile par cycle": "25 – 30 m³ (sol en place)",
        "Production journalière (8h, distance 500m)": "5 000 – 8 000 m³/j"
      },
      consommations: {
        "Carburant (travail moyen push-pull)": "55 – 75 L/h (tracteur avant seul)",
        "Carburant total (push-pull, 2 moteurs)": "80 – 110 L/h",
        "Consommation journalière (8h)": "640 – 880 L/j (push-pull)",
        "Carburant par m³ transporté (500m)": "0,08 – 0,12 L/m³",
        "Lubrifiants": "0,8 – 1,2 L/h"
      },
      rendements: {
        "Distance optimale transport": "200 – 1 500 m",
        "Production (distance 300 m, 8h)": "6 000 – 9 000 m³/j",
        "Production (distance 700 m, 8h)": "4 000 – 6 500 m³/j",
        "Production (distance 1 200 m, 8h)": "2 500 – 4 000 m³/j",
        "Coefficient d'utilisation": "0,75 – 0,85"
      },
      applications_routes: [
        "Grands mouvements de terres (remblais importants)",
        "Décapage de terrain et évacuation de matériaux sur 200–1 500 m",
        "Remblayage de vallons et zones déprimées",
        "Travaux d'aménagement de grandes surfaces",
        "Complémentaire au bulldozer (longues distances)"
      ],
      notes_importantes: "Idéale pour terrains à couverture meuble (latérite, argile, sable). Peu adaptée aux terrains rocheux. Économiquement rentable au-delà de 200 m de transport — en dessous, le bulldozer ou la pelle+tombereau sont plus économiques. Nécessite toujours un bulldozer pousseur d'appoint."
    },

    // =====================================================================
    // EXTRACTION & CHARGEMENT
    // =====================================================================
    {
      id: "pelle-320",
      nom: "Pelle Hydraulique 320 (20 tonnes)",
      categorie: "extraction",
      description_courte: "Pelle hydraulique de classe 20 tonnes — polyvalente pour excavation, chargement et travaux courants",
      modeles_courants: ["Caterpillar 320D3", "Komatsu PC210LC-11", "Volvo EC220E", "Liebherr R 920"],
      mots_cles_identification: [
        "pelle", "pelleteuse", "excavatrice", "hydraulique", "320", "bras articulé",
        "godet", "cabine rotative", "chenilles pelle", "excavateur", "drague"
      ],
      caracteristiques: {
        "Masse opérationnelle": "20 300 – 22 500 kg",
        "Puissance moteur": "104 – 122 kW (140 – 163 ch)",
        "Moteur": "CAT C7.1 ACERT diesel",
        "Capacité godet standard": "0,93 – 1,19 m³",
        "Profondeur de fouille max": "6,63 m",
        "Rayon de fouille max": "10,2 m",
        "Hauteur de déversement max": "7,08 m",
        "Effort d'arrachement godet": "142 kN",
        "Effort d'arrachement bras": "105 kN",
        "Vitesse de rotation": "11,6 tr/min",
        "Vitesse de translation": "5,5 km/h",
        "Pression au sol": "0,46 bar",
        "Réservoir carburant": "410 L",
        "Longueur hors tout (transport)": "10,0 m",
        "Largeur hors tout": "2,59 m",
        "Hauteur hors tout (cabine)": "2,97 m"
      },
      performances: {
        "Production (sol meuble, godet 1 m³)": "80 – 150 m³/h",
        "Production (sol compact, godet 1 m³)": "50 – 100 m³/h",
        "Production (roche fragmentée)": "30 – 70 m³/h",
        "Temps de cycle moyen": "20 – 30 sec",
        "Coefficient de remplissage godet": "0,80 – 1,10 selon matériau",
        "Production journalière (8h, sol meuble)": "600 – 1 200 m³/j"
      },
      consommations: {
        "Carburant (travail normal)": "15 – 22 L/h",
        "Carburant (travail intensif)": "22 – 28 L/h",
        "Consommation journalière (8h)": "120 – 180 L/j",
        "Carburant par m³ extrait": "0,12 – 0,22 L/m³",
        "Lubrifiants moteur": "0,3 – 0,5 L/h"
      },
      rendements: {
        "Excavation sol meuble": "100 – 150 m³/h",
        "Excavation sol argileux": "70 – 110 m³/h",
        "Excavation roche rippée": "40 – 80 m³/h",
        "Chargement de camions (sol meuble)": "120 – 200 m³/h",
        "Terrassement fondation (précision)": "40 – 80 m³/h",
        "Journée type productive (8h)": "700 – 1 200 m³/j"
      },
      applications_routes: [
        "Excavation de déblais (tranchées, fouilles)",
        "Chargement de tombereaux et camions bennes",
        "Travaux de drainage et fossés",
        "Terrassement en zone difficile",
        "Démolition et déblayage",
        "Pose de buses et canalisations",
        "Travaux hydrauliques (cours d'eau)"
      ],
      notes_importantes: "Pelle la plus courante sur les chantiers routiers en Afrique de l'Ouest. Vérifier quotidiennement l'huile hydraulique. En condition poussiéreuse (latérite), remplacer les filtres à air plus fréquemment. Adapter le godet selon le matériau."
    },

    {
      id: "pelle-330",
      nom: "Pelle Hydraulique 330 (30 tonnes)",
      categorie: "extraction",
      description_courte: "Grande pelle hydraulique pour excavations profondes, grandes productions et travaux intensifs",
      modeles_courants: ["Caterpillar 330D L", "Komatsu PC300LC-8", "Volvo EC300E", "Hitachi ZX330-6"],
      mots_cles_identification: [
        "grande pelle", "330", "pelle lourde", "excavateur lourd", "grand godet",
        "pelle 30 tonnes", "pelleteuse lourde", "extraction lourde"
      ],
      caracteristiques: {
        "Masse opérationnelle": "30 200 – 33 500 kg",
        "Puissance moteur": "195 – 227 kW (265 – 305 ch)",
        "Moteur": "CAT C9 ACERT diesel 6 cylindres",
        "Capacité godet standard": "1,62 – 2,0 m³",
        "Profondeur de fouille max": "7,55 m",
        "Rayon de fouille max": "11,5 m",
        "Hauteur de déversement max": "8,35 m",
        "Effort d'arrachement godet": "204 kN",
        "Vitesse de rotation": "10,0 tr/min",
        "Vitesse de translation": "5,0 km/h",
        "Réservoir carburant": "592 L",
        "Longueur hors tout (transport)": "11,5 m",
        "Largeur hors tout": "2,99 m"
      },
      performances: {
        "Production (sol meuble)": "150 – 280 m³/h",
        "Production (sol compact)": "100 – 180 m³/h",
        "Production (roche fragmentée)": "60 – 120 m³/h",
        "Temps de cycle": "22 – 35 sec",
        "Production journalière (8h, sol meuble)": "1 200 – 2 200 m³/j"
      },
      consommations: {
        "Carburant (travail normal)": "22 – 32 L/h",
        "Carburant (travail intensif)": "32 – 42 L/h",
        "Consommation journalière (8h)": "180 – 260 L/j",
        "Carburant par m³ extrait": "0,10 – 0,18 L/m³",
        "Lubrifiants": "0,5 – 0,8 L/h"
      },
      rendements: {
        "Excavation sol meuble": "180 – 280 m³/h",
        "Excavation sol compact": "120 – 200 m³/h",
        "Chargement de tombereaux lourds": "200 – 350 m³/h",
        "Journée type productive (8h)": "1 200 – 2 200 m³/j"
      },
      applications_routes: [
        "Excavation de grands volumes",
        "Alimentation de tombereaux lourds (773F, 777F)",
        "Travaux de déblais rocheux (après minage)",
        "Construction de barrages routiers",
        "Dragages et correction de cours d'eau"
      ],
      notes_importantes: "Utiliser avec tombereaux articulés (740/745) ou rigides (773/777) pour maximiser la production. La grande taille nécessite une zone de manœuvre suffisante."
    },

    {
      id: "chargeur-950",
      nom: "Chargeur sur Pneus 950 / 966",
      categorie: "extraction",
      description_courte: "Chargeur articulé sur pneus polyvalent — chargement, manutention de matériaux et alimentation centrale à enrobés",
      modeles_courants: ["Caterpillar 950H", "Caterpillar 966H", "Komatsu WA380-8", "Volvo L110H"],
      mots_cles_identification: [
        "chargeur", "loader", "chargeuse", "benne frontale", "godet avant", "pneus larges",
        "chariot élévateur", "alimentation", "pelle sur pneus", "bucket loader"
      ],
      caracteristiques: {
        "Masse opérationnelle (950H)": "16 734 kg",
        "Masse opérationnelle (966H)": "21 990 kg",
        "Puissance moteur (950H)": "135 kW (181 ch)",
        "Puissance moteur (966H)": "197 kW (264 ch)",
        "Capacité godet usage général (950H)": "3,1 m³",
        "Capacité godet usage général (966H)": "4,5 m³",
        "Hauteur de déversement (950H)": "3,10 m",
        "Hauteur de déversement (966H)": "3,34 m",
        "Charge maximale (950H)": "7 800 kg",
        "Charge maximale (966H)": "10 600 kg",
        "Vitesse de déplacement max": "38 – 42 km/h",
        "Rayon de braquage (extérieur)": "6,74 m (950H)",
        "Réservoir carburant (950H)": "247 L",
        "Réservoir carburant (966H)": "335 L"
      },
      performances: {
        "Cycles de chargement": "2,5 – 4 min/camion (15 t camion benne)",
        "Production de chargement (950H)": "200 – 350 m³/h",
        "Production de chargement (966H)": "300 – 500 m³/h",
        "Distance de transport optimale": "< 100 m",
        "Alimentation centrale enrobés": "200 – 400 t/h"
      },
      consommations: {
        "Carburant (950H, travail normal)": "14 – 18 L/h",
        "Carburant (966H, travail normal)": "18 – 26 L/h",
        "Consommation journalière 950H (8h)": "112 – 144 L/j",
        "Consommation journalière 966H (8h)": "144 – 208 L/j",
        "Lubrifiants": "0,3 – 0,5 L/h"
      },
      rendements: {
        "Chargement matériaux meubles (950H)": "250 – 400 m³/h",
        "Chargement gravillons/concassés": "200 – 350 m³/h",
        "Manutention et stockage matériaux": "150 – 300 m³/h",
        "Transport sur courte distance (< 100m)": "150 – 250 m³/h",
        "Journée type (8h)": "1 800 – 3 200 m³/j"
      },
      applications_routes: [
        "Chargement de camions bennes et tombereaux",
        "Alimentation de centrales à enrobés et béton",
        "Manutention et gerbage de matériaux en stock",
        "Transport sur courtes distances",
        "Nettoyage de chantier",
        "Mise en place de remblais de faible volume",
        "Démolition légère et déblayage"
      ],
      notes_importantes: "Vérifier régulièrement la pression des pneus (coûts importants en cas d'usure prématurée). Sur terrain rocheux concassé, utiliser pneus de protection renforcés. Indispensable auprès d'une centrale à enrobés."
    },

    {
      id: "retroexcavatrice-420",
      nom: "Rétrocaveuse / Pelle-Chargeuse 420F",
      categorie: "extraction",
      description_courte: "Machine polyvalente bi-fonctions — chargeur avant et rétrocaveuse arrière — idéale pour les petits travaux et tranchées",
      modeles_courants: ["Caterpillar 420F2", "John Deere 310SL", "Case 580SN", "JCB 3CX"],
      mots_cles_identification: [
        "rétrocaveuse", "pelle-chargeuse", "backhoe loader", "420", "machine polyvalente",
        "tracteur pelle", "godet avant et arrière", "petite pelle", "mini engin"
      ],
      caracteristiques: {
        "Masse opérationnelle": "7 030 – 8 200 kg",
        "Puissance moteur": "74 kW (99 ch)",
        "Moteur": "CAT C4.4 ACERT diesel",
        "Capacité godet rétro": "0,08 – 0,29 m³ (selon godet)",
        "Profondeur de fouille max": "5,97 m",
        "Rayon de fouille max": "8,20 m",
        "Capacité godet chargeur avant": "1,03 m³",
        "Hauteur de déversement (chargeur)": "2,86 m",
        "Vitesse de déplacement max": "38 km/h (4 roues motrices)",
        "Réservoir carburant": "136 L",
        "Longueur hors tout": "7,30 m",
        "Largeur hors tout": "2,32 m"
      },
      performances: {
        "Production creusement tranchée": "30 – 80 m³/h",
        "Profondeur de tranchée économique": "0,5 – 3,0 m",
        "Largeur de tranchée type": "0,3 – 0,8 m",
        "Production chargement (chargeur avant)": "60 – 120 m³/h"
      },
      consommations: {
        "Carburant (travail normal)": "8 – 14 L/h",
        "Consommation journalière (8h)": "64 – 112 L/j",
        "Lubrifiants": "0,2 – 0,3 L/h"
      },
      rendements: {
        "Creusement tranchée (sol meuble)": "50 – 100 m linéaire/h",
        "Creusement tranchée (sol compact)": "20 – 50 m linéaire/h",
        "Journée (8h, tranchée 0,6×1,2m)": "150 – 400 m linéaire/j"
      },
      applications_routes: [
        "Creusement de tranchées (drainage, assainissement)",
        "Pose de buses et canalisations",
        "Travaux de petites fouilles",
        "Entretien et réparation de routes",
        "Nettoyage de fossés",
        "Travaux en zone urbaine",
        "Travaux hydrauliques légers"
      ],
      notes_importantes: "Engin très polyvalent mais de faible puissance — à réserver aux petits travaux. Idéal pour les travaux d'assainissement et de pose de drains. Déplacement possible sur route sans transport spécial."
    },

    // =====================================================================
    // COMPACTAGE
    // =====================================================================
    {
      id: "compacteur-vibrant-ca250",
      nom: "Compacteur Vibrant Monocylindre CA250D",
      categorie: "compactage",
      description_courte: "Compacteur vibrant à bille unique — engin de référence pour le compactage de terrassements et couches de chaussée",
      modeles_courants: ["Caterpillar CA250D", "Caterpillar CA300D", "Bomag BW 213 D-5", "Dynapac CA3500D"],
      mots_cles_identification: [
        "compacteur", "rouleau vibrant", "rouleau compresseur", "monocylindre", "bille unique",
        "rouleau lisse", "compacteur de sol", "vibration", "damage", "compaction"
      ],
      caracteristiques: {
        "Masse opérationnelle": "9 060 – 12 800 kg",
        "Puissance moteur": "97 – 130 kW (130 – 174 ch)",
        "Moteur": "CAT C3.4B ACERT diesel",
        "Largeur du cylindre": "2,13 m",
        "Diamètre du cylindre": "1,52 m",
        "Amplitude vibration haute": "1,9 mm",
        "Amplitude vibration basse": "0,9 mm",
        "Fréquence de vibration (haute)": "30 Hz (1 800 vib/min)",
        "Fréquence de vibration (basse)": "35 Hz (2 100 vib/min)",
        "Force centrifuge nominale": "295 kN",
        "Charge statique linéaire": "31,6 kg/cm",
        "Vitesse de travail": "2 – 7 km/h",
        "Vitesse de transport max": "12 – 15 km/h",
        "Réservoir carburant": "208 L",
        "Longueur hors tout": "5,92 m",
        "Largeur hors tout": "2,39 m"
      },
      performances: {
        "Largeur de compactage effective": "2,0 – 2,1 m",
        "Vitesse optimale de compactage": "3 – 5 km/h",
        "Épaisseur de couche compactée max (remblai)": "0,30 – 0,50 m",
        "Épaisseur de couche compactée max (grave)": "0,20 – 0,30 m",
        "Nombre de passes recommandées": "4 – 8 passes (selon OPM)",
        "Densité sèche atteignable": "95 – 98% OPM (Proctor Normal)"
      },
      consommations: {
        "Carburant (travail normal)": "10 – 16 L/h",
        "Carburant (transit)": "6 – 10 L/h",
        "Consommation journalière (8h)": "80 – 128 L/j",
        "Carburant par 1 000 m² compactés": "2,5 – 5 L/1 000 m²",
        "Lubrifiants": "0,2 – 0,4 L/h"
      },
      rendements: {
        "Compactage terrassement (remblai, 6 passes)": "600 – 1 500 m²/h",
        "Compactage grave non traitée (4 passes)": "700 – 1 800 m²/h",
        "Compactage sous-couche (4 passes)": "800 – 2 000 m²/h",
        "Surface journalière compactée (8h, 6 passes)": "4 800 – 12 000 m²/j",
        "Volume compacté journalier (épaisseur 0,30m)": "1 440 – 3 600 m³/j"
      },
      applications_routes: [
        "Compactage des remblais de terrassement",
        "Compactage des couches de forme (plate-forme)",
        "Compactage de la couche de fondation",
        "Compactage des granulats traités",
        "Compactage en zones difficiles d'accès (talus)"
      ],
      notes_importantes: "La teneur en eau du matériau est critique — compacter à ±2% de l'OPM. Vérifier la densité par essai nucleodensimètre ou plaque de chargement. Croiser les passes pour uniformité. En cas de sol argileux, adapter la fréquence."
    },

    {
      id: "compacteur-pneus-cp54",
      nom: "Compacteur à Pneus CP-54",
      categorie: "compactage",
      description_courte: "Rouleau pneumatique à pneus lissants — idéal pour le compactage des enrobés et des couches granulaires",
      modeles_courants: ["Caterpillar CP-54", "Bomag BW 27 RH", "Dynapac CP274", "Sakai TS300"],
      mots_cles_identification: [
        "compacteur pneus", "rouleau pneumatique", "compacteur asphalte pneus",
        "pneus lisses", "compactage bitume", "finition asphalte"
      ],
      caracteristiques: {
        "Masse opérationnelle": "12 125 – 16 000 kg",
        "Nombre de pneus": "4 avant + 7 arrière (11 pneus)",
        "Pression de gonflage pneus": "0,3 – 0,8 MPa (réglable)",
        "Largeur de compactage": "2,20 m",
        "Vitesse de travail": "2 – 10 km/h",
        "Vitesse de transport max": "20 km/h",
        "Charge statique (masse max)": "Up to 25 000 kg (lestage eau/sable)",
        "Réservoir carburant": "170 L",
        "Longueur hors tout": "5,72 m",
        "Largeur hors tout": "2,43 m"
      },
      performances: {
        "Largeur de compactage": "2,0 – 2,2 m",
        "Pression de contact réglable": "Adapté enrobés chauds et sols fins",
        "Passes nécessaires (enrobé)": "4 – 6 passes",
        "Passes nécessaires (sol fin)": "6 – 10 passes"
      },
      consommations: {
        "Carburant (travail)": "8 – 14 L/h",
        "Consommation journalière (8h)": "64 – 112 L/j",
        "Lubrifiants": "0,2 – 0,3 L/h"
      },
      rendements: {
        "Compactage enrobé": "1 000 – 2 500 m²/h",
        "Compactage couche de base granulaire": "800 – 2 000 m²/h",
        "Surface journalière (8h, 6 passes)": "5 000 – 15 000 m²/j"
      },
      applications_routes: [
        "Compactage des enrobés bitumineux (couche de roulement)",
        "Finition de surface bitumineuse",
        "Compactage des couches de base et sous-base granulaires",
        "Compactage des remblais argileux",
        "Compactage de finition des terrassements"
      ],
      notes_importantes: "Ne jamais arroser un enrobé chaud avec le système d'arrosage du compacteur — risque de choc thermique et craquelures. Utiliser uniquement de l'eau propre. Les pneus doivent être réchauffés avant utilisation sur enrobé froid."
    },

    {
      id: "compacteur-tandem-cb534",
      nom: "Compacteur Tandem Vibrant CB-534",
      categorie: "compactage",
      description_courte: "Rouleau tandem vibrant à deux cylindres — compactage et finition des enrobés bitumineux",
      modeles_courants: ["Caterpillar CB-534D", "Bomag BW 174 AD-5", "Dynapac CC2200VI", "Hamm HD+90i"],
      mots_cles_identification: [
        "tandem", "rouleau tandem", "deux cylindres", "double bille", "finisseur rouleau",
        "compacteur asphalte", "compacteur enrobé", "rouleau double"
      ],
      caracteristiques: {
        "Masse opérationnelle": "5 440 – 8 900 kg",
        "Puissance moteur": "55 – 75 kW (74 – 100 ch)",
        "Largeur de compactage": "1,67 – 2,13 m",
        "Amplitude vibration": "0,4 – 0,7 mm",
        "Fréquence vibration": "42 – 58 Hz",
        "Vitesse de travail": "1 – 8 km/h",
        "Vitesse de transport": "10 km/h",
        "Réservoir carburant": "108 L",
        "Longueur hors tout": "4,25 m",
        "Largeur hors tout": "2,13 m"
      },
      performances: {
        "Épaisseur d'enrobé compactée": "4 – 15 cm",
        "Passes pour enrobé (couche roulement)": "4 – 6 passes",
        "Largeur effective": "1,67 – 2,0 m"
      },
      consommations: {
        "Carburant (travail)": "6 – 10 L/h",
        "Consommation journalière (8h)": "48 – 80 L/j",
        "Lubrifiants": "0,15 – 0,25 L/h"
      },
      rendements: {
        "Compactage enrobé (couche roulement)": "800 – 2 000 m²/h",
        "Compactage enrobé (couche de base)": "600 – 1 500 m²/h",
        "Surface journalière compactée (8h)": "4 000 – 12 000 m²/j"
      },
      applications_routes: [
        "Compactage et finition des couches de roulement en enrobé",
        "Compactage des couches de binder (couche d'accrochage)",
        "Finition soignée des surfaces bitumineuses",
        "Travaux de reprofilage et point à temps",
        "Compactage en zones étroites (accotements, virages)"
      ],
      notes_importantes: "Toujours travailler derrière le finisseur à une distance de 5 – 20 m. L'enrobé doit être compacté entre 130°C et 80°C. Arroser légèrement les cylindres pour éviter l'adhérence de l'enrobé."
    },

    // =====================================================================
    // TRANSPORT
    // =====================================================================
    {
      id: "tombereau-articule-740",
      nom: "Tombereau Articulé 740B (39 tonnes)",
      categorie: "transport",
      description_courte: "Tombereau articulé tout-terrain haute capacité — transport de matériaux sur chantiers difficiles et terrains meubles",
      modeles_courants: ["Caterpillar 740B", "Caterpillar 745", "Volvo A40G", "Bell B40E"],
      mots_cles_identification: [
        "tombereau", "tombereau articulé", "740", "engin de transport", "benne basculante",
        "dumper articulé", "6 roues motrices", "tout terrain transport", "ADT"
      ],
      caracteristiques: {
        "Charge utile nominale": "39 000 kg",
        "Volume de la benne (rase)": "23,5 m³",
        "Volume de la benne (comble)": "29,0 m³",
        "Masse à vide": "27 200 kg",
        "Masse en charge": "66 200 kg",
        "Puissance moteur": "336 kW (451 ch)",
        "Moteur": "CAT C15 ACERT diesel",
        "Transmission": "Hydrostatique + automatique 7 vitesses",
        "Traction": "6 × 6 permanente",
        "Vitesse max (chargé)": "53 km/h",
        "Pente franchissable": "35% (chargé)",
        "Réservoir carburant": "550 L",
        "Longueur hors tout": "11,5 m",
        "Largeur hors tout": "3,56 m",
        "Hauteur hors tout": "3,80 m"
      },
      performances: {
        "Cycles/heure (distance 500m, piste)": "5 – 8 cycles/h",
        "Transport (distance 500m)": "195 – 312 t/h (ou 130 – 208 m³/h foisonné)",
        "Temps de déchargement": "45 – 90 sec",
        "Temps de manouvre": "1 – 2 min",
        "Production journalière (8h, 500m)": "1 500 – 2 500 m³/j"
      },
      consommations: {
        "Carburant (travail chargé)": "40 – 55 L/h",
        "Carburant (retour à vide)": "20 – 30 L/h",
        "Carburant moyen (cycle aller-retour)": "30 – 45 L/h",
        "Consommation journalière (8h)": "240 – 360 L/j",
        "Carburant par tonne transportée (500m)": "0,12 – 0,18 L/t",
        "Lubrifiants": "0,6 – 0,9 L/h"
      },
      rendements: {
        "Distance économique optimale": "300 – 3 000 m",
        "Production (distance 300m, 8h)": "2 800 – 4 200 m³/j",
        "Production (distance 1 000m, 8h)": "1 200 – 2 000 m³/j",
        "Production (distance 2 000m, 8h)": "700 – 1 200 m³/j"
      },
      applications_routes: [
        "Transport de déblais des terrassements",
        "Transport de remblais vers zones de remplissage",
        "Alimentation des zones de compactage",
        "Transport de matériaux latéritiques (graveleux)",
        "Travaux en zones humides et pistes difficiles",
        "Transport de matériaux de carrière"
      ],
      notes_importantes: "Idéal pour terrains difficiles (latérite humide, pentes). La productivité dépend fortement de la distance de transport et de l'état de la piste de chantier. Prévoir 3 tombereaux pour 1 pelle 320D optimale. Vérifier quotidiennement le niveau des pneumatiques."
    },

    {
      id: "camion-benne",
      nom: "Camion Benne 10 – 30 tonnes",
      categorie: "transport",
      description_courte: "Camion benne routier pour transport de matériaux sur réseau routier — polyvalent et économique",
      modeles_courants: ["Mercedes Actros 3350", "Volvo FMX 540", "MAN TGS 41.400", "DAF CF 85", "Renault Kerax"],
      mots_cles_identification: [
        "camion benne", "camion bascule", "camion de chantier", "semi-remorque benne",
        "6x4", "8x4", "camion tas", "benne basculante routière", "gravier camion"
      ],
      caracteristiques: {
        "Charge utile (10t, 6×4)": "10 000 – 12 000 kg",
        "Charge utile (20t, 8×4)": "18 000 – 22 000 kg",
        "Charge utile (30t, semi-remorque)": "25 000 – 32 000 kg",
        "Volume benne (10t)": "6 – 8 m³",
        "Volume benne (20t)": "10 – 14 m³",
        "Volume benne (30t, semi)": "20 – 28 m³",
        "Puissance moteur (10t)": "250 – 300 ch",
        "Puissance moteur (20t)": "360 – 420 ch",
        "Puissance moteur (30t)": "460 – 540 ch",
        "Vitesse max (route)": "90 – 100 km/h",
        "Vitesse max (piste chargé)": "20 – 40 km/h",
        "Réservoir carburant": "400 – 600 L"
      },
      performances: {
        "Rotation chantier (10 km, route)": "3 – 5 rotations/h",
        "Rotation chantier (5 km, piste)": "2 – 4 rotations/h",
        "Temps de chargement (par pelle)": "3 – 8 min",
        "Temps de déchargement": "3 – 6 min"
      },
      consommations: {
        "Carburant (chargé, route)": "25 – 40 L/100 km",
        "Carburant (vide, route)": "18 – 28 L/100 km",
        "Carburant (chargé, piste lente)": "8 – 15 L/h",
        "Consommation journalière (8h, circuit 5km)": "80 – 140 L/j",
        "Carburant par tonne transportée au km": "0,25 – 0,45 L/(t·km)"
      },
      rendements: {
        "Transport 10 km (10t camion)": "30 – 50 t/h (aller-retour)",
        "Transport 10 km (20t camion)": "50 – 90 t/h",
        "Production journalière (20t, circuit 10km)": "350 – 650 t/j",
        "Nombre de camions 10t pour 1 pelle 320D": "4 – 6 camions"
      },
      applications_routes: [
        "Transport de matériaux entre chantier et dépôt",
        "Approvisionnement de chantiers en granulats",
        "Évacuation de déblais hors chantier",
        "Transport de remblais sélectionnés",
        "Livraison d'enrobés depuis la centrale",
        "Transport d'agrégats pour construction de routes"
      ],
      notes_importantes: "Pour pistes de chantier difficiles (terrain humide), préférer les tombereaux articulés. Les camions bennes standards sont adaptés aux pistes consolidées. Prévoir suffisamment de camions pour maintenir le flux continu (productivité de la pelle)."
    },

    // =====================================================================
    // REVÊTEMENT BITUMINEUX
    // =====================================================================
    {
      id: "finisseur-asphalte-ap655",
      nom: "Finisseur d'Asphalte AP-655",
      categorie: "revetement",
      description_courte: "Finisseur à vis de distribution pour la mise en œuvre d'enrobés bitumineux en couche régulière",
      modeles_courants: ["Caterpillar AP-655", "Vögele Super 1800-3", "Dynapac F1200C", "Bomag BF 600C"],
      mots_cles_identification: [
        "finisseur", "finisseur asphalte", "répandeuse enrobé", "machine à asphalter",
        "paver", "asphalt paver", "vis de répartition", "trémie", "enrobage route"
      ],
      caracteristiques: {
        "Largeur de mise en œuvre (min – max)": "2,5 – 7,3 m (avec extensions)",
        "Puissance moteur": "97 kW (130 ch)",
        "Moteur": "CAT C4.4 diesel",
        "Capacité trémie de chargement": "11,4 tonnes",
        "Épaisseur de pose max": "0 – 300 mm",
        "Vitesse de finition": "0 – 17,5 m/min",
        "Vitesse de transport": "0 – 4,5 km/h",
        "Pression de contact tracteur": "0,12 bar",
        "Système de chauffe tablier": "Gaz propane (bi-énergie)",
        "Réservoir carburant moteur": "209 L",
        "Réservoir gaz (tableaux)": "2 × 9 kg bouteilles",
        "Longueur hors tout": "5,36 m",
        "Largeur standard": "2,55 m",
        "Masse": "14 500 kg"
      },
      performances: {
        "Productivité (mise en œuvre)": "300 – 800 t/h théorique",
        "Production pratique par jour (8h)": "300 – 600 t/j (selon profil)",
        "Surface couverte par jour": "2 000 – 6 000 m²/j",
        "Régularité de surface (IRI)": "< 1,5 m/km (conditions optimales)",
        "Alimentation recommandée": "1 finisseur pour 10 – 15 camions/h"
      },
      consommations: {
        "Carburant moteur": "12 – 18 L/h",
        "Gaz propane (chauffe tablier)": "2 – 5 kg/h selon température",
        "Consommation journalière carburant (8h)": "96 – 144 L/j",
        "Carburant par tonne d'enrobé": "0,02 – 0,04 L/t",
        "Lubrifiants": "0,3 – 0,4 L/h"
      },
      rendements: {
        "Mise en œuvre (largeur 4 m, ep. 8 cm)": "2 500 – 5 000 m²/j",
        "Mise en œuvre (largeur 6 m, ep. 8 cm)": "3 000 – 6 000 m²/j",
        "Tonnes d'enrobé posées/jour (8h)": "250 – 550 t/j",
        "Longueur de chaussée réalisée/jour": "600 – 1 500 m/j (largeur 4 m)"
      },
      applications_routes: [
        "Mise en œuvre de couche de roulement en enrobé",
        "Réalisation de la couche de binder (couche d'accrochage)",
        "Construction de couche de base en grave-bitume",
        "Reprofilage de chaussées existantes",
        "Travaux de réhabilitation de routes bitumées"
      ],
      notes_importantes: "L'alimentation continue du finisseur est CRITIQUE — tout arrêt prolongé crée une irrégularité de surface. Chauffer systématiquement le tablier avant mise en œuvre (température minimale 130°C). Travailler par temps sec, température air > 10°C."
    },

    {
      id: "repandeuse-liant",
      nom: "Répandeuse de Liant Bitumineux",
      categorie: "revetement",
      description_courte: "Engin spécialisé pour le répandage de liant bitumineux (bitume, émulsion) sur la chaussée avant mise en œuvre de l'enrobé",
      modeles_courants: ["Etnyre Black Cat CB1200", "Bitelli BB240", "Breining SVD-170", "Colas SPRATEC"],
      mots_cles_identification: [
        "répandeuse", "distributeur de bitume", "répandeur liant", "citerne bitume",
        "arroseur bitume", "prime coat", "tack coat", "imprégnation", "enduit"
      ],
      caracteristiques: {
        "Capacité de la citerne": "8 000 – 12 000 L",
        "Rampe de répandage": "4,0 – 6,0 m (extensible)",
        "Débit de répandage": "0,3 – 3,5 kg/m²",
        "Régularité de répandage": "± 5% (débit constant)",
        "Système de chauffe citerne": "Brûleurs au fioul/gaz (maintien à 150 – 180°C)",
        "Pompe de repompage": "3 000 L/min",
        "Vitesse de répandage": "5 – 25 km/h",
        "Puissance moteur porteur": "200 – 360 ch",
        "Réservoir carburant porteur": "300 – 500 L"
      },
      performances: {
        "Surface traitée par plein (8 000L)": "2 700 – 26 000 m² (selon dosage)",
        "Surface traitée/heure (imprégnation)": "3 000 – 8 000 m²/h",
        "Nombre de ravitaillements/jour": "2 – 4 (selon distance centrale)",
        "Production journalière (8h)": "5 000 – 25 000 m²/j"
      },
      consommations: {
        "Carburant porteur (travail)": "20 – 30 L/h",
        "Combustible chauffe citerne (fioul)": "5 – 15 L/h",
        "Consommation journalière carburant (8h)": "160 – 240 L/j",
        "Liant bitumineux utilisé": "Bitume 80/100, 60/70 ou émulsion selon usage"
      },
      rendements: {
        "Imprégnation (dosage 1,0 kg/m²)": "8 000 m²/plein de citerne",
        "Enduit de couche d'accrochage (0,3 kg/m²)": "26 000 m²/plein",
        "Enduit superficiel (2,0 kg/m²)": "4 000 m²/plein",
        "Cadence journalière": "15 000 – 40 000 m²/j"
      },
      applications_routes: [
        "Couche d'imprégnation sur grave non traitée (avant enrobé)",
        "Couche d'accrochage entre deux couches bitumineuses",
        "Enduits superficiels (ES) monocouche/bicouche",
        "Traitement de surfaces (anti-poussière temporaire)",
        "Prime coat sur base granulaire"
      ],
      notes_importantes: "Le bitume doit être maintenu entre 150°C et 180°C. Ne jamais répandre par temps humide ou pluie. Sécurité stricte (risque de brûlures graves). Calibrer la rampe avant chaque campagne. Procéder à une montée en température progressive de la citerne."
    },

    {
      id: "centrale-enrobes",
      nom: "Centrale à Enrobés Mobile",
      categorie: "revetement",
      description_courte: "Installation mobile de fabrication d'enrobés bitumineux — coeur de tout chantier de revêtement routier",
      modeles_courants: ["Marini MAP 140", "Benninghoven TBA 240", "Ammann ABP 120", "Astec Double Barrel"],
      mots_cles_identification: [
        "centrale enrobés", "centrale bitume", "usine asphalte", "centrale mobile",
        "fabrication enrobé", "production asphalte", "centrale de malaxage", "plant asphalte"
      ],
      caracteristiques: {
        "Capacité de production": "80 – 200 t/h (centrale mobile)",
        "Type": "Poste discontinu (malaxeur) / continu (tambour-sécheur)",
        "Sécheur-tambour": "Débit 120 – 240 t/h",
        "Malaxeur": "Capacité 1 000 – 3 000 kg/fournée",
        "Stockage granulats (trémies froides)": "4 × 50 m³ minimum",
        "Stockage bitume (cuve)": "30 000 – 80 000 L",
        "Puissance installée (groupe)": "400 – 800 kW",
        "Consommation fioul sécheur": "8 – 15 kg/t d'enrobé produit",
        "Température enrobé produit": "150 – 175°C",
        "Délai de montage": "3 – 7 jours",
        "Surface d'implantation nécessaire": "40 × 60 m minimum"
      },
      performances: {
        "Production nominale": "120 – 200 t/h",
        "Production journalière (8h)": "800 – 1 500 t/j",
        "Surface de route produite/jour (ep. 8cm)": "8 000 – 15 000 m²/j",
        "Précision de dosage granulats": "± 0,5%",
        "Précision de dosage bitume": "± 0,3%"
      },
      consommations: {
        "Fioul (séchage granulats)": "8 – 12 kg/t d'enrobé",
        "Électricité (groupe)": "400 – 600 kW (groupe diesel)",
        "Carburant groupe électrogène": "80 – 130 L/h",
        "Consommation journalière fioul (8h, 150 t/h)": "9 600 – 14 400 kg/j (9 600 – 14 400 L)",
        "Bitume (dosage type 5,5%)": "55 – 60 kg/t d'enrobé"
      },
      rendements: {
        "Production type chantier africain": "80 – 140 t/h (réel)",
        "Linéaire de route produit (4m, 8cm)": "1,5 – 3 km/j de chaussée bitumée",
        "Autonomie (bitume, cuves 60 000L)": "1 000 – 1 100 t d'enrobé",
        "Distance d'approvisionnement optimale": "< 20 km de la zone de travaux"
      },
      applications_routes: [
        "Production d'enrobés pour toutes couches de chaussée",
        "Fabrication BBSG (béton bitumineux semi-grenus)",
        "Fabrication GB (grave-bitume) pour couche de base",
        "Fabrication EME (enrobé à module élevé)",
        "Production d'enrobé tiède ou froid sur demande"
      ],
      notes_importantes: "Localiser la centrale au plus près du chantier (< 15 km idéal) pour limiter le refroidissement des enrobés pendant le transport. La température minimale d'enrobé à l'arrivée sur chantier est 130°C. Nécessite alimentation électrique de secours. Prévoir 150 m² de zone de sécurité incendie."
    },

    // =====================================================================
    // CONCASSAGE
    // =====================================================================
    {
      id: "concasseur-mobile",
      nom: "Station de Concassage Mobile",
      categorie: "concassage",
      description_courte: "Installation mobile de concassage et criblage pour production de granulats sur site",
      modeles_courants: ["Metso Lokotrack LT106", "Sandvik QJ341", "Kleemann MR 130", "Terex Finlay J-960"],
      mots_cles_identification: [
        "concasseur", "broyeur", "concasseur mobile", "station concassage",
        "criblage", "granulats", "gravier concassé", "production granulats",
        "crible vibrant", "tapis roulant", "carrière"
      ],
      caracteristiques: {
        "Puissance moteur (concasseur à mâchoires)": "200 – 350 kW",
        "Capacité d'alimentation": "0 – 600 mm (blocs max)",
        "Production nominale": "100 – 350 t/h selon grade",
        "Ouverture de sortie réglable": "40 – 160 mm",
        "Convoyeur de décharge": "Longueur 8 – 12 m",
        "Masse totale (sur chenilles)": "40 000 – 65 000 kg",
        "Déplacement": "Autopropulsé sur chenilles",
        "Réservoir carburant": "400 – 600 L",
        "Puissance moteur diesel": "350 – 500 kW"
      },
      performances: {
        "Production (concasseur primaire, 0-80mm)": "150 – 300 t/h",
        "Production (avec crible, 0-31.5mm)": "100 – 200 t/h de chaque fraction",
        "Ratio concassage": "4:1 à 8:1",
        "Fractions produites": "0/31,5 mm, 31,5/80 mm, >80 mm retour"
      },
      consommations: {
        "Carburant (travail)": "40 – 70 L/h",
        "Consommation journalière (8h)": "320 – 560 L/j",
        "Carburant par tonne produite": "0,15 – 0,35 L/t",
        "Lubrifiants": "0,5 – 1,0 L/h"
      },
      rendements: {
        "Production granulats (0/31,5mm, 8h)": "800 – 1 600 t/j",
        "Production grave 0/20 pour base": "600 – 1 200 t/j",
        "Coefficient d'utilisation": "0,70 – 0,80 (arrêts bourrages inclus)"
      },
      applications_routes: [
        "Production de granulats pour couches de chaussée",
        "Production de grave concassée pour couche de base",
        "Production de ballast pour remblai technique",
        "Concassage de blocs rocheux extraits (minage)",
        "Recyclage de béton et enrobés existants"
      ],
      notes_importantes: "Implantation à proximité du gisement rocheux pour limiter les transports. Contrôle qualité granulats indispensable (LA, MDE, propreté). Nécessite un concasseur secondaire pour obtenir des graves bien graduées 0/20."
    },

    // =====================================================================
    // MATÉRIEL DIVERS
    // =====================================================================
    {
      id: "citerne-eau",
      nom: "Citerne à Eau de Chantier",
      categorie: "divers",
      description_courte: "Véhicule citerne pour l'arrosage de chantier — indispensable pour l'humidification des couches avant compactage",
      modeles_courants: ["Citerne sur IVECO Trakker 8×4", "Citerne sur MAN TGS 8×4", "Remorque citerne tractée"],
      mots_cles_identification: [
        "citerne", "camion eau", "arroseur", "humidification", "arrosage chantier",
        "eau compactage", "rampe arrosage", "tanker eau", "citerne chantier"
      ],
      caracteristiques: {
        "Capacité citerne": "10 000 – 25 000 L",
        "Rampe d'arrosage arrière": "Largeur 6 – 8 m",
        "Buses d'arrosage": "Jets réglables (pluie fine à jet direct)",
        "Puissance pompe": "15 – 30 kW",
        "Débit de pompe": "500 – 1 500 L/min",
        "Pression de travail": "3 – 8 bar",
        "Vitesse d'arrosage": "5 – 20 km/h",
        "Puissance moteur porteur": "300 – 400 ch",
        "Réservoir carburant porteur": "350 – 500 L"
      },
      performances: {
        "Surface arrosée par plein (10 000L)": "3 000 – 10 000 m² selon dosage",
        "Rotations/jour (point d'eau 2 km)": "8 – 15 rotations",
        "Volume distribué/jour": "80 000 – 200 000 L/j",
        "Débit d'arrosage": "1 – 3 L/m² selon besoin"
      },
      consommations: {
        "Carburant (travail + transit)": "20 – 30 L/h",
        "Consommation journalière (8h)": "160 – 240 L/j",
        "Eau consommée/jour (chantier de compactage)": "100 000 – 300 000 L/j selon surface"
      },
      rendements: {
        "Surface humidifiée/jour (dosage 1,5 L/m²)": "50 000 – 130 000 m²/j",
        "Recharge citerne au point d'eau": "8 – 20 min (pompe 1 000 L/min)"
      },
      applications_routes: [
        "Humidification des matériaux avant compactage (OPM ±2%)",
        "Arrosage anti-poussière des pistes de chantier",
        "Humidification des fonds de forme (entretien humidité)",
        "Lutte contre la poussière pour santé des travailleurs",
        "Arrosage des surfaces en sol ciment avant prise",
        "Refroidissement des tambours de compacteurs en enrobé"
      ],
      notes_importantes: "Eau = facteur clé de la qualité du compactage. Un sol trop sec ou trop humide ne peut pas être compacté correctement. Tester la teneur en eau sur site (essai Proctor). Localiser les points d'eau à < 3 km si possible pour limiter les temps de cycle."
    },

    {
      id: "groupe-electrogene",
      nom: "Groupe Électrogène de Chantier",
      categorie: "divers",
      description_courte: "Source d'énergie autonome pour l'alimentation électrique des équipements de chantier et installations",
      modeles_courants: ["Caterpillar XQ250", "Perkins 250 kVA", "Cummins C200D5", "FG Wilson P250P1"],
      mots_cles_identification: [
        "groupe électrogène", "générateur", "groupe", "GE", "alimentation électrique",
        "centrale électrique mobile", "moteur diesel électrique", "genset"
      ],
      caracteristiques: {
        "Puissance (chantier routier)": "100 – 500 kVA",
        "Tension de sortie": "380/220 V triphasé",
        "Fréquence": "50 Hz",
        "Moteur diesel": "6 cylindres turbocompressé",
        "Réservoir carburant": "400 – 1 000 L",
        "Autonomie": "12 – 24h selon charge",
        "Niveau sonore": "75 – 95 dB(A) à 1 m",
        "Masse": "2 500 – 5 000 kg",
        "Dimensions": "3,5 × 1,5 × 2,0 m"
      },
      performances: {
        "Puissance disponible (chantier type)": "200 – 400 kVA",
        "Facteur de charge recommandé": "70 – 80% de la puissance nominale",
        "Tension de régulation": "± 1,5% en régime permanent"
      },
      consommations: {
        "Carburant (charge 75%, 250 kVA)": "50 – 70 L/h",
        "Carburant (charge 50%)": "35 – 50 L/h",
        "Consommation journalière (8h, 75% charge)": "400 – 560 L/j",
        "Carburant par kWh produit": "0,25 – 0,35 L/kWh"
      },
      rendements: {
        "Disponibilité typique": "95 – 98% (maintenance préventive)",
        "Durée de vie moteur": "15 000 – 25 000 h"
      },
      applications_routes: [
        "Alimentation centrale à enrobés (compresseurs, convoyeurs)",
        "Éclairage nocturne de chantier",
        "Alimentation des ateliers de maintenance",
        "Alimentation des pompes de drainage",
        "Fonctionnement des équipements de laboratoire",
        "Base vie et bureaux de chantier"
      ],
      notes_importantes: "Dimensionner le groupe en prenant 125% de la puissance nécessaire nominale. Changer les filtres à carburant et à huile selon les préconisations constructeur (toutes les 250h). Prévoir systèmes de protection contre les surcharges et les courts-circuits."
    }
  ]
};

module.exports = equipmentDatabase;
