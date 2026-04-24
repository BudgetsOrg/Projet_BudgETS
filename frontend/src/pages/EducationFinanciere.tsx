import SectionEducation from "../components/SectionEducation.tsx";
import ellipse16 from "../img/Ellipse16.png";
import ellipse17 from "../img/Ellipse17.png";
import plante from "../img/planteEduc.png";


//Cette page est seulement quelque conseil pour l'utilisateur afin qu'il sache comment gérer son argent.
export default function EducationFinanciere() {
  return (
    <div className="space-y-12 bg-gradient-to-br from-[#FDF7EB] to-white space-x-4 p-8">
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-heading md:text-5xl lg:text-6xl">
        Éducation Financière
      </h1>
      <SectionEducation
        title="Le budget par enveloppes"
        description="
        Le budget par enveloppes, c'est une méthode simple mais efficace pour gérer votre argent.
L'idée, c'est de répartir votre revenu mensuel dans différentes enveloppes selon vos priorités.
Chaque enveloppe représente une catégorie de dépenses : épicerie, loyer, loisirs, et ainsi de suite.
Une fois qu'une enveloppe est vide, vous arrêtez de dépenser dans cette catégorie pour le reste du mois.
Ça vous empêche de piger dans votre coussin financier sans vous en rendre compte.
BudgETS rend cette méthode accessible à tout le monde, sans besoin d'être expert en finances."
        image={ellipse16}
        orientation="left"
        theme="light"
      />
      <SectionEducation
        title="La règle du 50/30/20"
        description="La règle du 50/30/20 est un bon point de départ pour bâtir un budget mensuel équilibré, et elle est reconnue dans l'industrie pour ses effets positifs sur les habitudes financières au quotidien.
Dans le cadre de cette règle, vous allouez 50% de votre revenu net à vos besoins essentiels : loyer, épicerie, transport, etc.
30% va à vos envies : sorties, restaurants, abonnements, magasinage, etc.
Les 20% restants sont mis de côté en épargne, pour rembourser vos dettes, ou pour alimenter vos objectifs financiers, comme ceux que vous pouvez créer directement dans BudgETS.
Cette règle n'est pas parfaite pour tout le monde, mais elle offre une base solide.
Utilisez-la comme guide pour remplir vos enveloppes et objectifs dans BudgETS, et ajustez-la selon votre réalité financière."
        image={ellipse17}
        orientation="right"
        theme="light"
      />
      <div className="bg-[var(--color-primary)] p-4 rounded-lg">
        <SectionEducation
          title="L'épargne régulière"
          description="Mettre de l'argent de côté régulièrement, même en petits montants, fait une vraie différence à long terme.
Grâce aux intérêts composés, vos économies grossissent sur elles-mêmes avec le temps.
Par exemple, épargner 50$ par semaine pendant 10 ans, avec un rendement de 5%, ce qu'est en dessous de la moyenne du marché, vous donnerait environ 320000$. Pourtant, vous n'auriez mis que 26000$ de votre poche : c'est plus de 6000$ générés sans effort supplémentaire.
Le secret, c'est la constance : commencer tôt et maintenir l'habitude, peu importe le montant.
Vos objectifs dans BudgETS vous aident à voir votre progression en temps réel.
Chaque épargne vous rapproche de votre liberté financière, un dépôt à la fois."
          image={plante}
          orientation="right"
          theme="dark"
        />
      </div>
    </div>
  );
}
