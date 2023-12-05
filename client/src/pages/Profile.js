import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/profile.css";
import Modal from "react-modal";
import QRCodeModal from "../components/QRCodeModal";

Modal.setAppElement("#root");

export default function Profile({ setTest }) {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem("userInfo")));
  const [purchaseResume, setPurchaseResume] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  useEffect(() => {
    const fetchPurchasesData = async () => {
      const purchasesResponse = await axios.get(
        `http://127.0.0.1:8000/purchases/`
      );

      const purchases = purchasesResponse.data.filter(
        (purchase) => purchase.userId === parseInt(user.id)
      );

      const updatedSeances = await Promise.all(
        purchases.map(async (seance) => {
          const sessionsResponse = await axios.get(
            `http://127.0.0.1:8000/sessions/${seance.sessionId}`
          );
          const movieResponse = await axios.get(
            `http://127.0.0.1:8000/movies/${sessionsResponse.data.filmId}`
          );

          const pricesResponse = await axios.get(
            `http://127.0.0.1:8000/prices/${seance.priceId}`
          );

          const resume = {
            purchaseId: seance.id,
            date: seance.timestamp,
            movieName: movieResponse.data.name,
            price: pricesResponse.data.price,
            priceType: pricesResponse.data.name,
          };

          return {
            resume,
          };
        })
      );
      setPurchaseResume(updatedSeances);
    };
    fetchPurchasesData();
  }, [user.id]);

  const openModal = (purchase) => {
    setSelectedPurchase(purchase.target.id);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedPurchase(null);
    setModalIsOpen(false);
  };

  const deleteAccount = async () => {
    try {
      const desac = {
        is_active: false
      }
      await axios.patch(`http://127.0.0.1:8000/users/${user.id}/`, desac, {
        headers: {
          Authorization: `token ${user.token}`,
        }
      });

      localStorage.removeItem("userInfo");
      setTest(localStorage.getItem("userInfo"));
      navigate("/");
    } catch (error) {
      console.error(error);
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
          <h3 className="user-name">{user.username}</h3>
          <div className="address">
            <p id="state" className="state">
              {user.first_name}
            </p>
            <span id="country" className="country">
              {user.last_name}
            </span>
          </div>
        </div>
        <div className="profile-nav-button">
          <button className="delete-button" onClick={deleteAccount}>
            Supprimer le compte
          </button>
        </div>
      </div>

      <div className="main-bd">
        <div className="left-side">
          <div className="profile-side">
            <p className="user-mail">
              <i className="ri-mail-line"></i> {user.email}
            </p>
          </div>
        </div>
        <div className="right-side">
          <div className="nave">
            <ul>
              <li className="user-review active">Historique de vos achats</li>
            </ul>
          </div>
          <div className="profile-body">
            <div className="profile-reviews tab">
              <table>
                <thead>
                  <tr>
                    <th>Films</th>
                    <th>Prix</th>
                    <th>Forfait</th>
                    <th>Date</th>
                    <th>Voir le QR Code</th>
                  </tr>
                </thead>

                <tbody>
                  {purchaseResume.map((purchase, index) => (
                    <tr key={purchase.resume.purchaseId}>
                      <td>{purchase.resume.movieName}</td>
                      <td>{purchase.resume.price.toFixed(2)} €</td>
                      <td>{purchase.resume.priceType}</td>
                      <td>
                        {new Date(purchase.resume.date).toLocaleString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </td>

                      <td id={purchase.resume.purchaseId} onClick={openModal}>
                        <i
                          id={purchase.resume.purchaseId}
                          className="ri-qr-code-line"
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Modal
                style={{
                  overlay: {
                    zIndex: 101,
                  },
                }}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Modal de QR Code"
              >
                <QRCodeModal data={selectedPurchase} closeModal={closeModal} />
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
