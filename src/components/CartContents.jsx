import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
// Impor store dan fungsi-fungsi dari cartStore
import * as cartStore from '../stores/cartStore.js';

// Helper untuk format Rupiah
const formatToRupiah = (number) => 'Rp ' + Number(number).toLocaleString('id-ID');

export default function CartContents() {
  // Langganan ke perubahan di 'cart' store
  const $cart = useStore(cartStore.cart);
  const [isClient, setIsClient] = useState(false);

  // Tandai bahwa komponen sudah berjalan di client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Tampilkan pesan loading jika belum di client atau jika cart masih kosong (saat awal load)
  if (!isClient) {
    return <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Memuat keranjang...</p>;
  }

  // Jika keranjang kosong
  if ($cart.length === 0) {
    return (
      <div style={styles.emptyCart}>
        <h2>Keranjang Anda kosong</h2>
        <p>Ayo, temukan aroma favoritmu sekarang!</p>
        <a href="/all" style={styles.emptyCartButton}>Lihat Semua Produk</a>
      </div>
    );
  }
  
  // Hitung total harga
  const subtotal = $cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Handler untuk menghapus item
  const handleRemove = (index) => {
    if (confirm('Anda yakin ingin menghapus item ini?')) {
      cartStore.removeItemFromCart(index);
    }
  };

  return (
    <div style={styles.cartContainer}>
      {/* Daftar Item */}
      <div style={styles.cartItems}>
        {$cart.map((item, index) => (
          <div key={`${item.id}-${item.size}`} style={styles.cartItem}>
            <img src={item.image} alt={item.name} style={styles.itemImage} />
            <div style={styles.itemDetails}>
              <p style={styles.itemBrand}>{item.brand}</p>
              <h3 style={styles.itemName}>{item.name}</h3>
              <p style={styles.itemSize}>Ukuran: {item.size}ml</p>
            </div>
            <div style={styles.itemQuantity}>
              <span>Qty: {item.quantity}</span>
            </div>
            <div style={styles.itemPrice}>
              <p>{formatToRupiah(item.price * item.quantity)}</p>
              <button onClick={() => handleRemove(index)} style={styles.removeButton}>Hapus</button>
            </div>
          </div>
        ))}
      </div>

      {/* Ringkasan Pesanan */}
      <div style={styles.orderSummary}>
        <h2>Ringkasan Pesanan</h2>
        <div style={styles.summaryRow}>
          <span>Subtotal</span>
          <span>{formatToRupiah(subtotal)}</span>
        </div>
        <div style={styles.summaryRow}>
          <span>Ongkos Kirim</span>
          <span>Akan dihitung</span>
        </div>
        <hr style={styles.divider} />
        <div style={{...styles.summaryRow, ...styles.total}}>
          <span>Total</span>
          <span>{formatToRupiah(subtotal)}</span>
        </div>
        <button style={styles.checkoutButton}>Lanjutkan ke Pembayaran</button>
      </div>
    </div>
  );
}

// Styling (bisa dipindahkan ke file CSS terpisah jika mau)
const styles = {
  cartContainer: { display: 'flex', gap: '2rem', alignItems: 'flex-start' },
  cartItems: { flex: 3 },
  cartItem: { display: 'flex', alignItems: 'center', background: '#fff', padding: '1rem', borderRadius: '12px', marginBottom: '1rem', border: '1px solid #e5d3b3' },
  itemImage: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginRight: '1rem' },
  itemDetails: { flexGrow: 1 },
  itemBrand: { margin: 0, color: '#bfa181', fontWeight: 600 },
  itemName: { margin: '0.2rem 0', fontFamily: 'Playfair Display, serif' },
  itemSize: { margin: 0, color: '#666', fontSize: '0.9rem' },
  itemQuantity: { marginRight: '2rem', textAlign: 'center' },
  itemPrice: { textAlign: 'right' },
  removeButton: { background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.8rem', marginTop: '0.5rem', textDecoration: 'underline' },
  orderSummary: { flex: 1, background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5d3b3', position: 'sticky', top: '80px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' },
  divider: { border: 'none', borderTop: '1px solid #eee', margin: '1rem 0' },
  total: { fontWeight: 'bold', fontSize: '1.2rem' },
  checkoutButton: { width: '100%', background: '#bfa181', color: '#fff', border: 'none', padding: '0.8rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600, marginTop: '1rem' },
  emptyCart: { textAlign: 'center', padding: '4rem 0' },
  emptyCartButton: { display: 'inline-block', marginTop: '1.5rem', background: '#bfa181', color: '#fff', padding: '0.8rem 2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 600 },
};