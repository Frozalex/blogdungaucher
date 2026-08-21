"""
CONSTRUCTIVIST MECHA — Blog d'un Gaucher
=========================================
Style : Propagande Constructiviste + Evangelion + Brutalisme
Moteur : EEVEE (Blender 4.x)

USAGE :
  1. Ouvrir Blender (4.0+)
  2. Scripting tab → New → coller ce fichier → Run Script
  3. Appuyer sur F12 pour rendre
  4. Ajustements recommandés : voir section CONFIG en bas
"""

import bpy
import mathutils
from mathutils import Vector
import math
import random

random.seed(42)

# ─────────────────────────────────────────────────────────────
# PALETTE (Constructiviste soviétique)
# ─────────────────────────────────────────────────────────────
RED       = (0.78, 0.04, 0.04)
DARK_RED  = (0.30, 0.01, 0.01)
GOLD      = (0.88, 0.65, 0.08)
DARK_GOLD = (0.45, 0.30, 0.02)
BLACK     = (0.04, 0.03, 0.03)
DARK_GRAY = (0.13, 0.10, 0.09)
MID_GRAY  = (0.28, 0.22, 0.18)
BEIGE     = (0.72, 0.60, 0.44)
CREAM     = (0.88, 0.82, 0.68)


# ─────────────────────────────────────────────────────────────
# UTILITAIRES
# ─────────────────────────────────────────────────────────────

def clean_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    for block in list(bpy.data.meshes) + list(bpy.data.materials) + list(bpy.data.lights):
        try:
            bpy.data.meshes.remove(block) if hasattr(block, 'vertices') else None
            bpy.data.materials.remove(block) if hasattr(block, 'use_nodes') else None
            bpy.data.lights.remove(block) if hasattr(block, 'energy') else None
        except Exception:
            pass


def aim_at(obj, target: Vector):
    """Rotate object so its -Z axis points at target."""
    direction = target - obj.location
    rot = direction.to_track_quat('-Z', 'Y')
    obj.rotation_euler = rot.to_euler()


