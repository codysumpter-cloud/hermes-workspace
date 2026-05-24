# syntax=docker/dockerfile:1.6
# Buddy Workspace — production Docker image
# Intended publish target: ghcr.io/codysumpter-cloud/buddy-workspace
#
# Build locally:
#   docker build -t buddy-workspace .
# Run against a local or remote Buddy/Hermes-compatible gateway:
#   docker run -p 3000:3000 -e BUDDY_API_URL=http://host.docker.internal:8642 buddy-workspace
#
FROM tianon/gosu:1.17-bookworm AS gosu_source
# ─── build stage ─────────────────────────────────────────────────────────
FROM node:22-slim AS build
RUN corepack enable && apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# Install deps (cache-friendly: copy only manifests first)
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy sources and build
COPY . .
RUN pnpm build

# ─── runtime stage ────────────────────────────────────────────────────────
FROM node:22-slim
# python3 is required by scripts/pty-helper.py (terminal feature).
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates curl tini python3 \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r workspace && useradd -r -g workspace -u 10010 -m workspace

COPY --from=gosu_source /gosu /usr/local/bin/gosu

WORKDIR /app

# Copy build artefacts + runtime deps.
# server-entry.js is the Node HTTP server that wraps the TanStack Start fetch
# handler exported by dist/server/server.js. buddy-env.js maps BUDDY_* env vars
# to upstream-compatible HERMES_* / CLAUDE_* names before server startup.
COPY --from=build --chown=workspace:workspace /app/dist ./dist
COPY --from=build --chown=workspace:workspace /app/node_modules ./node_modules
COPY --from=build --chown=workspace:workspace /app/package.json ./package.json
COPY --from=build --chown=workspace:workspace /app/server-entry.js ./server-entry.js
COPY --from=build --chown=workspace:workspace /app/buddy-env.js ./buddy-env.js
COPY --from=build --chown=workspace:workspace /app/skills ./skills
COPY --chown=workspace:workspace docker/entrypoint.sh /usr/local/bin/docker-entrypoint.sh

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    BUDDY_API_URL=http://buddy-agent:8642 \
    HERMES_API_URL=http://buddy-agent:8642

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/ >/dev/null || exit 1

ENTRYPOINT ["/usr/bin/tini", "--", "/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "--max-old-space-size=2048", "server-entry.js"]
