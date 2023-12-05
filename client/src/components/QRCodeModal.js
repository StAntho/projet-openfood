import "../style/qrcodemodal.css";

export default function QRCodeModal({ data, closeModal }) {

  if (data === null) {
    return;
  }

  return (
    <div className="qrcode-card" onClick={closeModal}>
      <div className="qrcode-card-body">
        <img src={`../media/${data}.png`} alt={`${data}.png`} />
      </div>
    </div>
  );
};