def add_cube(name, loc, scale, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = scale
    o.rotation_euler = rot
    return o


def add_cyl(name, loc, r, depth, verts=6, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=verts, radius=r, depth=depth, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.rotation_euler = rot
    return o


def add_cone(name, loc, r1, depth, verts=4, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cone_add(
        vertices=verts, radius1=r1, radius2=0, depth=depth, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.rotation_euler = rot
    return o


# ─────────────────────────────────────────────────────────────
# MATÉRIAUX — Toon Cel-Shading
# (Shader to RGB + ColorRamp CONSTANT → 3 niveaux de teinte)
# ─────────────────────────────────────────────────────────────

_mat_cache = {}

def toon_mat(name, base, shadow=None, hilight=None):
    if name in _mat_cache:
        return _mat_cache[name]

    shadow   = shadow   or tuple(c * 0.25 for c in base)
    hilight  = hilight  or tuple(min(c * 1.35, 1.0) for c in base)

    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    mat.use_backface_culling = False
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    # Diffuse BSDF → ShaderToRGB → ColorRamp (CONSTANT) → Output
    diffuse = nodes.new('ShaderNodeBsdfDiffuse')
    diffuse.inputs['Color'].default_value = (*base, 1.0)
    diffuse.location = (-500, 0)

    s2rgb = nodes.new('ShaderNodeShaderToRGB')
    s2rgb.location = (-300, 0)

    ramp = nodes.new('ShaderNodeValToRGB')
    ramp.location = (-100, 0)
    ramp.color_ramp.interpolation = 'CONSTANT'   # ← hard toon steps
    el = ramp.color_ramp.elements
    el[0].position = 0.0;  el[0].color = (*shadow,  1.0)
    el[1].position = 0.38; el[1].color = (*base,    1.0)
    el.new(0.82);           el[2].color = (*hilight, 1.0)

    out = nodes.new('ShaderNodeOutputMaterial')
    out.location = (150, 0)

    links.new(diffuse.outputs['BSDF'],  s2rgb.inputs['Shader'])
    links.new(s2rgb.outputs['Color'],   ramp.inputs['Fac'])
    links.new(ramp.outputs['Color'],    out.inputs['Surface'])

    _mat_cache[name] = mat
    return mat


def emissive_mat(name, color, strength=4.0):
    if name in _mat_cache:
        return _mat_cache[name]
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    emit = nodes.new('ShaderNodeEmission')
    emit.inputs['Color'].default_value = (*color, 1.0)
    emit.inputs['Strength'].default_value = strength
    out = nodes.new('ShaderNodeOutputMaterial')
    mat.node_tree.links.new(emit.outputs[0], out.inputs[0])
    _mat_cache[name] = mat
    return mat


def assign(obj, mat):
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)


# ─────────────────────────────────────────────────────────────
# ROBOT MECHA — Proportions EVA (haut, massif, anguleux)
# Posture : debout, légèrement de ¾, arme à gauche
# ─────────────────────────────────────────────────────────────
# Toutes les coordonnées Z sont en hauteur absolue
# (pieds au sol = Z=0, genoux ≈ Z=1.5, bassin Z=3, tête Z=7.5)

M_RED  = lambda: toon_mat("M_Red",      RED,       DARK_RED)
M_DARK = lambda: toon_mat("M_Dark",     DARK_GRAY, BLACK)
M_GOLD = lambda: toon_mat("M_Gold",     GOLD,      DARK_GOLD)
M_GRAY = lambda: toon_mat("M_MidGray",  MID_GRAY,  DARK_GRAY)


def build_mecha():
    parts = []

    # ── Pieds (massifs, rectangle plat) ──────────────────────
    for side, sx in (("L", 0.55), ("R", -0.55)):
        o = add_cube(f"Foot_{side}", (sx, 0.25, -0.18), (0.52, 0.95, 0.28))
        assign(o, M_RED()); parts.append(o)
        # Talonnière (plaque arrière angulaire)
        o2 = add_cube(f"Heel_{side}", (sx, -0.2, 0.05), (0.46, 0.3, 0.18),
                      rot=(-0.25, 0, 0))
        assign(o2, M_DARK()); parts.append(o2)

    # ── Tibias / Jambières ───────────────────────────────────
    for side, sx in (("L", 0.55), ("R", -0.55)):
        o = add_cube(f"Shin_{side}", (sx, 0.0, 1.1), (0.40, 0.42, 1.05))
        assign(o, M_DARK()); parts.append(o)
        # Plaque avant (garniture angulaire)
        o2 = add_cube(f"ShinPlate_{side}", (sx, -0.26, 1.3), (0.36, 0.12, 0.55),
                      rot=(0.15, 0, 0))
        assign(o2, M_RED()); parts.append(o2)

    # ── Cuisses ──────────────────────────────────────────────
    for side, sx in (("L", 0.55), ("R", -0.55)):
        o = add_cube(f"Thigh_{side}", (sx, 0.0, 2.4), (0.42, 0.38, 1.05))
        assign(o, M_RED()); parts.append(o)

    # ── Bassin / Jupe centrale ───────────────────────────────
    o = add_cube("Pelvis", (0, 0, 3.1), (1.0, 0.58, 0.55))
    assign(o, M_DARK()); parts.append(o)
    # Jupe latérale droite/gauche
    for side, sx in (("L", 0.8), ("R", -0.8)):
        o = add_cube(f"Hip_{side}", (sx, 0.0, 3.0), (0.38, 0.38, 0.45),
                     rot=(0, 0, 0.2 if side == "L" else -0.2))
        assign(o, M_RED()); parts.append(o)

    # ── Torse (long, élancé) ─────────────────────────────────
    o = add_cube("Torso", (0, 0, 4.6), (1.10, 0.62, 1.55))
    assign(o, M_RED()); parts.append(o)
    # Plaques pectorales diagonales
    for side, sx, rz in (("L", 0.52, 0.28), ("R", -0.52, -0.28)):
        o2 = add_cube(f"Pec_{side}", (sx, -0.28, 5.05), (0.45, 0.16, 0.52),
                      rot=(0, 0, rz))
        assign(o2, M_DARK()); parts.append(o2)
    # Médaillon central (or)
    o3 = add_cube("ChestMedal", (0, -0.32, 4.8), (0.22, 0.08, 0.22))
    assign(o3, M_GOLD()); parts.append(o3)

    # ── Épaules (massives, carrées — signature EVA) ──────────
    for side, sx, rz in (("L", 2.0, 0.18), ("R", -2.0, -0.18)):
        o = add_cube(f"Shoulder_{side}", (sx, 0.0, 5.4), (1.0, 0.72, 0.72),
                     rot=(0, 0, rz))
        assign(o, M_RED()); parts.append(o)
        # Épaulette tranchante (lame diagonale)
        o2 = add_cone(f"ShoulderBlade_{side}", (sx * 1.15, 0.0, 5.85),
                      0.30, 0.80, verts=4,
                      rot=(0, rz * 1.6, 0))
        assign(o2, M_GOLD()); parts.append(o2)

    # ── Bras haut ────────────────────────────────────────────
    for side, sx, ry in (("L", 2.5, 0.35), ("R", -2.5, -0.35)):
        o = add_cyl(f"UpperArm_{side}", (sx, 0.0, 4.4), 0.32, 1.4, verts=6,
                    rot=(0, ry, 0))
        assign(o, M_DARK()); parts.append(o)

    # ── Avant-bras ───────────────────────────────────────────
    # Bras gauche : tendu + légèrement levé (tient la faucille)
    o = add_cube("Forearm_L", (3.0, 0.2, 3.2), (0.38, 0.32, 1.15),
                 rot=(0.35, 0, 0.15))
    assign(o, M_RED()); parts.append(o)
    # Bras droit : légèrement écarté, garde militaire
    o = add_cube("Forearm_R", (-2.9, -0.1, 3.5), (0.38, 0.32, 1.1),
                 rot=(-0.2, 0, -0.1))
    assign(o, M_RED()); parts.append(o)

    # ── Poings ───────────────────────────────────────────────
    for side, loc in (("L", (3.2, 0.5, 2.2)), ("R", (-3.1, -0.1, 2.85))):
        o = add_cube(f"Fist_{side}", loc, (0.32, 0.30, 0.30))
        assign(o, M_DARK()); parts.append(o)

    # ── Cou ──────────────────────────────────────────────────
    o = add_cyl("Neck", (0, 0, 6.2), 0.22, 0.40, verts=6)
    assign(o, M_DARK()); parts.append(o)

    # ── Tête (casque anguleux) ───────────────────────────────
    o = add_cube("Head", (0, 0, 6.85), (0.72, 0.56, 0.82))
    assign(o, M_DARK()); parts.append(o)
    # Crête centrale (signature EVA — lame verticale)
    o2 = add_cube("HeadCrest", (0, -0.12, 7.55), (0.14, 0.20, 0.60),
                  rot=(0.18, 0, 0))
    assign(o2, M_GOLD()); parts.append(o2)
    # Visière / yeux (bande émissive dorée)
    o3 = add_cube("Visor", (0, -0.30, 6.85), (0.62, 0.05, 0.10))
    assign(o3, emissive_mat("M_VisorGlow", GOLD, 6.0)); parts.append(o3)
    # Mâchoire inférieure
    o4 = add_cube("Jaw", (0, -0.15, 6.45), (0.60, 0.30, 0.22),
                  rot=(-0.12, 0, 0))
    assign(o4, M_RED()); parts.append(o4)
    # Antennes latérales
    for side, sx in (("L", 0.42), ("R", -0.42)):
        oa = add_cube(f"Antenna_{side}", (sx, 0.0, 7.55), (0.06, 0.06, 0.55),
                      rot=(0, 0, 0.2 if side == "L" else -0.2))
        assign(oa, M_GOLD()); parts.append(oa)

    # ── ARME : Faucille géométrique ──────────────────────────
    # Manche
    o = add_cyl("Weapon_Handle", (3.5, 0.6, 2.9), 0.07, 2.8, verts=6,
                rot=(0, 0, math.radians(50)))
    assign(o, M_DARK()); parts.append(o)
    # Lame (arc de tore = deux cônes creux imbriqués)
    # On utilise un tore partiel (demi-tore aplati)
    bpy.ops.mesh.primitive_torus_add(
        major_radius=1.1, minor_radius=0.07,
        major_segments=6, minor_segments=5,
        location=(4.0, 0.5, 4.0))
    blade = bpy.context.active_object
    blade.name = "Weapon_Blade"
    blade.rotation_euler = (math.radians(90), 0, math.radians(40))
    blade.scale = (1.0, 0.5, 1.0)
    assign(blade, M_GOLD()); parts.append(blade)

    return parts


# ─────────────────────────────────────────────────────────────
# ARRIÈRE-PLAN — Propagande industrielle
# ─────────────────────────────────────────────────────────────

def build_background():
    parts = []
    mat_bg_red  = toon_mat("M_BG_Red",   RED,       DARK_RED)
    mat_bg_dark = toon_mat("M_BG_Dark",  DARK_GRAY, BLACK)
    mat_bg_brun = toon_mat("M_BG_Beige", BEIGE,     MID_GRAY)
    mat_black   = toon_mat("M_Black",    BLACK,     BLACK)

    # ── SOL ──────────────────────────────────────────────────
    bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 5, -0.62))
    ground = bpy.context.active_object
    ground.name = "Ground"
    assign(ground, mat_bg_brun); parts.append(ground)

    # ── DISQUE SOLEIL (grande disque rouge en fond) ───────────
    bpy.ops.mesh.primitive_circle_add(
        vertices=64, radius=9.0, fill_type='NGON',
        location=(0, 6, 5.0))
    sun = bpy.context.active_object
    sun.name = "BG_Sun"
    sun.rotation_euler = (math.radians(90), 0, 0)
    assign(sun, emissive_mat("M_SunGlow", RED, 1.5)); parts.append(sun)

    # ── RAYONS GÉOMÉTRIQUES (16 triangles alternés) ──────────
    NUM_RAYS = 16
    for i in range(NUM_RAYS):
        angle = (2 * math.pi / NUM_RAYS) * i
        long_ray = (i % 2 == 0)
        length   = 14.0 if long_ray else 9.0
        width    = 0.7  if long_ray else 0.45

        bpy.ops.mesh.primitive_cube_add(size=1)
        ray = bpy.context.active_object
        ray.name = f"BG_Ray_{i:02d}"
        # Position : partir du bord du soleil (r=9) vers l'extérieur
        cx = math.cos(angle) * (9.0 + length * 0.5)
        cz = math.sin(angle) * (9.0 + length * 0.5)
        ray.location = (cx, 6.5, 5.0 + cz)
        ray.scale    = (width, 0.04, length * 0.5)
        ray.rotation_euler = (math.radians(90), 0, angle + math.radians(90))

        col = DARK_RED if long_ray else BLACK
        assign(ray, toon_mat(f"M_Ray_{i}", col, BLACK))
        parts.append(ray)

    # ── ROUAGE GÉANT (gauche) ────────────────────────────────
    # Anneau (tore aplati)
    bpy.ops.mesh.primitive_torus_add(
        major_radius=4.5, minor_radius=0.5,
        major_segments=14, minor_segments=5,
        location=(-10, 5, 4.0))
    gear_ring = bpy.context.active_object
    gear_ring.name = "BG_GearRing"
    gear_ring.rotation_euler = (math.radians(90), 0, math.radians(13))
    assign(gear_ring, mat_bg_dark); parts.append(gear_ring)
    # Dents du rouage (cubes autour de l'anneau)
    for i in range(14):
        a = (2 * math.pi / 14) * i + math.radians(13)
        gx = -10 + math.cos(a) * 5.0
        gz =  4  + math.sin(a) * 5.0
        tooth = add_cube(f"GearTooth_{i}", (gx, 5.2, gz), (0.55, 0.30, 0.85),
                         rot=(0, 0, a))
        assign(tooth, mat_bg_dark); parts.append(tooth)
    # Axe central
    o = add_cyl("GearAxis", (-10, 5, 4), 0.6, 0.8, verts=8)
    o.rotation_euler = (math.radians(90), 0, 0)
    assign(o, mat_bg_brun); parts.append(o)

    # ── CHEMINÉES D'USINES (droite) ──────────────────────────
    chimney_data = [
        # (x, height, radius, x_offset)
        (7.5,  11, 0.55),
        (9.0,   8, 0.45),
        (10.8, 13, 0.65),
        (12.5,  9, 0.40),
    ]
    for i, (cx, h, r) in enumerate(chimney_data):
        # Corps
        o = add_cyl(f"Chimney_{i}", (cx, 5, h * 0.5 - 0.62), r, h, verts=4,
                    rot=(0, 0, math.radians(45)))
        assign(o, mat_bg_dark); parts.append(o)
        # Bague
        o2 = add_cyl(f"ChimneyBand_{i}", (cx, 5, h * 0.75), r * 1.25, 0.3, verts=4,
                     rot=(0, 0, math.radians(45)))
        assign(o2, mat_bg_brun); parts.append(o2)
        # Fumée stylisée (sphère aplatie grise)
        o3 = add_cube(f"Smoke_{i}", (cx + random.uniform(-0.5, 0.5),
                                      4.8,
                                      h + random.uniform(0.5, 1.5)),
                      (random.uniform(0.8, 1.4), 0.15, random.uniform(0.6, 1.0)))
        assign(o3, toon_mat(f"M_Smoke_{i}", MID_GRAY, DARK_GRAY))
        parts.append(o3)

    # ── PILIERS BRUTALISTES (fond centre) ────────────────────
    pillar_positions = [(-4.5, 8), (4.5, 8), (-2.5, 10), (2.5, 10)]
    for i, (px, py) in enumerate(pillar_positions):
        h = random.uniform(5, 9)
        o = add_cube(f"Pillar_{i}", (px, py, h * 0.5 - 0.62), (0.7, 0.7, h * 0.5))
        assign(o, mat_bg_dark); parts.append(o)
        # Plaque décorative (bande horizontale)
        o2 = add_cube(f"PillarBand_{i}", (px, py, h * 0.65), (0.75, 0.72, 0.12))
        assign(o2, mat_bg_brun); parts.append(o2)

    # ── LIGNES DE TRANSMISSION (en diagonale) ────────────────
    for i in range(5):
        x_start = -15 + i * 6
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=4, radius=0.04, depth=18,
            location=(x_start + 3, 6.0, 3.5))
        wire = bpy.context.active_object
        wire.name = f"Wire_{i}"
        wire.rotation_euler = (0, math.radians(12), 0)
        assign(wire, mat_black); parts.append(wire)

    return parts


