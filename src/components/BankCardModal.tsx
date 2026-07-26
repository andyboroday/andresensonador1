import { useEffect, useState } from "react";

type BankCardModalProps = {
  onClose: () => void;
};

const suggestedAmounts = [5, 10, 25, 50];

export function BankCardModal({ onClose }: BankCardModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState("10");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  useEffect(() => {
  const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
          document.body.style.overflow = previousOverflow;
        };
      }, []);
  const cardDigits = cardNumber.replace(/\s/g, "");

        let cardType: "visa" | "mastercard" | "amex" | null = null;

          if (/^4/.test(cardDigits)) {
            cardType = "visa";
          } else if (
            /^(5[1-5]|2(2[2-9]|[3-6][0-9]|7[01]|720))/.test(cardDigits)
          ) {
            cardType = "mastercard";
          } else if (/^(34|37)/.test(cardDigits)) {
            cardType = "amex";
          }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 donate-modal-overlay">

      <div className="w-full max-w-xl p-5 shadow-2xl donate-modal-panel">

        <div className="flex items-start justify-between gap-4">

          <h2 className="text-xl donate-modal-title">
            Bank Card
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 px-3 py-2 donate-modal-close"
          >
            Close
          </button>

        </div>

        <div className="bank-form">

          <div className="bank-section">

            <div className="bank-label">
              Select Amount
            </div>

            <div className="bank-amounts">

              {suggestedAmounts.map((amount) => (

                <button
                    key={amount}
                    type="button"
                    onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount(String(amount));
                        }}
                    className={`bank-amount-button ${
                      selectedAmount === amount ? "bank-amount-button-active" : ""
                    }`}
                  >
                    ${amount}
                  </button>

              ))}

            </div>

          </div>

          <div className="bank-section">

            <label className="bank-label">
              Custom Amount
            </label>

            <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => {
                        const value = e.target.value;

                        setCustomAmount(value);

                        const amount = Number(value);

                        if (suggestedAmounts.includes(amount)) {
                          setSelectedAmount(amount);
                        } else {
                          setSelectedAmount(null);
                        }
                      }}
                      placeholder="Enter amount"
                      className="bank-input"
                    />

          </div>

          <div className="bank-section">

            <label className="bank-label">
              Email
            </label>

            <input
              type="email"
              placeholder="your@email.com"
              className="bank-input"
            />

          </div>

          <div className="bank-section">

            <div className="bank-label">
              Card Details
            </div>
              <div className="bank-card-icons">
                <img
                  src="/payment/visa.svg"
                  alt="Visa"
                  className={`bank-card-logo ${
                      cardType === "visa" ? "bank-card-logo-active" : ""
                    }`}
                />

                <img
                  src="/payment/mastercard.svg"
                  alt="Mastercard"
                  className={`bank-card-logo ${
                      cardType === "mastercard" ? "bank-card-logo-active" : ""
                    }`}
                />

                <img
                  src="/payment/american-express.svg"
                  alt="American Express"
                  className={`bank-card-logo ${
                      cardType === "amex" ? "bank-card-logo-active" : ""
                    }`}
                />
              </div>
           <input
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 16)
                    .replace(/(.{4})/g, "$1 ")
                    .trim();

                  setCardNumber(value);
                }}
                placeholder="1234 5678 9012 3456"
                className="bank-input"
              />

           <input
                type="text"
                value={cardholderName}
                onChange={(e) => {
                  const value = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z\s'-]/g, "");

                  setCardholderName(value);
                }}
                placeholder="CARDHOLDER NAME"
                className="bank-input mt-4"
              />

            <div className="bank-card-row">

            <input
                type="text"
                value={expiryDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, "").slice(0, 4);

                  // Первая цифра месяца может быть только 0 или 1
                  if (value.length >= 1) {
                    if (value[0] !== "0" && value[0] !== "1") {
                      return;
                    }
                  }

                  // Проверяем полный месяц
                  if (value.length >= 2) {
                    const month = Number(value.slice(0, 2));

                    if (month < 1 || month > 12) {
                      value = value.slice(0, 1);
                    }
                  }

                  // Добавляем разделитель после корректного месяца
                  if (value.length >= 3) {
                    value = `${value.slice(0, 2)} / ${value.slice(2)}`;
                  }

                  setExpiryDate(value);
                }}
                placeholder="MM / YY"
                className="bank-input"
              />

              <input
                      type="text"
                      value={cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setCvv(value);
                      }}
                      placeholder="CVV"
                      className="bank-input"
                    />

            </div>

            <button
              type="button"
              className="bank-donate-button"
            >
              Donate
            </button>

            <p className="bank-note">
              This payment form is currently a visual prototype.
              Secure payment integration will be added later.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}