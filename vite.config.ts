import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import alias from '@rollup/plugin-alias'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// mock server
import { viteMockServe } from 'vite-plugin-mock'
import Icons from 'unplugin-icons/vite'
const rootPath = resolve(__dirname)

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // css 配置修复warning: Deprecation Warning: The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0.
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          // Deprecation Warning: Global built-in functions are deprecated and will be removed in Dart Sass 3.0.0.
          quietDeps: true // Silence deprecation warnings from dependencies
        }
      }
    },
    plugins: [
      vue({
        script: {
          defineModel: true
        }
      }),
      vueJsx(),
      alias({
        entries: [
          {
            find: '@',
            replacement: resolve(rootPath, 'src')
          }
        ]
      }),
      {
        configureServer(server) {
          server.watcher.on('add', path => {
            if (path.includes('views') && path.endsWith('.vue')) {
              server.restart()
            }
          })
        }
      },
      viteMockServe({
        mockPath: './mock',
        // localEnabled: env.NODE_ENV === 'development',
        localEnabled: command === 'serve',
        watchFiles: true // 监视文件夹中的文件更改。 并实时同步到请求结果
      }),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core']
        // resolvers: [ ElementPlusResolver({importStyle: 'sass'}) ]
      }),
      Components({
        dirs: ['src/components/', 'src/layout/'],
        extensions: ['vue'],
        // directoryAsNamespace: true,
        deep: true,
        dts: true,
        include: [/\.vue$/, /\.vue\?vue/],
        exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/]
        // resolvers: [ ElementPlusResolver({ importStyle: 'sass'}) ]
      }),
      Icons({
        compiler: 'vue3',
        autoInstall: true
      })
    ],
    publicDir: './public',
    define: {
      BASE_URL: env.BASE_URL
    },
    preprocessorOptions: {
      scss: {
        // additionalData: `@use "@/public/assets/styles/element.scss" as *;`,
      }
    },
    server: {
      host: '127.0.0.1',
      port: 8001,
      open: true, // 自动打开浏览器
      cors: true, // 允许跨域
      strictPort: true // 端口占用直接退出
    },
    build: {
      chunkSizeWarningLimit: 2000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false,
          pure_funcs: ['console.log', 'console.info'],
          drop_debugger: true
        }
      },
      // outDir: '../public/admin',
      assetsDir: 'assets',
      rollupOptions: {
        input: './index.html',
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',

          entryFileNames: 'assets/js/[name]-[hash].js',

          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      }
    }
  }
})
