import { useState } from "react";
import "../style/accountmodal.css";
import { toast } from "react-toastify";
import { getErrorFromBackend } from "../utils";
import axios from "axios";
import { useUser } from "./UserContext";

export default function AccountModal({ data, closeModal }) {
  const { dispatch } = useUser();
  const [userData, setUserData] = useState(data);

  const inputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserData((values) => ({ ...values, [name]: value }));
  }

  const confirmModifyAccount = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.patch(
        `http://localhost:8000/api/user/update/${userData._id}`,
        userData,
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );
      dispatch({ type: "USER_SIGNIN", payload: data.data });
      localStorage.setItem("userInfo", JSON.stringify(data.data));
      closeModal();
    } catch (error) {
      toast.error(getErrorFromBackend(error));
    }
  };

  return (
    <form className="modify-account-form" onSubmit={confirmModifyAccount}>
      <input
        type="text"
        name="username"
        placeholder="Pseudo"
        value={userData.username}
        onChange={inputChange}
        required
      />
      <input
        type="text"
        name="firstname"
        placeholder="Prénom"
        value={userData.firstname}
        onChange={inputChange}
        required
      />
      <input
        type="text"
        name="name"
        placeholder="Nom de famille"
        value={userData.name}
        onChange={inputChange}
        required
      />
      <input
        type="text"
        name="mail"
        placeholder="Adresse e-mail"
        value={userData.mail}
        onChange={inputChange}
        required
      />
      <input
        type="text"
        name="password"
        placeholder="Mot de passe"
        value={userData.password}
        onChange={inputChange}
      />
      <button className="confirm-button">Confirmer</button>
      <button className="cancel-button" type="button" onClick={closeModal}>Annuler</button>
    </form>
  );
};
