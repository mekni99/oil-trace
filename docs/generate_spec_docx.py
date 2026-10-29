# -*- coding: utf-8 -*-
"""Génère le document Word de spécification des formulaires de traçabilité Veritrace."""
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_ORIENT, WD_SECTION
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

NAVY = RGBColor(0x1F, 0x38, 0x64)
GOLD = RGBColor(0x9C, 0x6F, 0x0A)
GREEN = RGBColor(0x2E, 0x7D, 0x32)
ORANGE = RGBColor(0xE6, 0x51, 0x00)
RED = RGBColor(0xC6, 0x28, 0x28)
BLUE = RGBColor(0x15, 0x65, 0xC0)
PURPLE = RGBColor(0x6A, 0x1B, 0x9A)
GREY = RGBColor(0x55, 0x55, 0x55)

STATUS = {
    "ok":   ("Existant", GREEN, None),
    "new":  ("À ajouter", ORANGE, "FFF3E0"),
    "int":  ("Interne", RED, "FFEBEE"),
}
VIS = {
    "pub": ("Public", GREEN),
    "bo":  ("Backoffice", BLUE),
    "exp": ("Expert", PURPLE),
    "conf": ("Confidentiel", RED),
}

DOC_COLORS = {
    "reg":  "DEEBF7",   # réglementaire — bleu clair
    "san":  "E2EFDA",   # sanitaire — vert clair
    "fin":  "FBE5D6",   # financier — orange clair
    "log":  "EDEDED",   # transport — gris clair
    "org":  "F3E5F5",   # origine — violet clair
}
DOC_LABEL = {
    "reg": ("Réglementaire", BLUE),
    "san": ("Sanitaire", GREEN),
    "fin": ("Financier — CONFIDENTIEL", RED),
    "log": ("Transport / Logistique", GREY),
    "org": ("Origine", PURPLE),
}


def shade(cell, hexcolor):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:val"), "clear")
    shd.set(qn("w:fill"), hexcolor)
    tcPr.append(shd)


def set_borders(table):
    tbl = table._tbl
    tblPr = tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), "single")
        el.set(qn("w:sz"), "4")
        el.set(qn("w:color"), "B0B0B0")
        borders.append(el)
    tblPr.append(borders)


def cell_text(cell, text, size=8.5, bold=False, color=None, italic=False):
    cell.text = ""
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(1)
    run = p.add_run(text)
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.italic = italic
    if color:
        run.font.color.rgb = color
    return p


def field_table(doc, rows, widths):
    table = doc.add_table(rows=1, cols=7)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_borders(table)
    hdr = table.rows[0].cells
    for i, h in enumerate(["Champ", "Description", "Type", "Choix / valeurs", "Exemple", "Statut", "Visibilité"]):
        cell_text(hdr[i], h, size=8.5, bold=True, color=RGBColor(0xFF, 0xFF, 0xFF))
        shade(hdr[i], "1F3864")
    for (champ, desc, ftype, choix, ex, st, vis) in rows:
        c = table.add_row().cells
        label, scolor, fill = STATUS[st]
        vlabel, vcolor = VIS[vis]
        cell_text(c[0], champ, bold=True, size=8.5)
        cell_text(c[1], desc, size=8.5)
        cell_text(c[2], ftype, size=8.5)
        cell_text(c[3], choix, size=8)
        cell_text(c[4], ex, size=8.5)
        cell_text(c[5], label, size=8, bold=True, color=scolor)
        cell_text(c[6], vlabel, size=8, bold=True, color=vcolor)
        if fill:
            for cc in c:
                shade(cc, fill)
    for row in table.rows:
        for i, w in enumerate(widths):
            row.cells[i].width = Cm(w)
    return table


def h1(doc, text, color=NAVY):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.size = Pt(18)
    run.font.bold = True
    run.font.color.rgb = color
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after = Pt(4)
    return p


def h2(doc, text, color=NAVY):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.color.rgb = color
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    return p


def para(doc, text, size=10, italic=False, color=None, bold=False):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.size = Pt(size)
    run.font.italic = italic
    run.font.bold = bold
    if color:
        run.font.color.rgb = color
    return p


