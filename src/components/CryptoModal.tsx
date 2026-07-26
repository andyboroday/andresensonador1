import { useEffect, useRef, useState } from "react";

type CryptoModalProps = {
  onClose: () => void;
};

type Wallet = {
  id: string;
  name: string;
  icon: string;
  shortAddress: string;
  fullAddress: string;
  qr: string;
};

const wallets: Wallet[] = [
  {
    id: "btc",
    name: "Bitcoin",
    icon: "/crypto/btc.svg",
    shortAddress: "bc1q...f2l6",
    fullAddress: "bc1q67vxqwtl3v8jzzchymq2nzzcap7fd2yhc5f2l6",
    qr: "/qr/btc.png",
  },
  {
    id: "eth",
    name: "Ethereum",
    icon: "/crypto/eth.svg",
    shortAddress: "0x47...4419",
    fullAddress: "0x47dE277C59Ba8A0ED20592dacF581409aEb74419",
    qr: "/qr/eth.png",
  },
  {
    id: "usdt",
    name: "USDT (TRC-20)",
    icon: "/crypto/usdt.svg",
    shortAddress: "TKdq...rQHL",
    fullAddress: "TKdqAbZQgv5UYCBGNV7h23vT21a195rQHL",
    qr: "/qr/usdt.png",
  },
  {
    id: "ltc",
    name: "Litecoin",
    icon: "/crypto/ltc.svg",
    shortAddress: "LW9M...TSpS",
    fullAddress: "LW9MRqiC7rb8NNX6zRGK97NpqLVvN1TSpS",
    qr: "/qr/ltc.png",
  },
  {
    id: "sol",
    name: "Solana",
    icon: "/crypto/sol.svg",
    shortAddress: "8AxT...CNuC",
    fullAddress: "8AxTEZqKTTt9WeRNzVB1HhrjCXkdzjoyiErtFhE9CNuC",
    qr: "/qr/sol.png",
  },
];

export function CryptoModal({ onClose }: CryptoModalProps) {
  const [activeQr, setActiveQr] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const qrRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "";
  };
}, []);

  useEffect(() => {
    if (!copiedId) return;

    const timer = setTimeout(() => {
      setCopiedId(null);
    }, 1500);

    return () => clearTimeout(timer);
  }, [copiedId]);

  useEffect(() => {
  if (!activeQr) return;

  qrRefs.current[activeQr]?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}, [activeQr]);

  const handleCopy = async (wallet: Wallet) => {
    try {
      await navigator.clipboard.writeText(wallet.fullAddress);
      setCopiedId(wallet.id);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const toggleQr = (id: string) => {
    setActiveQr((current) => (current === id ? null : id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 donate-modal-overlay">
      <div className="w-full max-w-4xl p-6 shadow-2xl donate-modal-panel">

        <div className="flex items-start justify-between gap-4">

          <h2 className="text-xl donate-modal-title">
            Cryptocurrency
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 px-3 py-2 donate-modal-close"
          >
            Close
          </button>

        </div>

        <div className="mt-8 crypto-list">

          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="crypto-item"
            >

              <div className="crypto-row">

                <div className="crypto-info">

                  <div className="crypto-name">

                    <img
                      src={wallet.icon}
                      alt={wallet.name}
                      className="crypto-icon"
                    />

                    <span>{wallet.name}</span>

                  </div>

                  <div className="crypto-address">
                    {wallet.shortAddress}
                  </div>

                </div>

                <div className="crypto-actions">

                  <button
                    type="button"
                    className="crypto-button"
                    onClick={() => toggleQr(wallet.id)}
                  >
                    {activeQr === wallet.id ? "Hide QR" : "QR Code"}
                  </button>

                  <button
                    type="button"
                    className="crypto-button"
                    onClick={() => handleCopy(wallet)}
                  >
                    {copiedId === wallet.id
                      ? "Copied!"
                      : "Copy Address"}
                  </button>

                </div>

              </div>
              
              {activeQr === wallet.id && (
                <div
                      ref={(el) => {
                        qrRefs.current[wallet.id] = el;
                      }}
                      className="crypto-qr"
                    >

                  <img
                    src={wallet.qr}
                    alt={`${wallet.name} QR Code`}
                    className="crypto-qr-image"
                  />

                </div>
              )}

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}