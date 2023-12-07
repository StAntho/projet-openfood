import "../style/Card.css";

export default function Card({ data, handleChange, type }) {
  return (
    <div className="card">
      <div className="content">
        <div className="imgBx">
          <img src={data?.selected_images?.front?.display?.fr} alt={data?.selected_images?.front?.display?.fr} />
        </div>
        <div className="contentBx">
          <h3><a href={`https://fr.openfoodfacts.org/produit/${data?.code}`} target='_blank'>{data?.product_name_fr}</a><br /><span>{data?.brands}</span></h3>
        </div>
      </div>
      {handleChange !== undefined ? (
        <ul className="sci">
          <li>
            <button onClick={() => handleChange(data)}>{type === 1 ? 'Voir les substitut' : 'Choisir ce substitut'}</button>
          </li>
        </ul>
      ) : (
        <ul className="sci">
          <li>
            <span>{type === "initial" ? "Produit remplacé" : "Produit remplaçant"}</span>
          </li>
        </ul>
      )}
    </div>
  );
}
