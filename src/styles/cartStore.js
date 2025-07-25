import { persistentAtom } from '@nanostores/persistent';

// atom adalah "wadah" untuk state kita.
// Kita akan menyimpan array dari item-item di keranjang.
export const cart = persistentAtom('cart', [], {
    encode: JSON.stringify,
    decode: JSON.parse,
});

/**
 * Menambahkan item ke keranjang.
 * Jika item dengan ukuran yang sama sudah ada, maka hanya quantity-nya yang bertambah.
 * @param {object} itemToAdd - Item yang akan ditambahkan, format: { brand, name, image, size, price }
 */
export function addItemToCart(itemToAdd) {
    // 1. Ambil isi keranjang saat ini
    const currentCart = cart.get();
    
    // 2. Cek apakah item dengan ID dan ukuran yang sama sudah ada
    const itemIndex = currentCart.findIndex(
        item => item.brand === itemToAdd.brand && item.name === itemToAdd.name && item.size === itemToAdd.size
    );

    let newCart;

    if (itemIndex > -1) {
        // Jika item sudah ada, update quantity-nya
        newCart = currentCart.map((item, index) => {
            if (index === itemIndex) {
                // Buat salinan objek dan tambahkan quantity
                return { ...item, quantity: (item.quantity || 1) + 1 };
            }
            return item;
        });
    } else {
        // Jika item baru, tambahkan ke keranjang dengan quantity 1
        newCart = [...currentCart, { ...itemToAdd, quantity: 1 }];
    }

    // 3. Update state keranjang dengan data yang baru
    cart.set(newCart);
    console.log("Cart updated:", cart.get());
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

// Anda juga bisa menambahkan fungsi lain seperti updateQuantity, dll.