# ─────────────────────────────────────────────────────────────
# ÉCLAIRAGE — Chiaroscuro / Contre-jour rouge
# ─────────────────────────────────────────────────────────────

def build_lighting():
    lights = []

    # 1. Contre-jour principal (disque rouge derrière le mecha)
    bpy.ops.object.light_add(type='AREA', location=(0, 8, 5.0))
    bl = bpy.context.active_object
    bl.name = "L_Backlight"
    bl.data.color = (1.0, 0.12, 0.04)
    bl.data.energy = 12000
    bl.data.size = 10
    bl.data.shape = 'DISK'
    bl.rotation_euler = (math.radians(180), 0, 0)
    lights.append(bl)

    # 2. Rim light gauche (or dur — découpe le bord du mecha)
    bpy.ops.object.light_add(type='SPOT', location=(-9, -4, 9))
    rl = bpy.context.active_object
    rl.name = "L_RimLeft"
    rl.data.color = (1.0, 0.80, 0.20)
    rl.data.energy = 8000
    rl.data.spot_size = math.radians(25)
    rl.data.spot_blend = 0.02       # bord très dur
    rl.data.shadow_soft_size = 0.01  # ombre nette
    aim_at(rl, Vector((0, 0, 4.5)))
    lights.append(rl)

    # 3. Rim light droit (rouge sombre — symétrie rompue)
    bpy.ops.object.light_add(type='SPOT', location=(7, -3, 7))
    rr = bpy.context.active_object
    rr.name = "L_RimRight"
    rr.data.color = (0.8, 0.05, 0.02)
    rr.data.energy = 4000
    rr.data.spot_size = math.radians(30)
    rr.data.spot_blend = 0.03
    rr.data.shadow_soft_size = 0.01
    aim_at(rr, Vector((0, 0, 4.0)))
    lights.append(rr)

    # 4. Fill frontal froid (minime — gardons le contraste)
    bpy.ops.object.light_add(type='SPOT', location=(0, -9, 10))
    fl = bpy.context.active_object
    fl.name = "L_FillFront"
    fl.data.color = (0.55, 0.55, 0.72)  # légèrement bleu/froid
    fl.data.energy = 1200
    fl.data.spot_size = math.radians(40)
    fl.data.spot_blend = 0.05
    fl.data.shadow_soft_size = 0.01
    aim_at(fl, Vector((0, 0, 4.5)))
    lights.append(fl)

    # 5. Ground bounce (rouge sombre — sol réfléchi)
    bpy.ops.object.light_add(type='AREA', location=(0, 0, -0.5))
    gb = bpy.context.active_object
    gb.name = "L_GroundBounce"
    gb.data.color = (0.5, 0.02, 0.0)
    gb.data.energy = 600
    gb.data.size = 12
    gb.rotation_euler = (math.radians(180), 0, 0)
    lights.append(gb)

    return lights


