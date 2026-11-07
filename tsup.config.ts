import {readFileSync} from 'node:fs';
import {defineConfig} from 'tsup';

const {version} = JSON.parse(readFileSync('./package.json', 'utf8')) as {
	version: string;
};

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	sourcemap: true,
	clean: true,
	target: 'es2022',
	define: {__SDK_VERSION__: JSON.stringify(version)},
	banner: {js: `/* Copyright ${new Date().getFullYear()} Linkvite */`},
});
