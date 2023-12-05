import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import "../style/Seance.css";
import Modal from "react-modal";
import PurchaseCard from "../components/PurchaseCard";

Modal.setAppElement('#root')

export default function Seance() {
  const { id } = useParams();
  const [seances, setSeances] = useState([]);
  const [film, setFilm] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSeance, setSelectedSeance] = useState(null);

  const openModal = (seance) => {
    setSelectedSeance(seance);
    setSelectedSeance({
      ...seance,
      timestamp: new Date(seance.timestamp).toLocaleString("fr-FR", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      filmname: film.name
    });
    setModalIsOpen(true);
  }

  const closeModal = () => {
    setSelectedSeance(null);
    setModalIsOpen(false);
  }

  useEffect(() => {
    const fetchPurchasesData = async () => {
      try {
        const filmResponse = await axios.get(`http://127.0.0.1:8000/movies/${id}`);
        setFilm(filmResponse.data);

        const seanceResponse = await axios.get(`http://127.0.0.1:8000/sessions/`);
        const now = new Date().toISOString();
        const filteredSeances = seanceResponse.data.filter(seance => {
          return seance.filmId === parseInt(id) && seance.timestamp > now;
        });

        const updatedSeances = await Promise.all(
          filteredSeances.map(async seance => {
            const roomResponse = await axios.get(`http://127.0.0.1:8000/rooms/${seance.roomId}`);
            const purchasesResponse = await axios.get(`http://127.0.0.1:8000/purchases/`);
            const purchases = purchasesResponse.data;
            const totalPurchased = purchases.reduce((total, purchase) => {
              return purchase.sessionId === seance.id ? total + 1 : total;
            }, 0);
            const placesLeft = roomResponse.data.nbPlaces - totalPurchased;
            const room_name = roomResponse.data.name;
            return { ...seance, placesLeft, room_name };
          })
        );

        const dateAscending = [...updatedSeances].sort((a, b) => {
          const dateA = new Date(a.timestamp);
          const dateB = new Date(b.timestamp);
          return dateA - dateB;
        });

        setSeances(dateAscending);

      } catch (error) {
        console.error('Failed to fetch purchases data:', error);
      }
    };

    fetchPurchasesData();
  }, [id]);

  return (
    <div className="section">
      <div className="card">
        {seances.length > 0 ? (
          <>
            <img src={film.image} alt={film.name} className="card-img" />
            <div className="card-content">
              <h2 className="card-title">{film.name}</h2>
              <p className="card-realisateur">{film.realisator}</p>
              <p className="card-duration">Durée : {film.duration} minutes</p>
              <p className="card-year">Année de sortie : {film.year}</p>
              <p className="card-synopsis">{film.synopsis}</p>

              {seances.map(seance => (
                <div className="seance" key={seance.id}>
                  <p>Horaire : {new Date(seance.timestamp).toLocaleString("fr-FR", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  <p>Langue : {seance.language}</p>
                  <p>Places restantes : {seance.placesLeft}</p>
                  <button className="btn-reserve" onClick={() => openModal(seance)}>Réserver</button>
                </div>
              ))}
            </div>
            <Modal
              style={{
                overlay: {
                  zIndex: 101,
                }
              }}
              isOpen={modalIsOpen}
              onRequestClose={closeModal}
              contentLabel="Modal de réservation"
            >
              <PurchaseCard data={selectedSeance} closeModal={closeModal} />
            </Modal>
          </>
        ) : (
          <>
            <div>Loading...</div>
          </>
        )}
      </div>
    </div>
  );
};
