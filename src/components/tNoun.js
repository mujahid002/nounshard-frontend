import { useGlobalContext } from "../context/Store";
import { useState } from "react";

export default function Product({ nouns }) {
  const { nounId, image, price } = nouns;

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <article className="flex flex-col gap-3 bg-white p-8 rounded-xl shadow-md text-center mb-6">
      <div className="text-7xl cursor-default">{emoji}</div>
      <div className="text-lg">{name}</div>
      <div className="text-xl font-semibold mt-auto">$ {price}</div>
      <div className="text-sm font-semibold mt-auto">
        {(price / maticPrice).toFixed(4)} Matic
      </div>
      <div className="text-sm font-semibold mt-auto">
        {((price * (100 - parseFloat(discount))) / 100 / masqPrice).toFixed(4)}{" "}
        Masq
      </div>
      <div className="text-sm font-semibold mt-auto text-green-300">
        ~{discount}% OFF
      </div>

      <div className="flex justify-around items-center mt-4 mb-2">
        <button
          onClick={decreaseQuantity}
          className="hover:text-emerald-500 hover:bg-emerald-50 w-8 h-8 rounded-full transition-colors duration-500"
        >
          -
        </button>
        <span className="w-10 text-center rounded-md mx-3">{quantity}</span>
        <button
          onClick={increaseQuantity}
          className="hover:text-emerald-500 hover:bg-emerald-50 w-8 h-8 rounded-full transition-colors duration-500"
        >
          +
        </button>
      </div>
      <button
        // onClick={() => addItemToCart(product, quantity)}
        className="bg-emerald-50 hover:bg-emerald-500 hover:text-white transition-colors duration-500 text-emerald-500 rounded-md px-5 py-2"
      >
        Add to cart
      </button>
    </article>
  );
}
