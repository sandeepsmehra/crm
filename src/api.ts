/**
 * ==============================================================================
 * Nationrise CaseOS - Backend API Client
 * ==============================================================================
 * Backend base URL is configured exclusively via environment variables:
 * - VITE_API_BASE_URL (configured in .env / .env.development / .env.production)
 * ==============================================================================
 */

import type {
  Client,
  ClientKind,
  Matter,
  MatterStage,
  Appointment,
  OfficeTask,
  PFLRecord,
  DeadlineItem,
  ContactLogEntry,
  SubmissionRecord
} from '@/types/crm'

// Environment configuration loaded dynamically from Vite environment variables (.env files)
export const API_BASE_URL: string = (
  import.meta.env.VITE_API_BASE_URL || ''
).replace(/\/+$/, '')

export const API_TIMEOUT_MS: number = Number(import.meta.env.VITE_API_TIMEOUT) || 15000

if (!API_BASE_URL && typeof window !== 'undefined' && import.meta.env.DEV) {
  console.warn(
    '[api] VITE_API_BASE_URL is not defined in your .env file. Please ensure VITE_API_BASE_URL is set.'
  )
}

/**
 * Standard FastAPI Error Structure
 */
export interface FastAPIValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface FastAPIDetailError {
  detail: string | FastAPIValidationError[]
}

export class ApiError extends Error {
  public status: number
  public statusText: string
  public url: string
  public details?: unknown

  constructor(message: string, status: number, statusText: string, url: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
    this.url = url
    this.details = details
  }
}

/**
 * Token management helpers
 */
const TOKEN_KEY = 'nationrise_auth_token'

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string, remember = true): void {
  if (typeof window === 'undefined') return
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    sessionStorage.setItem(TOKEN_KEY, token)
  }
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
}

/**
 * Base Fetch Wrapper with timeout, authentication, and FastAPI error handling
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined | null>
  body?: unknown
  timeoutMs?: number
  token?: string
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    params,
    body,
    timeoutMs = API_TIMEOUT_MS,
    token = getAuthToken(),
    headers: customHeaders,
    ...fetchConfig
  } = options

  // Normalize endpoint URL
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  let fullUrl = `${API_BASE_URL}${normalizedEndpoint}`

  // Append query parameters if present
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${queryString}`
    }
  }

  // Setup abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  // Configure HTTP headers
  const headers = new Headers(customHeaders || {})
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }

  if (body !== undefined && !(body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const response = await fetch(fullUrl, {
      ...fetchConfig,
      headers,
      signal: controller.signal,
      body: body !== undefined ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined
    })

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T
    }

    // Try parsing JSON response
    const contentType = response.headers.get('content-type') || ''
    const isJson = contentType.includes('application/json')
    const responseData = isJson ? await response.json() : await response.text()

    if (!response.ok) {
      // Parse FastAPI detail message if available
      let errorMessage = `HTTP ${response.status} ${response.statusText}`
      if (responseData && typeof responseData === 'object' && 'detail' in responseData) {
        const detail = (responseData as FastAPIDetailError).detail
        if (typeof detail === 'string') {
          errorMessage = detail
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map((d) => `${d.loc.join('.')}: ${d.msg}`).join(', ')
        }
      } else if (typeof responseData === 'string' && responseData.trim()) {
        errorMessage = responseData
      }

      throw new ApiError(errorMessage, response.status, response.statusText, fullUrl, responseData)
    }

    return responseData as T
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err
    }
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(`Request timeout after ${timeoutMs}ms`, 408, 'Request Timeout', fullUrl)
    }
    const message = err instanceof Error ? err.message : 'Network request failed'
    throw new ApiError(message, 0, 'Network Error', fullUrl, err)
  } finally {
    clearTimeout(timeoutId)
  }
}

// Convenience HTTP Methods
export const http = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' })
}

// =============================================================================
// DOMAIN-SPECIFIC API CLIENTS
// =============================================================================

/**
 * 1. Clients API Service (/clients)
 */
export const clientsApi = {
  /**
   * GET /clients - Retrieve list of clients with optional filtering
   */
  getAll: (params?: {
    search?: string
    kind?: ClientKind
    type?: string
    limit?: number
    offset?: number
  }) => http.get<Client[]>('/clients', { params }),

  /**
   * GET /clients/:id - Retrieve client details by ID
   */
  getById: (id: string) => http.get<Client>(`/clients/${encodeURIComponent(id)}`),

  /**
   * POST /clients - Create a new client record
   */
  create: (client: Partial<Client>) => http.post<Client>('/clients', client),

  /**
   * PUT /clients/:id - Update existing client record
   */
  update: (id: string, client: Partial<Client>) =>
    http.put<Client>(`/clients/${encodeURIComponent(id)}`, client),

  /**
   * PATCH /clients/:id - Partially update client record
   */
  patch: (id: string, client: Partial<Client>) =>
    http.patch<Client>(`/clients/${encodeURIComponent(id)}`, client),

  /**
   * DELETE /clients/:id - Remove client record
   */
  delete: (id: string) => http.delete<{ success: boolean; id: string }>(`/clients/${encodeURIComponent(id)}`),

  /**
   * GET /clients/:id/matters - Retrieve matters associated with a client
   */
  getMatters: (clientId: string) =>
    http.get<Matter[]>(`/clients/${encodeURIComponent(clientId)}/matters`)
}

/**
 * 2. Matters API Service (/matters)
 */
