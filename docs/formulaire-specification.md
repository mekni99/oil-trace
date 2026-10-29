# Spécification — Formulaires de saisie de traçabilité

**Plateforme** : Veritrace — traçabilité huile d'olive
**Standards** : GS1 (GTIN, GLN, SSCC, GS1-128) · EPCIS
**Version** : 1.1 — octobre 2026

---

## 1. Identifiants GS1 utilisés

| Code | Nom complet | Rôle | Format | Exemple plateforme |
|---|---|---|---|---|
| **GTIN** | Global Trade Item Number | Identifie un *type* de produit par niveau d'emballage (bouteille, carton, palette) | 13 chiffres | `06191234500417` |
| **Lot** | Batch / Lot Number | Identifie une fabrication précise (cuvée, trituration, conditionnement). Le couple **GTIN + lot** est la base d'un rappel produit | Alphanumérique | `ZTN-26-04` |
| **SSCC** | Serial Shipping Container Code | Identifie une palette expédiée (logistique amont/aval) | 18 chiffres | `361912345000417` |
| **GLN** | Global Location Number | Identifie un site physique ou un acteur : parcelle, moulin, cuve, usine, entrepôt, point de vente | 13 chiffres | `6191234500007` |

> **Règle GTIN** : chaque format d'emballage possède son propre GTIN.
> Bouteille 750 ml ≠ carton ×6 ≠ palette.

---

## 2. Correspondance rubriques ↔ maillons de la chaîne

Les 10 rubriques du passeport produit correspondent aux maillons de la chaîne et aux événements EPCIS :

| # | Rubrique | Maillon | Acteur | Événement EPCIS |
|---|---|---|---|---|
| 01 | Identification | Produit fini | Embouteilleur | — |
| 02 | Geography | Récolte (amont) | Exploitant | — |
| 03 | Agricultural | Récolte (amont) | Exploitant | ObjectEvent `commissioning` |
| 04 | Process | Trituration | Moulin | **TransformationEvent** |
| 05 | Sustainability | Transverse | — | — |
| 06 | Certifications | Contrôle qualité | Labo / certificateurs | — |
| 07 | Nutrition | Produit fini | Embouteilleur | — |
| 08 | Traceability | Toute la chaîne | Tous | Tous les événements |
| 09 | Packaging | Conditionnement | Embouteilleur | ObjectEvent `commissioning` |
| 10 | Shipping | Expédition (aval) | Logistique | ObjectEvent `shipping` |

Chaque événement EPCIS répond à 4 questions :
- **What** — quels objets (GTIN, lots, SSCC)
- **Where** — quel lieu (GLN)
- **When** — date / heure
- **Why** — étape métier (bizStep)

**Légende statut** : ✅ déjà présent dans la plateforme · 🆕 champ à ajouter

---

## 3. Rubrique 01 — Identification

Identité unique de l'unité et de son lot.

| Champ | Description | Exemple | Statut |
|---|---|---|---|
| Nom du produit | Désignation commerciale | Extra Virgin Olive Oil — Chemlali Early Harvest | ✅ |
| Marque / titre | | Domaine Zitouna · Réserve | ✅ |
| Format | Contenance et matériau | Bouteille verre foncé · 750 ml | ✅ |
| Serial | Identifiant unique de l'unité | `ZTN-EVOO-2026-0417` | ✅ |
| **N° de lot** | Lot de conditionnement | `ZTN-26-04` | ✅ |
| Date de fabrication | | 2026-02-20 | ✅ |
| **DDM** | Date de durabilité minimale | 2027-11-30 | ✅ |
| Emballage | Description matériaux | Verre UV, capsule alu, étiquette FSC | ✅ |
| **GTIN** | Code produit unitaire | `06191234500417` | ✅ |
| QR code produit | GS1 Digital Link | `veritrace.app/p/…` | ✅ |
| Catégorie (tag) | Badge affiché sur la carte catalogue | Extra virgin | ✅ |
| Catégories de filtrage | Labels de recherche catalogue (`cats`) | Extra virgin · Organic · AOP/IGP · Virgin | ✅ |
| Image produit | Photo carte catalogue + onglet Photos | bouteille, verger, moulin | ✅ |
| Statut on-chain | Badge de vérification catalogue | `On-chain` | ✅ |

