// src/components/Navbar/CartIcon.jsx

import { useStore } from '@nanostores/react';
// PERUBAHAN 1: Impor seluruh file sebagai satu objek
import * as cartStore from '../../stores/cartStore.js';

export default function CartIcon() {
    // PERUBAHAN 2: Gunakan store dari objek yang diimpor
    const $cart = useStore(cartStore.cart);

    const totalItems = $cart.reduce((total, item) => total + (item.quantity || 0), 0);

    return (
        <a href="/cart" className="cart-btn" aria-label="Shopping Cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {totalItems > 0 && (
                <span className="cart-count">{totalItems}</span>
            )}
        </a>
    );
}