# ─────────────────────────────────────────────────────────────
# CAMÉRA — Contre-plongée totale (wide 20mm)
# ─────────────────────────────────────────────────────────────

def build_camera():
    bpy.ops.object.camera_add(location=(0, -11, -2.0))
    cam = bpy.context.active_object
    cam.name = "Cam_Main"
    cam.data.lens = 20        # ultra-grand angle = exagère le gigantisme
    cam.data.sensor_width = 36
    cam.data.clip_end = 200
    aim_at(cam, Vector((0, 0, 5.5)))  # vise la tête du mecha
    bpy.context.scene.camera = cam
    return cam


# ─────────────────────────────────────────────────────────────
# CONTOURS — Freestyle (rendu de lignes noires)
# (Plus stable que Grease Pencil LineArt selon la version)
# ─────────────────────────────────────────────────────────────

def setup_freestyle():
    scene = bpy.context.scene

    # Activer Freestyle
    scene.render.use_freestyle = True

    view_layer = bpy.context.view_layer
    view_layer.use_freestyle = True

    fs = view_layer.freestyle_settings
    fs.use_culling = True

    # Supprimer les linestyles par défaut et en créer un propre
    lineset = None
    if fs.linesets:
        lineset = fs.linesets[0]
    else:
        lineset = fs.linesets.new("ToonOutline")

    lineset.select_silhouette = True
    lineset.select_crease = True
    lineset.select_border = True
    lineset.select_contour = True
    lineset.crease_angle = math.radians(25)

    ls = lineset.linestyle
    ls.color = (0.02, 0.01, 0.01)   # quasi noir
    ls.alpha = 1.0
    ls.thickness = 2.8              # contour bien visible

    # Modificateur d'épaisseur : plus épais en bas (contre-plongée)
    ls.thickness_modifiers.new("DistFromCamera", type='DISTANCE_FROM_CAMERA')
    mod = ls.thickness_modifiers["DistFromCamera"]
    mod.range_min = 2.0
    mod.range_max = 20.0
    mod.value_min = 1.5
    mod.value_max = 4.0


