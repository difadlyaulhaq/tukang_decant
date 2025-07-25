import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

/**
 * Mengambil daftar kategori unik dari koleksi 'products'.
 * @returns {Promise<Array<{name: string, slug: string}>>}
 */
export async function getProductCategories() {
    try {
        const products = await pb.collection('products').getFullList({
            fields: 'category', // Hanya ambil field kategori
        });

        // Buat daftar kategori yang unik
        const uniqueCategories = [...new Set(products.map(p => p.category))];

        // Format data agar sesuai untuk menu dropdown
        return uniqueCategories.map(category => ({
            name: category.charAt(0).toUpperCase() + category.slice(1), // Contoh: 'men' -> 'Men'
            slug: category.toLowerCase(),
        }));

    } catch (error) {
        console.error("Error fetching categories:", error);
        return []; // Kembalikan array kosong jika gagal
    }
}