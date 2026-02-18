import api from "./client";

// Adjust these paths only if your backend URLs are different.
export const registerUser = (payload) => api.post("/accounts/register/", payload);
export const loginUser = (payload) => api.post("/auth/login/", payload);

export const getMatchStreams = (team1, team2) => {
  const t1 = (team1 || "").trim();
  const t2 = (team2 || "").trim();

  if (!t1 || !t2) {
    // avoid bad request before user selects teams
    return Promise.resolve({ data: [] });
  }

  return api.get("/cricket/streams/match_streams/", {
    params: { team1: t1, team2: t2 },
  });
};