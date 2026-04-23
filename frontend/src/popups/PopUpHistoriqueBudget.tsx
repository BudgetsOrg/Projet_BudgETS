// source pour le calendar: https://mui.com/x/react-date-pickers/date-picker/ order of years
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { getBudgetHistorique, getLastBudget } from "../api/BudgetApi";
import type { Budget } from "../interfaces";
import {
  clearSelectedBudgetId,
  setSelectedBudgetId,
} from "../utils/budgetSelection";

function monthKeyFromBudgetDateCreation(date_creation: unknown): string | null {
  if (typeof date_creation === "string") {
    // Common backend format: YYYY-MM-DD (timezone-safe by slicing)
    if (/^\d{4}-\d{2}/.test(date_creation)) return date_creation.slice(0, 7);
    const parsed = new Date(date_creation);
    if (!Number.isNaN(parsed.getTime())) {
      const y = parsed.getUTCFullYear();
      const m = String(parsed.getUTCMonth() + 1).padStart(2, "0");
      return `${y}-${m}`;
    }
    return null;
  }

  if (date_creation instanceof Date) {
    if (Number.isNaN(date_creation.getTime())) return null;
    const y = date_creation.getUTCFullYear();
    const m = String(date_creation.getUTCMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }

  const parsed = new Date(date_creation as any);
  if (Number.isNaN(parsed.getTime())) return null;
  const y = parsed.getUTCFullYear();
  const m = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthKeyFromPickerValue(value: any): string | null {
  try {
    const y = dayjs(value).year();
    const m = dayjs(value).month() + 1;
    if (!Number.isFinite(y) || !Number.isFinite(m)) return null;
    return `${y}-${String(m).padStart(2, "0")}`;
  } catch {
    return null;
  }
}

export default function PopUpHistoriqueBudget({
  showPopup,
  closePopup,
}: {
  showPopup: boolean;
  closePopup: () => void;
}) {
  const [selectedDate, setSelectedDate] = useState<any | null>(null);
  const [availableMonthKeys, setAvailableMonthKeys] =
    useState<Set<string> | null>(null);

  useEffect(() => {
    if (!showPopup) return;

    let cancelled = false;

    (async () => {
      try {
        const [historiqueRaw, lastRaw] = await Promise.all([
          getBudgetHistorique(),
          getLastBudget(),
        ]);

        const historique = (historiqueRaw ?? []) as Budget[];
        const lastBudget = (
          Array.isArray(lastRaw) ? lastRaw[0] : lastRaw
        ) as Budget | null;

        const keys = new Set<string>();

        if (Array.isArray(historique)) {
          for (const b of historique) {
            const key = monthKeyFromBudgetDateCreation(b?.date_creation);
            if (!key) continue;
            keys.add(key);
          }
        }

        // Ensure the latest/current budget month is selectable even if historique omits it.
        if (lastBudget?.date_creation) {
          const key = monthKeyFromBudgetDateCreation(lastBudget.date_creation);
          if (key) keys.add(key);
        }

        if (!cancelled) setAvailableMonthKeys(keys);
      } catch (e) {
        console.log("Erreur lors du chargement des mois disponibles:", e);
        if (!cancelled) setAvailableMonthKeys(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [showPopup]);

  const availableYearKeys = useMemo(() => {
    if (!availableMonthKeys) return null;
    const years = new Set<string>();
    for (const monthKey of availableMonthKeys) {
      years.add(monthKey.split("-")[0]);
    }
    return years;
  }, [availableMonthKeys]);

  const shouldDisableMonth = useMemo(() => {
    if (!availableMonthKeys) return undefined;
    return (value: any) => {
      const key = monthKeyFromPickerValue(value);
      if (!key) return false;
      return !availableMonthKeys.has(key);
    };
  }, [availableMonthKeys]);

  const shouldDisableYear = useMemo(() => {
    if (!availableYearKeys) return undefined;
    return (value: any) => {
      const key = monthKeyFromPickerValue(value);
      if (!key) return false;
      return !availableYearKeys.has(key.split("-")[0]);
    };
  }, [availableYearKeys]);

  const handleClose = () => {
    closePopup();
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      handleClose();
      return;
    }

    try {
      const historique = (await getBudgetHistorique()) as Budget[];
      const selectedKey = monthKeyFromPickerValue(selectedDate);
      if (!selectedKey) {
        handleClose();
        return;
      }

      const now = dayjs();
      const nowKey = monthKeyFromPickerValue(now);
      const budgetChoisi = nowKey ? selectedKey === nowKey : false;

      // Always allow switching back to the latest/current budget.
      // We do it by clearing the persisted selection so the page reloads using getLastBudget().
      if (budgetChoisi) {
        clearSelectedBudgetId();
        window.dispatchEvent(new Event("selectedBudgetChanged"));
        return;
      }

      // retourne le budget du mois sélectionné, si existe, sinon null
      const match = Array.isArray(historique)
        ? historique
            .filter((b) => b?.id_budget)
            .sort((a, b) => {
              const da = new Date(a?.date_creation ?? 0).getTime();
              const db = new Date(b?.date_creation ?? 0).getTime();
              return db - da;
            })
            .find((b) => {
              const key = monthKeyFromBudgetDateCreation(b?.date_creation);
              return key === selectedKey;
            })
        : null;

      if (match?.id_budget) {
        // on donne le id du budget trouvé au localStorage
        setSelectedBudgetId(match.id_budget);
        // crée un event pour dire que le budget sélectionné a changé, les composants à l'écoute de cet event vont se reload avec le nouveau budget
        window.dispatchEvent(new Event("selectedBudgetChanged"));
      } else {
        console.log("Aucun budget trouvé pour le mois sélectionné");
      }
    } catch (e) {
      console.log("Erreur lors du chargement de l'historique:", e);
    } finally {
      handleClose();
    }
  };

  const currentYear = dayjs();
  if (!showPopup) return null;

  return (
    <div className="fixed top-15 h-70 w-100 right-40 z-50 bg-white bg-opacity-2 flex-col items-center justify-center rounded-lg shadow-lg">
      <div className="w-full bg-[var(--color-primary)] px-6 py-4 rounded-lg text-center">
        <h4 className="font-bold text-lg p-4 text-align-center text-white">
          Choisissez un mois
        </h4>
      </div>
      <div className="flex flex-col gap-4 py-10">
        <div className="self-center">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Sélection mois/année"
              maxDate={currentYear}
              openTo="year"
              views={["year", "month"]}
              yearsOrder="desc"
              sx={{ minWidth: 250 }}
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              shouldDisableMonth={shouldDisableMonth as any}
              shouldDisableYear={shouldDisableYear as any}
            />
          </LocalizationProvider>
        </div>
        <div className="flex flex-row justify-center gap-6">
          <button
            className="delete-button py-2 px-4 rounded-lg m"
            onClick={handleClose}
          >
            Annuler
          </button>
          <button
            className="confirm-button py-2 px-4 rounded-lg"
            onClick={handleSubmit}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
