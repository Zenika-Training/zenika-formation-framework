0.4.6:
- date: 2016-02-16
- changes:
  - Montée de version de node dans Dockerfile
  - Fix: Script de déploiement avec dernière version de GCloud 
0.4.5:
- date: 2015-10-26
- changes:
  - feat: ouverture forcée dans Chrome
  - fix: correction de la génération des PDF avec PhantomJS 1.x
  - fix: ajout d'un polyfill qui ne s'active que si les `Promise` n'existe pas dans le browser
  - feat: ajout d'un mode debug pour les PDF
  - feat: screenshot & HTML sauvegardé en mode debug
  - fix: augmentation du temps d'attente avant la création du PDF  avec PhantomJS 1.x (1000ms -> 10000ms)

0.4.4:
- date: 2015-10-18
- changes:
  - correction pour GAE

0.4.3:
- date: 2015-10-08
- changes:
  - correction de la version de Reveal.js

0.4.2:
- date: 2015-10-05
- changes:
  - ajout de Gulp pour gérer NPM3

0.4.1:
- date: 2015-09-15
- changes:
  - reveal reste en v2
  - fix : syntax highlighting sur appEngine

0.4.0:
- date: 2015-08-07
- changes:
  - ajout d'un Dockerfile
  - Déploiement continue opérationnel

0.3.5:
- date: 2015-06-30
- changes:
  - feat(slides): augmentation de la profondeur du scan des md des slides
  - feat(slides): point d'entrée pour la personnalisation du style (CSS)
  - feat(slides): pouvoir désactiver la coloration syntaxique dans les blocs de code
  - feat(slides): titre HTML "dynamique"
  - feat(cahier): paragraphes justifié.
  - fix(cahier): correction des bugs avec des 'alt' des `<img>`
  - chore(grunt): package with rev

0.3.4:
- date: 2015-03-12
- changes:
  - ajout des pdf dans le 'grunt package'

0.3.3:
- date: 2015-03-04
- changes:
 - test de déploiement continue

0.3.1:
- date: 2015-XX-XX
- changes:
  - améliorations des css
  - support du html dans le cahier de TP
  - support des liens relatifs pour les images dans les TP

0.3.0:
- date: 2015-02-20
- changes:
  - upgrade de markdown-pdf
  - possibilité de séparer le cahier de tp en plusieurs fichiers
  - liens relatifs des ressources du cahier de tp plus élégants

0.2.0:
- date: 2015-01-20
- changes:
  - correction d'anomalies css
  - génération pdf automatisée
  - nom de la formation parametrable

0.1.1:
- date: 2014-12-17
- changes:
  - Reveal.js en dépendance npm

0.1.0:
- date: 2014-12-17
- changes:
  - Init
