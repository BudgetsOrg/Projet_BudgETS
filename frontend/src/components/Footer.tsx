export default function Footer() {
  return (
    <footer className="bg-[#2F2F2F] text-white py-4 mt-10">
      <div className="container mx-auto text-center flex flex-row items-center justify-center">
        <h1 className="text-7xl font-extrabold text-left bg-clip-text text-transparent bg-gradient-to-b from-[var(--color-secondary)] to-[var(--color-primary)]">
          BUDGETS
        </h1>
        <div>
          <p className="text-sm font-bold">Nous contacter</p>
          <p className="text-sm mt-2 text-white">
            tel: xxx-xxx-xxxx Adresse : 123 rue de l'université, Québec, QC G1V
            0A6 Email : budgets.2026@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
}
