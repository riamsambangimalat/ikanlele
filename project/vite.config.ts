import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

// Multi-page Vite config — each HTML page is a separate entry point
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        profil: fileURLToPath(new URL('./profil.html', import.meta.url)),
        kegiatan: fileURLToPath(new URL('./kegiatan.html', import.meta.url)),
        fasilitas: fileURLToPath(new URL('./fasilitas.html', import.meta.url)),
        prestasi: fileURLToPath(new URL('./prestasi.html', import.meta.url)),
        ppdb: fileURLToPath(new URL('./ppdb.html', import.meta.url)),
        kontak: fileURLToPath(new URL('./kontak.html', import.meta.url)),
      },
    },
  },
});
