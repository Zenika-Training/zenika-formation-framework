# Zenika Formation Framework

Utilisé par toutes nos formations, comme sur le [Modèle](https://github.com/Zenika/Formation--Modele)

## Contenu

- README.md => ce fichier
- package.json => la carte d'identité du package pour `npm`
- Gruntfile.js => le fichier de build utilisé par `grunt` (son contenu est détaillé dans la suite)
- index.html => le template des slides (voir section dédiée)
- styleCahierExercice.css => le fichier de style pour le cahier de TP
- reveal => le repertoire contenant reveal.js customisé pour les formations

## Principes

Le framework des formations est un package npm à part entière. Il est importé dans les formations via `npm`.
Comme il s'agit d'un package privé (il n'est pas publié sur http://npmjs.org), sa déclaration dans le fichier package.json de chaque formation se fait de la manière suivante :
```javascript
  "dependencies": {
    "grunt": "^0.4.5",
    "zenika-formation-framework": "git+ssh://git@github.com:Zenika/Formation--Framework.git#tags/X.Y.Z"
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

## Troobleshooting

Dans le [wiki](https://github.com/Zenika/Formation--Framework/wiki/Troubleshooting)
