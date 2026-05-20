/**
 * Buddy Workspace environment compatibility shim.
 *
 * Keep this file tiny and dependency-free. It lets Buddy deployments use
 * BUDDY_* names while preserving the upstream Hermes Workspace runtime
 * contracts and legacy CLAUDE_* fallbacks.
 */

const aliases = [
  ['BUDDY_API_URL', 'HERMES_API_URL'],
  ['BUDDY_DASHBOARD_URL', 'HERMES_DASHBOARD_URL'],
  ['BUDDY_API_TOKEN', 'HERMES_API_TOKEN'],
  ['BUDDY_PASSWORD', 'HERMES_PASSWORD'],
  ['BUDDY_HOME', 'HERMES_HOME'],
  ['BUDDY_WORKSPACE_DIR', 'HERMES_WORKSPACE_DIR'],
  ['BUDDY_WORKSPACE_STATE_DIR', 'HERMES_WORKSPACE_STATE_DIR'],
  ['BUDDY_AGENT_PATH', 'HERMES_AGENT_PATH'],
  ['BUDDY_DEFAULT_MODEL', 'HERMES_DEFAULT_MODEL'],
  ['BUDDY_ALLOW_INSECURE_REMOTE', 'HERMES_ALLOW_INSECURE_REMOTE'],
]

for (const [buddyName, hermesName] of aliases) {
  const buddyValue = process.env[buddyName]
  if (buddyValue && !process.env[hermesName]) {
    process.env[hermesName] = buddyValue
  }
}

// The workspace still contains upstream-compatible CLAUDE_* fallbacks in a
// few places. Mirror Buddy values there only when neither Hermes nor Claude
// already provided an explicit value.
const legacyAliases = [
  ['BUDDY_API_URL', 'CLAUDE_API_URL'],
  ['BUDDY_DASHBOARD_URL', 'CLAUDE_DASHBOARD_URL'],
  ['BUDDY_API_TOKEN', 'CLAUDE_API_TOKEN'],
  ['BUDDY_PASSWORD', 'CLAUDE_PASSWORD'],
  ['BUDDY_HOME', 'CLAUDE_HOME'],
  ['BUDDY_DEFAULT_MODEL', 'CLAUDE_DEFAULT_MODEL'],
  ['BUDDY_ALLOW_INSECURE_REMOTE', 'CLAUDE_ALLOW_INSECURE_REMOTE'],
]

for (const [buddyName, legacyName] of legacyAliases) {
  const buddyValue = process.env[buddyName]
  if (buddyValue && !process.env[legacyName]) {
    process.env[legacyName] = buddyValue
  }
}
