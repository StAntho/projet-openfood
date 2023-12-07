import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import "../style/Home.css";
import Card from '../components/Card';
import { useUser } from "../components/UserContext";
import { toast } from "react-toastify";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useUser();
  const { userInfo } = state;
  const [selectCat, setSelectCat] = useState();
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [productsReplace, setProductsReplace] = useState([]);
  const [onLoad, setOnLoad] = useState(0);
  const [toReplace, setToReplace] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios.get(`https://world.openfoodfacts.net/api/v2/product/${location.state.code}?fields=categories_tags`);
        if (response?.data?.product?.categories_tags) {
          let string = "";
          for (let index = 0; index < response?.data?.product?.categories_tags.length; index++) {
            if (index > 2) {
              break;
            }
            string += response?.data?.product?.categories_tags[index].split(':')[1]
            if ((index + 1) !== response?.data?.product?.categories_tags.length && (index + 1) < 3) {
              string += ','
            }
          }
          setOnLoad(1);
          const productsData = await axios.get(`https://world.openfoodfacts.net/api/v2/search?countries_tags_en=France&origins_tags=france&purchase_places_tags=france&nutrition_grades_tags=a&categories_tags=${string}&fields=code,product_name_fr,selected_images,allergens_tags&page_size=100`);
          const filteredProducts = productsData.data.products.filter(product =>
            !product.allergens_tags.some(allergen => userInfo?.allergen?.includes(allergen))
          );
          if (filteredProducts.length === 0) {
            toast.error("Vous n'avons trouvé aucun substitut qui correspondent à vos filtres");
          }
          setOnLoad(0);
          setToReplace(location.state.code);
          setProductsReplace(filteredProducts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (location.state && location.state.code) {
      fetchData();
    }
  }, [location, userInfo]);

  const categories = {
    "Plant-based foods and beverages": "Aliments et boissons à base de végétaux",
    // "Plant-based foods": "Aliments d'origine végétale",
    "Snacks": "Snacks",
    "Sweet snacks": "Snacks sucrés",
    "Beverages": "Boissons",
    "Dairies": "Produits laitiers",
    "Cereals and potatoes": "Céréales et pommes de terre",
    "Meats and their products": "Viandes et leurs produits",
    "Fermented foods": "Aliments fermentés",
    "Fruits and vegetables based foods": "Aliments à base de fruits et légumes"
  };

  const handleCatChange = async (e) => {
    setSelectCat(e.target.value);
    setSearchText('');
    setProducts([]);
    setProductsReplace([]);
    if (e.target.value !== "") {
      try {
        setOnLoad(1);
        const productsData = await axios.get(`https://world.openfoodfacts.net/api/v2/search?categories_tags=${e.target.value}&countries_tags_en=France&origins_tags=france&purchase_places_tags=france&fields=code,product_name_fr,stores,selected_images,link,categories_tags,brands_tags&sort_by=product_name&page_size=100`);
        setOnLoad(0);
        const finalProducts = productsData.data.products.filter((product) => product.product_name_fr && product.product_name_fr !== "");
        setProducts(finalProducts)
      } catch (error) {
        setOnLoad(0);
        console.log(error);
      }
    } else {
      setProducts([]);
      setProductsReplace([]);
      setSearchText('')
    }
  }

  const handleSubstitute = async (code) => {
    if (userInfo) {
      try {
        let data = {
          userId: userInfo._id,
          productId: toReplace,
          substituteId: code.code
        }
        const response = await axios.patch('http://127.0.0.1:8000/api/substitute/set', data, { headers: { Authorization: `Bearer ${userInfo.token}` } });
        dispatch({ type: "USER_SIGNIN", payload: response.data });
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        setProducts([]);
        setProductsReplace([]);
        setSelectCat();
        setSearchText('');
        toast.success('Votre substitut a bien été enregistré');
      } catch (error) {
        console.log(error);
      }
    } else {
      navigate('/inscription');
    }
  }

  const handleSearchChange = async (e) => {
    setProductsReplace([]);
    setProducts([]);
    const searchText = e.target.value;
    setSearchText(searchText);
    if (searchText.length > 0) {
      try {
        const response = await axios.get(`https://world.openfoodfacts.net/api/v2/search?code=${searchText}`);
        setProducts(response.data.products.filter((product) => product.code !== ""))
      } catch (error) {
        console.error(error);
      }
    } else {
      if (selectCat !== "") {
        try {
          setOnLoad(1);
          const productsData = await axios.get(`https://world.openfoodfacts.net/api/v2/search?categories_tags=${selectCat}&countries_tags_en=France&origins_tags=france&purchase_places_tags=france&fields=code,product_name_fr,stores,selected_images,link,categories_tags,brands_tags&sort_by=product_name&page_size=100`);
          setOnLoad(0);
          const finalProducts = productsData.data.products.filter((product) => product.product_name_fr && product.product_name_fr !== "");
          setProducts(finalProducts)
        } catch (error) {
          setOnLoad(0);
          console.log(error);
        }
      } else {
        setProducts([]);
        setProductsReplace([]);
        setSearchText('')
      }
    }
  };

  const handleToReplace = async (code) => {
    setProductsReplace([])
    let string = "";
    for (let index = 0; index < code.categories_tags.length; index++) {
      if (index > 2) {
        break;
      }
      string += code.categories_tags[index].split(':')[1]
      if ((index + 1) !== code.categories_tags.length && (index + 1) < 3) {
        string += ','
      }
    }

    try {
      setOnLoad(1);
      const productsData = await axios.get(`https://world.openfoodfacts.net/api/v2/search?countries_tags_en=France&origins_tags=france&purchase_places_tags=france&nutrition_grades_tags=a&categories_tags=${string}&fields=code,product_name_fr,selected_images,allergens_tags&page_size=100`);
      const filteredProducts = productsData.data.products.filter(product =>
        !product.allergens_tags.some(allergen => userInfo?.allergen?.includes(allergen))
      );
      if (filteredProducts.length === 0) {
        toast.error("Vous n'avons trouvé aucun substitut qui correspondent à vos filtres");
      }
      setOnLoad(0);
      setToReplace(code.code);
      setProductsReplace(filteredProducts);
    } catch (error) {
      setOnLoad(0);
      console.log(error);
    }
  }

  if (onLoad === 1) {
    return (
      <span className="homepage">
        <div className='section'>
          <div className="loader"></div>
        </div>
      </span>
    );
  }

  return (
    <span className="homepage">
      <div className='section'>
        <select value={selectCat} onChange={handleCatChange}>
          <option value="">-- Choisissez votre catégorie --</option>
          {Object.entries(categories).map(([key, value]) => (
            <option key={key} value={key}>{value}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Recherche par code barre..."
          value={searchText}
          onChange={handleSearchChange}
        />
        <div className="container" >
          {
            productsReplace.length > 0 ? (
              <>
                <h2>Produits similaires</h2>
                <button className='retour-btn' onClick={(e) => { setProductsReplace([]); setToReplace(null) }}>Retour à la liste des catégories</button>
                <div className='grid'>
                  {productsReplace.map((product, index) => (
                    product?.selected_images?.front?.display?.fr ?
                      <Card key={index} data={product} handleChange={handleSubstitute} type={0} /> : null
                  ))}
                </div>
              </>
            ) : products.length > 0 ? (
              <>
                <h2>Produits de la catégorie</h2>
                <div className='grid'>
                  {products.map((product, index) => (
                    product?.selected_images?.front?.display?.fr ?
                      <Card key={index} data={product} handleChange={handleToReplace} type={1} /> : null
                  ))}
                </div>
              </>
            ) : (
              <p>Aucun produit trouvé.</p>
            )
          }
        </div>
      </div>
    </span>
  )
};
