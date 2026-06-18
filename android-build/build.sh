#!/bin/bash
# Build script — EnginScan BTP APK
# Prérequis : android-sdk, build-tools 29.0.3, platform android-23, Java 8+
# Compatible Android 5.0+ (API 21) → Android 14 (API 34)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ANDROID_SDK=/usr/lib/android-sdk
BUILD_TOOLS=$ANDROID_SDK/build-tools/29.0.3
ANDROID_JAR=$ANDROID_SDK/platforms/android-23/android.jar
BUILD_DIR=$SCRIPT_DIR/build
APK_NAME="EnginScan-BTP"

echo ""
echo "🚧  EnginScan BTP — Construction APK"
echo "════════════════════════════════════"

# Nettoyage
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR/gen" "$BUILD_DIR/classes" "$BUILD_DIR/dex"

# ─── Icônes toutes densités ──────────────────────────────────────────────────
echo "📱  Génération icônes (toutes densités)..."
python3 - <<'PYEOF'
import struct, zlib, os, math

def make_png(w, h, pixels):
    def chunk(ct, data):
        c = zlib.crc32(ct + data) & 0xFFFFFFFF
        return struct.pack('>I', len(data)) + ct + data + struct.pack('>I', c)
    raw = b''.join(b'\x00' + bytes([v for px in row for v in px]) for row in pixels)
    return (b'\x89PNG\r\n\x1a\n'
            + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(raw))
            + chunk(b'IEND', b''))

def draw_icon(W, H):
    BG = (180, 54, 14)    # #B4541E laterite
    FG = (237, 230, 214)  # #EDE6D6 crème
    rows = [[BG]*W for _ in range(H)]
    # Colonne verticale gauche du E (10-17% de la largeur)
    x0, x1 = round(W*0.10), round(W*0.27)
    for y in range(round(H*0.15), round(H*0.85)):
        for x in range(x0, x1): rows[y][x] = FG
    # Barre haute
    for y in range(round(H*0.15), round(H*0.30)):
        for x in range(x0, round(W*0.85)): rows[y][x] = FG
    # Barre milieu
    for y in range(round(H*0.44), round(H*0.58)):
        for x in range(x0, round(W*0.72)): rows[y][x] = FG
    # Barre basse
    for y in range(round(H*0.70), round(H*0.85)):
        for x in range(x0, round(W*0.85)): rows[y][x] = FG
    return rows

# Densités Android : (dossier, taille en dp×dp)
DENSITIES = [
    ('mipmap-mdpi',    48),
    ('mipmap-hdpi',    72),
    ('mipmap-xhdpi',   96),
    ('mipmap-xxhdpi',  144),
    ('mipmap-xxxhdpi', 192),
]

for folder, size in DENSITIES:
    os.makedirs(f'res/{folder}', exist_ok=True)
    rows = draw_icon(size, size)
    path = f'res/{folder}/ic_launcher.png'
    with open(path, 'wb') as f:
        f.write(make_png(size, size, rows))
    print(f"  ✓ {folder}/ic_launcher.png {size}×{size}")
PYEOF

# ─── Compilation ressources ──────────────────────────────────────────────────
echo "⚙️   Compilation ressources (aapt2 compile)..."
$BUILD_TOOLS/aapt2 compile \
  --dir res/ \
  -o "$BUILD_DIR/compiled_res.zip"

echo "⚙️   Liaison ressources (aapt2 link)..."
$BUILD_TOOLS/aapt2 link \
  "$BUILD_DIR/compiled_res.zip" \
  -I "$ANDROID_JAR" \
  --manifest AndroidManifest.xml \
  -o "$BUILD_DIR/resources.apk" \
  --java "$BUILD_DIR/gen"

# ─── Compilation Java ────────────────────────────────────────────────────────
echo "☕   Compilation Java → .class..."
javac \
  -source 8 -target 8 -Xlint:-options \
  -bootclasspath "$ANDROID_JAR" \
  -classpath "$ANDROID_JAR" \
  -d "$BUILD_DIR/classes" \
  src/com/komtechnologie/enginscan/MainActivity.java

# ─── Conversion DEX ──────────────────────────────────────────────────────────
echo "🔄  Conversion .class → DEX (dx)..."
$BUILD_TOOLS/dx \
  --dex \
  --output "$BUILD_DIR/dex/classes.dex" \
  "$BUILD_DIR/classes"

# ─── Assemblage APK ──────────────────────────────────────────────────────────
echo "📦  Assemblage APK..."
cp "$BUILD_DIR/resources.apk" "$BUILD_DIR/${APK_NAME}-unsigned.apk"

# Ajout classes.dex
(cd "$BUILD_DIR/dex" && zip -j "$BUILD_DIR/${APK_NAME}-unsigned.apk" classes.dex)

# Ajout des assets (www + sous-dossiers)
(cd "$SCRIPT_DIR" && zip -r "$BUILD_DIR/${APK_NAME}-unsigned.apk" assets/)

# ─── Alignement ──────────────────────────────────────────────────────────────
echo "📐  Alignement mémoire (zipalign)..."
$BUILD_TOOLS/zipalign -f 4 \
  "$BUILD_DIR/${APK_NAME}-unsigned.apk" \
  "$BUILD_DIR/${APK_NAME}-aligned.apk"

# ─── Keystore ────────────────────────────────────────────────────────────────
if [ ! -f "$BUILD_DIR/debug.keystore" ]; then
  echo "🔑  Génération keystore debug..."
  keytool -genkey -v \
    -keystore "$BUILD_DIR/debug.keystore" \
    -storepass android \
    -alias androiddebugkey \
    -keypass android \
    -keyalg RSA -keysize 2048 \
    -dname "CN=KOM Technologie,O=SOMAC BTP,C=BF" \
    -validity 10000 2>/dev/null
fi

# ─── Signature ───────────────────────────────────────────────────────────────
echo "✍️   Signature APK..."
apksigner sign \
  --ks "$BUILD_DIR/debug.keystore" \
  --ks-pass pass:android \
  --ks-key-alias androiddebugkey \
  --key-pass pass:android \
  --out "$SCRIPT_DIR/${APK_NAME}-debug.apk" \
  "$BUILD_DIR/${APK_NAME}-aligned.apk"

echo ""
echo "════════════════════════════════════════════"
echo "✅  APK construit avec succès !"
printf "    Fichier : %s/%s-debug.apk\n" "$SCRIPT_DIR" "$APK_NAME"
printf "    Taille  : %s\n" "$(du -sh "$SCRIPT_DIR/${APK_NAME}-debug.apk" | cut -f1)"
echo "════════════════════════════════════════════"
echo ""
echo "📲  Pour installer sur un téléphone Android :"
echo "    adb install ${APK_NAME}-debug.apk"
echo "    (ou transférer le fichier manuellement)"