def doc_card(doc, title, kind, desc, issuer, where, fields):
    """Encadré coloré pour un document justificatif."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_borders(table)
    cell = table.rows[0].cells[0]
    shade(cell, DOC_COLORS[kind])
    label, color = DOC_LABEL[kind]
    cell.text = ""
    p = cell.paragraphs[0]
    r = p.add_run(f"{title}   ")
    r.font.bold = True
    r.font.size = Pt(10.5)
    r2 = p.add_run(f"[{label}]")
    r2.font.bold = True
    r2.font.size = Pt(9)
    r2.font.color.rgb = color
    for line in [desc, f"Délivré par : {issuer}", f"Apparaît dans : {where}", f"Champs clés : {fields}"]:
        pp = cell.add_paragraph()
        rr = pp.add_run(line)
        rr.font.size = Pt(9)
        pp.paragraph_format.space_before = Pt(0)
        pp.paragraph_format.space_after = Pt(1)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)


doc = Document()
style = doc.styles["Normal"]
style.font.name = "Calibri"
style.font.size = Pt(10)

# ---------- PAGE DE GARDE (portrait) ----------
for _ in range(6):
    doc.add_paragraph()
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("SPÉCIFICATION FONCTIONNELLE")
r.font.size = Pt(16)
r.font.color.rgb = GOLD
r.font.bold = True
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("Formulaires de saisie de traçabilité")
r.font.size = Pt(26)
r.font.bold = True
r.font.color.rgb = NAVY
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("Plateforme Veritrace — Huile d'olive")
r.font.size = Pt(14)
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("Standards : GS1 (GTIN · GLN · SSCC · GS1-128) — EPCIS — Douane tunisienne (DUM/TTN)")
r.font.size = Pt(10)
r.font.color.rgb = GREY
for _ in range(3):
    doc.add_paragraph()
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("Version 2.0 — Octobre 2026\nDocument de recherche — attributs détaillés, types de champ et listes de choix")
r.font.size = Pt(10)
r.font.color.rgb = GREY

# ---------- SECTION IDENTIFIANTS GS1 ----------
doc.add_page_break()
h1(doc, "1. Identifiants GS1 — le socle de la traçabilité", GOLD)
para(doc, "Ces quatre codes standardisés identifient respectivement le produit, sa fabrication, le lieu et l'unité logistique. Ils sont définis par l'organisation GS1 et rendent la chaîne interopérable (distributeurs, douanes, transporteurs).", size=10)

gs1 = [
    ("GTIN", "Global Trade Item Number",
     "Code produit universel identifiant chaque FORMAT d'huile d'olive : une bouteille 50 cl, un bidon 5 L, un carton et une palette possèdent chacun leur propre GTIN. C'est le numéro du code-barres scanné en caisse.",
     "13 chiffres + clé de contrôle", "06191234500417"),
    ("N° de Lot", "Batch / Lot Number",
     "Associé au GTIN, il identifie une cuvée ou une session précise de trituration/conditionnement. Le couple GTIN+lot est l'unité minimale d'un rappel produit (obligatoire, règlement UE 178/2002).",
     "Alphanumérique, libre", "ZTN-26-04"),
    ("SSCC", "Serial Shipping Container Code",
     "Code unique apposé sur chaque palette d'expédition pour gérer la logistique amont et aval : le destinataire scanne la palette et connaît son contenu exact.",
     "18 chiffres", "361912345000417"),
    ("GLN", "Global Location Number",
     "Code d'emplacement global identifiant de façon unique chaque site physique : parcelle/verger, moulin de trituration, cuve de stockage, usine d'emballage, entrepôt, point de vente. Dans les événements EPCIS, il répond à la question « où ? ».",
     "13 chiffres + clé de contrôle", "6191234500007"),
]
for code, full, desc, fmt, ex in gs1:
    h2(doc, f"{code} — {full}", GOLD)
    para(doc, desc, size=9.5)
    para(doc, f"Format : {fmt}    Exemple : {ex}", size=9, italic=True, color=GREY)

# ---------- VISIBILITÉ ----------
h1(doc, "2. Niveaux de visibilité des données", NAVY)
para(doc, "Tous les attributs ne vont pas dans le passeport public. Quatre niveaux s'appliquent :", size=10)
vis_rows = [
    ("Public", GREEN, "Consommateur (scan QR)", "Lecture seule via GS1 Digital Link", "GTIN, lots, origine, parcours, nutrition"),
    ("Backoffice", BLUE, "Producteur : exploitant, moulin, embouteilleur, logistique", "Saisie des événements, dossier export", "Masses, cuves, DUM, factures, BL"),
    ("Expert", PURPLE, "Labo ONH, ECOCERT, transitaire", "Co-signature et validation des événements", "Certificats signés, agréments, visa export"),
    ("Confidentiel", RED, "Admin plateforme, exportateur", "Données financières/réglementaires sensibles", "Valeur en douane, domiciliation bancaire, MF"),
]
t = doc.add_table(rows=1, cols=4)
set_borders(t)
hdr = t.rows[0].cells
for i, h in enumerate(["Niveau", "Qui", "Accès", "Contenu"]):
    cell_text(hdr[i], h, bold=True, color=RGBColor(0xFF, 0xFF, 0xFF))
    shade(hdr[i], "1F3864")
for name, color, who, access, content in vis_rows:
    c = t.add_row().cells
    cell_text(c[0], name, bold=True, color=color)
    cell_text(c[1], who)
    cell_text(c[2], access)
    cell_text(c[3], content)
para(doc, "Règle d'or : le passeport public n'expose jamais de prix, de valeur douanière, de coordonnées bancaires ni de pièce jointe brute.", size=9.5, italic=True, color=RED)

# ---------- PASSAGE EN PAYSAGE POUR LES TABLEAUX ----------
sec = doc.add_section(WD_SECTION.NEW_PAGE)
sec.orientation = WD_ORIENT.LANDSCAPE
sec.page_width, sec.page_height = sec.page_height, sec.page_width
sec.left_margin = sec.right_margin = Cm(1.5)
sec.top_margin = sec.bottom_margin = Cm(1.5)

h1(doc, "3. Attributs détaillés par rubrique du passeport", NAVY)
para(doc, "Types de champ : Texte · Texte long · Nombre · Date · Sélection (liste déroulante) · Multi-sélection · Fichier (upload PDF/image) · Auto (généré ou calculé par le système) · Booléen · Tableau (lignes répétables).", size=9, italic=True, color=GREY)
para(doc, "Légende Statut : Existant (vert) = déjà dans la plateforme · À ajouter (orange, ligne surlignée) · Interne (rouge, confidentiel).", size=9, italic=True, color=GREY)

W = [3.4, 6.2, 2.3, 5.8, 4.0, 1.9, 2.0]

RUBRICS = [
("3.1  Rubrique 01 — Identification", [
    ("Nom du produit", "Désignation commerciale complète", "Texte", "—", "EVOO Chemlali Early Harvest", "ok", "pub"),
    ("Marque / titre", "Marque et gamme du produit", "Texte", "—", "Domaine Zitouna · Réserve", "ok", "pub"),
    ("Catégorie d'huile", "Grade affiché sur la carte catalogue (tag)", "Sélection", "Extra vierge · Vierge · Lampante · Raffinée", "Extra vierge", "ok", "pub"),
    ("Catégories de filtrage", "Labels de recherche du catalogue (cats)", "Multi-sélection", "Extra virgin · Organic · AOP/IGP · Virgin", "Extra virgin + Organic", "ok", "pub"),
    ("Format", "Contenance et matériau de l'emballage", "Sélection", "250 ml · 500 ml · 750 ml · 1 L · 3 L · 5 L bidon · vrac", "Verre foncé · 750 ml", "ok", "pub"),
    ("Serial", "Identifiant unique de l'unité (anti-contrefaçon)", "Auto", "Pattern MARQUE-GRADE-ANNEE-NNNN", "ZTN-EVOO-2026-0417", "ok", "pub"),
    ("N° de lot", "Lot de conditionnement (couple GTIN+lot = rappel)", "Auto", "Libre — convention interne", "ZTN-26-04", "ok", "pub"),
    ("Date de fabrication", "Date de mise en bouteille", "Date", "—", "2026-02-20", "ok", "pub"),
    ("DDM", "Date de durabilité minimale imprimée sur bouteille", "Date", "—", "2027-11-30", "ok", "pub"),
    ("Emballage", "Description des matériaux", "Texte long", "—", "Verre UV, capsule alu, étiquette FSC", "ok", "pub"),
    ("GTIN", "Code produit universel de l'unité vendue", "Texte", "13 chiffres + clé de contrôle GS1 (validé)", "06191234500417", "ok", "pub"),
    ("QR code produit", "Lien GS1 Digital Link vers le passeport", "Auto", "veritrace.app/01/<GTIN>/10/<LOT>", "veritrace.app/p/…", "ok", "pub"),
    ("Image produit", "Photo pour carte catalogue + onglet Photos", "Fichier", "JPG · PNG · WebP — max 5 Mo", "bouteille, verger, moulin", "ok", "pub"),
    ("Statut on-chain", "Badge de vérification blockchain", "Auto", "—", "On-chain", "ok", "pub"),
]),
("3.2  Rubrique 02 — Geography", [
    ("Pays", "Pays de production des olives", "Sélection", "Liste ISO 3166 (Tunisie · Espagne · Italie…)", "Tunisie", "ok", "pub"),
    ("Région", "Zone de production", "Texte", "—", "Sfax · Agareb", "ok", "pub"),
    ("GPS récolte", "Coordonnées géographiques de la parcelle (preuve EUDR)", "Texte", "Lat. / Long. degrés décimaux", "34.7406° N, 10.7603° E", "ok", "pub"),
    ("Parcelle", "Référence interne, surface, nombre d'arbres", "Texte", "—", "P-14 · 38 ha · 2 400 arbres", "ok", "pub"),
    ("GLN parcelle", "Identifiant GS1 unique du site de récolte", "Texte", "13 chiffres + clé de contrôle", "6191234500014", "new", "pub"),
    ("Altitude", "Altitude de la parcelle", "Nombre", "mètres", "110 m", "ok", "pub"),
    ("Label AOP / IGP", "Appellation d'origine", "Sélection", "AOP · IGP · Aucun · En cours d'instruction", "IGP Huile d'olive de Sfax", "ok", "pub"),
    ("Producteur", "Raison sociale de l'exploitation", "Texte", "—", "Domaine Zitouna SARL", "ok", "pub"),
    ("Matricule fiscal", "Identifiant fiscal tunisien de l'exportateur (rubrique DUM 1)", "Texte", "Format MF tunisien", "TN-MF-1187245", "new", "conf"),
    ("GLN exploitant", "Identifiant GS1 de l'exploitation agricole", "Texte", "13 chiffres", "6191234500007", "new", "pub"),
    ("Exploitation", "Historique / présentation du domaine", "Texte long", "—", "Familiale depuis 1962", "ok", "pub"),
    ("Adresse / contact", "Siège et contact producteur", "Texte", "—", "Route de Gremda km 8, Sfax", "ok", "pub"),
]),
("3.3  Rubrique 03 — Agricultural", [
    ("Date de récolte", "Jour de cueillette des olives", "Date", "—", "2025-11-18", "ok", "pub"),
    ("Méthode de récolte", "Technique de cueillette", "Sélection", "Manuelle peignes · Vibreur mécanique · Filets · Ramassage au sol", "Peignes + filets", "ok", "pub"),
    ("Variété d'olive", "Cultivar(s) du lot", "Multi-sélection", "Chemlali · Chetoui · Oueslati · Zarrazi · Chemchali · Arbequina · autre", "Chemlali (vert précoce)", "ok", "pub"),
    ("ID lot matière première", "Étiquette apposée sur chaque bac/palox (clé du lien amont)", "Auto", "Pattern HV-<PARCELLE>-<AAMMJJ>", "HV-P14-251118", "ok", "pub"),
    ("Masse récoltée", "Poids total du lot d'olives", "Nombre", "kg", "12 400 kg", "new", "bo"),
    ("Type de contenant", "Conditionnement de la récolte au champ", "Sélection", "Bac 25 kg · Palox 400 kg · Remorque vrac", "Palox 400 kg", "new", "bo"),
    ("Label agricole", "Certification culturale", "Sélection", "Bio UE · Bio TN (ECOCERT) · Conventionnel · En conversion", "Bio ECOCERT TN-BIO-01", "ok", "pub"),
    ("Traitements", "Historique phytosanitaire : produit, date d'application, délai avant récolte", "Tableau", "Produit (texte) · Date (date) · Délai (auto, jours)", "Cuivre 2025-04-10 · 222 j", "ok", "bo"),
    ("Délai récolte→moulin", "Temps max entre cueillette et trituration (qualité)", "Nombre", "heures", "4 h", "ok", "pub"),
]),
("3.4  Rubrique 04 — Process (moulin)", [
    ("Moulin", "Nom du site de trituration", "Texte", "—", "Moulin El Bousten", "ok", "pub"),
    ("Localisation", "Adresse du moulin", "Texte", "—", "Sakiet Ezzit, Sfax", "ok", "pub"),
    ("GLN moulin", "Identifiant GS1 du site de transformation", "Texte", "13 chiffres", "6191234500021", "new", "pub"),
    ("Date de trituration", "Date de l'événement de transformation", "Date", "—", "2025-11-19", "ok", "pub"),
    ("Certification du site", "Certifications qualité du moulin", "Multi-sélection", "ISO 22000 · HACCP · BRC · IFS · Aucune", "ISO 22000", "ok", "pub"),
    ("Méthode d'extraction", "Procédé d'extraction de l'huile", "Sélection", "Pression · Centrifugation 2 phases · Centrifugation 3 phases", "2 phases, < 27 °C", "ok", "pub"),
    ("Température extraction", "Seuil « extraction à froid »", "Nombre", "°C — doit être ≤ 27 pour « cold extraction »", "< 27 °C", "ok", "pub"),
    ("Malaxation", "Durée du malaxage de la pâte", "Nombre", "minutes", "35 min", "ok", "pub"),
    ("Lot(s) olives en entrée", "Références aux lots de récolte (INPUT de l'événement)", "Multi-sélection", "Liste des lots HV-* existants", "HV-P14-251118 (+HV-P14-251119)", "ok", "bo"),
    ("Masse olives entrante", "Poids total des olives entrées (EPCIS inputQuantity)", "Nombre", "kg", "12 400 kg", "ok", "bo"),
    ("Lot huile sortant", "Nouveau lot créé (OUTPUT du TransformationEvent)", "Auto", "Pattern ML-<AA>-<MMJJ>-<NN>", "ML-25-1119-07", "ok", "pub"),
    ("Volume produit", "Volume d'huile obtenu", "Nombre", "litres", "2 050 L", "ok", "pub"),
    ("Rendement", "Ratio huile/olives", "Auto", "calculé : volume ÷ masse × 100", "16,5 %", "ok", "pub"),
    ("Filtration", "Traitement de l'huile avant stockage", "Sélection", "Filtré · Non filtré · Décantation naturelle", "Filtré coton, sous azote", "ok", "pub"),
    ("ID cuve de stockage", "Cuve de stockage + son identifiant", "Sélection + texte", "Liste des cuves + GLN optionnel", "Cuve C-07 · GLN 6191234500038", "new", "bo"),
    ("Type EPCIS", "Typage de l'événement dans le modèle EPCIS", "Auto", "TransformationEvent (fixe pour cette étape)", "TransformationEvent", "new", "bo"),
    ("Date mise en bouteille", "Date de conditionnement ultérieur", "Date", "—", "2026-02-20", "ok", "pub"),
    ("Ingrédients", "Composition déclarée", "Texte", "—", "100 % huile d'olive extra vierge", "ok", "pub"),
]),
("3.5  Rubrique 05 — Sustainability", [
    ("Empreinte carbone", "CO₂e par bouteille", "Nombre", "kg CO₂e", "1,4 kg", "ok", "pub"),
    ("Empreinte eau", "Eau consommée par bouteille", "Nombre", "litres", "420 L (pluvial)", "ok", "pub"),
    ("Énergie renouvelable", "Part d'énergie renouvelable au moulin", "Nombre", "%", "62 % (solaire)", "ok", "pub"),
    ("Verre recyclé", "Part de verre recyclé dans l'emballage", "Nombre", "%", "70 %", "ok", "pub"),
    ("Score durabilité", "Note composite vs benchmark régional EVOO", "Auto", "0–10, calculé carbone+eau+énergie+recyclé", "8,2", "ok", "pub"),
    ("Valorisation déchets", "Destination du grignon", "Multi-sélection", "Biomasse · Compost · Alimentation animale · Enfouissement", "Grignon → biomasse", "ok", "pub"),
]),
("3.6  Rubrique 06 — Certifications & contrôles", [
    ("Certificat bio", "Certificat d'agriculture biologique + organisme + validité", "Fichier + sélection", "Organismes : ECOCERT · Bureau Veritas · Control Union · autre + date de validité", "ECOCERT · valide 2027", "ok", "exp"),
    ("AOP / IGP", "Certificat d'appellation + autorité émettrice", "Fichier + texte", "—", "IGP Sfax · Ministère Agriculture", "ok", "pub"),
    ("Commerce équitable", "Identifiant fair-trade", "Texte", "FLO-ID", "FLO-ID 45218", "ok", "pub"),
    ("EUDR", "Conformité déforestation UE + preuve géolocalisation", "Booléen + fichier", "Conforme · Non conforme", "EUDR compliant", "ok", "pub"),
    ("Certificat phytosanitaire", "N° du certificat du contrôle sanitaire aux frontières", "Texte + fichier", "—", "PH-2026-11872", "ok", "bo"),
    ("Autorisation d'export", "Agrément exportateur délivré par l'ONH", "Texte + fichier", "—", "ONH · 2026-0217", "ok", "bo"),
    ("Certificat EUR.1", "Certificat d'origine pour les quotas tarifaires UE", "Texte + fichier", "—", "EUR-2026-0441", "new", "bo"),
    ("Analyse chimique", "Paramètres labo : acidité oléique ≤0,8 %, indice peroxyde ≤20, K232 ≤2,5, K270 ≤0,22, humidité, pesticides, contaminants", "Tableau + fichier", "Paramètre · Résultat · Limite EVOO · Statut (Pass/Fail)", "Acidité 0,21 % · Peroxyde 6,4", "ok", "exp"),
    ("Analyse organoleptique", "Dégustation panel test : médiane de défauts Md = 0 et fruité Mf > 0 (norme COI)", "Fichier + nombre", "Md (défauts) · Mf (fruité) — seuils EVOO", "Fruity 4.2 · no defect", "new", "exp"),
]),
("3.7  Rubrique 07 — Nutrition", [
    ("Énergie", "Valeur énergétique pour 100 ml", "Nombre", "kJ / kcal", "3 404 kJ / 828 kcal", "ok", "pub"),
    ("Lipides", "Matières grasses totales", "Nombre", "g / 100 ml", "92 g", "ok", "pub"),
    ("dont saturés", "Acides gras saturés", "Nombre", "g", "13 g", "ok", "pub"),
    ("Mono / polyinsaturés", "AG monoinsaturés / polyinsaturés", "Nombre", "g", "68 g / 11 g", "ok", "pub"),
    ("Glucides / protéines", "Sucres et protéines", "Nombre", "g", "0 g", "ok", "pub"),
    ("Polyphénols", "Antioxydants (allégation santé UE 432/2012)", "Nombre", "mg/kg", "612 mg/kg", "ok", "pub"),
    ("Vitamine E", "Teneur en vitamine E", "Nombre", "mg", "18 mg", "ok", "pub"),
    ("Instructions", "Conservation et conseils d'usage", "Texte long", "—", "14–18 °C · 3 mois après ouverture", "ok", "pub"),
]),
("3.8  Rubrique 08 — Traceability", [
    ("Journal d'événements", "Chaîne de garde : événement, lieu, date, hash blockchain", "Tableau", "Type événement · Lieu · Date · Tx hash", "7 événements signés", "ok", "pub"),
    ("GLN par lieu d'événement", "readPoint EPCIS : GLN du site où l'événement s'est produit", "Texte (par événement)", "13 chiffres", "GLN parcelle → moulin → port", "new", "bo"),
    ("Typage EPCIS", "Type de chaque événement selon la norme", "Sélection", "ObjectEvent · AggregationEvent · TransformationEvent · TransactionEvent", "TransformationEvent", "new", "bo"),
    ("bizStep", "Étape métier EPCIS", "Sélection", "commissioning · packing · shipping · receiving · transforming", "shipping", "new", "bo"),
    ("Agrégation de lots", "Blend : fusion de plusieurs lots moulin", "Texte + tableau", "Liste lots + ratio d'assemblage", "ML-25-1119-07 + ML-25-1120-02 (70/30)", "ok", "bo"),
    ("SSCC palette", "Code unique de la palette expédiée", "Texte", "18 chiffres + clé", "361912345000417", "ok", "pub"),
    ("Marquage GS1-128", "Code-barres logistique sur cartons : AI(01)=GTIN, AI(10)=lot", "Auto", "Code-barres GS1-128 généré", "(01)06191234500424(10)ZTN-26-04", "new", "bo"),
    ("N° conteneur", "Numéro du conteneur maritime", "Texte", "Format ISO 6346", "MSCU 482917-3", "ok", "pub"),
    ("Preuve blockchain", "Réseau, contrat, bloc d'ancrage", "Auto", "Polygon · adresse contrat · n° bloc", "Polygon · #4 812 330", "ok", "pub"),
    ("Alertes transport", "Excursions (température, choc) pendant le transit", "Tableau", "Type alerte · Valeur · Durée · Tolérance", "31 °C · 2 h · toléré", "ok", "bo"),
]),
("3.9  Rubrique 09 — Packaging", [
    ("Poids brut / net", "Poids de l'unité emballée", "Nombre", "g / ml", "1 180 g brut · 690 g net", "ok", "pub"),
    ("Dimensions", "Hauteur et diamètre de la bouteille", "Nombre", "cm", "31 cm · Ø 7,4 cm", "ok", "pub"),
    ("Variantes", "Autres formats du même produit", "Multi-sélection", "250 ml · 500 ml · 750 ml · 1 L · 5 L", "3 variantes", "ok", "pub"),
    ("Date conditionnement", "Date du passage en bouteille", "Date", "—", "2026-02-20", "ok", "pub"),
    ("Établissement", "Site de conditionnement", "Texte", "—", "Domaine Zitouna bottling unit", "ok", "pub"),
    ("N° lot de conditionnement", "Lot imprimé sur la bouteille", "Auto", "—", "ZTN-26-04", "ok", "pub"),
    ("Blend de lots", "Assemblage de plusieurs lots d'huile", "Booléen + sélection", "Oui → liste des lots + ratio", "Oui · 2 lots moulin", "ok", "bo"),
    ("GTIN carton", "GTIN du format carton (≠ bouteille)", "Texte", "13 chiffres + clé", "06191234500424", "new", "pub"),
    ("GTIN palette", "GTIN du format palette", "Texte", "13 chiffres + clé", "06191234500431", "new", "bo"),
    ("Marquage GS1-128 cartons", "Code-barres logistique imprimé sur carton", "Auto", "AI(01) + AI(10)", "GS1-128", "new", "bo"),
    ("N° agrément conditionneur", "Agrément officiel de l'embouteilleur (ex. FranceAgriMer FR, ONH TN)", "Texte + fichier", "—", "TN-AGR-2026-1187", "new", "bo"),
    ("Stockage", "Conditions de stockage des cuves", "Texte", "—", "Cuves inox sous azote, 16 °C, 92 j", "ok", "bo"),
    ("Fin de vie", "Consignes de tri de l'emballage", "Tableau", "Composant → filière de tri", "Verre→verre · cap→métal", "ok", "pub"),
]),
("3.10  Rubrique 10 — Shipping & douane", [
    ("Date d'expédition", "Départ de l'envoi", "Date", "—", "2026-03-02", "ok", "pub"),
    ("Fournisseur", "Expéditeur de la marchandise", "Texte", "—", "Domaine Zitouna SARL", "ok", "pub"),
    ("GLN expéditeur", "Identifiant GS1 du site de départ", "Texte", "13 chiffres", "6191234500007", "new", "pub"),
    ("Transporteur", "Société de transport", "Texte", "—", "CTN Maritime", "ok", "pub"),
    ("Mode de transport", "Mode principal", "Sélection", "Maritime · Routier (CMR) · Aérien · Ferroviaire", "Maritime reefer", "ok", "pub"),
    ("Code SH", "Position tarifaire douanière du produit", "Sélection", "1509 20 00 EVOO · 1509 30 00 vierge · 1509 40 00 autre vierge · 1509 90 00 autre", "1509 20 00", "new", "bo"),
    ("Incoterm", "Conditions de livraison (qui paie quoi)", "Sélection", "EXW · FOB · CFR · CIF · DAP · DDP", "FOB Port de Sfax", "new", "bo"),
    ("Transitaire / déclarant", "Agréé en douane qui dépose la DUM", "Texte", "Nom + code agrément douane", "SOTRANS · AGR-1187", "new", "bo"),
    ("N° DUM / DCE", "Déclaration export saisie sur Tunisie Trade Net (TTN/SINDA)", "Texte", "—", "DUM-2026-08841", "new", "bo"),
    ("B/L connaissement", "Bill of Lading maritime (≠ bon de livraison interne)", "Texte + fichier", "—", "MSKU-BL-88213", "new", "bo"),
    ("Facture", "Facture commerciale d'exportation (prix, volume, devise)", "Texte + fichier", "—", "INV-2026-0311", "ok", "bo"),
    ("Bon de livraison", "BL interne de l'envoi", "Texte", "—", "BL-ZTN-0417", "ok", "bo"),
    ("Date de réception", "Arrivée chez le destinataire", "Date", "—", "2026-03-15", "ok", "pub"),
    ("Acheteur", "Client / importateur", "Texte", "—", "Grigolato.NL B.V.", "ok", "pub"),
    ("GLN destinataire", "Identifiant GS1 de l'entrepôt/point de vente", "Texte", "13 chiffres", "3112345678903", "new", "pub"),
    ("Adresse livraison", "Adresse du destinataire", "Texte", "—", "Almere, NL", "ok", "pub"),
    ("EORI importateur", "Identifiant douane UE de l'acheteur", "Texte", "Format EORI (FR/NL + chiffres)", "NL851234567B01", "new", "bo"),
    ("MRN dédouanement", "N° de déclaration import UE + bureau + date de mise en libre pratique", "Texte", "MRN système DELTA/Portbase", "26NL-5518-DELTA · 12/03", "new", "bo"),
    ("Contrôle réception", "Vérification à la réception", "Texte", "—", "Scellé intact · 6/6 cartons", "ok", "pub"),
    ("Valeur en douane", "Valeur déclarée de la marchandise", "Nombre + sélection", "Monnaie : TND · EUR · USD", "ex. 48 000 EUR", "int", "conf"),
    ("Domiciliation bancaire", "Banque agréée + n° d'engagement de change", "Texte", "—", "BIAT · ENG-2026-0217", "int", "conf"),
    ("Poids brut / net envoi", "Poids totaux de l'expédition", "Nombre", "kg", "9 800 / 9 200 kg", "int", "conf"),
    ("Nombre de colis", "Colis / conteneurs de l'envoi", "Nombre", "Palettes · cartons · iso-tank", "20 palettes", "int", "conf"),
]),
]

for title, rows in RUBRICS:
    h2(doc, title)
    field_table(doc, rows, W)
    doc.add_paragraph().paragraph_format.space_after = Pt(2)

# ---------- DOCUMENTS JUSTIFICATIFS ----------
h1(doc, "4. Documents justificatifs — certificats & factures", NAVY)
para(doc, "Pièces à joindre au dossier d'export. Couleur = type de document : bleu réglementaire · vert sanitaire · orange financier (confidentiel) · gris transport · violet origine.", size=9, italic=True, color=GREY)

doc_card(doc, "Agrément d'Exportateur d'Huile d'Olive", "reg",
    "Autorisation officielle d'exporter de l'huile d'olive — préalable obligatoire à toute DUM.",
    "Ministère de l'Agriculture + Office National de l'Huile (ONH)",
    "§6 Certifications (Autorisation export)",
    "N° d'agrément, date de validité, catégories autorisées")
doc_card(doc, "Certificat d'Analyse et de Conformité ONH", "reg",
    "Atteste la catégorie de l'huile (Vierge Extra, Vierge…) et ses paramètres physico-chimiques (acidité, peroxyde, K232/K270) et organoleptiques (panel test : Md=0, Mf>0).",
    "Laboratoire ONH / laboratoire accrédité",
    "§6 Certifications (analyse chimique + organoleptique)",
    "Catégorie, acidité, peroxyde, K232, K270, Md, Mf")
doc_card(doc, "Facture Commerciale d'Exportation", "fin",
    "Preuve de la vente : prix, volume, devise et Incoterm (FOB, CIF…). Document sensible — jamais dans le passeport public.",
    "Exportateur",
    "§10 Shipping (Facture — backoffice)",
    "Prix, volume, devise, Incoterm, n° facture")
doc_card(doc, "Titre d'Exportation / Engagement de Change", "fin",
    "Engagement de rapatrier les devises de la vente — domicilié auprès d'une banque agréée tunisienne. CONFIDENTIEL.",
    "Banque agréée en Tunisie",
    "§10 Shipping (champs internes 🔒)",
    "Banque, n° d'engagement de change, montant")
doc_card(doc, "Certificat Sanitaire / Phytosanitaire", "san",
    "Atteste la conformité sanitaire de la marchandise à la frontière.",
    "Services du contrôle sanitaire aux frontières",
    "§6 Certifications (phytosanitaire)",
    "N° certificat, date, espèce/produit")
doc_card(doc, "Certificat d'Origine EUR.1", "org",
    "Prouve l'origine tunisienne pour bénéficier des préférences tarifaires UE (quotas/droits réduits).",
    "Douane tunisienne / Chambre de Commerce",
    "§6 Certifications (EUR.1)",
    "N° EUR.1, pays d'origine, autorité")
doc_card(doc, "Connaissement maritime (B/L) ou CMR", "log",
    "Titre de transport : B/L pour le maritime, lettre de voiture CMR pour le routier. Porte les lots et volumes.",
    "Compagnie maritime / transporteur",
    "§10 Shipping (B/L connaissement)",
    "N° B/L, navire, port chargement/déchargement")
doc_card(doc, "DUM / DCE — Déclaration douanière", "reg",
    "Déclaration Unique de Marchandise saisie en ligne sur Tunisie Trade Net (TTN/SINDA) par le transitaire.",
    "Direction Générale des Douanes (Tunisie)",
    "§10 Shipping (N° DUM / DCE)",
    "Exportateur+MF, destinataire, code SH, poids, valeur, lots")

# ---------- STRUCTURE DUM ----------
h2(doc, "4.1  Structure de la DUM tunisienne — mapping")
para(doc, "Les 6 blocs de la Déclaration Unique de Marchandise et leur équivalent dans la plateforme :", size=9, italic=True, color=GREY)
dum_rows = [
    ("1. Exportateur", "Raison sociale, adresse, MF, agrément ONH", "Producteur + MF + Autorisation export (§2, §6)", "ok"),
    ("2. Destinataire", "Raison sociale client, pays de destination", "Acheteur + adresse + GLN (§10)", "ok"),
    ("3. Déclarant", "Transitaire + code agrément douane", "Transitaire (§10)", "new"),
    ("4. Marchandise", "Désignation, code SH, colis, poids, lots", "Code SH + lots + poids (§10)", "new"),
    ("5. Valeur", "Valeur en douane, monnaie, domiciliation bancaire", "Champs internes 🔒 (§10)", "int"),
    ("6. Contrôles", "N° certificat ONH, EUR.1, B/L", "§6 Certifications + B/L (§10)", "new"),
]
t = doc.add_table(rows=1, cols=4)
set_borders(t)
hdr = t.rows[0].cells
for i, h in enumerate(["Bloc DUM", "Contenu douane", "Champ plateforme", "Statut"]):
    cell_text(hdr[i], h, bold=True, color=RGBColor(0xFF, 0xFF, 0xFF))
    shade(hdr[i], "1F3864")
for bloc, contenu, champ, st in dum_rows:
    c = t.add_row().cells
    label, scolor, fill = STATUS[st]
    cell_text(c[0], bloc, bold=True)
    cell_text(c[1], contenu)
    cell_text(c[2], champ)
    cell_text(c[3], label, bold=True, color=scolor)
    if fill:
        for cc in c:
            shade(cc, fill)

# ---------- RETOUR PORTRAIT : RÉCAP + GLOSSAIRE ----------
sec2 = doc.add_section(WD_SECTION.NEW_PAGE)
sec2.orientation = WD_ORIENT.PORTRAIT
sec2.page_width, sec2.page_height = sec2.page_height, sec2.page_width
sec2.left_margin = sec2.right_margin = Cm(2)

h1(doc, "5. Récapitulatif des ajouts", NAVY)
recap = [
    ("GLN parcelle · exploitant · moulin · cuve · expéditeur · destinataire · readPoint événements", "§2, §4, §8, §10", "8 champs"),
    ("GTIN carton + GTIN palette", "§9", "2 champs"),
    ("Marquage GS1-128 (AI 01 + 10)", "§8, §9", "1 champ"),
    ("Masse récoltée + type de contenant", "§3", "2 champs"),
    ("ID cuve de stockage", "§4", "1 champ"),
    ("Certificat organoleptique (panel test)", "§6", "1 champ"),
    ("Typage EPCIS + bizStep", "§8", "2 champs"),
    ("Douane export : code SH, Incoterm, transitaire, DUM/DCE, B/L", "§10", "5 champs"),
    ("Douane import : EORI, MRN dédouanement", "§10", "2 champs"),
    ("Matricule fiscal + certificat EUR.1", "§2, §6", "2 champs"),
    ("Interne 🔒 : valeur douane, domiciliation bancaire, poids envoi, colis", "§10", "4 champs"),
]
t = doc.add_table(rows=1, cols=3)
set_borders(t)
hdr = t.rows[0].cells
for i, h in enumerate(["Groupe d'ajouts", "Où", "Nombre"]):
    cell_text(hdr[i], h, bold=True, color=RGBColor(0xFF, 0xFF, 0xFF))
    shade(hdr[i], "1F3864")
for g, w, n in recap:
    c = t.add_row().cells
    cell_text(c[0], g)
    cell_text(c[1], w)
    cell_text(c[2], n, bold=True)
para(doc, "Total : 30 champs à ajouter (dont 4 strictement confidentiels — backoffice uniquement).", size=10, bold=True, color=ORANGE)

h1(doc, "6. Glossaire — termes difficiles", NAVY)
gloss = [
    ("GTIN", "Global Trade Item Number — code-barres produit (13 chiffres), un par format d'emballage."),
    ("GLN", "Global Location Number — identifiant GS1 d'un lieu ou acteur (13 chiffres)."),
    ("SSCC", "Serial Shipping Container Code — identifiant unique d'une palette (18 chiffres)."),
    ("GS1-128", "Code-barres logistique combinant GTIN (AI 01) et lot (AI 10) sur cartons/palettes."),
    ("EPCIS", "Norme GS1 d'enregistrement d'événements : What (objets), Where (GLN), When (date), Why (bizStep)."),
    ("TransformationEvent", "Événement EPCIS qui consomme des lots en entrée et crée un lot en sortie (olives → huile)."),
    ("DDM", "Date de Durabilité Minimale — « à consommer de préférence avant »."),
    ("DUM", "Déclaration Unique de Marchandise — déclaration douanière tunisienne."),
    ("DCE / TTN / SINDA", "Déclaration Commerce Extérieur saisie sur Tunisie Trade Net (système SINDA)."),
    ("MRN", "Movement Reference Number — numéro de la déclaration douanière à l'import UE."),
    ("BAE", "Bon À Enlever — mainlevée douanière autorisant la sortie de la marchandise."),
    ("EORI", "Economic Operators Registration and Identification — identifiant douane UE de l'importateur."),
    ("EUR.1", "Certificat de circulation des marchandises prouvant l'origine pour les préférences tarifaires UE."),
    ("MF", "Matricule Fiscal — identifiant fiscal tunisien de l'entreprise."),
    ("Incoterm", "Terme de vente international (FOB, CIF, EXW…) définissant frais et responsabilités."),
    ("B/L", "Bill of Lading — connaissement maritime, titre de transport."),
    ("CMR", "Lettre de voiture internationale pour le transport routier."),
    ("Md / Mf", "Médiane de défauts / médiane de fruité — critères organoleptiques COI (EVOO : Md=0, Mf>0)."),
    ("Code SH", "Système Harmonisé — code tarifaire international (1509 20 00 = huile d'olive vierge extra)."),
    ("ONH", "Office National de l'Huile — organisme tunisien de contrôle et d'agrément oléicole."),
    ("palox", "Caisse-palette en bois/plastique (~400 kg) utilisée pour transporter les olives au moulin."),
    ("readPoint", "Lieu EPCIS où un événement s'est produit — exprimé en GLN."),
    ("bizStep", "Étape métier EPCIS : commissioning, packing, shipping, receiving, transforming…"),
]
for term, definition in gloss:
    p = doc.add_paragraph()
    r = p.add_run(f"{term} : ")
    r.font.bold = True
    r.font.size = Pt(9.5)
    r.font.color.rgb = NAVY
    r2 = p.add_run(definition)
    r2.font.size = Pt(9.5)
    p.paragraph_format.space_after = Pt(2)

doc.save(r"docs\Specification_Formulaires_Tracabilite.docx")
print("OK — docs/Specification_Formulaires_Tracabilite.docx")
