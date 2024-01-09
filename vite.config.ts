import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from 'vite-imagetools';
import vsharp from 'vite-plugin-vsharp';

const DEFAULT_OPTIONS = {
  test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
  exclude: undefined,
  include: undefined,
  includePublic: true,
  logStats: true,
  ansiColors: true,
  svg: {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            cleanupNumericValues: false,
            removeViewBox: false, // https://github.com/svg/svgo/issues/1128
          },
          cleanupIDs: {
            minify: false,
            remove: false,
          },
          convertPathData: false,
        },
      },
      'sortAttrs',
      {
        name: 'addAttributesToSVGElement',
        params: {
          attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
        },
      },
    ],
  },
  png: {
    // https://sharp.pixelplumbing.com/api-output#png
    quality: 50,
  },
  jpeg: {
    // https://sharp.pixelplumbing.com/api-output#jpeg
    quality: 50,
  },
  jpg: {
    // https://sharp.pixelplumbing.com/api-output#jpeg
    quality: 50,
  },
  tiff: {
    // https://sharp.pixelplumbing.com/api-output#tiff
    quality: 50,
  },
  // gif does not support lossless compression
  // https://sharp.pixelplumbing.com/api-output#gif
  gif: {},
  webp: {
    // https://sharp.pixelplumbing.com/api-output#webp
    lossless: true,
  },
  avif: {
    // https://sharp.pixelplumbing.com/api-output#avif
    lossless: true,
  },
  cache: false,
  cacheLocation: undefined,
};
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    //ViteImageOptimizer(DEFAULT_OPTIONS),
    vsharp({
      width: 800, // Max width, images with a smaller width than this will not be resized
      height: 800, // Max height, images with a smaller height than this will not be resized
      scale: 0.8, // Overrides width and height
    }),
    imagetools()
  ],
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes("node_modules")) {
  //           return id
  //             .toString()
  //             .split("node_modules/")[1]
  //             .split("/")[0]
  //             .toString();
  //         }
  //       },
  //     },
  //   },
  // },
});
