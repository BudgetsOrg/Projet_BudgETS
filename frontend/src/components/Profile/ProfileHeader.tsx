export function ProfileHeader() {
  return (
    <header className="w-full py-16 px-6 text-white bg-gradient-to-r from-[var(--color-primary)] to-black">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
          Profil
        </h1>
        <p className="text-lg md:text-xl opacity-80 text-center">
          Vos informations personnelles
        </p>
      </div>
    </header>
  );
}
