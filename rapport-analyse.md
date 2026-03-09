## Liste des membres de l'équipe avec identifiant Github et Discord
  - Panagiotis Katsanis: PKatETS
  - Sarah Salah: Harsa1
  - Hadjar Rafes: Hadjar18
  - Justine Ouellette: JuOuellette
  - Mohamed-Amine Allet: MohamedAmineAllet
  - Koya Annabelle Lacombe Cardenas: annabellecard3nas

## Description l'objectif principal de l'application
Le public cible est les étudiants de tous genres dans un établissement québécois. L'application est en français. Facultatif en anglais. Le but: aider les étudiants québecois à planifier leurs dépenses et à mieux gérer leur porte-feuille sur une période d'une session et pendant la durée de leurs études.

## Choix technologique pour l'application
 - Web développé avec: HTML, CSS, REST API, REACT (Javascript)   
 - Mobile développé avec: Android Studio (Developpé en Java)

### Choix des deux interfaces et les technologies/framework/librairies utilisés
 - Web développé avec: HTML, Tailwind), REACT , NestJs(TypeORM), REST API   
 - Mobile développé avec: Android Studio (Java, XML)

### Choix de technologies/framework/librairies pour l'API REST
 - Web développé avec:  NestJs(TypeORM)   

# Planification du Sprint 1 

## Diagramme de cas d'utilisation
<img width="1340" height="880" alt="Cas d&#39;utilisation système complet" src="https://github.com/user-attachments/assets/9ec84161-0b9d-4596-bd1b-a73684a0c23e" />

## Schéma initial de la base de données

<img width="1055" height="571" alt="Capture d’écran 2026-03-04 131034" src="https://github.com/user-attachments/assets/7406d3ab-0c82-4206-9e6a-ec183aabbf60" />


## Liste d’user stories

[1. En tant qu'ami d'un groupe, je veux créer un objectif d'épargne commun afin de financer un cadeau collectif (ex: bracelet en or) sans porter le coût seul.](https://github.com/PKatETS/Projet_BudgETS/issues/1#issue-4008263319)
  
[2. En tant qu'utilisateur distrait, je veux recevoir une notification quotidienne pour entrer mes dépenses afin de garder une comptabilité rigoureuse sans effort.](https://github.com/PKatETS/Projet_BudgETS/issues/2#issue-4008264802)
   
[3. En tant qu'étudiant occupé, je veux scanner mes relevés de banque (ou factures) afin de convertir automatiquement mes dépenses en données manipulables sans saisie manuelle.](https://github.com/PKatETS/Projet_BudgETS/issues/3#issue-4008269229)
  
[4. En tant qu'étudiant ayant son permis, je veux définir un objectif d'épargne personnel afin de mettre de côté l'argent nécessaire pour l'achat de ma première voiture.](https://github.com/PKatETS/Projet_BudgETS/issues/4#issue-4008270263)
   
[5. En tant qu'abonné à des services (ex: téléphone, streaming), je veux identifier mes dépenses récurrentes vs variables afin de prévoir mon solde à la fin du mois.](https://github.com/PKatETS/Projet_BudgETS/issues/5#issue-4008275754)

[6. En tant qu'utilisatrice sans budget fixe, je veux créer des catégories (système d'enveloppes) afin de répartir ma paye et ne pas tout dépenser impulsivement.](https://github.com/PKatETS/Projet_BudgETS/issues/6#issue-4008276993)
   
[7. En tant que nouveau détenteur d'un compte bancaire, je veux accéder à une page d'éducation financière afin d'apprendre les bases de la gestion d'argent.](https://github.com/PKatETS/Projet_BudgETS/issues/7#issue-4008278836)
   
[8. En tant que travailleur, je veux recevoir des rappels pour ma déclaration d'impôts afin d'éviter les pénalités de retard.](https://github.com/PKatETS/Projet_BudgETS/issues/8#issue-4008282898)
   
[9. En tant qu'utilisateur qui fréquente beaucoup de commerces "cash-only", je veux saisir manuellement mes dépenses en liquide et gérer mes retraits afin que mon solde d'application soit toujours juste.](https://github.com/PKatETS/Projet_BudgETS/issues/9#issue-4008286153)
    
[10. En tant qu'utilisateur voulant quitter et supprimer l'application, l'administrateur veut pouvoir supprimer son compte et ses données personnelles.](https://github.com/PKatETS/Projet_BudgETS/issues/10#issue-4008292373)

[11. En tant qu'utilisateur voulant s'inscrire à l'application, je veux me créer un compte pour gérer mieux mon argent.](https://github.com/BudgetsOrg/Projet_BudgETS/issues/11#issue-4045837502)

[12. En tant qu'utilisateur voulant accéder à mon compte, je veux me connecter à mon compte.](https://github.com/BudgetsOrg/Projet_BudgETS/issues/12#issue-4045838721) 

### Liste de requis technologiques
Ajoutez les requis technologiques avec les liens vers les Issues de votre projet.

NestJS : Gestion des routes de l'API (Ajouter, Supprimer, Lister).
- Pour structurer le backend de façon modulaire et assurer une validation robuste des données entrantes.

TypeORM : Communication entre l'API et la base de données.
- Permet de manipuler la base de données MySQL en TypeScript. On évite d'écrire du SQL brut, ce qui réduit les erreurs et facilite la maintenance.

MySQL : Stockage persistant des données.
- Pour gérer les **relations** complexes (ex: une dépense est liée à une ou plusieurs catégories) grâce à son système relationnel robuste.

Framework REACT : Création de l'interface utilisateur (UI)
- **Composants Fonctionnels & Hooks (useState, useEffect) :**
Pour créer une interface **dynamique**. Les Hooks permettent de mettre à jour l'affichage instantanément (ex: rafraîchir le solde après une dépense) sans recharger toute la page.

Tailwind CSS : style visuel de l’application web 
- Pour le design "Mobile-First" et le stylage rapide. Cela permet de créer une application esthétique, moderne et adaptée aux téléphones intelligents grâce à des classes utilitaires intégrées directement dans le code React. 

### Liste de requis non fonctionnels
Ajoutez les requis non fonctionnels avec les liens vers les Issues de votre projet.

Sécurité et Confidentialité : 
- L'application doit garantir la protection des données financières en hachant les mots de passe

Rapidité et Look : 
- Le site doit s'afficher relativement vite et rester facile à utiliser grâce à un design simple qui s'adapte à tous les écrans.

Clarté : 
- L'interface doit être super simple pour qu'un nouvel utilisateur comprenne tout de suite comment ajouter son argent sans avoir besoin d'un manuel.

Entretien du code : 
- Le code doit être bien organisé et clair pour qu'on puisse facilement corriger des bugs ou ajouter des nouvelles options plus tard.
