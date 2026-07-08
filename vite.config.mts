import vue from '@vitejs/plugin-vue';
import path, { resolve } from 'path';
import { defineConfig, loadEnv, type ConfigEnv } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import viteCompression from 'vite-plugin-compression2';
// @ts-ignore
import { svgBuilder } from './src/components/IconSelector/index';

import dns from 'node:dns';
dns.setDefaultResultOrder('verbatim');

const pathResolve = (dir: string) => {
	return resolve(__dirname, '.', dir);
};

const alias: Record<string, string> = {
	'/@': pathResolve('./src/'),
	'vue-i18n': 'vue-i18n/dist/vue-i18n.esm-bundler.js',
};

const viteConfig = defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, process.cwd());
	// 判断是否开发环境
	const isDev = env.ENV === 'development';
	return {
		plugins: [
			vue(), // Vue 插件
			svgBuilder('./src/assets/icons/'), // 将 SVG 文件转换成 Vue 组件
			vueSetupExtend(), // setup语法糖增强插件
			AutoImport({
				imports: [
					'vue',
					'vue-router',
					'pinia',
					{
						'/@/utils/globalProperties': ['baseURL'],
					},
				],
				dts: './auto-imports.d.ts', // 自动导入类型定义文件路径
			}),
			viteCompression({
				deleteOriginalAssets: false, // 压缩后是否删除原始文件
			}),
		],
		root: process.cwd(), // 项目根目录
		resolve: { alias }, // 路径别名配置
		base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		optimizeDeps: {
			include: ['element-plus/es/locale/lang/zh-cn', 'element-plus/es/locale/lang/en'],
		},
		server: {
			host: '0.0.0.0', // 服务器地址
			port: env.VITE_PORT as unknown as number, // 服务器端口号
			open: env.VITE_OPEN === 'true', // 是否自动打开浏览器
			allowedHosts: true as const, // 允许外部访问
			hmr: true, // 启用热更新
			proxy: {
				'/api': {
					target: env.VITE_ADMIN_PROXY_PATH, // 目标服务器地址
					ws: true, // 是否启用 WebSocket
					changeOrigin: true, // 是否修改请求头中的 Origin 字段
					rewrite: (path: string) => path.replace(/^\/api/, ''),
				},
				'^/ws/info/.*': {
					target: env.VITE_ADMIN_PROXY_PATH, // 目标服务器地址
					ws: true, // 是否启用 WebSocket
					changeOrigin: true,
				},
			},
		},
		build: {
			outDir: 'dist', // 打包输出目录
			chunkSizeWarningLimit: 1500, // 代码分包阈值
			assetsInlineLimit: 0, // 禁止资源内联，确保所有 SVG 生成独立文件
			cssMinify: 'esbuild', // 避免 Lightning CSS 误判 Vue :deep() 选择器
			// 开发使用 esbuild 更快，生产环境打包使用 terser 可以删除更多注释
			minify: isDev ? ('esbuild' as const) : ('terser' as const),
			terserOptions: {
				compress: {
					// 只删除 log/info/debug，保留 console.error / console.warn 便于生产排查
					pure_funcs: ['console.log', 'console.info', 'console.debug'],
					drop_debugger: true, // 删除 debugger
				},
				format: {
					comments: false, // 删除所有注释
				},
			},
			rolldownOptions: {
				output: {
					entryFileNames: `assets/[name].[hash].js`,
					chunkFileNames: `assets/[name].[hash].js`,
					assetFileNames: `assets/[name].[hash].[ext]`,
					codeSplitting: {
						groups: [
							{
								name: 'vue',
								test: /node_modules[\\/](vue|vue-router|pinia)[\\/]/,
								priority: 2,
							},
							{
								name: 'echarts',
								test: /node_modules[\\/]echarts[\\/]/,
								priority: 1,
							},
						],
					},
				},
			},
		},
		css: {
			preprocessorOptions: {
				css: { charset: false },
				scss: {
					api: 'modern-compiler', // 使用现代 Sass API,消除 legacy-js-api 警告
				},
			},
		},
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
			__VERSION__: JSON.stringify(process.env.npm_package_version),
			__NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
		},
	};
});

export default viteConfig;
