export default function PopUpHistoriqueBudget({
  showPopup,
  closePopup,
}: {
  showPopup: boolean;
  closePopup: () => void;
}) {
  const handleClose = () => {
    closePopup();
  };

  const handleSubmit = async () => {};

  if (!showPopup) return null;

  return (
    <div className="fixed top-15 h-100 w-100 right-40 z-50 bg-white bg-opacity-2 flex-col items-center justify-center rounded-lg shadow-lg">
      <div className="w-full bg-[var(--color-primary)] px-6 py-4 rounded-lg text-center">
        <h4 className="font-bold text-lg p-4 text-align-center text-white">
          Fonctionnalité à venir!
        </h4>
      </div>
      <div className="flex flex-row justify-between gap-2 items-center mt-6">
        <button
          className="delete-button py-2 px-4 rounded-lg"
          onClick={handleClose}
        >
          Annuler
        </button>
        <button
          className="confirm-button py-2 px-4 rounded-lg"
          onClick={handleSubmit}
        >
          Changer
        </button>
      </div>
    </div>
  );
}