# ─────────────────────────────────────────────────────────────
# MONDE / SKY — Fond rouge très sombre
# ─────────────────────────────────────────────────────────────

def setup_world():
    world = bpy.data.worlds.get("World") or bpy.data.worlds.new("World")
    bpy.context.scene.world = world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    bg_node = nodes.get("Background") or nodes.new('ShaderNodeBackground')
    bg_node.inputs[0].default_value = (0.04, 0.008, 0.008, 1.0)  # rouge-noir
    bg_node.inputs[1].default_value = 0.8


# ─────────────────────────────────────────────────────────────
# RENDU EEVEE — Paramètres
# ─────────────────────────────────────────────────────────────

def setup_render():
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE_NEXT'

    # Résolution — format affiche (portrait 2:3)
    scene.render.resolution_x = 2000
    scene.render.resolution_y = 3000
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = False

    # Chemin de sortie
    scene.render.filepath = "//constructivist_render.png"
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_depth = '16'

    # EEVEE shadows (dures, nettes)
    eevee = scene.eevee
    eevee.use_shadows = True
    try:
        eevee.shadow_cube_size   = '2048'
        eevee.shadow_cascade_size = '2048'
    except AttributeError:
        pass  # Blender 4.x a renommé ces propriétés — ignoré

    # Bloom léger (lueur visor + backlight)
    try:
        eevee.use_bloom = True
        eevee.bloom_intensity = 0.12
        eevee.bloom_threshold = 0.8
        eevee.bloom_radius = 4.0
    except AttributeError:
        pass  # Bloom retiré dans Blender 4.2+ → remplacer par Glare dans Compo


