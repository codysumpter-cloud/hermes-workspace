import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

/**
 * Resolve the Buddy/Hermes workspace state directory.
 *
 * Priority:
 * 1. `BUDDY_WORKSPACE_STATE_DIR` / `HERMES_WORKSPACE_STATE_DIR`
 * 2. `join(BUDDY_HOME, 'workspace')`
 * 3. `join(HERMES_HOME, 'workspace')`
 * 4. `join(CLAUDE_HOME, 'workspace')` for legacy deployments
 * 5. `~/.hermes/workspace`
 *
 * The returned path is absolute and resolved. Callers should create the
 * directory at startup if it doesn't exist.
 */
export function getStateDir(): string {
  const explicit =
    process.env.BUDDY_WORKSPACE_STATE_DIR?.trim() ??
    process.env.HERMES_WORKSPACE_STATE_DIR?.trim()
  if (explicit) return resolve(explicit)

  const workspaceHome =
    process.env.BUDDY_HOME?.trim() ??
    process.env.HERMES_HOME?.trim() ??
    process.env.CLAUDE_HOME?.trim() ??
    join(homedir(), '.hermes')

  return resolve(join(workspaceHome, 'workspace'))
}
