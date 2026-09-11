# Nine Gates Mahjong deployment contract

**A push to `master` is the deployment trigger. Cloudflare is the deployment
engine. GitHub Actions is not required to deploy.**

Note the production branch is **`master`**, not `main`.

## Contract

| Field | Value |
|---|---|
| Repository | `alexdevriesxing/nine-gates-mahjong` |
| Cloudflare Worker | `nine-gates-mahjong` |
| Production domains | `ninegatesmahjong.com`, `www.ninegatesmahjong.com` |
| Production branch | `master` |
| Root directory | repository root |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Worker entry | `src/worker/entry.ts` |
| Static assets | `./dist` (binding `ASSETS`, SPA not-found handling) |
| Node version | 22 |
| Deployment type | **Worker with static assets** — not Pages |
| Wrangler fallback | `npm run build && npx wrangler deploy` |

## Connect Git (Workers Builds)

This is a **Worker**, not a Pages project, so it connects through **Workers
Builds** rather than the Pages Git integration.

**Cloudflare Dashboard → Workers & Pages → `nine-gates-mahjong` → Settings →
Build → Connect to Git**

| Setting | Value |
|---|---|
| Repository | `alexdevriesxing/nine-gates-mahjong` |
| Production branch | `master` |
| Root directory | *(empty — repository root)* |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |

Once connected, every push to `master` builds and deploys automatically.

`npm run build` typechecks and builds the production assets, so a type error
fails the build and Cloudflare keeps serving the previous deployment.

## Bindings

From `wrangler.toml`, applied by `wrangler deploy`:

- **Durable Object** `MAHJONG_ROOM` → `MahjongRoom`
- **D1** `DB` → database `nine-gates-mahjong`
- **Assets** `ASSETS` → `./dist`, SPA not-found handling, `run_worker_first`

The Durable Object migration (`v1`) is declared in `wrangler.toml` and applied
by `wrangler deploy`, so a Git-integration build applies the same one as the
CLI.

## The D1 schema step is deliberately NOT automatic

The old workflow ran the initial schema file against production D1 on every
push:

```sh
npx wrangler d1 execute DB --remote --file=src/worker/db/migrations/0001_initial.sql
```

That coupled a code deploy to a database write. Workers Builds deploys code
only. Apply schema changes explicitly, once, from an authenticated environment
before the deploy that needs them:

```sh
npx wrangler d1 execute DB --remote --file=src/worker/db/migrations/0001_initial.sql
```

The file is idempotent, so re-running it is safe. Additional migrations live in
`src/worker/db/migrations` (`migrations_dir` in `wrangler.toml`).

## Emergency fallback (Wrangler)

```sh
export CLOUDFLARE_API_TOKEN=...    # never commit
export CLOUDFLARE_ACCOUNT_ID=...
npm ci
npm run build
npx wrangler deploy
```

## Rollback

Cloudflare Dashboard → Workers & Pages → `nine-gates-mahjong` → Deployments → a
known good version → Rollback. Otherwise `git revert <bad commit>` and push to
`master`.

A rollback reverts code only. It does not undo an applied schema change.

## GitHub Actions

`.github/workflows/deploy.yml` is a manual (`workflow_dispatch`) fallback and is
not the production path. It previously ran on push to `master` and was the only
way this repository deployed.

Actions is currently budget-blocked on this account: runs end in about four
seconds with `steps: []` and "The job was not started because an Actions budget
is preventing further use". That is a billing setting at
https://github.com/settings/billing. Until Workers Builds is connected as above,
this repository has no automatic deployment path.

`ci.yml` and `production-smoke.yml` report health and do not gate deployment.
