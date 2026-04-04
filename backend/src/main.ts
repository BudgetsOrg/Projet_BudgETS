import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

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
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
