// Récupération des données de l'utilisateur connecté via le localStorage
export const userInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;
