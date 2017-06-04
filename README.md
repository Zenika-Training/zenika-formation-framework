# Zenika Formation Framework

Utilisé par toutes nos formations, comme sur le [Modèle](https://github.com/Zenika/Formation--Modele)

## Contenu

- README.md => ce fichier
- package.json => la carte d'identité du package pour `npm`
- Gruntfile.js => le fichier de build utilisé par `grunt` (son contenu est détaillé dans la suite)
- index.html => le template des slides (voir section dédiée)
- styleCahierExercice.css => le fichier de style pour le cahier de TP
- reveal => le repertoire contenant reveal.js customisé pour les formations
- deploy.js => script gérant le déploiement sur AppEngine
- ic.js => script gérant la création du job CircleCI

## Principes

Le framework des formations est un package npm à part entière. Il est importé dans les formations via `npm`.
```javascript
  "dependencies": {
    "grunt": "^0.4.5",
    "zenika-formation-framework": "X.Y.Z"
  },
  "script": {
    "deploy": "zenika-formation-deploy"
  }
```

## Slides

Le framework utilisé pour les slides est [Reveal.js](https://github.com/hakimel/reveal.js).
 Il a été customisé pour les besoins des formations Zenika.

Le code de Reveal, ainsi que le thème utilisé, se trouve dans le framework de formation. Le contenu des slides, spécifique à chaque formation se trouve dans le repository dédié de chacune des formations utilisant le framework. Ainsi, chaque formation peut choisir la version du framework qu'elle souhaite utiliser, et les modifications de thème peuvent facilement être prises en compte dans chaque formation via `npm`.

### Architecture

Pour une formation F donnée, 
le framework se trouve dans le répertoire `./node_modules/zenika-formation-framework/`, le contenu des slides dans `./Slides/`. 
Le serveur utilise 2 baseDir qui sont `./node_modules/zenika-formation-framework/`, puis `./Slides/`.
Ainsi, il est possible d'utiliser des ressources dans le contenu des slides (dans les fichiers `./Slides/*.md`) avec un chemin relatif simple.

La configuration du serveur est faite dans `./node_modules/zenika-formation-framework/Gruntfile.js`.

La configuration de reveal est faite dans `./node_modules/zenika-formation-framework/reveal/run.js`.

Le thème est défini dans `./node_modules/zenika-formation-framework/reveal/theme-zenika`.

## Cahier d'Exercices de TP

Les exercices de TP sont écrits également en markdown, puis convertis en PDF grâce à [markdown-pdf](https://github.com/alanshaw/markdown-pdf).

Le contenu du cahier de TP doit se trouver dans `./CahierExercices/Cahier.md`, ou dans plusieurs fichiers `.md` distincts. Dans ce dernier cas, un fichier `parts.json` doit indexer les fichier `.md` sur le même principe que pour les slides.
Le fichier de style utilisé est `./node_modules/zenika-formation-framework/styleCahierExercice.css`

## Commandes et utilisation

### deploy.js

Permet d'installer et d'utiliser l'outil `gcloud` de Google pour déployer sur AppEngine un projet statique.
Nécessite 2 variables d'environnement:
```
GAE_SERVICE_ACCOUNT=email de service
GAE_KEY_FILE_CONTENT=clé au format json
```

Ce script est utilisé par les formations pour se déployer via `npm run deploy`.

### ic.js

Permet d'initialiser (ou ré-initialiser) un projet CircleCI à partir d'un repository GitHub.

Nécessite 3 variables d'environnement:
```
CIRCLE_TOKEN=token circle
GAE_SERVICE_ACCOUNT=email de service
GAE_KEY_FILE_CONTENT=clé au format json
```
Pour les valeurs, aller sur la documentation de CircleCI sur [l'API](https://circleci.com/docs/api/#getting-started) et [l'authentification avec Google](https://circleci.com/docs/google-auth/)

Possibilité de surcharger le nom du projet:
```
$./ic.js formation-pwa
👷 Welcome jlandure
🚧 Project formation-pwa created
🔧 Env variables set!
💚 All is done! Wait for a green deployment
```

### rebuild-all.js

Force une reconstruction de tous les projets suivis sur CircleCI. Nécessite la variable d'environnement `CIRCLE_TOKEN`. Ce script est appelé après la publication du framework sur npm. Dans ce cadre la variable d'environnement peut être spécifiée dans une fichier `.env`.

### Intégration Slack _Non disponible en API_

De base, tous les builds sont repertoriés sur Slack dans le channel `#ic-formation`.
Pour cela, aller dans CircleCI > Settings du projet > Chat Notifications et indiquer dans le panel Slack `https://hooks.slack.com/services/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`

NB: Url directe pour le paramétrage `https://circleci.com/gh/Zenika/formation-pwa/edit#hooks`

### Build args

The following args are available to customize the build:
- `slides-folder` to define the folder name containing the slides (useful when the training is translated in different languages)
  - Default to `Slides`
- `labs-folder` to define the folder name containing the labs (useful when the training is translated in different languages)
  - Default to `CahierExercices`
- `port` to define the port of the HTTP server
  - Default to `8000`
  
## Troobleshooting

Dans le [wiki](https://github.com/Zenika/zenika-formation-framework/wiki/Troubleshooting)

## Publish a release

- Choose the version number.
  - If the release requires changes in depending projects: bump the major version.
  - If the release changes an expected behavior (eg rendering differences) or adds new behaviors: bump the minor version.
  - Otherwise, bump the patch version.
  - As depending projects use a caret semver range (on purpose) and are rebuilt upon every framework release, it is critical to not break depending projects on minor or patch releases.
- Edit the changelog to add the new release.
- Run `npm version [major|minor|patch]`.
- Run `git push`.
- Run `npm publish` (requires authorization from the `zenika` npm user, which you may contact to obtain those rights).
  - Publication will trigger all GitHub projects starting with `Zenika/formation-` to rebuild and redeploy.
