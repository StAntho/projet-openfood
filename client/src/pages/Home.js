import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import "../style/Home.css";

export default function Home() {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    let allFilms;

    axios.get('http://127.0.0.1:8000/movies/')
      .then(response => {
        allFilms = response.data;
        return axios.get('http://127.0.0.1:8000/sessions/');
      })
      .then(response => {
        const now = new Date().toISOString();
        const sessionCounts = response.data.filter(session => session.timestamp > now).reduce((counts, seance) => {
          counts[seance.filmId] = (counts[seance.filmId] || 0) + 1;
          return counts;
        }, {});

        const validFilms = allFilms.filter(film => sessionCounts[film.id] > 0)
          .map(film => ({ ...film, sessionCount: sessionCounts[film.id] }));

        setFilms(validFilms);
      })
      .catch(error => {
        console.error('Failed to fetch film data:', error);
      });
  }, []);


  if (films.length > 0) {
    return (
      <div className='section'>
        <h1 className='section__title'>Liste des séances</h1>
        <div className='content-main'>
          <ul>
            {films.map((film, index) => (
              <div key={film.id} className="movie_card">
                <Link to={`/seance/${film.id}`}>
                  <div className="info_section">
                    <div className="movie_header">
                      <img className="locandina" src={film.image} alt={film.image} />
                      <h1>{film.name}</h1>
                      <h4>{film.year}, {film.realisator}</h4>
                      <span className="minutes">{film.duration} min</span>
                      <p className="type">
                        {film.sessionCount} séance{film.sessionCount > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="movie_desc">
                      <p className="text">
                        {film.synopsis}
                      </p>
                    </div>
                  </div>
                  <div className="blur_back" style={{ backgroundImage: `url(${film.image})` }}></div>
                </Link>
              </div>
            ))}
          </ul>
        </div >
      </div >
    );
  }
};
