import axios from "axios";
import "../style/Dashboard.css";
import React, { useEffect, useState } from "react";
import { useUser } from "../components/UserContext";
import BarChart from "../components/BarChart";
import Modal from "react-modal";
import "../style/profile.css";

Modal.setAppElement("#root");

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [usersProducts, setUsersProducts] = useState([]);
  const [search, setSearch] = useState([]);
  const [substitute, setSubstitute] = useState([]);
  const { state } = useUser();
  const { userInfo } = state;
  const token = userInfo.token;
  const [modalProductIsOpen, setProductIsOpen] = React.useState(false);
  const [modalSubstituteIsOpen, setSubstituteIsOpen] = React.useState(false);

  function openModalProduct() {
    setProductIsOpen(true);
  }

  function closeProductModal() {
    setProductIsOpen(false);
  }

  function openModalSubstitute() {
    setSubstituteIsOpen(true);
  }

  function closeSubstituteModal() {
    setSubstituteIsOpen(false);
  }

  const customStyles = {
    content: {
      top: "55%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      width: "65%",
      height: "80%",
      marginTop: "5vh",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      overflow: "auto",
    },
  };

  useEffect(() => {
    const listUser = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        setUsersProducts(response.data.map((user) => user.products));
      } catch (error) {
        console.log(error);
      }
    };
    listUser();
  }, [token]);

  useEffect(() => {
    Object.entries(usersProducts).map(([key, substitut]) => {
      if (substitut === undefined) {
        return "";
      }
      Object.entries(substitut).map(async ([searchId, substitutId]) => {
        try {
          const searchResponse = await axios.get(
            `https://world.openfoodfacts.net/api/v2/product/${searchId}`
          );
          setSearch((values) => ({
            ...values,
            [searchId]: searchResponse.data.product,
          }));
          const substitutResponse = await axios.get(
            `https://world.openfoodfacts.net/api/v2/product/${substitutId}`
          );
          setSubstitute((values) => ({
            ...values,
            [substitutId]: substitutResponse.data.product,
          }));
        } catch (error) {
          console.log(error);
        }
      });
      return "";
    });
  }, [usersProducts]);

  const nbsubstitut = [];
  const nbsearch = [];
  Object.keys(usersProducts).map((user) => {
    if (usersProducts[user] === undefined) {
      return "";
    }
    Object.keys(usersProducts[user]).map((product) => {
      const s = product;
      const id = usersProducts[user][product];
      if (nbsubstitut[id]) {
        nbsubstitut[id] += 1;
      } else {
        nbsubstitut[id] = 1;
      }
      if (nbsearch[s]) {
        nbsearch[s] += 1;
      } else {
        nbsearch[s] = 1;
      }
    });
  });

  return (
    <div>
      <h1 className="titleDashboard">Tableau de bord</h1>

      <h2>Utilisateurs</h2>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.firstname}</td>
              <td>{user.mail}</td>
              <td>{user.is_admin === 1 ? "Admin" : "User"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="modify-button" onClick={openModalProduct}>
        Voir les produits recherchés
      </button>
      <button className="modify-button" onClick={openModalSubstitute}>
        Voir les substituts
      </button>

      {/* <ChartPie plat={26} dessert={32} /> */}
      <Modal
        isOpen={modalProductIsOpen}
        onRequestClose={closeProductModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>Produits</h2>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Image</th>
              <th>Nom</th>
              <th>Catégories</th>
              <th>Nb d'apparitions</th>
              <th>Magazins</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(search).map((key) => (
              <tr key={key}>
                <td>{search[key].id}</td>
                <td>
                  <img
                    src={search[key].image_front_thumb_url}
                    alt={search[key].product_name_fr}
                  />
                </td>
                <td>{search[key].product_name_fr}</td>
                <td>{search[key].categories}</td>
                <td>{nbsearch[search[key].id]}</td>
                <td>{search[key].stores}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <BarChart
          nombre={nbsearch}
          produits={search}
          title={"Graphique des produits recherchés"}
        />
        <button className="modify-button" onClick={closeProductModal}>
          Fermer
        </button>
      </Modal>
      <Modal
        isOpen={modalSubstituteIsOpen}
        onRequestClose={closeSubstituteModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2>Substituts</h2>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Image</th>
              <th>Nom</th>
              <th>Catégories</th>
              <th>Nb d'apparitions</th>
              <th>Magazins</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(substitute).map((key) => (
              <tr key={key}>
                <td>{substitute[key].id}</td>
                <td>
                  <img
                    src={substitute[key].image_front_thumb_url}
                    alt={substitute[key].product_name_fr}
                  />
                </td>
                <td>{substitute[key].product_name_fr}</td>
                <td>{substitute[key].categories}</td>
                <td>{nbsubstitut[substitute[key].id]}</td>
                <td>{substitute[key].stores}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <BarChart
          nombre={nbsubstitut}
          produits={substitute}
          title={"Graphique des produits substituts"}
        />
        <button className="modify-button" onClick={closeSubstituteModal}>
          Fermer
        </button>
      </Modal>
    </div>
  );
}
