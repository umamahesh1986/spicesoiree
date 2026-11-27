import React, { useEffect, useState } from "react";
import { readCart, saveCart } from "../api";
import "./CartQuantity.css";

export function useCartItems() {
  const [cart, setCart] = useState(readCart);
  useEffect(() => {
    const sync = () => setCart(readCart());
    window.addEventListener("cartUpdated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cartUpdated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return cart;
}

export default function CartQuantity({ item, onIncrease }) {
  const decrease = () => {
    const cart = readCart();
    const index = cart.findIndex((line) =>
      (item.itemType && item.itemId
        ? line.itemType === item.itemType && line.itemId === item.itemId
        : line.name === item.name) && line.size === item.size &&
      (line.cuttingOption || "") === (item.cuttingOption || "")
    );
    if (index < 0) return;
    const quantity = Number(cart[index].quantity || 0) - 1;
    if (quantity <= 0) cart.splice(index, 1);
    else cart[index] = { ...cart[index], quantity };
    saveCart(cart);
  };

  return (
    <div className="product-cart-quantity" aria-label={`${item.name}, ${item.size} quantity`}>
      <button type="button" onClick={decrease} aria-label={`Remove one ${item.name}`}>−</button>
      <span aria-live="polite">{item.quantity}</span>
      <button type="button" onClick={onIncrease} aria-label={`Add one ${item.name}`}>+</button>
    </div>
  );
}
