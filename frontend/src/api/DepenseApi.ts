const API_URL_GLOBAL = "https://projetbudgets-backend.up.railway.app";
const API_URL_LOCAL = "http://localhost:3000";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTc3NTE1MjI1MywiZXhwIjoxNzc1MjM4NjUzfQ.YzE3xvT7r97x26eUGf-vVMVKKshvVTEMTy1JBj9odcY";
//localStorage.getItem("token");
const debug = false;
// choose one
const local = false;

export async function getDepenses() {
  if (debug) {
    const mockDepense1 = {
      id: 1,
      titre: "Mock Depense 1",
      categorie: "Alimentation",
      prix: 10,
      date: "2026-03-29",
    };
    const mockDepense2 = {
      id: 2,
      titre: "Mock Depense 2",
      categorie: "Alimentation",
      prix: 20,
      date: "2026-03-26",
    };
    const mockDepense3 = {
      id: 2,
      titre: "Mock Depense 3",
      categorie: "Alimentation",
      prix: 20,
      date: "2026-03-26",
    };
    return [mockDepense1, mockDepense2, mockDepense3];
  } else {
    const response = await fetch(`${API_URL_GLOBAL}/depense`);
    if (!response.ok) {
      throw new Error("Erreur lors du fetch");
    }
    return response.json();
  }
}
