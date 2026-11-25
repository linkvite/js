// openapi-typescript (scripts/generate.mjs) builds its output with the
// TypeScript 5 compiler API (ts.factory), which TypeScript 7's native
// compiler doesn't have. Give it its own TypeScript 5 instead of the
// project's TypeScript 7 (which typecheck, tests and the build use).
module.exports = {
	hooks: {
		readPackage(pkg) {
			if (pkg.name === 'openapi-typescript') {
				delete pkg.peerDependencies?.typescript;
				pkg.dependencies = {...pkg.dependencies, typescript: '^5.9.3'};
			}
			return pkg;
		},
	},
};
