// src/stores/cartStore.js
import { map } from 'nanostores';

// Create a regular nanostores map
const cartMap = map({});

// Custom localStorage key
const CART_STORAGE_KEY = 'parfum_cart';

// Load cart from localStorage on initialization
function loadCartFromStorage() {
  // Check if we're running in browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    console.warn('localStorage not available, using empty cart');
    cartMap.set({});
    return;
  }

  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      // Ensure parsedCart is an object
      if (typeof parsedCart === 'object' && parsedCart !== null) {
        cartMap.set(parsedCart);
        console.log('Cart loaded from localStorage:', parsedCart);
      } else {
        console.warn('Invalid cart data in localStorage, initializing empty cart');
        cartMap.set({});
      }
    } else {
      console.log('No cart data found in localStorage, initializing empty cart');
      cartMap.set({});
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    cartMap.set({});
  }
}

// Save cart to localStorage
function saveCartToStorage(cartData) {
  // Check if we're running in browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    console.warn('localStorage not available, cannot save cart');
    return;
  }

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
    console.log('Cart saved to localStorage:', cartData);
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

// Subscribe to cart changes to automatically save to localStorage
cartMap.subscribe((cartData) => {
  saveCartToStorage(cartData);
});

// Initialize cart from localStorage (only in browser)
if (typeof window !== 'undefined') {
  loadCartFromStorage();
}

// Export the cart store
export const cartItems = cartMap;

/**
 * Menambah item ke keranjang. Jika sudah ada, quantity ditambah.
 * @param {{ brand: string, name: string, size: number, price: number, image: string }} item - Detail produk yang akan ditambahkan.
 */
export function addItemToCart(item) {
  console.log('addItemToCart called with:', item);
  
  // Validasi input
  if (!item || !item.brand || !item.name || !item.size || !item.price || !item.image) {
    console.error('Invalid item data:', item);
    throw new Error('Data item tidak lengkap');
  }

  // ID unik dibuat dari brand dan ukuran agar item yang sama tidak duplikat.
  const id = `${item.brand}-${item.size}`;
  const currentItems = cartItems.get();
  const existingEntry = currentItems[id];

  // Create new cart state
  const newCartState = { ...currentItems };

  if (existingEntry && typeof existingEntry === 'object' && existingEntry.quantity) {
    // Jika item sudah ada, tambah quantity-nya
    newCartState[id] = {
      ...existingEntry,
      quantity: existingEntry.quantity + 1,
    };
    console.log('Updated existing item:', newCartState[id]);
  } else {
    // Jika item baru, tambahkan ke keranjang dengan quantity 1
    newCartState[id] = { 
      ...item, 
      id: id, 
      quantity: 1 
    };
    console.log('Added new item:', newCartState[id]);
  }
  
  // Update cart
  cartItems.set(newCartState);
  console.log('Current cart items:', cartItems.get());
}

/**
 * Menghapus item dari keranjang berdasarkan ID uniknya.
 * @param {string} itemId - ID unik dari item (contoh: "Mykonos Dreamscape-5").
 */
export function removeItemFromCart(itemId) {
  console.log('Removing item with ID:', itemId);
  
  const currentItems = cartItems.get();
  const newCartState = { ...currentItems };
  
  if (newCartState[itemId]) {
    delete newCartState[itemId];
    cartItems.set(newCartState);
    console.log('Item removed successfully');
  } else {
    console.warn('Item not found in cart:', itemId);
  }
}

/**
 * Mengubah jumlah (quantity) dari sebuah item.
 * @param {string} itemId - ID unik item.
 * @param {number} quantity - Jumlah baru.
 */
export function updateItemQuantity(itemId, quantity) {
  console.log('Updating quantity for item:', itemId, 'to:', quantity);
  
  if (quantity <= 0) {
    // Jika quantity 0 atau kurang, hapus item dari keranjang
    removeItemFromCart(itemId);
    return;
  }
  
  const currentItems = cartItems.get();
  const existingEntry = currentItems[itemId];
  
  if (existingEntry && typeof existingEntry === 'object') {
    const newCartState = { ...currentItems };
    newCartState[itemId] = {
      ...existingEntry,
      quantity: quantity,
    };
    
    cartItems.set(newCartState);
    console.log('Quantity updated:', newCartState[itemId]);
  } else {
    console.warn('Item not found when updating quantity:', itemId);
  }
}

/**
 * Mendapatkan total item dalam keranjang
 * @returns {number} - Total quantity semua item
 */
export function getCartItemCount() {
  const items = cartItems.get();
  return Object.values(items).reduce((total, item) => {
    if (typeof item === 'object' && item !== null && typeof item.quantity === 'number') {
      return total + item.quantity;
    }
    return total;
  }, 0);
}

/**
 * Mendapatkan total harga keranjang
 * @returns {number} - Total harga semua item
 */
export function getCartTotal() {
  const items = cartItems.get();
  return Object.values(items).reduce((total, item) => {
    if (typeof item === 'object' && item !== null && 
        typeof item.price === 'number' && typeof item.quantity === 'number') {
      return total + (item.price * item.quantity);
    }
    return total;
  }, 0);
}

/**
 * Mengosongkan keranjang
 */
export function clearCart() {
  console.log('Clearing cart');
  cartItems.set({});
}

/**
 * Get all cart items as an array
 * @returns {Array} - Array of cart items
 */
export function getCartItemsArray() {
  const items = cartItems.get();
  console.log('Getting cart items array from:', items);
  
  const itemsArray = Object.values(items).filter(item => {
    const isValid = typeof item === 'object' && 
                   item !== null && 
                   typeof item.id === 'string' &&
                   typeof item.brand === 'string' &&
                   typeof item.name === 'string' &&
                   typeof item.size === 'number' &&
                   typeof item.price === 'number' &&
                   typeof item.image === 'string' &&
                   typeof item.quantity === 'number' &&
                   item.quantity > 0;
    
    if (!isValid) {
      console.warn('Invalid item found:', item);
    }
    
    return isValid;
  });
  
  console.log('Filtered items array:', itemsArray);
  return itemsArray;
}

/**
 * Force load cart from localStorage (useful for debugging)
 */
export function forceLoadCart() {
  loadCartFromStorage();
}

/**
 * Get current cart state (for debugging)
 */
export function getCartState() {
  return cartItems.get();
}