## 4. Rubrique 02 — Geography

Provenance des olives et identification des lieux.

| Champ | Description | Exemple | Statut |
|---|---|---|---|
| Pays | | Tunisie | ✅ |
| Région | | Sfax · Agareb | ✅ |
| GPS récolte | Coordonnées de la parcelle | 34.7406° N, 10.7603° E | ✅ |
| Parcelle | Réf. interne, surface, arbres | P-14 · 38 ha · 2 400 arbres | ✅ |
| **GLN parcelle** | Identifiant GS1 du site de récolte | `6191234500014` | 🆕 |
| Altitude | | 110 m | ✅ |
| Label AOP / IGP | | IGP Huile d'olive de Sfax | ✅ |
| Producteur | | Domaine Zitouna SARL | ✅ |
| **Matricule fiscal (MF)** | Identifiant fiscal de l'exportateur (DUM) | `TN-MF-1187245` | 🆕 |
| **GLN exploitant** | Identifiant GS1 de l'exploitation | `6191234500007` | 🆕 |
| Exploitation | Historique | Familiale depuis 1962 | ✅ |
| Adresse / contact | | Route de Gremda km 8, Sfax | ✅ |

## 5. Rubrique 03 — Agricultural

Pratiques culturales et enregistrement de la récolte (lot matière première).

| Champ | Description | Exemple | Statut |
|---|---|---|---|
| Date de récolte | Jour de cueillette | 18 novembre 2025 | ✅ |
| Méthode | Manuelle / mécanique | Peignes + filets | ✅ |
| Variété d'olive | Cultivar | Chemlali (récolte verte précoce) | ✅ |
| **ID lot matière première** | Étiquette bac / palox | `HV-P14-251118` | ✅ |
| **Masse récoltée** | Poids d'olives du lot | 12 400 kg | 🆕 |
| **Type de contenant** | Bac ou palox | Palox 400 kg | 🆕 |
| Label agricole | Certification | Bio (ECOCERT TN-BIO-01) | ✅ |
| Traitements | Produit, date, délai avant récolte | Cuivre 2025-04-10 · 222 j | ✅ |
| Indicateurs | Mono-variété, bio, irrigation, délai récolte→moulin | 100 % Chemlali · 4 h | ✅ |

## 6. Rubrique 04 — Process

**EPCIS TransformationEvent** : ce qui *entre* (lots d'olives) et ce qui *sort* (lot d'huile).

| Champ | Description | Exemple | Statut |
|---|---|---|---|
| Moulin | Nom du site | Moulin El Bousten | ✅ |
| Localisation | | Sakiet Ezzit, Sfax | ✅ |
| **GLN moulin** | Identifiant GS1 du site | `6191234500021` | 🆕 |
| Date de trituration | | 19 novembre 2025 | ✅ |
| Certification du site | | ISO 22000 | ✅ |
| Méthode d'extraction | | Extraction à froid 2 phases < 27 °C | ✅ |
| Malaxation | Durée | 35 min | ✅ |
| **Lot(s) olives en entrée** | Réf. aux lots de récolte | `HV-P14-251118` (+ `HV-P14-251119`) | ✅ |
| **Masse olives entrante** | kg | 12 400 kg | ✅ |
| **Lot huile sortant** | Nouveau lot créé | `ML-25-1119-07` | ✅ |
| **Volume produit** | litres | 2 050 L | ✅ |
| Rendement | % | 16,5 % | ✅ |
| Filtration | | Filtré coton, stocké sous azote | ✅ |
| **ID cuve de stockage** | Cuve + identifiant GS1 | `Cuve C-07 · GLN 6191234500038` | 🆕 |
| Date de mise en bouteille | | 20 février 2026 | ✅ |
| Ingrédients | | 100 % huile d'olive extra vierge | ✅ |

