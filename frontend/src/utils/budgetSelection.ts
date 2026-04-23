const STORAGE_KEY = "budgets:selectedBudgetId";

export function getSelectedBudgetId(): number | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function setSelectedBudgetId(id: number | undefined | null) {
  if (id == null) return;
  if (!Number.isFinite(id)) return;
  localStorage.setItem(STORAGE_KEY, String(id));
}

export function clearSelectedBudgetId() {
  localStorage.removeItem(STORAGE_KEY);
}
