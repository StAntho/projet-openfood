import { useState } from "react";
import "../style/Card.css";

export default function Card({ data, handleChange, type }) {

    return (
        <div className="card">
            <div className="content">
                <div className="imgBx">
                    <img src={data?.selected_images?.front?.display?.fr} />
                </div>
                <div className="contentBx">
                    <h3>{data?.product_name_fr}<br /><span>{data?.brands}</span></h3>
                </div>
            </div>
            <ul className="sci">
                <li>
                    <button onClick={() => handleChange(data)}>{type == 1 ? 'Voir les substitut' : 'Choisir ce substitut'}</button>
                </li>
            </ul>
        </div>
    );
}