## 7. Rubrique 05 — Sustainability

Empreinte environnementale (pas d'identifiant GS1 requis).

| Champ | Description | Exemple | Statut |
|---|---|---|---|
| Empreinte carbone | kg CO₂e / bouteille | 1,4 kg | ✅ |
| Empreinte eau | L / bouteille | 420 L (pluvial) | ✅ |
| Énergie renouvelable | % | 62 % (solaire au moulin) | ✅ |
| Verre recyclé | % emballage | 70 % | ✅ |
| Score durabilité | 0–10, benchmark régional EVOO | 8,2 | ✅ |
| Valorisation déchets | Grignon → biomasse | ✅ | ✅ |

## 8. Rubrique 06 — Certifications

Certificats et analyses de laboratoire associés au lot.

| Champ | Description | Exemple | Statut |
|---|---|---|---|
| Certificat bio | Organisme + validité | ECOCERT · valide 2027 | ✅ |
| AOP / IGP | Autorité | IGP Sfax · Ministère Agriculture | ✅ |
| Commerce équitable | | FLO-ID 45218 | ✅ |
| EUDR | Déforestation + preuve géo | Compliant | ✅ |
| Certificat phytosanitaire | | `PH-2026-11872` | ✅ |
| Autorisation export | Agrément exportateur ONH | ONH · 2026-0217 | ✅ |
| **Certificat EUR.1** | Origine UE / quotas tarifaires | `EUR-2026-0441` | 🆕 |
| **Certificat analyse chimique** | Acidité, peroxyde, K232/K270, humidité, pesticides, contaminants | Acidité 0,21 % · peroxyde 6,4 | ✅ |
| **Certificat organoleptique** | Dégustation panel test (Md = 0, Mf > 0) | `Fruity 4.2 · no defect` | 🆕 |

## 9. Rubrique 07 — Nutrition

Valeurs nutritionnelles et conseils (pas d'identifiant GS1 requis).

| Champ | Description | Exemple | Statut |
|---|---|---|---|
| Énergie | kJ / kcal pour 100 ml | 3 404 kJ / 828 kcal | ✅ |
| Lipides | g | 92 g | ✅ |
| dont saturés / mono / poly | g | 13 / 68 / 11 g | ✅ |
| Glucides / protéines | g | 0 g | ✅ |
| Polyphénols | mg/kg | 612 | ✅ |
| Vitamine E | mg | 18 | ✅ |
| Instructions | Conservation, consommation | 14–18 °C, 3 mois après ouverture | ✅ |

## 10. Rubrique 08 — Traceability

Chaîne de garde complète, ancrée sur blockchain.

| Champ | Description | Exemple | Statut |
|---|---|---|---|
| Journal d'événements | Événement, lieu, date, hash tx | 7 événements | ✅ |
| **GLN par lieu d'événement** | readPoint EPCIS de chaque étape | GLN parcelle → moulin → port | 🆕 |
| **Typage EPCIS** | ObjectEvent / TransformationEvent / AggregationEvent | `bizStep` par événement | 🆕 |
| Agrégation | Fusion de lots (blend) | `ML-25-1119-07 + ML-25-1120-02 (70/30)` | ✅ |
| **SSCC palette** | Code unique palette | `361912345000417` | ✅ |
| **Marquage GS1-128** | Étiquette logistique cartons | AI(01) GTIN + AI(10) lot | 🆕 |
| N° conteneur | | `MSCU 482917-3` | ✅ |
| Preuve blockchain | Réseau, contrat, bloc | Polygon · 7/7 événements | ✅ |
| Alertes transport | Excursions température | 31 °C · 2 h · dans tolérance | ✅ |

## 11. Rubrique 09 — Packaging

Conditionnement, écoconception et fin de vie.

| Champ | Description | Exemple | Statut |
|---|---|---|---|
| Poids brut / net | | 1 180 g / 690 g · 750 ml | ✅ |
| Dimensions | Hauteur, diamètre | 31 cm · Ø 7,4 cm | ✅ |
| Variantes | Autres formats | 250 / 500 / 750 ml | ✅ |
| Date de conditionnement | | 2026-02-20 | ✅ |
| Établissement | | Domaine Zitouna bottling unit | ✅ |
| **N° lot de conditionnement** | | `ZTN-26-04` | ✅ |
| Blend de lots | Assemblage | Oui · 2 lots moulin | ✅ |
| **GTIN carton** | Code du format carton | `06191234500424` | 🆕 |
| **GTIN palette** | Code du format palette | `06191234500431` | 🆕 |
| **Marquage GS1-128 cartons** | AI(01) + AI(10) | | 🆕 |
| **N° agrément conditionneur** | Ex. FranceAgriMer (FR) / ONH (TN) | `TN-AGR-2026-1187` | 🆕 |
| Stockage | Cuves inox sous azote | 16 °C · 92 jours | ✅ |
| Fin de vie | Tri des matériaux | Verre / métal / papier | ✅ |

## 12. Rubrique 10 — Shipping

Expédition, réception et documents commerciaux.

| Champ | Description | Exemple | Statut |
|---|---|---|---|
| Date d'expédition | | 2026-03-02 | ✅ |
| Fournisseur | | Domaine Zitouna SARL | ✅ |
| **GLN expéditeur** | Site de départ | `6191234500007` | 🆕 |
| Transporteur | | CTN Maritime · reefer | ✅ |
| **Code SH** | Position tarifaire (1509 20 00 = EVOO, 1509 30 00 = vierge) | `1509 20 00` | 🆕 |
| **Incoterm** | Conditions de livraison | FOB Port de Sfax | 🆕 |
| **Transitaire / déclarant** | Nom + code agrément douane | `SOTRANS · AGR-1187` | 🆕 |
| **N° DUM / DCE** | Déclaration export (Tunisie Trade Net) | `DUM-2026-08841` | 🆕 |
| **B/L connaissement maritime** | Document de transport (≠ bon de livraison) | `MSKU-BL-88213` | 🆕 |
| Facture | Document commercial | `INV-2026-0311` | ✅ |
| Bon de livraison | Document commercial | `BL-ZTN-0417` | ✅ |
| Date de réception | | 2026-03-15 | ✅ |
| Acheteur | | Grigolato.NL B.V. | ✅ |
| **GLN destinataire** | Entrepôt / point de vente | `3112345678903` | 🆕 |
| Adresse livraison | | Almere, NL | ✅ |
| **EORI importateur** | Identifiant douane UE de l'acheteur | `NL851234567B01` | 🆕 |
| **MRN dédouanement** | N° déclaration import + bureau + date | `MRN 26NL5518… · Rotterdam · 12/03` | 🆕 |
| Contrôle réception | | Scellé intact · 6/6 cartons | ✅ |

> ⚠️ **Données internes uniquement** 🔒 (backoffice, jamais dans le passeport public) :
> valeur en douane + monnaie, domiciliation bancaire / engagement de change, poids brut/net de l'envoi. Voir §15.

---

## 13. Récapitulatif — champs à ajouter

| # | Champ | Rubrique | Maillon |
|---|---|---|---|
| 1 | GLN parcelle | 02 Geography | Récolte |
| 2 | GLN exploitant | 02 Geography | Récolte |
| 3 | Masse récoltée | 03 Agricultural | Récolte |
| 4 | Type de contenant (bac/palox) | 03 Agricultural | Récolte |
| 5 | GLN moulin | 04 Process | Trituration |
| 6 | ID cuve de stockage (+ GLN) | 04 Process | Trituration |
| 7 | Certificat organoleptique | 06 Certifications | Trituration |
| 8 | GLN par lieu d'événement | 08 Traceability | Tous |
| 9 | Typage EPCIS des événements | 08 Traceability | Tous |
| 10 | Marquage GS1-128 | 08/09 Traceability/Packaging | Expédition |
| 11 | GTIN carton | 09 Packaging | Conditionnement |
| 12 | GTIN palette | 09 Packaging | Conditionnement |
| 13 | N° agrément conditionneur | 09 Packaging | Conditionnement |
| 14 | GLN expéditeur | 10 Shipping | Expédition |
| 15 | GLN destinataire | 10 Shipping | Expédition |
| 16 | Matricule fiscal (MF) | 02 Geography | Exportateur |
| 17 | Certificat EUR.1 | 06 Certifications | Export UE |
| 18 | Code SH | 10 Shipping | Douane export |
| 19 | Incoterm | 10 Shipping | Douane export |
| 20 | Transitaire / agrément douane | 10 Shipping | Douane export |
| 21 | N° DUM / DCE (TTN) | 10 Shipping | Douane export |
| 22 | B/L connaissement maritime | 10 Shipping | Douane export |
| 23 | EORI importateur | 10 Shipping | Douane import UE |
| 24 | MRN / dédouanement | 10 Shipping | Douane import UE |
| — 🔒 | Valeur douane, domiciliation bancaire | interne uniquement | Confidentiel |

**Total : 24 ajouts** dont 8 GLN et 9 champs douaniers — GLN et dossier export sont les deux manques principaux.

---

## 15. Niveaux de visibilité des données

Tous les champs de ce document ne vont **pas** dans le passeport public (QR code scanné par le consommateur). La plateforme applique 4 niveaux :

| Niveau | Qui | Accès | Contenu |
|---|---|---|---|
| 🌐 **Public** | Consommateur, acheteur | Lecture seule via QR / GS1 Digital Link | GTIN, lots, origine, certificats affichables, parcours, nutrition, durabilité |
| 🏭 **Backoffice producteur** | Exploitant, moulin, embouteilleur, logistique | Saisie des événements, gestion des lots, dossier export | Masses, cuves, DUM, factures, BL, documents joints |
| 🧪 **Expert / certificateur** | Labo ONH, ECOCERT, transitaire | Co-signature et validation des événements | Certificats d'analyse signés, agréments, visa export |
| 🔐 **Admin / confidentiel** | Admin plateforme, exportateur | Données financières et réglementaires sensibles | Valeur en douane, domiciliation bancaire, engagement de change, MF |

**Règle d'or** : le passeport public n'expose jamais de prix, de valeur douanière, de coordonnées bancaires ni de pièce jointe brute — même si la donnée existe dans le système.

Cette séparation correspond à ce que la plateforme montre déjà dans le workspace mockup : *« Roles per actor »* (chaque acteur signe sa propre étape) et *« Pending signs »* (le labo doit signer avant la clôture du lot).

---

## 14. Chaîne de traçabilité résultante

```
Récolte                    Trituration                 Conditionnement          Expédition
─────────                  ───────────                 ───────────────          ──────────
GLN parcelle      ┐        GLN moulin        ┐          GTIN bouteille           SSCC palette
Lot HV-P14-…      ┼──────► INPUT  HV-P14-…   ┼───────►  GTIN carton       ┌───►  GS1-128 cartons
(variété, date)   │        OUTPUT ML-25-…    │          GTIN palette      │      GLN départ/dest.
masse, contenant  ┘        cuve + certificats┘          lot ZTN-26-04     │      transporteur, BL
                          (chimie + panel)              DDM, agrément     └────  GLN client
```