# ─────────────────────────────────────────────────────────────
# COMPOSITEUR — Grain + Vignette + Color Grade Constructiviste
# ─────────────────────────────────────────────────────────────

def setup_compositor():
    scene = bpy.context.scene
    scene.use_nodes = True
    tree  = scene.node_tree
    nodes = tree.nodes
    links = tree.links
    nodes.clear()

    rl = nodes.new('CompositorNodeRLayers')
    rl.location = (-800, 0)

    # ── Color Balance (pousser les rouges, noircir les ombres) ──
    cb = nodes.new('CompositorNodeColorBalance')
    cb.location = (-550, 0)
    cb.correction_method = 'LIFT_GAMMA_GAIN'
    cb.lift  = (0.04, 0.00, 0.00)   # ombres → rouge sombre
    cb.gamma = (1.08, 0.92, 0.88)   # midtons → rouge chaud
    cb.gain  = (1.05, 0.96, 0.82)   # hautes lumières → or

    # ── Contraste dur (effet affiche imprimée) ───────────────
    bc = nodes.new('CompositorNodeBrightContrast')
    bc.location = (-300, 0)
    bc.inputs['Bright'].default_value   = -8
    bc.inputs['Contrast'].default_value = 28

    # ── Vignette ─────────────────────────────────────────────
    ellipse = nodes.new('CompositorNodeEllipseMask')
    ellipse.location = (-800, -300)
    ellipse.width  = 0.82
    ellipse.height = 0.90

    blur_v = nodes.new('CompositorNodeBlur')
    blur_v.location = (-600, -300)
    blur_v.size_x = 100
    blur_v.size_y = 100

    inv = nodes.new('CompositorNodeInvert')
    inv.location = (-400, -300)

    mix_vign = nodes.new('CompositorNodeMixRGB')
    mix_vign.location = (-100, -150)
    mix_vign.blend_type = 'MULTIPLY'
    mix_vign.inputs['Fac'].default_value = 0.65

    # ── Grain cinéma (Noise + Overlay) ───────────────────────
    noise = nodes.new('CompositorNodeTexNoise')
    noise.location = (-300, -400)
    noise.inputs['Scale'].default_value  = 1200  # grain très fin
    noise.inputs['Detail'].default_value = 1.0
    noise.inputs['Roughness'].default_value = 0.7

    grain_mix = nodes.new('CompositorNodeMixRGB')
    grain_mix.location = (150, -200)
    grain_mix.blend_type = 'OVERLAY'
    grain_mix.inputs['Fac'].default_value = 0.06  # subtil

    # ── Glare (halo visor — remplace Bloom si Blender 4.2+) ──
    glare = nodes.new('CompositorNodeGlare')
    glare.location = (400, 0)
    glare.glare_type = 'GHOSTS'
    glare.quality = 'HIGH'
    glare.threshold = 1.2
    glare.mix = -0.85  # presque transparent, juste l'effet

    # ── Saturation finale (désaturée → style affiche) ────────
    hsl = nodes.new('CompositorNodeHueSaturation')
    hsl.location = (600, 0)
    hsl.inputs['Saturation'].default_value = 0.72
    hsl.inputs['Value'].default_value      = 1.02

    # ── Output ───────────────────────────────────────────────
    comp = nodes.new('CompositorNodeComposite')
    comp.location = (850, 0)
    view = nodes.new('CompositorNodeViewer')
    view.location = (850, -200)

    # Liens
    links.new(rl.outputs['Image'],      cb.inputs['Image'])
    links.new(cb.outputs['Image'],      bc.inputs['Image'])
    links.new(bc.outputs['Image'],      mix_vign.inputs[1])
    links.new(ellipse.outputs['Mask'],  blur_v.inputs['Image'])
    links.new(blur_v.outputs['Image'],  inv.inputs['Color'])
    links.new(inv.outputs['Color'],     mix_vign.inputs[2])
    links.new(mix_vign.outputs['Image'],grain_mix.inputs[1])
    links.new(noise.outputs['Color'],   grain_mix.inputs[2])
    links.new(grain_mix.outputs['Image'], glare.inputs['Image'])
    links.new(glare.outputs['Image'],   hsl.inputs['Image'])
    links.new(hsl.outputs['Image'],     comp.inputs['Image'])
    links.new(hsl.outputs['Image'],     view.inputs['Image'])


