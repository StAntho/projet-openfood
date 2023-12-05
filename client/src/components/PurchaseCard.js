import { useEffect, useState } from "react";
import axios from "axios";
import "../style/purchasecard.css";
import { useNavigate } from "react-router-dom";

export default function PurchaseCard({ data, closeModal }) {
  const navigate = useNavigate();
  const [tarifs, setTarifs] = useState([]);
  const [film, setFilm] = useState({});
  const [placeSelected, setPlaceSelected] = useState(0);
  const [globalPrice, setGlobalPrice] = useState(0);
  const [placeData, setPlaceData] = useState([]);


  useEffect(() => {
    if (data === null) {
      return;
    }

    const fetchTarifData = async () => {
      try {
        const tarifResponse = await axios.get("http://127.0.0.1:8000/prices");
        setTarifs(tarifResponse.data.filter(tarif => tarif.isSpecial === data.isSpecial));
      } catch (error) {
        console.error("Failed to fetch tarif data:", error);
      }
    }

    fetchTarifData();
    setFilm(data);
  }, [data]);

  useEffect(() => {
    tarifs.forEach(element => {
      setPlaceData((values) => ({ ...values, [element.id]: 0 }));
    });
  }, [tarifs])

  const addPlaces = (e) => {
    const targetTarif = e.target.id.slice(10);

    if (placeSelected === film.placesLeft) {
      return;
    }

    setPlaceData((values) => ({ ...values, [targetTarif]: placeData[targetTarif]++ }));
    setPlaceSelected(placeSelected + 1);

    tarifs.forEach(element => {
      if (element.id === parseInt(targetTarif)) {
        setGlobalPrice(globalPrice + element.price)
      }
    });
  };

  const minusPlaces = (e) => {
    const targetTarif = e.target.id.slice(12);

    if (placeSelected < 1 || placeData[targetTarif] < 1) {
      return;
    }

    setPlaceData((values) => ({ ...values, [targetTarif]: placeData[targetTarif]-- }));
    setPlaceSelected(placeSelected - 1);

    tarifs.forEach(element => {
      if (element.id === parseInt(targetTarif)) {
        setGlobalPrice(globalPrice - element.price)
      }
    });
  };

  const handleConfirm = (e) => {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    Object.entries(placeData).map(([key, value]) => {
      for (let index = 0; index < value; index++) {
        const purchase = {
          userId: userInfo.id,
          sessionId: film.id,
          priceId: key
        };

        axios.post('http://127.0.0.1:8000/purchases/', purchase, {
          headers: {
            Authorization: `token ${userInfo.token}`,
          },
        })
          .then(res => {
            const qrcode = {
              purchase_id: res.data.id,
              session_name: film.filmname,
              room_name: film.room_name,
              ticket_type: tarifs.filter(tarif => tarif.id === parseInt(key))[0].name,
              timestamp: new Date(res.data.timestamp).toLocaleString("fr-FR", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            }
            return axios.post('http://127.0.0.1:8000/qrcodeapp/generate_qr_code', qrcode);
          })
          .then(res => {
            navigate('/')
          });
      }
    })
  };

  return (
    <div className="purchase-card">
      <div className="purchase-card-header">
        <div className="first-line">
          <b className="title">{film.filmname}</b>
          <div className="session-details">
            {film.room_name} - {film.timestamp}
          </div>
        </div>

        <div className="second-line">
          <div className="nbPlaces">{placeSelected} Place{placeSelected > 1 ? "s" : ""}</div>
          <div className="total-prices">{globalPrice.toFixed(2)} €</div>
        </div>
      </div>

      <div className="purchase-card-body">
        {tarifs.map((tarif, index) => (
          <div key={tarif.id} className="line">
            <p>
              {tarif.name}
              <span className="tarif-price">
                {tarif.price.toFixed(2)} €
              </span>
            </p>
            <input type="button" className="place-minus" id={`minus_tarif_${tarif.id}`} value="−" onClick={minusPlaces} />
            <input type="number" className="place-nb vide" name={`tarif[${tarif.id}]`} id={`tarif_${tarif.id}`} value={placeData[tarif.id]} min="0" step="1" readOnly />
            <input type="button" className="place-add" id={`add_tarif_${tarif.id}`} value="+" onClick={addPlaces} />
          </div>
        ))}
      </div>

      <div className="purchase-card-button">
        <button className="close-button" onClick={closeModal}>Fermer</button>
        <button className="confirm-button" onClick={handleConfirm}>Confirmer</button>
      </div>
    </div>
  );
};
