import { useEffect, useRef } from "react";

export const getErrorFromBackend = (error) => {
  return error.response && error.response.data.error
    ? error.response.data.error
    : error.message;
};
// Récupération des données de l'utilisateur connecté via le localStorage
export const userInfo = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
