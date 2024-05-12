# Example Project

## Installing

Simplest approach is to follow [GitHub's documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token).

This repo includes a `.npmrc` file, just provide the environment variable `GITHUB_AUTH_TOKEN` with a (classic) github access token with the "read:packages" scope.

```sh
npm install
```

or

```sh
GITHUB_AUTH_TOKEN="ghp_lettersandnumbers" npm install
```

## Building

```sh
npm run build
```

## Running

```sh
node my-parser
```

You can change the name of the output in the `tsconfig.json` file.
