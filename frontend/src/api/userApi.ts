import type { User } from "../interfaces/interfaces";

const API_URL = "http://localhost:3000";

// because we are in testing phase
const debug = true;
let loggedInUser: User | null = null;

//TODO : Change with the actual login information, used as a placeholder for the profile page;
export async function login(username: string, password: string) {
  if (debug) {
    const mockUser: User = {
      id_user: 1,
      nom: "Doe",
      prenom: "John",
      adresse_email: "john.doe@example.com",
      telephone: "1234567890",
      image: "https://thispersondoesnotexist.com/",
      date_naissance: new Date("1990-01-01"),
    };
    loggedInUser = mockUser;
    return mockUser;
  } else {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      throw new Error("Erreur lors du login");
    }
    const user = await response.json();
    loggedInUser = user;
    return user;
  }
}

//TODO : Change with the actual login information, used as a placeholder for the profile page;
export function getLoggedInUser() {
  if (debug) {
    login("john.doe", "password"); // This will set the loggedInUser variable to the mock user, which is fine for now as we are just testing the profile page with a mock user. We should handle this more gracefully in a real application.
  }
  if (!loggedInUser) {
    //We should probably send the user back to the login page instead of throwing an error
    throw new Error("No user is currently logged in");
  }
  return loggedInUser;
}
