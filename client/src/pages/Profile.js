import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/profile.css";
import Modal from "react-modal";
import AccountModal from "../components/AccountModal";
import { useUser } from "../components/UserContext";
import { toast } from "react-toastify";
import { getErrorFromBackend } from "../utils";
import Card from '../components/Card';

Modal.setAppElement("#root");

export default function Profile() {
  const navigate = useNavigate();
  const { state, dispatch } = useUser();
  const { userInfo } = state;
  const [allergens, setAllergens] = useState([]);
  const [textAllergen, setTextAllergen] = useState('');
  const [substituts, setSubstituts] = useState({});
  const [productsData, setProductsData] = useState({});
  const [modalAccountIsOpen, setModalAccountIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios.get('https://world.openfoodfacts.org/data/taxonomies/allergens.json');
        const finalData = { ...response.data };
        if (finalData['en:none']) {
          delete finalData['en:none'];
        }
        setAllergens(finalData);
      } catch (error) {
        toast.error(getErrorFromBackend(error));
      }
    };

    fetchData();
  }, []);

  const handleSelectChange = async (e) => {
    e.preventDefault();
    if (!userInfo.allergen.includes(textAllergen)) {
      try {
        const data = await axios.patch(
          `http://localhost:8000/api/user/update/${userInfo._id}`,
          { allergen: [...userInfo.allergen, textAllergen] },
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "USER_SIGNIN", payload: data.data });
        localStorage.setItem("userInfo", JSON.stringify(data.data));
      } catch (error) {
        toast.error(getErrorFromBackend(error));
      }
    } else {
      toast.error('Cet allergène est déjà enregistré')
    }
  };

  const handleDeleteAllergen = async (allergenDel) => {
    try {
      const filteredAllergen = userInfo.allergen.filter(allergen => allergenDel !== allergen);
      const data = await axios.patch(
        `http://localhost:8000/api/user/update/${userInfo._id}`,
        { allergen: filteredAllergen },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "USER_SIGNIN", payload: data.data });
      localStorage.setItem("userInfo", JSON.stringify(data.data));
    } catch (error) {
      toast.error(getErrorFromBackend(error));
    }
  };

  useEffect(() => {
    const fetchSubstituteData = async () => {
      try {
        const substituts = await axios.get(`http://localhost:8000/api/substitute/${userInfo._id}`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        setSubstituts(substituts.data);
        Object.entries(substituts.data).map(async ([key, substitut]) => {
          try {
            const initialProduct = await axios.get(`https://world.openfoodfacts.net/api/v2/product/${key}?fields=code,product_name_fr,stores,selected_images,link,categories_tags,brands_tags&sort_by=product_name`);
            setProductsData((values) => ({ ...values, [key]: initialProduct.data.product }));
            const substitutProduct = await axios.get(`https://world.openfoodfacts.net/api/v2/product/${substitut}?fields=code,product_name_fr,stores,selected_images,link,categories_tags,brands_tags&sort_by=product_name`);
            setProductsData((values) => ({ ...values, [substitut]: substitutProduct.data.product }));
          } catch (error) {
            toast.error(getErrorFromBackend(error));
          }
          return "";
        })
      } catch (error) {
        toast.error(getErrorFromBackend(error));
      }
    };
    fetchSubstituteData();
  }, [userInfo]);

  const openModalAccount = () => {
    setModalAccountIsOpen(true);
  };

  const closeModalAccount = () => {
    setModalAccountIsOpen(false);
  };

  const deleteAccount = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/user/delete/${userInfo._id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        }
      });

      dispatch({ type: "USER_SIGN_OUT" });
      localStorage.removeItem("userInfo");
      navigate("/");
    } catch (error) {
      toast.error(getErrorFromBackend(error));
    }
  };

  const modifySubstitute = async (e) => {
    e.preventDefault();
    const value = e.target.value;
    navigate('/', { state: { code: value } });
  };

  const deleteSubstitute = async (e) => {
    e.preventDefault();
    const value = e.target.value;
    try {
      const data = await axios.patch(`http://localhost:8000/api/substitute/delete`, {
        userId: userInfo._id,
        productId: value
      }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      dispatch({ type: "USER_SIGNIN", payload: data.data });
      localStorage.setItem("userInfo", JSON.stringify(data.data));
    } catch (error) {
      toast.error(getErrorFromBackend(error));
    }
  };

  return (
    <div className="account-body">
      <div className="profile-header">
        <div className="profile-img">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            style={{ width: "200" }}
            alt=""
          />
        </div>
        <div className="profile-nav-info">
          <h3 className="user-name">{userInfo.username}</h3>
          <div className="address">
            <p id="state" className="state">
              {userInfo.firstname}
            </p>
            <span id="country" className="country">
              {userInfo.name}
            </span>
          </div>
          <div className="address">
            <span id="country" className="country">
              <i className="ri-mail-line"></i> {userInfo.mail}
            </span>
          </div>
        </div>
        <div className="profile-nav-button">
          <button className="modify-button" onClick={openModalAccount}>
            Modifier le compte
          </button>
          <button className="delete-button" onClick={deleteAccount}>
            Supprimer le compte
          </button>
        </div>
      </div>

      <div className="main-bd">
        <div className="right-side">
          <div className="nave">
            <ul>
              <li className="user-review active">Configurer vos alergies</li>
            </ul>
          </div>
          <div className="profile-body">
            <div className="profile-reviews tab container">
              <form onSubmit={handleSelectChange}>
                <select onChange={(e) => setTextAllergen(e.target.value)}>
                  <option value=''>Choisissez votre allergène</option>
                  {Object.keys(allergens).map(key => (
                    <option key={key} value={key}>{allergens[key]?.name?.fr}</option>
                  ))}
                </select>
                <input type='submit' />
              </form>
              {
                userInfo?.allergen?.map((allergen) => (
                  allergens[allergen] ?
                    <p>{allergens[allergen].name.fr} <button onClick={() => handleDeleteAllergen(allergen)}>Delete</button></p>
                    : null
                ))
              }
            </div>
          </div>
          <div className="nave">
            <ul>
              <li className="user-review active">Listes de vos substituts</li>
            </ul>
          </div>
          <div className="profile-body">
            <div className="profile-reviews tab container">
              {Object.entries(substituts).map(([key, substitut]) => (
                <div key={key} className="grid">
                  <Card data={productsData[key]} type="initial" />
                  <div className="subtitut-nav-button">
                    <button className="modify-button" value={key} onClick={modifySubstitute}>
                      Modifier le substitut
                    </button>
                    <button className="delete-button" value={key} onClick={deleteSubstitute}>
                      Supprimer le substitut
                    </button>
                  </div>
                  <Card data={productsData[substitut]} type="substitute" />
                </div>
              ))}
              <Modal
                style={{
                  overlay: {
                    zIndex: 101,
                  },
                }}
                isOpen={modalAccountIsOpen}
                onRequestClose={closeModalAccount}
                contentLabel="Modification de votre compte"
              >
                <AccountModal data={userInfo} closeModal={closeModalAccount} />
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
