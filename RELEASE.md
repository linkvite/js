# Releasing @linkvite/js

Releases are automated with [changesets](https://github.com/changesets/changesets). You never run `npm publish` yourself: merging to `main` does it.

```
your PR (with a changeset) ──merge──▶ main ──▶ "Version Packages" PR (bumps version, writes CHANGELOG)
                                                     │
                                                   merge
                                                     ▼
                                         release.yml publishes to npm
```

## One-time setup

- **`NPM_TOKEN`** repo secret (Settings → Secrets and variables → Actions): an npm **granular access token** with read and write access to `@linkvite/js`. Tokens expire; if a release fails with `E401`/`E403`, make a new one.
- **Workflow permissions** (Settings → Actions → General): "Read and write permissions" and "Allow GitHub Actions to create and approve pull requests", so the action can open the Version Packages PR.

## Every release

### 1. If the API changed: refresh the spec

The SDK is generated from cultus's OpenAPI document. In cultus, `make openapi` writes `api/openapi.json`; then here:

```bash
pnpm generate --spec ../cultus/api/openapi.json   # copies the spec, regenerates src/generated
pnpm check                                         # generated code current, typecheck, tests
```

Use the spec from cultus's `main`, the API that's deployed, not a feature branch.

### 2. Add a changeset

```bash
pnpm changeset
```

Pick the bump and write one line for the changelog:

| Bump    | When                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------- |
| `patch` | Fixes, docs, new optional fields in responses                                                                 |
| `minor` | New methods or namespaces, new optional parameters                                                            |
| `major` | Removed or renamed methods, changed signatures, changed behaviour (e.g. an endpoint was removed from the API) |

Commit the generated `.changeset/*.md` with your changes and open a PR. CI runs `pnpm check` and the build.

### 3. Merge, then merge "Version Packages"

1. Merge your PR to `main`. The release workflow opens (or updates) a **Version Packages** PR that bumps `package.json`, updates `CHANGELOG.md` and deletes the consumed changesets. Several changesets roll into one release.
2. Review and merge **Version Packages**. The workflow runs `pnpm release:publish`: checks, build, `changeset publish` (with npm provenance), and a `v<version>` git tag.

### 4. Check it

```bash
npm view @linkvite/js version
```

Then try it in a scratch project: `npm i @linkvite/js@latest`.

## The first v4 release

The v4 branch already includes its changeset (`.changeset/openapi-v4.md`, major), so:

1. Merge the v4 PR. The workflow opens **Version Packages** for `3.0.0 → 4.0.0`.
2. Merge **Version Packages**; v4 is published.
3. In the extension repo, remove the `pnpm.overrides` entry for `@linkvite/js` (it points at `../js` until v4 is on npm) and run `pnpm install`.

To try it first, put it on the `next` tag (below) before merging.

## Pre-releases (try a major before everyone gets it)

```bash
pnpm changeset pre enter next   # versions become 4.0.0-next.0, published under the "next" tag
# add changesets and merge as usual; each Version Packages merge publishes a new -next.N
pnpm changeset pre exit         # back to normal; the next release is 4.0.0 on "latest"
```

Install a pre-release with `npm i @linkvite/js@next`.

## Publishing by hand (if CI is down)

```bash
npm login                 # an npm account with publish rights on @linkvite
pnpm changeset version    # bump and write the changelog; commit it
pnpm release:publish      # check, build, publish
git push --follow-tags
```

## If something goes wrong

- **Bad release:** publish a fixed patch. To steer people off the broken version: `npm deprecate @linkvite/js@4.0.1 "Broken: use 4.0.2"`. Don't unpublish: npm only allows it within 72 hours, and the version number can never be reused.
- **Wrong `latest`:** `npm dist-tag add @linkvite/js@4.0.2 latest`.
- **No Version Packages PR appeared:** the PR was merged without a changeset. Add one in a new PR.
