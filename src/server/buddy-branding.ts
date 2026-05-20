export const BUDDY_WORKSPACE_NAME = 'Buddy Workspace'
export const BUDDY_WORKSPACE_TITLE = 'Buddy Workspace'
export const BUDDY_WORKSPACE_DESCRIPTION =
  'Command center for Buddy and Hermes agents — chat, orchestration, memory, skills, files, jobs, terminal, and swarm workflows.'

export const BUDDY_COMPATIBLE_BACKENDS = [
  'buddy-agent',
  'buddy-brain',
  'Omni-buddy',
  'Hermes Agent',
] as const

export function getBuddyCompatibleBackendLabel(): string {
  return BUDDY_COMPATIBLE_BACKENDS.join(', ')
}
