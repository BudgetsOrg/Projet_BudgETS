const API_URL_GLOBAL = "https://projetbudgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTc3NTE1MjI1MywiZXhwIjoxNzc1MjM4NjUzfQ.YzE3xvT7r97x26eUGf-vVMVKKshvVTEMTy1JBj9odcY";
//localStorage.getItem("token");
const debug = false;
// choose one
const local = false;

export async function getBudget() {
  if (debug) {
    const mockBudget1 = {
      id_budget: 1,
      solde: 5000,
      soldeDuMois: 5000,
      date_creation: new Date("2026-04-01"),
      user_id: 1,
    };
    const mockBudget2 = {
      id_budget: 2,
      solde: 2000,
      soldeDuMois: 2000,
      date_creation: new Date("2026-02-01"),
      user_id: 1,
    };
    return [mockBudget1, mockBudget2];
  } else {
    if (local) {
      const response = await fetch(`${API_URL_LOCAL}/budget/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    } else {
      const response = await fetch(`${API_URL_GLOBAL}/budget/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    }
  }
}
