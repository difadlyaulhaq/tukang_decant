import { defineConfig } from 'astro/config';
import react from "@astrojs/react"; // <-- Tambahkan ini

export default defineConfig({
  integrations: [react()] // <-- Tambahkan ini
});