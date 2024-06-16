### README.md

![Demo](https://i.imgur.com/wJY65w2.gif)

# Projet de Visualisation LiDAR 🌍

Ce projet a été réalisé pour démontrer mes compétences en développement web Full Stack, en utilisant plusieurs technologies modernes pour traiter et visualiser des données LiDAR.


## Technologies Utilisées 💻

- **Front-end** : React + Vite
- **Back-end** : Node.js + Express
- **Base de données** : PostgreSQL + PostGIS
- **Traitement des données LiDAR** : Python + PDAL via Anaconda

## Données utilisées 🌈
https://geoservices.ign.fr/lidarhd
-> Zone de Pibrac (31820)

## Processus de réalisation du projet 🗒️

    1. Installation et configuration d'une base de données POSTGRE/PostGIS
    
    2. Intégration des données LIDAR dans une base de données Postgres, avec PDAL via Anaconda et le pipeline indiqué ci-dessous.

    3. Conversion des données binaires en GeoJSON grâce au module pointcloud_postgis.

    4. Préparation et configuration du back-end avec Node + Express
        - 4.1 Utilisation d'une vue spécifique
        - 4.2 Mise en forme pour avoir en retour un GeoJSON 

    5. Préparation et configuration du front-end avec React + Vite
        - 5.1 Affichage d'une map avec mapboxgl avec des coordonnées par défaut
        - 5.2 Intégration via l'API des points lidar en superposition

## Description du Projet 🛠️

### Front-end

Le front-end de l'application est construit avec React et Vite. La carte est intégrée en utilisant Mapbox GL JS, avec des données géospatiales affichées dynamiquement.

### Back-end

Le serveur back-end utilise Node.js et Express pour gérer les requêtes API et servir les données. Les données LiDAR sont stockées dans une base de données PostgreSQL avec l'extension PostGIS pour les fonctionnalités géospatiales.

### Base de Données

La base de données PostgreSQL est utilisée pour stocker les points LiDAR avec des fonctionnalités géospatiales fournies par PostGIS.

### Traitement des Données LiDAR

Pour le traitement des fichiers LiDAR (.laz), j'ai utilisé PDAL via Anaconda en Python.

## Problèmes Rencontrés et Solutions 🔴 💡

### Chargement des Fichiers .laz

Le chargement des fichiers .laz directement avec Node.js s'est avéré être trop lourd, ce qui m'a conduit à adopter une méthode de chargement par blocs. Cependant, même avec cette approche, le processus de split des fichiers était très long.

### Réduction de la Taille des Données

Pour améliorer les performances, j'ai utilisé une pipeline PDAL pour réduire la densité des points et limiter l'impact sur les ressources système.

#### Pipeline PDAL Utilisée

```json
{
	"pipeline": [
	  {
		"type": "readers.las",
		"filename": "C:/Users/33669/Desktop/Elda/example_LiDAR/LHD_FXX_0561_6282_PTS_C_LAMB93_IGN69.copc.laz"
	},
	  {
		"type": "filters.decimation",
		"step": 10
	  },
	  {
		"type": "writers.pgpointcloud",
		"connection": "host='localhost' port='5433' dbname='elda_tech' user='postgres' password='0000'",
		"table": "lidar_data",
		"schema": "public",
		"srid": 4326
	  }
	]
}  
```

### Transformation des Coordonnées

Les coordonnées initiales en Lambert-93 ont été transformées en coordonnées WGS 84 pour être utilisées avec Mapbox GL JS. Pour cela, j'ai utilisé la bibliothèque `proj4`.

### Mapbox

J'ai rendu lisible les points Lidar issu du back-end et je suis parvenu à leur ajouter un mouseover pour indiquer les coordonnées.

### Le format GeoJSON depuis POSTGRE était incorrect

J'ai modifié le back-end pour remettre en forme le format correctement.

```json
{
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [
					561188.61,
					6281937.52
				]
			},
			"properties": {
				"elevation": 158.78
			}
		},
```