# ─────────────────────────────────────────────────────────────
# MAIN — Assembler la scène
# ─────────────────────────────────────────────────────────────

def main():
    print("\n" + "═" * 56)
    print("  CONSTRUCTIVIST MECHA — Build start")
    print("═" * 56)

    print("→ Nettoyage scène...")
    clean_scene()

    print("→ Setup monde / sky...")
    setup_world()

    print("→ Setup render EEVEE...")
    setup_render()

    print("→ Construction mecha...")
    build_mecha()

    print("→ Construction arrière-plan...")
    build_background()

    print("→ Éclairage Chiaroscuro...")
    build_lighting()

    print("→ Caméra contre-plongée...")
    build_camera()

    print("→ Freestyle contours...")
    try:
        setup_freestyle()
    except Exception as e:
        print(f"  [!] Freestyle ignoré : {e}")

    print("→ Compositeur (grain + vignette + grade)...")
    setup_compositor()

    print("\n" + "═" * 56)
    print("  SCÈNE PRÊTE")
    print("  → F12 pour rendre")
    print("  → Output : constructivist_render.png")
    print("═" * 56 + "\n")


main()


# ─────────────────────────────────────────────────────────────
# CONFIG — Tweaks rapides (modifier ici)
# ─────────────────────────────────────────────────────────────
#
# Résolution :         setup_render()  → resolution_x / resolution_y
# Intensité grain :    setup_compositor() → grain_mix 'Fac' (0.0–0.15)
# Épaisseur contours : setup_freestyle()  → ls.thickness (1.0–5.0)
# Backlight rouge :    build_lighting()   → L_Backlight energy (5000–20000)
# Angle caméra :       build_camera()     → aim_at(cam, Vector(x, y, z))
# Palette :            constantes RED / GOLD / DARK_RED en haut du script
#
# ANIMATION (optionnel) :
#   Ajouter des keyframes sur le rouage :
#     gear_ring.rotation_euler = (π/2, 0, 0)  → frame 1
#     gear_ring.rotation_euler = (π/2, 0, 2π) → frame 120
#   Puis : File → Export → FFmpeg Video
