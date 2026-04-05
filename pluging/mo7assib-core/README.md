# Mo7assib Core

`mo7assib-core` est un plugin WordPress autonome concu pour remplacer completement la homepage WordPress par une interface Mo7assib, tout en laissant Astra actif sur le reste du site.

Le plugin expose un shortcode `[mo7assib_home]`, charge ses propres assets CSS/JS et peut aussi intercepter `is_front_page()` pour court-circuiter le template du theme et afficher directement `templates/home-interface.php`.

## Structure

```text
pluging/mo7assib-core/
├── assets/
│   ├── css/app.css
│   └── js/app.js
├── includes/
│   ├── admin.php
│   └── shortcodes.php
├── templates/
│   └── home-interface.php
├── mo7assib-core.php
└── README.md
```

## Rôle des fichiers

- `mo7assib-core.php`
  Bootstrap principal du plugin. Definit les constantes, charge les fichiers internes, enregistre les assets, initialise les shortcodes et remplace le template de homepage via `template_include`.

- `includes/admin.php`
  Gere les reglages WordPress du plugin, notamment l activation du remplacement total de la homepage et l usage optionnel du header/footer du theme.

- `includes/shortcodes.php`
  Contient la logique du shortcode `[mo7assib_home]`. Le shortcode prepare les donnees de vue, charge les assets necessaires et inclut le template.

- `templates/home-interface.php`
  Contient le template principal de la homepage Mo7assib. Il peut servir de template complet ou de rendu shortcode.

- `assets/css/app.css`
  Contient le style de l’interface. Les classes sont préfixées avec `mo7assib-` pour limiter les conflits avec Astra et d’autres plugins.

- `assets/js/app.js`
  Point d’entrée JavaScript léger, prêt à accueillir des interactions plus avancées ou des appels API.

## Installation dans WordPress

1. Copier le dossier `mo7assib-core` dans `wp-content/plugins/`
2. Aller dans l’administration WordPress
3. Activer le plugin `Mo7assib Core`
4. Créer ou éditer une page WordPress compatible Astra
5. Aller dans `Settings > Mo7assib Core` pour verifier que `Remplacer completement la homepage` est active

Le plugin peut aussi etre zippe depuis le dossier `mo7assib-core` puis installe depuis l interface WordPress via `Extensions > Ajouter`.

## Remplacement complet de la homepage

Par defaut, le plugin peut prendre le controle total de la homepage WordPress :

- si la requete courante est `is_front_page()`
- et si l option `Remplacer completement la homepage` est active
- alors le plugin ignore le template Astra pour cette page
- et WordPress charge directement `templates/home-interface.php`

Les autres pages continuent d utiliser Astra normalement.

Option complementaire :

- `Conserver header/footer du theme`
  Si active, la homepage Mo7assib garde `get_header()` et `get_footer()`
  Si inactive, la homepage est rendue en full screen autonome

## Utilisation du shortcode

Shortcode minimal :

```text
[mo7assib_home]
```

Exemple avec texte personnalisé :

```text
[mo7assib_home title="Pilotez vos réservations" subtitle="Une interface métier branchable à votre backend Laravel."]

Placement recommande du shortcode ailleurs dans le site :

- Ouvrir la page definie comme page d accueil WordPress
- Ajouter un bloc `Shortcode` dans le contenu principal de la page
- Coller `[mo7assib_home]`
- Enregistrer puis recharger la home

Le shortcode reste utile pour afficher la meme interface sur une autre page, independamment du remplacement complet de la homepage.
```

## Où modifier le rendu

- Modifier le HTML ici : `templates/home-interface.php`
- Modifier le style ici : `assets/css/app.css`
- Modifier les comportements JS ici : `assets/js/app.js`
- Modifier la logique du shortcode ici : `includes/shortcodes.php`

## Évolution future

La structure actuelle est déjà prête pour :

- ajouter des endpoints REST WordPress ou des proxys vers Laravel
- brancher de vraies données API à la place des données de démonstration
- créer d’autres shortcodes ou composants frontend
- introduire une couche de services PHP sans dépendre du thème

## Notes de compatibilité

- Le plugin ne modifie pas Astra
- Le plugin ne surcharge pas le thème parent
- Les assets sont chargés seulement quand le shortcode est utilisé
- La logique est isolée pour rester portable et maintenable
