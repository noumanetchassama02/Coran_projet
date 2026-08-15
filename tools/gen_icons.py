# -*- coding: utf-8 -*-
"""Génère les icônes de l'application Coran (Python pur, sans PIL).

- icons/          : icônes PWA (512, 192, 180, maskable)
- android-icons/  : icônes natives Android
    - ic_launcher.png / ic_launcher_round.png (legacy, pré-API 26)
    - ic_launcher_foreground.png  (couche avant adaptative — API 26+)
    - ic_launcher_monochrome.png  (icône thémée — Android 13+)
"""
import zlib, struct, math, os

GREEN_TOP = (22, 101, 52)     # #166534
GREEN_BOT = (11, 61, 46)      # #0B3D2E
GOLD = (212, 175, 55)         # #D4AF37
WHITE = (255, 255, 255)

def chunk(tag, data):
    c = struct.pack('>I', len(data)) + tag + data
    c += struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
    return c

def write_png(path, w, h, rows):
    raw = b''.join(b'\x00' + b''.join(struct.pack('BBBB', *px) for px in row) for row in rows)
    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0))
    png += chunk(b'IDAT', zlib.compress(raw, 9))
    png += chunk(b'IEND', b'')
    with open(path, 'wb') as f:
        f.write(png)

def star_points(cx, cy, r_out, r_in, n=5, rot=-math.pi / 2):
    pts = []
    for i in range(2 * n):
        r = r_out if i % 2 == 0 else r_in
        a = rot + i * math.pi / n
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts

def point_in_poly(x, y, poly):
    inside = False
    j = len(poly) - 1
    for i in range(len(poly)):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi) + xi):
            inside = not inside
        j = i
    return inside

# Géométrie du dessin (croissant + étoile) en coordonnées de conception 0..1
DESIGN = {
    'ocx': 0.40, 'ocy': 0.46, 'orad': 0.30,
    'icx': 0.52, 'icy': 0.40, 'irad': 0.25,
    'star': star_points(0.70, 0.27, 0.13, 0.055)
}
# Cadre du contenu : x [0.10, 0.83], y [0.14, 0.76] → centre (0.465, 0.45), largeur 0.73
CONTENT_CX, CONTENT_CY = 0.465, 0.45
# Échelle pour tenir dans la zone de sécurité adaptative (cercle ~61 % du canvas)
# 0.75 → contenu de diamètre 0.55 (rayon 0.27 < 0.30 requis)
SCALE = 0.75

def in_design(fx, fy):
    """True si (fx, fy) en coordonnées 0..1 est sur le croissant ou l'étoile."""
    dxo = fx - DESIGN['ocx']
    dyo = fy - DESIGN['ocy']
    dxi = fx - DESIGN['icx']
    dyi = fy - DESIGN['icy']
    if dxo * dxo + dyo * dyo <= DESIGN['orad'] ** 2 and not (dxi * dxi + dyi * dyi <= DESIGN['irad'] ** 2):
        return True
    return point_in_poly(fx, fy, DESIGN['star'])

def make_foreground(size, color):
    """Couche avant adaptative : dessin doré (ou monochrome) sur fond transparent,
    centré et réduit dans la zone de sécurité."""
    S = float(size)
    rows = []
    for y in range(size):
        row = []
        for x in range(size):
            fx = (x + 0.5) / S
            fy = (y + 0.5) / S
            dx, dy = fx - 0.5, fy - 0.5
            dfx = CONTENT_CX + dx / SCALE
            dfy = CONTENT_CY + dy / SCALE
            if in_design(dfx, dfy):
                row.append((color[0], color[1], color[2], 255))
            else:
                row.append((0, 0, 0, 0))
        rows.append(row)
    return rows

def make_icon(size, rounded=True):
    """Dessine l'icône legacy : fond vert dégradé, croissant doré, étoile."""
    S = float(size)
    R = 0.22 * S
    rows = []
    for y in range(size):
        row = []
        fy = (y + 0.5) / S
        for x in range(size):
            fx = (x + 0.5) / S
            if rounded:
                cx = min(fx * S, S - fx * S)
                cy = min(fy * S, S - fy * S)
                if cx < R and cy < R:
                    dx, dy = R - cx, R - cy
                    if dx * dx + dy * dy > R * R:
                        row.append((0, 0, 0, 0))
                        continue
            t = fy
            r = int(GREEN_TOP[0] + (GREEN_BOT[0] - GREEN_TOP[0]) * t)
            g = int(GREEN_TOP[1] + (GREEN_BOT[1] - GREEN_TOP[1]) * t)
            b = int(GREEN_TOP[2] + (GREEN_BOT[2] - GREEN_TOP[2]) * t)
            px = (r, g, b, 255)
            if in_design(fx, fy):
                px = (GOLD[0], GOLD[1], GOLD[2], 255)
            row.append(px)
        rows.append(row)
    return rows

def downscale(rows, src, dst):
    """Rééchantillonnage au plus proche voisin."""
    out = []
    for y in range(dst):
        sy = int((y + 0.5) * src / dst)
        row = []
        for x in range(dst):
            sx = int((x + 0.5) * src / dst)
            row.append(rows[sy][sx])
        out.append(row)
    return out

os.makedirs('icons', exist_ok=True)
big = make_icon(512)
write_png('icons/icon-512.png', 512, 512, big)
write_png('icons/icon-192.png', 192, 192, downscale(big, 512, 192))
write_png('icons/icon-180.png', 180, 180, downscale(big, 512, 180))
mask = make_icon(512, rounded=False)
write_png('icons/maskable-512.png', 512, 512, mask)
print('Icônes PWA générées:', sorted(os.listdir('icons')))

# Icônes natives Android
native = make_icon(192, rounded=False)
os.makedirs('android-icons', exist_ok=True)
for size, folder in ((48, 'mipmap-mdpi'), (72, 'mipmap-hdpi'), (96, 'mipmap-xhdpi'),
                     (144, 'mipmap-xxhdpi'), (192, 'mipmap-xxxhdpi')):
    os.makedirs(f'android-icons/{folder}', exist_ok=True)
    write_png(f'android-icons/{folder}/ic_launcher.png', size, size, downscale(native, 192, size))
    write_png(f'android-icons/{folder}/ic_launcher_round.png', size, size, downscale(native, 192, size))

# Couches adaptatives (API 26+) : canvas 108dp → mdpi 108px, hdpi 162px, xhdpi 216px,
# xxhdpi 324px, xxxhdpi 432px
for size, folder in ((108, 'mipmap-mdpi'), (162, 'mipmap-hdpi'), (216, 'mipmap-xhdpi'),
                     (324, 'mipmap-xxhdpi'), (432, 'mipmap-xxxhdpi')):
    write_png(f'android-icons/{folder}/ic_launcher_foreground.png', size, size, make_foreground(size, GOLD))
    write_png(f'android-icons/{folder}/ic_launcher_monochrome.png', size, size, make_foreground(size, WHITE))
print('Icônes Android générées:', sorted(os.listdir('android-icons/mipmap-xxxhdpi')))
