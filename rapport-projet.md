Justine Ouellette : JuOuellette
Sarah Salah : Harsa1
Hadjar Rafes : Hadjar18
Mohamed-Amine Allet : MohamedAmineAllet
Koya Annabelle Lacombe Cardenas : annabellecard3nas
Panagiotis Katsanis : PKatETS

## Description l'objectif principal de l'application
L'objectif principal de l'application est d'aider les étudiants à gérer leur argent. Il y a des enveloppes budgétaires pour catégoriser ses dépenses et se mettre un maximum à dépenser. Un utilisateur peut ajouter ses dépenses et prendre conscience de celles-ci. Un utilisateur peut aussi se faire un objectif personnel ou partagé avec des amis ajouté par adresses courriel. Un montant est attribué à l'objectif et chaque personne peut mettre de côté de l'argent pour l'épargne collectif. 

## Choix technologique pour l'application
Web développé avec: HTML, CSS, REST API, REACT (Javascript)
Mobile développé avec: Android Studio (Developpé en Java)

## Choix des deux interfaces et les technologies/framework/librairies utilisés
Web développé avec: HTML, Tailwind et css (modifié on a utilisé les deux en fin de compte), REACT , NestJs(TypeORM), REST API, bibliothèque cloudinary pour les images (ajouté), page web hôté sur Railway (ajouté)
Mobile développé avec: Android Studio (Java, XML), Ajouté: OkHttp avec JSON pour communiquer avec le backend

## Choix de technologies/framework/librairies pour l'API REST
Backend développé avec: NestJs(TypeORM) en Typescript
Librairies utilisées: Cron + Brevo API + Swagger pour les courriels programmés, et transactionnels et documentation API (ajouté)
DB MYSQL hôté sur Railway (ajouté)

## Diagramme d'architecture 
<img width="1728" height="2304" alt="React_web_app_Vite_tailwind_css" src="https://github.com/user-attachments/assets/c194e91d-8328-4b40-bf8f-1bceb4746142" />

## Revu des tâches 
84 tâches total
<img width="1004" height="294" alt="image" src="https://github.com/user-attachments/assets/df363cf2-a037-44f3-b83d-49a133e05dc2" />


## Amélioration possible 
Nous aurions pu éviter de séparer nos tâches aussi strictement entre backend et frontend. Quand on a implémenté la liaison du backend avec le frontend, nous avons découvert plusieurs erreurs des deux côtés. On a eu besoin de consulter les gens qui ont travaillé sur le backend, pour accéder aux tables dans la base de données (en ligne) et comprendre la structure des routes. Pour nous faciliter la tâche, nous aurions dû créer une nouvelle branche pour la liaison après avoir complété nos tâches respectives. Cela nous aurait permis de tester, exécuter et éditer le code des deux équipes sans devoir consulter l'autre équipe, ce qu'aurait réduit le temps gaspillé pour la communication.  

## Prochain élément à implémenter 
Nous aurions pu ajouter un agent IA comme dans plusieurs applications bancaires. Le but principal de celui-ci serait de convertir les dépenses de l'utilisateur à partir d'une capture d'écran ou d'un téléversement de ses relevés de compte bancaire en ajouts automatiques dans nos tables dépenses et catégories. On pourrait créer des enveloppes plus appropriées et ce serait moins d'efforts pour l'utilisateur que d'entrer toutes ses dépenses une par une. Ça rend le onboarding plus facile et augmente les chances que l'utlisateur continuera à utiliser l'application.
