import axios from "axios";
import "../style/Dashboard.css";
import { useEffect, useState } from "react";
import { getErrorFromBackend } from "./../utils";
import { useUser } from "../components/UserContext";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState([]);
  const [substitute, setSubstitute] = useState([]);
  const { state } = useUser();
  const { userInfo } = state;
  const token = userInfo.token;

  useEffect(() => {
    const listUser = async () => {
      const response = await axios.get("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      try {
        setUsers(response.data);
      } catch (error) {
        console.error(getErrorFromBackend(error));
      }
    };
    listUser();
  }, [token]);

  useEffect(() => {
    const products = users.map((user) => user.products);
    const searchIds = [];
    const substituteIds = [];
    // const searchsearch = Object.assign({}, searchIds);
    console.log(searchIds);
    console.log(substituteIds);

    for (let i = 0; i < products.length; i++) {
      if (products[i] !== undefined) {
        Object.keys(products[i]).forEach((key) => {
          searchIds.push(key);
          substituteIds.push(products[i][key]);
        });
      }
    }

    const searchf = searchIds.forEach((idsearch) => {
      const listSearch = async () => {
        try {
          const response = await axios.get(
            `https://world.openfoodfacts.net/api/v2/product/${idsearch}`
          );
          console.log(response.data);
          setSearch((values) => ({ ...values, [search]: response.data }));
        } catch (error) {
          console.error(getErrorFromBackend(error));
        }
      };
      listSearch();
    });
  }, []);
  console.log(search);

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
            <tr key={user.id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.firstname}</td>
              <td>{user.mail}</td>
              <td>{user.is_admin === 1 ? "Admin" : "User"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Produits</h2>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nom</th>
            <th>Catégories</th>
            <th>Email</th>
            <th>Magazins</th>
          </tr>
        </thead>
        <tbody>
          {search.forEach((s) => {
            <tr key={s._id}>
              <td>{s._id}</td>
              <td>{s.product_name_fr}</td>
              <td>{s.categories}</td>
              <td>{s.mail}</td>
              <td>{s.stores}</td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}