export const mattersApi = {
  getAll: (params?: {
    owner?: string
    stage?: number
    retained?: boolean
    search?: string
    limit?: number
    offset?: number
  }) => http.get<Matter[]>('/matters', { params }),

  getById: (id: string) => http.get<Matter>(`/matters/${encodeURIComponent(id)}`),

  create: (matter: Partial<Matter>) => http.post<Matter>('/matters', matter),

  update: (id: string, matter: Partial<Matter>) =>
    http.put<Matter>(`/matters/${encodeURIComponent(id)}`, matter),

  patch: (id: string, matter: Partial<Matter>) =>
    http.patch<Matter>(`/matters/${encodeURIComponent(id)}`, matter),

  delete: (id: string) => http.delete<{ success: boolean }>(`/matters/${encodeURIComponent(id)}`),

  updateStage: (id: string, stage: MatterStage, stageName?: string) =>
    http.patch<Matter>(`/matters/${encodeURIComponent(id)}/stage`, { stage, stageName }),

  updateSubmissionDue: (id: string, submissionDue: string) =>
    http.patch<Matter>(`/matters/${encodeURIComponent(id)}/submission-due`, { submissionDue }),

  recordContact: (matterId: string, contact: ContactLogEntry) =>
    http.post<Matter>(`/matters/${encodeURIComponent(matterId)}/contacts`, contact),

  recordSubmission: (matterId: string, submission: SubmissionRecord) =>
    http.post<Matter>(`/matters/${encodeURIComponent(matterId)}/submission`, submission),

  addDeadline: (matterId: string, deadline: DeadlineItem) =>
    http.post<Matter>(`/matters/${encodeURIComponent(matterId)}/deadlines`, deadline)
}

/**
 * 3. Appointments API Service (/appointments)
 */
export const appointmentsApi = {
  getAll: (params?: {
    date?: string
    consultant?: string
    status?: string
    limit?: number
  }) => http.get<Appointment[]>('/appointments', { params }),

  getById: (id: number | string) =>
    http.get<Appointment>(`/appointments/${encodeURIComponent(id)}`),

  create: (appointment: Partial<Appointment>) =>
    http.post<Appointment>('/appointments', appointment),

  update: (id: number | string, appointment: Partial<Appointment>) =>
    http.put<Appointment>(`/appointments/${encodeURIComponent(id)}`, appointment),

  updateCell: (id: number | string, field: keyof Appointment, value: unknown) =>
    http.patch<Appointment>(`/appointments/${encodeURIComponent(id)}/cell`, { field, value }),

  delete: (id: number | string) =>
    http.delete<{ success: boolean }>(`/appointments/${encodeURIComponent(id)}`)
}

/**
 * 4. Office Tasks API Service (/tasks)
 */
export const tasksApi = {
  getAll: (params?: {
    assignedTo?: string
    status?: string
    priority?: string
  }) => http.get<OfficeTask[]>('/tasks', { params }),

  getById: (id: string) => http.get<OfficeTask>(`/tasks/${encodeURIComponent(id)}`),

  create: (task: Partial<OfficeTask>) => http.post<OfficeTask>('/tasks', task),

  update: (id: string, task: Partial<OfficeTask>) =>
    http.put<OfficeTask>(`/tasks/${encodeURIComponent(id)}`, task),

  complete: (id: string, result: string, completedBy: string) =>
    http.post<OfficeTask>(`/tasks/${encodeURIComponent(id)}/complete`, { result, completedBy }),

  reassign: (id: string, assignedTo: string) =>
    http.patch<OfficeTask>(`/tasks/${encodeURIComponent(id)}/reassign`, { assignedTo }),

  changeStatus: (id: string, status: 'Pending' | 'In Progress' | 'Completed') =>
    http.patch<OfficeTask>(`/tasks/${encodeURIComponent(id)}/status`, { status }),

  delete: (id: string) => http.delete<{ success: boolean }>(`/tasks/${encodeURIComponent(id)}`)
}

/**
 * 5. Procedural Fairness Letters (PFL) API Service (/pfl)
 */
export const pflApi = {
  getAll: () => http.get<PFLRecord[]>('/pfl'),

  getById: (id: string) => http.get<PFLRecord>(`/pfl/${encodeURIComponent(id)}`),

  create: (record: Partial<PFLRecord> & { docsList?: string[] }) =>
    http.post<PFLRecord>('/pfl', record),

  update: (id: string, record: Partial<PFLRecord>) =>
    http.put<PFLRecord>(`/pfl/${encodeURIComponent(id)}`, record),

  delete: (id: string) => http.delete<{ success: boolean }>(`/pfl/${encodeURIComponent(id)}`)
}

/**
 * 6. Deadlines API Service (/deadlines)
 */
export const deadlinesApi = {
  getAll: () => http.get<DeadlineItem[]>('/deadlines'),

  create: (deadline: DeadlineItem & { matterId?: string }) =>
    http.post<DeadlineItem>('/deadlines', deadline),

  resolve: (matterId: string, deadlineIndex: number) =>
    http.post<{ success: boolean }>(`/matters/${encodeURIComponent(matterId)}/deadlines/${deadlineIndex}/resolve`)
}

/**
 * 7. Authentication & User Profile API (/auth)
 */
export const authApi = {
  login: (credentials: { username?: string; email?: string; password?: string }) =>
    http.post<{ access_token: string; token_type: string; user?: unknown }>('/auth/token', credentials),

  me: () => http.get<{ id: string; name: string; role: string; email: string }>('/auth/me'),

  logout: () => http.post<{ success: boolean }>('/auth/logout')
}

/**
 * 8. System Health / Connectivity Check
 */
export const healthApi = {
  check: () => http.get<{ status: string; version?: string }>('/health')
}

/**
 * Unified API Client Object
 */
export const api = {
  baseUrl: API_BASE_URL,
  request: apiRequest,
  http,
  clients: clientsApi,
  matters: mattersApi,
  appointments: appointmentsApi,
  tasks: tasksApi,
  pfl: pflApi,
  deadlines: deadlinesApi,
  auth: authApi,
  health: healthApi
}

export default api
