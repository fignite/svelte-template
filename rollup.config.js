// import 'dotenv/config';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import { readFileSync, existsSync, mkdirSync, readdir, unlink } from 'fs'
import { globalStyle } from 'svelte-preprocess';
import strip from '@rollup/plugin-strip';
import json from '@rollup/plugin-json'
import svg from 'rollup-plugin-svg';
import typescript from 'rollup-plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-node-polyfills'
const figmaBuildOptions = require('./figma.config.js')
import path from 'path'

/* Inline to single html */
import htmlBundle from 'rollup-plugin-html-bundle';

const production = !process.env.ROLLUP_WATCH;

function createConfigFromManifest(options) {

	const uiConfig = {
		output: {
			format: 'iife',
			name: 'ui',
			file: `${options.src}/ui/build/bundle.js`
		},
		plugins: [
			svelte({
				// enable run-time checks when not in production
				// dev: !production,
				preprocess: [globalStyle()]
			}),
			// strip({
			// 	labels: ['unittest'],
			// 	functions: ['console.*']
			// }),

			// If you have external dependencies installed from
			// npm, you'll most likely need these plugins. In
			// some cases you'll need additional configuration —
			// consult the documentation for details:¡
			// https://github.com/rollup/plugins/tree/master/packages/commonjs
			resolve({
				browser: true,
				dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
				extensions: ['.svelte', '.mjs', '.js', '.json', '.node']
			}),
			json(),
			commonjs(),
			svg(),
			postcss(),



			// In dev mode, call `npm run start` once
			// the bundle has been generated
			!production && serve(),

			// Watch the `dist` directory and refresh the
			// browser on changes when not in production
			!production && livereload(options.dest),

			// If we're building for production (npm run build
			// instead of npm run dev), minify
			production && terser()
		],
		watch: {
			clearScreen: false
		}
	}

	const codeConfig = {
		output: {
			file: `${options.dest}/code.js`,
			format: 'cjs',
			name: 'code'
		},
		plugins: [
			typescript(),
			nodePolyfills(),
			nodeResolve(),
			// strip(),
			replace({
				'process.env.PKG_PATH': JSON.stringify(process.cwd() + '/package.json'),
				'process.env.VERSIONS_PATH': JSON.stringify(process.cwd() + '/.plugma/versions.json')
			}),
			json(),
			commonjs(),
			production && terser(),
		]
	}

	var manifestPath = options.manifest || 'manifest.json'

	if (existsSync(manifestPath)) {
		var data = readFileSync('manifest.json', 'utf8');

		// if (err) {
		// 	console.error(err);
		// 	return;
		// }

		var obj = JSON.parse(data)

		var inputs = {}

		if (typeof obj.ui === 'string' || obj.ui instanceof String) {
			// If it's just a string then, give it a key of html. We do this because this is a single view
			inputs = {
				ui: {
					html: obj.ui
				}
			}
		}
		else {
			inputs = { ui: obj.ui }
		}

		if (obj.main) {
			inputs.code = obj.main
		}

		if (existsSync(options.dest)) {
			// If directory exists then delete it's contents
			readdir(options.dest, (err, files) => {
				if (err) throw err;

				for (const file of files) {
					unlink(path.join(options.dest, file), (err) => {
						if (err) throw err;
					});
				}
			});
		}
		else {
			mkdirSync(options.dest)
		}

		// Look through inputs
		var configs = []
		for (const [key, value] of Object.entries(inputs)) {

			if (key === "ui") {
				var ui = value

				for (const [key, value] of Object.entries(ui)) {

					if (key === "html") {
						console.log(`src/${key}/${value}`)
						uiConfig.input = `${options.src}/ui/main.js`

						if (!existsSync(uiConfig.input)) {
							throw (`${uiConfig.input} doesn't exist`)
						}
					}
					else {

						let filename = path.basename(value)
						let extname = path.extname(filename)

						if (extname.toLocaleLowerCase() === ".html") {
							uiConfig.input = `${options.src}/ui/${key}/main.js`

							if (!existsSync(uiConfig.input)) {
								throw (`${uiConfig.input} doesn't exist`)
							}
						}

					}

					uiConfig.plugins.push(htmlBundle({
						template: `${options.src}/ui/template.html`,
						target: `${value}`,
						inline: true
					}))
					configs.push(uiConfig)
				}

			}

			if (key === "code" && options.code !== false) {
				codeConfig.input = `${options.src}/code/code.ts`
				configs.push(codeConfig)

				if (!existsSync(codeConfig.input)) {
					throw (`${codeConfig.input} doesn't exist`)
				}
			}
		}

	}
	else {
		throw ("Can't find manifest.json")
	}

	return configs
}

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default createConfigFromManifest(figmaBuildOptions);
