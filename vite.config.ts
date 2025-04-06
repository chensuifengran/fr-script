import { defineConfig } from "vite";
// import legacy from '@vitejs/plugin-legacy'
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
import path from "path";
import UnoCSS from "unocss/vite";
import { hotUpdatePlugin } from "./vitePlugins/hotUpdate";
import { VueHooksPlusResolver } from "@vue-hooks-plus/resolvers";
// import { visualizer } from "rollup-plugin-visualizer";
import compression from "vite-plugin-compression";
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      UnoCSS(),
      hotUpdatePlugin(),
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver(), VueHooksPlusResolver()],
        imports: [
          "vue",
          "vue-router",
          // 添加其他需要自动导入的模块
        ],
        dts: "./src/types/auto_gen_types/auto-imports.d.ts",
        dirs: [
          "./src/api/**",
          "./src/hooks/**",
          "./src/router/**",
          "./src/store/**",
          "./src/types/**",
          "./src/utils/**",
          "./src/*.ts",
          "./src/invokes/*.ts",
        ],
      }),
      Components({
        resolvers: [
          ElementPlusResolver(), // 自动注册图标组件
        ],
        dts: "./src/types/auto_gen_types/components.d.ts",
        dirs: ["./src/components/**", "./src/pages/**", "./src/views/**"],
      }),
      // visualizer({
      //   // 可选：指定输出文件的位置，默认为 bundle-stats.html
      //   filename: "./dist/bundle-stats.html",
      //   // 可选：开启 gzip 压缩分析
      //   gzipSize: true,
      // }),
      compression({
        algorithm: "gzip", // 指定压缩算法为gzip
        threshold: 1024, // 大于1KB的文件才压缩
        disable: !mode.includes("play"), // 仅play模式打包开启压缩
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler",
        },
      },
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              },
            },
          },
        ],
      },
    },
    // prevent vite from obscuring rust errors
    clearScreen: false,
    // Tauri expects a fixed port, fail if that port is not available
    server: {
      strictPort: true,
      port: mode.includes("play") ? 5174 : 5173,
    },
    // to make use of `TAURI_PLATFORM`, `TAURI_ARCH`, `TAURI_FAMILY`,
    // `TAURI_PLATFORM_VERSION`, `TAURI_PLATFORM_TYPE` and `TAURI_DEBUG`
    // env variables
    envPrefix: ["VITE_", "TAURI_"],
    build: {
      // Tauri uses Chromium on Windows and WebKit on macOS and Linux
      target: mode.includes("play")
        ? "ESNext"
        : process.env.TAURI_PLATFORM == "windows"
        ? "chrome105"
        : "safari13",
      // don't minify for debug builds
      minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
      // 为调试构建生成源代码映射 (sourcemap)
      sourcemap: !!process.env.TAURI_DEBUG,
      outDir: "dist",
      rollupOptions: {
        output: {
          manualChunks(id) {
            //assets/scss
            if (id.includes("assets/scss")) {
              return "styles";
            }
            //src/invokes
            if (id.includes("src/invokes")) {
              return "invokes";
            }
            // //monaco-editor
            // const vsPart = "monaco-editor/esm/vs/";
            // if (id.includes(vsPart)) {
            //   let vsName = id.split(vsPart)[1].split("/")[0];
            //   const subParts = [
            //     "base",
            //     "editor",
            //     "browser",
            //     "common",
            //     "contrib",
            //   ];
            //   if (id.includes(`${vsPart}editor`)) {
            //     const subEditorParts = ["browser", "common", "contrib"];
            //     for (const part of subEditorParts) {
            //       if (id.includes(`${vsPart}editor/${part}`)) {
            //         const partName = id
            //
            //           .split(`${vsPart}editor/${part}/`)[1]
            //           .split("/")[0];
            //         vsName += `-${partName}`;
            //         break;
            //       }else{
            //         vsName += `-${part}`;
            //       }
            //     }
            //   } else {
            //     for (const part of subParts) {
            //       if (id.includes(`${vsPart}${part}`)) {
            //         const partName = id
            //
            //           .split(`${vsPart}${part}/`)[1]
            //           .split("/")[0];
            //         vsName += `-${partName}`;
            //         break;
            //       }
            //     }
            //   }
            //   return "vs-" + vsName;
            // }
            if (id.includes("node_modules")) {
              const names = id.split("node_modules/");
              return names[names.length - 1].split("/")[0];
            }
          },
        },
      },
    },
    // 强制预构建插件包
    optimizeDeps: {
      include: [
        `monaco-editor/esm/vs/language/json/json.worker`,
        `monaco-editor/esm/vs/language/css/css.worker`,
        `monaco-editor/esm/vs/language/html/html.worker`,
        `monaco-editor/esm/vs/language/typescript/ts.worker`,
        `monaco-editor/esm/vs/editor/editor.worker`,
        "element-plus/es/components/**/style/index*", // 强制预构建 element-plus 的样式
      ],
    },
  };
});
