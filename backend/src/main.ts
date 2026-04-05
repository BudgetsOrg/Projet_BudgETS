import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Ajoute des en-têtes de sécurité pour protéger l'application contre certaines vulnérabilités web courantes
  app.use(helmet());

  // CORS configuration pour autoriser les requêtes depuis le frontend en ligne et en local et bloquer les autres origines.
  app.enableCors({
    origin: [
        'http://localhost:5173',
        'https://budgets.up.railway.app',
    ],
});
  // Utilise le ValidationPipe global pour valider les données entrantes et transformer les données en objets DTO 
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Configuration de Swagger pour la documentation de l'API -- Titre -- Légendes -- Structure + Construit le document Swagger et le met sur l'endpoint /api
  const config = new DocumentBuilder()
    .setTitle('BudgETS API')
    .setDescription(`
# API pour la gestion de BudgETS
Vous pouvez testé les endpoints de l'API depuis cette interface Swagger. \n
---

## Légende des endpoints
- **POST**    - Créer un nouveau objet
- **GET**     - Récupérer des objets
- **PATCH**   - Mettre à jour un objet existant
- **DELETE**  - Supprimer un objet

---

## Légende des codes de réponse
- **200,201** - Requête réussie ou action réussie
- **400**     - Données invalides (vérifier le body)
- **401**     - Non autorisé (token manquant ou expiré)
- **404**     - Ressource non trouvée ou n'appartient pas à l'utilisateur

---

## Schemas
La section schemas de Swagger fournit des exemples de corps de requête pour les endpoints POST et PATCH. \n
Utilisez ces exemples comme référence pour formater vos requêtes. \n
Les champs avec * sont obligatoires. Les champs sans * sont optionnels.\n 

---

## Authentification
Toutes les routes (sauf les routes Auth) nécessitent un token JWT. (Icone de cadenas dans Swagger) \n
Utiliser le bouton **Authorize** en haut à droite pour entrer le token.

---

## Structure de l'application
- **User**      → possède plusieurs **Budgets**
- **Budget**    → possède plusieurs **Enveloppes**
- **Enveloppe** → possède plusieurs **Dépenses**
- **User**      → possède plusieurs **Catégories**
- **User**      → possède plusieurs **Objectifs** (partageables)
- **Objectif**  → possède plusieurs **Économies**
    `)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Redirige la route racine du lien backend vers l'interface Swagger. 
  const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/', (req, res) => {
        res.redirect('/api');
  });
  
  // Démarre le serveur sur le port spécifié. Si Port est défini on load sur le service Railway sinon on load en local sur le port 3000
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
// Démarre l'application NestJS, configure et lance le serveur.
bootstrap();
