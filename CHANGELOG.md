# 3.2.0 (2017-12-04)

## Features

- mathjax support (issue #218, pr #219)

# 3.1.0 (2017-09-27)

## Features

- special slides for labs are now in English

## Fixes

- special slides for labs do not show the lab number on Chrome 61

# 3.0.0 (2017-09-01)

Includes everything listed under 2.7.0.

:warning: requires Node.js 8.2.1+ to run!

## Breaking changes

- New Gruntfile uses async functions and trailing commas in argument lists, which require Node 8.2.1+. Most depending
projects use Node 6 and have to update their build configuration.
- PDF generation with Chrome cannot run on CircleCI (some low-level libs are missing) so CI now generates PDF using Docker. This change impacts the build configuration of depending projects and the `run.sh` script hosted by depending projects.

## Migrating

You should apply [this commit](https://github.com/Zenika/Formation--Modele/commit/e2e9b0f306b02fdcc53bc775aeb12ea2d1b998bf) and [this commit](https://github.com/Zenika/Formation--Modele/commit/e2577c48bc9707957d9dc772d20131a12695f824). To ease the task, you may want to add [Formation--Modele](https://github.com/Zenika/Formation--Modele) has a remote to your project and cherry-pick the commits.

# 2.7.0 (2017-09-01)

:warning: This version was unpublished because of breaking changes, see 3.0.0.

## Features

- PDF generation with Chrome (issue #185, pr #201 and #202)
  - faster PDF generation
  - support for ES2015, SVGs...
- Special pages for exercices up to 30 (pr #200)

## Development changes

- Added eslint with AirBnB styleguide

# 2.6.0 (2017-06-06)

## Features

- Added build args to specify path to slides and exercices (issue #189, pr #193)

## Deployment changes

- Fixed: "no test command" CI warning (issue #167, pr #186)
- Fixed: `ic.js` retries latest build instead of building `master` (issue #156, pr #182)

# 2.5.1 (2017-04-04)

## Bug fixes

- Fixed packaging of new syntax highlighter (issue #176, pr #177)
- Fixed new syntax highlighter default language selection (pr #179)

# 2.5.0 (2017-04-03)

## Features

- Support for wide screen slides (issue #125, pr #174)
- New syntax highlighting for slides (issue #171, pr #172)

## Bug fixes

- Better font for exercices (issue #35, commit f0347304acbcfd336de0282d336c2b7eee4e2998)

## Deployment changes

- All dependent projects rebuilt upon new release (issue #165, pr #175)

# 2.4.0 (2017-03-27)

## Features

- Support for presentation remotes (pr #170)

# 2.3.2 (2017-03-16)

## Bug fixes

- VERSION on PDF is not replaced (issue #169, commit 1431ba87fcecef0718ab550eac815ef91fe61a9a)

# 2.3.1 (2017-03-03)

## Bug fixes

- PDF generation not working inside the Docker image (issue #162, pr #166)

# 2.3.0 (2017-02-27)

## Features

- The first slide mentions the date and abbreviated commit SHA-1 of its build (issue #98, pr #158)

## Bug fixes

- Titles on PDF slides are not vertically centered (pr #158)
- PDF slides lack a Zenika logo (issue #152, pr #155)
- Web slides display FORMATION_NAME as a page title (issue #154, pr #157)

# 2.2.0 (2017-02-10)

## :warning: Breaking change!

A breaking change was unintentionally introduced into this release. The `package.json` from depending packages is now expected to have a name that can be an AppEngine service name. That is to say it should have only lower case letters and hyphens. As a convention, it is recommended to name the package `formation-<name>`. Examples: `formation-angularjs`, `formation-maven`, `formation-initiation-js`. A package with an incompatible name will fail to deploy to AppEngine.

Also, while not really a breaking change, depending packages should update their README with the new URL to the deployed site, which is now of the following form: `https://<package-name>-dot-zen-formations.appspot.com`.

## Deployment changes

- Deployment to a single App Engine project for all depending packages, instead of one AppEngine project per depending package (issue #146, pr #150).

## Bug fixes

- Fixed `gulp clean` command not waiting for termination before handling control to next tasks (issue #147, pr #148).
- Fixed a bug preventing the correct packaging of Reveal.js assets, resulting in those assets not being deployed (commit 3c731cf).

# 2.1.0 (2016-12-13)

- Updated copyright notice in slides

# 2.0.1 (2016-11-29)

## Bug fixes

- `Dockerfile` updated to work with changes introduced in 2.0.0.

# 2.0.0 (2016-11-17)

## Breaking changes

- Le déploiement se fait maintenant via le script `zenika-formation-deploy` à la place de `gcloud-deploy.sh`, ce qui corrige les builds rouges systèmatiques (issue [#130](https://github.com/Zenika/zenika-formation-framework/issues/130)).

## Migrating

- S'assurer que le build s'exécute sur une version 6 ou supérieure de Node.js, comme [ceci](https://github.com/Zenika/Formation--Modele/commit/0c6e195113eb3f4a85816934dc00cfbc3cbba378). Il est recommandé d'utiliser la dernière LTS (voir http://nodejs.org).
- Modification de `circle.yml` pour utiliser le nouveau script à la place des anciens, comme [ceci](https://github.com/Zenika/Formation--Modele/pull/112/commits/b5f2f8d5f0e28fe7fd88026ce13a6bdb88445c7b#diff-b9cfc7f2cdf78a7f4b91a753d10865a2).

# Older versions

1.0.3:
- date: 2016-09-30
- changes:
  - mise à jour de la façon dont on ajoute le framework au package.json d'une formation suite à la publication du
  framework sur npm

1.0.2:
- date: 2016-09-30
- changes:
  - mise à jour de l'URL du repo dans le readme et le package.json

1.0.1:
- date: 2016-07-29
- changes:
  - plus de coupure au milieu des mots dans les titres (#112)

1.0.0:
- date: 2016-07-29
- changes:
  - nouveau thème (#37, #120)

0.4.7:
- date: 2016-07-14
- changes:
  - ajout d'une favicon
  - support des icônes font awesome dans les slides
  - ajout d'une slide "démo"
  - build grunt compatible npm 3

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
