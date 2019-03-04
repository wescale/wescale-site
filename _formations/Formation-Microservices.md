---
layout: formation
title: Formation Microservices
desctitle: Poser les bases d'une architecture évolutive et liée à l'existant
class: formation
pitch: |
    L'architecture et la technologie microservices sont présentes dans presque tous les projets en création ou en cours
    de portage. Après cette formation, vous serez capable de mettre en place une réflexion et des actions au sein de
    votre équipe pour accompagner votre architecture vers cette technologie.

img: /images/formations/microservices.png
formateur_img: /images/wewes/carre-sebastien-lavayssiere.jpg
subtitle: |
    Notre prochaine formation<br>
    4 au 6 juin 2019
pdf: /pdf/Programme-de-formation-Microservices.pdf
duree: 3 jours
tarif: 2 200 €
---

# Formation Microservices - *3 jours*

{{ page.pitch }}

## Public


Chefs de projet techniques, architectes, décideurs.

## Pré-requis


Connaissances système Linux, notions d’architecture logicielle, notions d’architecture infrastructure.


## Programme de la formation

### Les Microservices

* Quand ? Pourquoi ? contexte historique et architecture
* Microservice vs monolithe, migrer mon application monolithique
* Bénéfices (scalabilité, résilience, multi-langages, financier) et risques (complexité, maintenance, documentation, multiversion) - Release management (maintien/cycle de vie des API) - Organisation des équipes
* Place des données


### Les Outils

* Service registry - discovery (utilité, concepts, Consul, etcd, Zookeeper)
* REST - communication inter-services (RSS, AMQP, bus, ZeroMQ)
* Framework/technologies et plateformes
* Les containers
* Monitoring (remballer Nagios, Zabbix, Icinga, placer Prometheus) - tracing.io - events
* Cas de l’asynchronisme


### Ecosystème

* Utilisation du cloud
* Infrastructure as Code
* Mise en place du CI / CD (dans le cloud ou on premise?)
* Tests
* Sécurité
* Topologie (emplacement de la CI par rapport aux environnements déployés)


## A l’issue de la formation les stagiaires seront à même de


* Migrer une application existante en microservices
* Comprendre les avantages et les inconvénients de ces technologies
* Préparer une architecture microservices
* Organiser un écosystème orienté microservices
* Organiser une équipe de développement


## Méthodes pédagogiques

Cette formation repose sur l’adoption d’objectifs définis entre l’entreprise cliente et le formateur avant la formation
mais également sur des objectifs revus entre le formateur et les formés au début de la session. Des exercices sont
organisés tout au long de la formation pour valider l’acquisition des compétences.

# Formateur

{% include formateur.html nom_formateur="sebastien-lavayssiere" %}
