import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { BankCardModal } from "@/components/BankCardModal";
import { CryptoModal } from "@/components/CryptoModal";

import cardIcon from "@/assets/card.svg";
import cryptoIcon from "@/assets/crypto.svg";

type DonateMethod = "bank-card" | "crypto";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate - Support Andres Ensonador" },
      {
        name: "description",
        content:
          "Support the independent creative work of Andres Ensonador and help new dreamlike projects come to life.",
      },
    ],
  }),
  component: Donate,
});

function Donate() {
  const [activeMethod, setActiveMethod] = useState<DonateMethod | null>(null);

  return (
    <main className="flex-1 px-6 py-8 donate-page">
      <section className="mx-auto flex min-h-full w-full max-w-3xl flex-col items-center justify-center text-center">
        <h1 className="donate-title">Support the Work</h1>

<p className="mt-6 max-w-3xl donate-description">
  Your contribution helps keep this independent creative universe alive, supporting future
  art, writing, experiments, and dreamlike digital experiences.

  <br />
  <br />

  If none of the available payment methods works for you, feel free to contact me and we will
  find another convenient way to support the project.
</p>

        <div className="mt-10 flex w-full max-w-2xl flex-col gap-6 donate-methods-container">
  <button
  type="button"
  onClick={() => setActiveMethod("bank-card")}
  className="flex h-12 w-[80%] mx-auto items-center justify-center px-4 donate-method-button"
>
  <div className="flex w-56 items-center gap-5">
    <img src={cardIcon} alt="" className="h-8 w-8 shrink-0" />
    <span>Bank Card</span>
  </div>
</button>

<button
  type="button"
  onClick={() => setActiveMethod("crypto")}
  className="flex h-12 w-[80%] mx-auto items-center justify-center px-4 donate-method-button"
>
  <div className="flex w-56 items-center gap-5">
    <img src={cryptoIcon} alt="" className="h-7 w-7 shrink-0" />
    <span>Cryptocurrency</span>
  </div>
</button>


</div>
      </section>

      {activeMethod === "bank-card" && <BankCardModal onClose={() => setActiveMethod(null)} />}
      {activeMethod === "crypto" && <CryptoModal onClose={() => setActiveMethod(null)} />}
    </main>
  );
}
