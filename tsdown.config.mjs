// Plain JS loaded with `tsdown --config-loader native` (package.json "build"):
// on Node 20, which has no built-in TypeScript, tsdown otherwise loads its
// config through the optional "unrun" package and the build fails.
import {readFileSync} from 'node:fs';
import {defineConfig} from 'tsdown';

const {version} = JSON.parse(readFileSync('./package.json', 'utf8'));

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	sourcemap: true,
	clean: true,
	target: 'es2022',
	platform: 'node',
	// keep dist/index.js, index.cjs, index.d.ts, index.d.cts (package.json exports)
	fixedExtension: false,
	define: {__SDK_VERSION__: JSON.stringify(version)},
	banner: {js: `/* Copyright ${new Date().getFullYear()} Linkvite */`},
});
