# projetweb_groupe2
Dans le cadre de nos études à l'ISEN, nous devons concevoir et développer une application Web de gestion de profils de plongée sous-marine. Elle doit alors pouvoir donner des points et temps spécifiques correspondant aux palliers à respecter en fonction de la profondeur et du volume d'air restant dans les bouteilles.

# Pré-requis
Notre serveur utilisant une architecture de routeur pour indexer les pages, une configuration préalable est nécessaire pour faire fonctionner le projet sur votre serveur web.
Voici une liste de services fonctionnant avec notre projet ainsi que les étapes nécessaires pour le faire fonctionner.

**Apache 2 :** Vous devez activer le module "RewriteEngine" puis redémarrer le service :
````bash
1. sudo a2enmod rewrite 
2. sudo service apache2 restart
````
Puis vous devez ajouter les lignes suivants à la configuration de votre site :
```apacheconf
 	<Directory [path to the project]>
		Options Indexes FollowSymLinks
                AllowOverride All
                Require all granted
		RewriteEngine On

                RewriteCond %{REQUEST_FILENAME} -f [OR]
                RewriteCond %{REQUEST_FILENAME} -d
                RewriteRule ^(.+) - [PT,L]

                RewriteRule ^assets/(.*)$ public/assets/$1 [L]

                RewriteBase /
                RewriteRule ^ index.php
	</Directory>
```

**Nginx :** Vous devez également activer un certain module en ajoutant ceci à la configuration de votre site :
```
#
# Redirect all to index.php
#
RewriteEngine On

# if a directory or a file exists, use it directly
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

location / {
    try_files $uri $uri/ /index.php;
}
```
# Dossiers
L'architecture suivante est celle que nous avons utilisé pour notre projet.
```
.
├── assets			# Fichiers supplémentaires nécessaires
│   ├── css			# Feuilles de style du site
│   ├── js			# Fichiers javascript du site
│   └── sql			# Fichiers pour initialiser la base de données (ou la visualiser)
├── src				# Fichiers sources (controllers, dao, pages html)
│   ├── appli			# Controlleurs et fichier utils.php
│   ├── dao			# Fichiers DAO (Database Access Object - Accès à base de données)
│   ├── metier			# Fichiers objets liés à la base de données
│   └── view			# Vues (fichiers 'HTML' en PHP)
│   README.md			# Ce fichier, contenant les instructions
└── index.php			# Fichier routeur
```

# Structure du serveur
## Le routeur
> Un routeur est utilisé pour rediriger le client sur la ressource nécessaire en fonction du contexte (la partie suivant le '/' dans un lien). Le programme passera **toujours** par ce chemin, sauf pour les ressources CSS et JS, qui elles sont renseignées par leur chemin exact.

Le routeur se situe à `./index.php`, à la racine du projet.

## Le controlleur
> Le controlleur comporte les opérations nécessaires pour la page web, tel que la collecte des variables `$_POST`, la récupération des `SELECT` dans la base de données etc.

Les controlleurs peuvent être trouvés à `./src/appli/`.

## Les DAO (Database Access Object)
> Une DAO est utilisé pour collecter et insérer des données dans la base de données. Chaque DAO est composé d'un objet possédant le nom de la table qu'il possède, et on utilise de l'objet pour représenter le contenu d'une table.

Les DAO peuvent être trouvées dans `./src/dao/`. Chaque fichier est nommé `DaoX.php`, où `X` représente le nom de la table à laquelle il a accès.

## Les objets
> Les objets sont utilisés pour représenter un concept avec l'aide de propriétés et de fonctions.

Les objets peuvent être trouvés dans `./src/metier/`. Chaque fichier a pour nom celui de son objet. Chaque objet est utilisé pour représenter une table dans la base de données, tel que `User.php`, `Speciality.php`, `Meeting.php`, ...

## Les vuew
> Une vue correspond à ce que l'utilisateur verra sur son écran, et ne doit alors être composé seulement de code html, et éventuellement de codes php nécessaires à l'affichage tel qu'une boucle `for` avec des `print_r` ou `echo`.

Les vues se situent dans `./src/view/` et commencent avec un `v` si elles sont affichées à l'utilisateur. *(par exemple : header.php n'est pas montré à l'utilisateur seul : il est toujours accompagné d'une page, cependant il est montré à l'utilisateur et correspond alors bien à une "vue")*

# Utilisation
- N'oubliez pas de changer les variables `const` dans le fichier `/src/appli/utils.php` selon votre configuration.
- Vous pourrez trouver le document de création de la base de données sql et l'insertion des données dans le dossier `/assets/sql/`.