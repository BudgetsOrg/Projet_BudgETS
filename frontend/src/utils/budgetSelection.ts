const STORAGE_KEY = "budgets:selectedBudgetId";

function coerceFiniteNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function getSelectedBudgetId(): number | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return coerceFiniteNumber(raw);
}

export function setSelectedBudgetId(
  id: number | string | undefined | null,
) {
  const parsed = coerceFiniteNumber(id);
  if (parsed == null) return;
  localStorage.setItem(STORAGE_KEY, String(parsed));
}

export function clearSelectedBudgetId() {
  localStorage.removeItem(STORAGE_KEY);
}
