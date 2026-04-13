interface SectionEducationProps {
  title: string;
  description: string;
  image: string;
  orientation: "left" | "right";
  theme: "dark" | "light";
}

export default function SectionEducation({
  title,
  description,
  image,
  orientation,
  theme,
}: SectionEducationProps) {
  const isDark = theme === "dark";

  return (
    <div
      className={`flex ${orientation === "left" ? "flex-row" : "flex-row-reverse"} justify-between gap-4`}
    >
      <div className="flex flex-col">
        <h2
          // if dark theme else
          className={`${
            isDark
              ? "text-[var(--color-secondary)]"
              : "text-[var(--color-primary)]"
          } text-4xl font-bold p-4`}
        >
          {title}
        </h2>
        <p
          className={`${
            isDark ? "text-gray-300" : "text-gray-500"
          } text-lg p-4`}
        >
          {description}
        </p>
      </div>
      <img src={image} alt={title} className="rounded-full h-80 w-80" />
    </div>
  );
}
