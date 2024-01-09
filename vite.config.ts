import { ConfigEnv, UserConfig, defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path, { resolve } from "path";
import { wrapperEnv } from "./src/utils/getEnv";
// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd());
  const viteEnv = wrapperEnv(env);
  return {
    plugins: [
      vue({
        script: {
          // 开启 defineModel
          defineModel: true
        }
      }),
    ],
    // * 打包去除 console.log && debugger
    esbuild: {
      pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        types: path.resolve(__dirname, 'types/')
      }
    },
    base: '',
    server: {
      open: true,
      cors: true,
      proxy: {
        '/baseAPI': {
          target: 'http://192.168.100.74:3002',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/baseAPI/, '')
        },
        '/iframeApi': {
          target: 'http://192.168.100.74:3001',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/iframeApi/, '')
        },
        // '/iframeApi': {
        //   target: 'http://localhost:6422',
        //   changeOrigin: true,
        //   rewrite: path => path.replace(/^\/iframeApi/, '')
        // }
      }
    }
  }

})
