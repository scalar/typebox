# Publishing to npm

Pushing a release tag runs `publish-npm.yml`, which builds and checks the package,
then publishes the generated tarball as `@scalar/typebox` with public access.
Update the version in `package.json` and `package-lock.json` before tagging a new release.

## Configure the trusted publisher

A package maintainer must configure the following trusted publisher in the
[`@scalar/typebox` package settings](https://www.npmjs.com/package/@scalar/typebox/access)
before the next release:

| Setting | Value |
| --- | --- |
| Provider | GitHub Actions |
| Organization or user | `scalar` |
| Repository | `typebox` |
| Workflow filename | `publish-npm.yml` |
| Environment name | Leave empty |
| Allowed actions | Allow direct publishing with `npm publish` |

The workflow runs on a GitHub-hosted runner using Node 26 and its bundled npm.
Trusted publishing requires npm 11.5.1 or later. The job's `id-token: write`
permission lets npm authenticate using OIDC without `NPM_TOKEN` or
`NODE_AUTH_TOKEN`. The package's `repository.url` must match `scalar/typebox`
so npm can generate provenance for the published package.

Create the trust configuration close to the release: npm currently requires its
first successful publish within two days. An expired configuration must be
recreated. After the first successful OIDC release, remove the unused GitHub
`NPM_TOKEN` secret and revoke the old npm publishing token if nothing else uses it.

See [npm's trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/)
for setup details and troubleshooting.
