import axios from "axios";
import "../style/Dashboard.css";
import { useEffect, useState } from "react";
import { getErrorFromBackend } from "./../utils";
import { useUser } from "../components/UserContext";
import { toast } from "react-toastify";
import ChartPie from "../components/ChartPie";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [usersProducts, setUsersProducts] = useState([]);
  const [search, setSearch] = useState([]);
  const [substitute, setSubstitute] = useState([]);
  const { state } = useUser();
  const { userInfo } = state;
  const token = userInfo.token;

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
        toast.error(getErrorFromBackend(error));
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
          toast.error(getErrorFromBackend(error));
        }
      });
      return "";
    });
  }, [usersProducts]);

  console.log(usersProducts);
  const nbsubstitut = [];
  const nbsearch = [];
  Object.keys(usersProducts).map((user) => {
    // console.log(user);
    if (usersProducts[user] === undefined) {
      return "";
    }
    Object.keys(usersProducts[user]).map((product) => {
      console.log(product);
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

  console.log(nbsearch);
  // console.log(search);
  // console.log(substitute);
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

      <ChartPie plat={26} dessert={32} />
    </div>
  );
}
