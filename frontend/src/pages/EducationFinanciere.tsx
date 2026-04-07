import SectionEducation from "../components/SectionEducation.tsx";
import ellipse16 from "../../public/img/Ellipse16.png";
import ellipse17 from "../../public/img/Ellipse17.png";
import plante from "../../public/img/planteEduc.png";
export default function EducationFinanciere() {
  return (
    <div className="space-y-12 bg-gradient-to-br from-[#FDF7EB] to-white space-x-4 p-8">
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-heading md:text-5xl lg:text-6xl">
        Éducation Financière
      </h1>
      <SectionEducation
        title="Titre 1"
        description="
        befcvbejkvnejbcekncjkncjkwbc jkwbc 
        jkebjkcebkcjbcjkbcjkbjkebc jkebcjkebcjkebcjk
        ebcjkebcjkebcjkebcjkebcjkebcjkebcjkebcjkebcjkebcjkebcj
        kebcjkebcjkebcjkebcjkebcjkebcjkebcjkebc"
        image={ellipse16}
        orientation="left"
        theme="light"
      />
      <SectionEducation
        title="Titre 2"
        description="ebfvuebvuebvjkebjvbejvbeobvoevbjkebf
        vjbebvebvukbekjvbeubvubrvjevnkv"
        image={ellipse17}
        orientation="right"
        theme="light"
      />
      <div className="bg-[var(--color-primary)] p-4 rounded-lg">
        <SectionEducation
          title="Titre 3"
          description="bcjkfbewjkcbwbvuoehnvinwvnkjbvubvobvjkbvurvuobrvjekvjkvbr
          oihio3hfhi3hnbnevkbeoivhioenejkbvejhviowhvnjkwvjkwbvjw"
          image={plante}
          orientation="right"
          theme="dark"
        />
      </div>
    </div>
  );
}
