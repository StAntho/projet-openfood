import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import "../style/Home.css";

export default function Home() {
  const [selectCat, setSelectCat] = useState();
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [productsReplace, setProductsReplace] = useState([]);
  const [onLoad, setOnLoad] = useState(0);

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
        const productsData = await axios.get(`https://world.openfoodfacts.net/api/v2/search?categories_tags=${e.target.value}&countries_tags_en=France&origins_tags=france&purchase_places_tags=france&fields=code,product_name_fr,stores,selected_images,link,categories_tags,brands_tags&sort_by=product_name`);
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

  const handleSearchChange = async (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);
    if (searchText.length > 0) {
      try {
        const response = await axios.get(`https://world.openfoodfacts.net/api/v2/search?code=${searchText}`);
        setProducts(response.data.products)
      } catch (error) {
        console.error(error);
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
      const productsData = await axios.get(`https://world.openfoodfacts.net/api/v2/search?countries_tags_en=France&origins_tags=france&purchase_places_tags=france&nutrition_grades_tags=a&categories_tags=${string}&fields=product_name_fr,selected_images`);
      setOnLoad(0);
      setProductsReplace(productsData.data.products)
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
          placeholder="Recherche par nom..."
          value={searchText}
          onChange={handleSearchChange}
        />
        <section className="cards" >
          {
            productsReplace.length > 0 ? (
              <>
                <h2>Produits similaires</h2>
                <button className='retour-btn' onClick={(e) => { setProductsReplace([]); }}>Retour à la liste des catégories</button>
                <div className='grid'>
                  {productsReplace.map((product, index) => (
                    <article key={index} className="card">
                      <div className="card__info-hover">
                      </div>
                      <div className="card__img"></div>
                      <a href="#" className="card_link">
                        <div style={{
                          backgroundImage: `url('${product.selected_images?.front?.display?.fr}')`
                        }} className="card__img--hover"></div>
                      </a>
                      <div className="card__info">
                        <h3 className="card__title">{product.product_name_fr}</h3>
                        <button onClick={() => console.log('fonction substitut')}>Définir substitut</button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : products.length > 0 ? (
              <>
                <h2>Produits de la catégorie</h2>
                <div className='grid'>
                  {products.map((product, index) => (
                    <article key={index} className="card">
                      <div className="card__info-hover">
                      </div>
                      <div className="card__img"></div>
                      <a href="#" className="card_link">
                        <div style={{
                          backgroundImage: `url('${product.selected_images?.front?.display?.fr}')`
                        }} className="card__img--hover"></div>
                      </a>
                      <div className="card__info">
                        <h3 className="card__title">{product.product_name_fr}</h3>
                        <button onClick={() => handleToReplace(product)}>Voir similaires</button>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <p>Aucun produit trouvé.</p>
            )
          }
        </section>
      </div>
    </span>
  )
};
