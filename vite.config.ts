import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from 'vite-imagetools';
import vsharp from 'vite-plugin-vsharp';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    vsharp({
      width: 800, // Max width, images with a smaller width than this will not be resized
      height: 800, // Max height, images with a smaller height than this will not be resized
      scale: 0.8, // Overrides width and height
    }),
    imagetools(),
  ],
    build: {
      // rollup manualChunks 來分離檔案較大的第三方套件
      rollupOptions: {
          output: {
              manualChunks: {
                  react: ['react', 'react-dom'],
                  firebase: ['@firebase/firestore', '@firebase/auth', '@firebase/app', '@firebase/storage'],
              }
          }
      }
    }
});
