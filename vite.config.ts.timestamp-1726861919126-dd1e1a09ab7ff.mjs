// vite.config.ts
import { defineConfig } from "file:///Users/zhou/Desktop/code/redi-vue-binding/node_modules/.pnpm/vite@5.2.10_@types+node@22.5.5/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/zhou/Desktop/code/redi-vue-binding/node_modules/.pnpm/@vitejs+plugin-vue@5.0.4_vite@5.2.10_@types+node@22.5.5__vue@3.4.26_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///Users/zhou/Desktop/code/redi-vue-binding/node_modules/.pnpm/vite-plugin-dts@3.9.0_@types+node@22.5.5_rollup@4.17.1_typescript@5.4.5_vite@5.2.10_@types+node@22.5.5_/node_modules/vite-plugin-dts/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [vue(), dts()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "redi-vue-binding",
      formats: ["es"]
    },
    rollupOptions: {
      external: ["vue", "@vueuse/core", "@wendellhu/redi"],
      output: {
        globals: {
          vue: "Vue"
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvemhvdS9EZXNrdG9wL2NvZGUvcmVkaS12dWUtYmluZGluZ1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3pob3UvRGVza3RvcC9jb2RlL3JlZGktdnVlLWJpbmRpbmcvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3pob3UvRGVza3RvcC9jb2RlL3JlZGktdnVlLWJpbmRpbmcvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcblxuLy8gXHU1MTk5XHU0RTAwXHU0RTJBIHZpdGUgdnVlIFx1NTMwNVx1NzY4NFx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3Z1ZSgpLCBkdHMoKV0sXG4gIGJ1aWxkOiB7XG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogJ3NyYy9pbmRleC50cycsXG4gICAgICBuYW1lOiAncmVkaS12dWUtYmluZGluZycsXG4gICAgICBmb3JtYXRzOiBbJ2VzJ10sXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBleHRlcm5hbDogWyd2dWUnLCAnQHZ1ZXVzZS9jb3JlJywgJ0B3ZW5kZWxsaHUvcmVkaSddLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICB2dWU6ICdWdWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlMsU0FBUyxvQkFBb0I7QUFDMVUsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sU0FBUztBQUdoQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUFBLEVBQ3RCLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxJQUFJO0FBQUEsSUFDaEI7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxPQUFPLGdCQUFnQixpQkFBaUI7QUFBQSxNQUNuRCxRQUFRO0FBQUEsUUFDTixTQUFTO0FBQUEsVUFDUCxLQUFLO0FBQUEsUUFDUDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
