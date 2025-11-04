# 🧩 Spécifications – Mockup statique “Veille concurrentielle ADA”

## 🎯 Objectif
Créer une **maquette statique** reproduisant fidèlement le visuel fourni (capture d’écran du tableau de bord “Veille concurrentielle ADA”), avec quelques **améliorations ergonomiques et esthétiques**.  
Cette version servira :
- à tester la **lisibilité et la disposition**,  
- à valider les choix **graphiques et de navigation**,  
- à préparer le **futur prototype SaaS interactif**.

---

## 🧱 Structure générale de la page

### ✅ Organisation principale
Page unique, composée de **trois zones horizontales** :

1. **Header (bandeau supérieur)**  
   - Logo ADA (gauche)  
   - Titre : *“Veille concurrentielle”*  
   - Date de mise à jour : *“Mise à jour données : 24/07”*  
   - (amélioration) Ajout d’un bouton `Exporter PDF` à droite  

2. **Zone de filtres (haut de page)**  
   Divisée en **deux colonnes** :
   - **Colonne gauche (Sélection automatique)**  
     - Agence (dropdown)  
     - Concurrents (liste générée automatiquement selon agence)  
     - Catégorie (dropdown)  
     - Période : boutons `Semaine` / `Week-end`
     - Genre : boutons `VP` / `VU`
   - **Colonne droite (Sélection manuelle)**  
     - Liste des loueurs avec logo (ADA, Rent A Car, Sixt, Europcar, Avis)  
     - Catégories : dropdown “Tout”  
     - Indication du nombre d’agences par loueur (ex. “189 Agences”)  

3. **Zone principale (graphiques)**  
   - 4 graphiques alignés en grille 2x2 :  
     - ADA Paris 13 Tolbiac  
     - Rent A Car Gobelins  
     - Sixt Paris 06 Odéon  
     - Europcar Paris Place d’Italie  
   - Chaque graphique contient :
     - Titre clair (ville + loueur + catégorie + période + km/jour)
     - Légende : durée (1, 3, 5 jours)
     - Courbes de tendance (3 lignes max)
     - Valeurs affichées aux points clés
     - Axes temporels (date / semaine)
     - Logo du loueur (haut droite)
   - (amélioration) Ajout d’un **hover tooltip** au survol d’un point (ex. “Prix : 202€ le 23/09”).  

---

## 🎨 Design system (à conserver et optimiser)

| Élément | Spécification | Amélioration suggérée |
|----------|----------------|-----------------------|
| **Fond** | Noir / gris anthracite (#1b1b1b) | Ajouter un léger dégradé ou texture fine pour profondeur |
| **Texte principal** | Blanc pur / gris clair (#e5e5e5) | Légèrement augmenter contraste (accessibilité) |
| **Titres** | Police sans-serif (ex. *Roboto*, *Inter*) | Taille +1px, espacement 0.5rem |
| **Logos** | Couleur d’origine (ADA rouge, Rent A Car bleu, Sixt orange, Europcar vert, Avis rouge) | OK — conserver pour reconnaissance |
| **Courbes** | Couleur = code loueur | Épaissir lignes (stroke-width +1) pour meilleure lecture |
| **Boutons filtres** | Fond gris foncé, texte blanc | Ajouter état “actif” coloré (bleu clair #4cc9f0) |
| **Dropdowns** | Style sombre, arrondis doux | Ajouter icône ▼ visible |
| **Tableau / Graphiques** | Fond légèrement plus clair (#2a2a2a) | Ajouter ombre douce (shadow-lg) pour relief |

---

## 🧭 Navigation et interactions (mockup statique = visuel uniquement)
Aucune interaction fonctionnelle requise, mais **toutes les zones interactives doivent être identifiables** visuellement.

| Élément | Indication visuelle |
|----------|---------------------|
| Boutons | Surbrillance bleu clair au survol |
| Dropdown | Chevron visible + survol gris |
| Graphique | Effet hover (halo sur point, info-bulle fictive) |
| Bouton Export | Icône “flèche bas” ou “PDF” |

---

## 🧰 Composants à maquetter (pour Replit ou Figma)

1. **Composant `<Header />`**
   - Logo ADA à gauche  
   - Texte “Veille concurrentielle” centré  
   - Date “Mise à jour : 24/07” à droite  
   - Bouton `Exporter PDF`

2. **Composant `<FilterPanel />`**
   - Deux sous-composants :
     - `<AutomaticSelection />`
     - `<ManualSelection />`
   - Disposition responsive (côte à côte sur desktop, empilé sur mobile)

3. **Composant `<ChartGrid />`**
   - 4 cartes `<ChartCard />`
   - Props attendues : `title`, `loueur`, `dates`, `prices`, `color`, `durationLabels`
   - Zone hover (non-fonctionnelle mais visible)

4. **Composant `<Footer />` (optionnel pour mockup)**
   - Mention “Prototype - Veille concurrentielle v1.0”
   - Lien “Mentions légales” (non cliquable)

---

## 🧩 Suggestions d’amélioration intégrées dans le design

1. **Aération visuelle**
   - Espacement de 20–30px entre les blocs graphiques.  
   - Marges internes de 15px dans chaque carte.  
   - Lignes de séparation très fines (#333).

2. **Synthèse automatique (placeholder)**
   - En haut du dashboard, prévoir un encart (même vide dans le mockup) :  
     > “ADA Paris 13 est en moyenne 8 % plus cher que Sixt et 12 % moins cher qu’Europcar.”  

3. **Alerte visuelle (fictive dans le mockup)**
   - Ajouter un petit badge rouge `⚠` à côté d’un titre graphique si écart > 10 %.

4. **Compatibilité future mobile**
   - En mode étroit, les 4 graphiques passent en 1 colonne verticale.  
   - Filtres deviennent accordéon déroulant.

5. **Accessibilité**
   - Contraste minimum AA (rapport ≥ 4.5).  
   - Police ≥ 14px sur mobile.

---

## 🧮 Livrable attendu

Un **fichier statique unique**, livré sous l’un des formats suivants :  
- **HTML/CSS + JS (mock data)** — recommandé pour Replit  
- ou **Figma / PNG** pour validation design

### Structure recommandée pour Replit
```
/public
  logo_ada.png
  logo_rentacar.png
  logo_sixt.png
  logo_europcar.png
  logo_avis.png
index.html
styles.css
mockdata.js
README.md
```

---

## 🧠 Rappel : objectifs du mockup

✅ Tester l’ergonomie et la hiérarchie visuelle  
✅ Valider la cohérence des filtres et du tableau de bord  
✅ Préparer la transition vers le développement SaaS (v2)
