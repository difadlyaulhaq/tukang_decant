import{r as f,g as l,c as p,u as g,a as d,b as h}from"./cartStore.CTNzjfxz.js";function b(){const r=document.getElementById("cart-container");if(!r){console.error("Cart container not found");return}function o(t){return typeof t!="number"||isNaN(t)?(console.error("formatRupiah received invalid input:",t),"Rp 0"):"Rp "+t.toLocaleString("id-ID")}function u(t){const a=typeof t=="object"&&t!==null&&typeof t.id=="string"&&typeof t.brand=="string"&&typeof t.name=="string"&&typeof t.size=="number"&&typeof t.price=="number"&&typeof t.image=="string"&&typeof t.quantity=="number"&&t.quantity>0;return a||(console.log("Invalid item detected:",t),console.log("Item validation details:",{isObject:typeof t=="object",notNull:t!==null,hasId:typeof t?.id=="string",hasBrand:typeof t?.brand=="string",hasName:typeof t?.name=="string",hasSize:typeof t?.size=="number",hasPrice:typeof t?.price=="number",hasImage:typeof t?.image=="string",hasQuantity:typeof t?.quantity=="number",quantityPositive:t?.quantity>0})),a}function c(){if(r)try{const t=h();console.log("Raw items from store:",t);const a=t.filter(u);if(console.log("Valid cart items after filtering:",a),a.length===0){r.innerHTML=`
          <div class="cart-empty">
            <h3>Keranjang Anda masih kosong</h3>
            <p>Belum ada produk yang ditambahkan ke keranjang.</p>
            <a href="/product/all" class="cart-shop-btn">Mulai Belanja</a>
          </div>
        `;return}const n=l();console.log("Cart total:",n);const i=a.map(e=>{const s=e.price*e.quantity;return`
          <tr>
            <td><img src="${e.image}" alt="${e.brand}" class="cart-img-preview" /></td>
            <td>
              <div class="cart-item-brand">${e.brand}</div>
              <div class="cart-item-name">${e.name}</div>
              <div class="cart-item-size">${e.size}ml</div>
            </td>
            <td>${o(e.price)}</td>
            <td>
              <input type="number" min="1" max="99" value="${e.quantity}" class="cart-quantity-input" data-id="${e.id}" />
            </td>
            <td>${o(s)}</td>
            <td><button class="cart-delete-btn" data-id="${e.id}" title="Hapus item">🗑️</button></td>
          </tr>
        `}).join("");r.innerHTML=`
        <table class="cart-table">
          <thead>
            <tr>
              <th>Gambar</th>
              <th>Produk</th>
              <th>Harga</th>
              <th>Jumlah</th>
              <th>Subtotal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${i}
          </tbody>
        </table>
        <div class="cart-summary">
          <div class="cart-total">Total: ${o(n)}</div>
          <div class="cart-actions">
            <button class="cart-clear-btn">Kosongkan Keranjang</button>
            <div>
              <a href="/product/all" class="cart-shop-btn">Lanjut Belanja</a>
              <button class="cart-checkout-btn">Checkout</button>
            </div>
          </div>
        </div>
      `}catch(t){console.error("Error rendering cart:",t),r.innerHTML=`
        <div class="error-message">
          <h3>Terjadi kesalahan saat memuat keranjang</h3>
          <p>Silakan refresh halaman atau hubungi support jika masalah berlanjut.</p>
          <button onclick="location.reload()" class="cart-shop-btn">Refresh</button>
        </div>
      `}}r.addEventListener("click",t=>{const a=t.target;if(a){if(a.classList.contains("cart-delete-btn")){const n=a.dataset.id;n&&confirm("Apakah Anda yakin ingin menghapus item ini?")&&f(n)}if(a.classList.contains("cart-checkout-btn")){const n=l();n>0&&alert(`Total belanja: ${o(n)}
Fitur checkout akan segera tersedia!`)}a.classList.contains("cart-clear-btn")&&confirm("Apakah Anda yakin ingin mengosongkan keranjang?")&&p()}}),r.addEventListener("change",t=>{const a=t.target;if(a&&a.classList.contains("cart-quantity-input")){const n=a.dataset.id,i=parseInt(a.value,10);if(n&&!isNaN(i)&&i>0)g(n,i);else if(n&&(isNaN(i)||i<=0)){const s=d.get()[n];s&&typeof s=="object"&&s.quantity&&(a.value=s.quantity.toString())}}}),c(),d.subscribe(()=>{console.log("Cart updated, re-rendering..."),c()})}document.addEventListener("DOMContentLoaded",b);
