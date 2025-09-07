import React, { useState } from "react";

function Payment() {
  const [selected, setSelected] = useState(true);
  return (
    <div className="w-[478px] p-6 bg-white rounded-2xl">
      <h1 className="font-semibold text-2xl">Payment</h1>
      <p className="mt-9 mb-8">
        You are subscribing to the 7 days plan for $50.99
      </p>
      <div className="flex gap-4 mb-8">
        <div
          onClick={() => setSelected(!selected)}
          className={`w-full p-3 flex items-center gap-10 rounded-xl cursor-pointer border ${
            selected ? "border-zinc-900" : "border-zinc-200"
          }`}
        >
          <button
            className={`w-5 h-5 rounded-full border border-black flex items-center justify-center ${
              selected ? "border-zinc-900" : "border-zinc-200"
            }`}
          >
            {selected && (
              <div className="w-[14px] h-[14px] bg-black rounded-full" />
            )}
          </button>
          <img src="/images/stripe.svg" alt="paypal" />
        </div>
        <div
          onClick={() => setSelected(!selected)}
          className={`w-full p-3 flex items-center gap-10 rounded-xl cursor-pointer border ${
            selected ? "border-zinc-900" : "border-zinc-200"
          }`}
        >
          <button
            className={`w-5 h-5 rounded-full border border-black flex items-center justify-center ${
              selected ? "border-zinc-900" : "border-zinc-200"
            }`}
          >
            {selected && (
              <div className="w-[14px] h-[14px] bg-black rounded-full" />
            )}
          </button>
          <img src="/images/paypal.svg" alt="paypal" />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <input
          type="text"
          className="h-14 pl-3 rounded-xl border border-gray-100 placeholder:text-zinc-400"
          placeholder="Name"
        />
        <input
          type="text"
          className="h-14 pl-3 rounded-xl border border-gray-100 placeholder:text-zinc-400"
          placeholder="Card Number"
        />
        <div className="flex gap-4">
          <input
            type="text"
            className="w-full h-14 pl-3 rounded-xl border border-gray-100 placeholder:text-zinc-400"
            placeholder="Expiry Date (MM/YY)"
          />
          <input
            type="text"
            className="w-full h-14 pl-3 rounded-xl border border-gray-100 placeholder:text-zinc-400"
            placeholder="CVV"
          />
        </div>
      </div>
      <div className="w-full h-14 mt-12 rounded-xl bg-black text-white font-medium flex justify-center items-center">Confirm Payment</div>
    </div>
  );
}

export default Payment;
