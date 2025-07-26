// PASTIKAN BARIS INI ADA DAN BENAR
import { persistentAtom } from '@nanostores/persistent';

// Baris ini mendefinisikan "wadah" untuk state keranjang kita
// dan menyimpannya di localStorage dengan nama 'cart'.
export const cart = persistentAtom('cart', [], {
    encode: JSON.stringify,
    decode: JSON.parse,
});

/**
 * Menambahkan item ke keranjang.
 * Jika item dengan ukuran yang sama sudah ada, maka hanya quantity-nya yang bertambah.
 * @param {object} itemToAdd - Item yang akan ditambahkan
 */
export function addItemToCart(itemToAdd) {
    const currentCart = cart.get();
    const itemIndex = currentCart.findIndex(
        item => item.brand === itemToAdd.brand && item.name === itemToAdd.name && item.size === itemToAdd.size
    );

    let newCart;

    if (itemIndex > -1) {
        newCart = currentCart.map((item, index) => {
            if (index === itemIndex) {
                return { ...item, quantity: (item.quantity || 1) + 1 };
            }
            return item;
        });
    } else {
        newCart = [...currentCart, { ...itemToAdd, quantity: 1 }];
    }

    cart.set(newCart);
}

/**
 * Menghapus item dari keranjang berdasarkan indeksnya.
 * @param {number} indexToRemove - Indeks item yang akan dihapus.
 */
export function removeItemFromCart(indexToRemove) {
    const currentCart = cart.get();
    const newCart = currentCart.filter((_, index) => index !== indexToRemove);
    cart.set(newCart);
}

/**
 * Mengosongkan semua isi keranjang.
 */
export function clearCart() {
    cart.set([]);
}