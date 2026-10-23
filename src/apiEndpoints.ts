/**
 * ==============================================================================
 * Nationrise CaseOS - Centralized Backend API Endpoints & Path Variables
 * ==============================================================================
 * All backend API route paths are defined in this single file as variables/constants.
 * Imported and consumed by src/api.ts and other modules.
 * ==============================================================================
 */

// 1. Clients Endpoints
export const CLIENTS_BASE_PATH = '/clients' as const
export const getClientDetailPath = (id: string) =>
  `${CLIENTS_BASE_PATH}/${encodeURIComponent(id)}`
export const getClientMattersPath = (clientId: string) =>
  `${CLIENTS_BASE_PATH}/${encodeURIComponent(clientId)}/matters`

// 2. Matters Endpoints
export const MATTERS_BASE_PATH = '/matters' as const
export const getMatterDetailPath = (id: string) =>
  `${MATTERS_BASE_PATH}/${encodeURIComponent(id)}`
export const getMatterStagePath = (id: string) =>
  `${MATTERS_BASE_PATH}/${encodeURIComponent(id)}/stage`
export const getMatterSubmissionDuePath = (id: string) =>
  `${MATTERS_BASE_PATH}/${encodeURIComponent(id)}/submission-due`
export const getMatterContactsPath = (matterId: string) =>
  `${MATTERS_BASE_PATH}/${encodeURIComponent(matterId)}/contacts`
export const getMatterSubmissionPath = (matterId: string) =>
  `${MATTERS_BASE_PATH}/${encodeURIComponent(matterId)}/submission`
export const getMatterDeadlinesPath = (matterId: string) =>
  `${MATTERS_BASE_PATH}/${encodeURIComponent(matterId)}/deadlines`
export const getResolveDeadlinePath = (matterId: string, index: number) =>
  `${MATTERS_BASE_PATH}/${encodeURIComponent(matterId)}/deadlines/${index}/resolve`

// 3. Appointments Endpoints
export const APPOINTMENTS_BASE_PATH = '/appointments' as const
export const getAppointmentDetailPath = (id: number | string) =>
  `${APPOINTMENTS_BASE_PATH}/${encodeURIComponent(id)}`
export const getAppointmentCellPath = (id: number | string) =>
  `${APPOINTMENTS_BASE_PATH}/${encodeURIComponent(id)}/cell`

// 4. Tasks Endpoints
export const TASKS_BASE_PATH = '/tasks' as const
export const getTaskDetailPath = (id: string) =>
  `${TASKS_BASE_PATH}/${encodeURIComponent(id)}`
export const getTaskCompletePath = (id: string) =>
  `${TASKS_BASE_PATH}/${encodeURIComponent(id)}/complete`
export const getTaskReassignPath = (id: string) =>
  `${TASKS_BASE_PATH}/${encodeURIComponent(id)}/reassign`
export const getTaskStatusPath = (id: string) =>
  `${TASKS_BASE_PATH}/${encodeURIComponent(id)}/status`

// 5. Procedural Fairness Letters (PFL) Endpoints
export const PFL_BASE_PATH = '/pfl' as const
export const getPflDetailPath = (id: string) =>
  `${PFL_BASE_PATH}/${encodeURIComponent(id)}`

// 6. Deadlines Endpoints
export const DEADLINES_BASE_PATH = '/deadlines' as const

// 7. Authentication Endpoints
export const AUTH_LOGIN_PATH = '/auth/token' as const
export const AUTH_ME_PATH = '/auth/me' as const
export const AUTH_LOGOUT_PATH = '/auth/logout' as const

// 8. Health / Diagnostics Endpoints
export const HEALTH_CHECK_PATH = '/health' as const

/**
 * Unified API Endpoints Dictionary
 */
export const API_ENDPOINTS = {
  CLIENTS: {
    BASE: CLIENTS_BASE_PATH,
    DETAIL: getClientDetailPath,
    MATTERS: getClientMattersPath
  },
  MATTERS: {
    BASE: MATTERS_BASE_PATH,
    DETAIL: getMatterDetailPath,
    STAGE: getMatterStagePath,
    SUBMISSION_DUE: getMatterSubmissionDuePath,
    CONTACTS: getMatterContactsPath,
    SUBMISSION: getMatterSubmissionPath,
    DEADLINES: getMatterDeadlinesPath,
    RESOLVE_DEADLINE: getResolveDeadlinePath
  },
  APPOINTMENTS: {
    BASE: APPOINTMENTS_BASE_PATH,
    DETAIL: getAppointmentDetailPath,
    CELL: getAppointmentCellPath
  },
  TASKS: {
    BASE: TASKS_BASE_PATH,
    DETAIL: getTaskDetailPath,
    COMPLETE: getTaskCompletePath,
    REASSIGN: getTaskReassignPath,
    STATUS: getTaskStatusPath
  },
  PFL: {
    BASE: PFL_BASE_PATH,
    DETAIL: getPflDetailPath
  },
  DEADLINES: {
    BASE: DEADLINES_BASE_PATH
  },
  AUTH: {
    LOGIN: AUTH_LOGIN_PATH,
    ME: AUTH_ME_PATH,
    LOGOUT: AUTH_LOGOUT_PATH
  },
  HEALTH: {
    CHECK: HEALTH_CHECK_PATH
  }
} as const

export default API_ENDPOINTS
