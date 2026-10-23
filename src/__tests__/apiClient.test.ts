import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  apiClient,
  ApiError,
  setAuthToken,
  getAuthToken,
  clearAuthToken,
  clientsApi,
  mattersApi,
  tasksApi
} from '@/api'

describe('Backend API Client', () => {
  beforeEach(() => {
    clearAuthToken()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Auth Token Management', () => {
    it('should set, retrieve and clear token properly', () => {
      expect(getAuthToken()).toBeNull()
      setAuthToken('mock-jwt-token-123')
      expect(getAuthToken()).toBe('mock-jwt-token-123')
      clearAuthToken()
      expect(getAuthToken()).toBeNull()
    })
  })

  describe('ApiError class', () => {
    it('should format message and status correctly', () => {
      const err = new ApiError('Not found', 404, 'Not Found', '/clients/123', { detail: 'Client missing' })
      expect(err.message).toBe('Not found')
      expect(err.status).toBe(404)
      expect(err.statusText).toBe('Not Found')
      expect(err.url).toBe('/clients/123')
      expect(err.details).toEqual({ detail: 'Client missing' })
    })
  })

  describe('HTTP Methods and Fetch Calls', () => {
    it('should send GET request and parse JSON result', async () => {
      const mockData = [{ id: '1', name: 'John Doe' }]
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockData
      })

      const res = await apiClient.get<typeof mockData>('/clients')
      expect(res).toEqual(mockData)
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    it('should include Authorization header when token is set', async () => {
      setAuthToken('test-secret-token')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true })
      })

      await apiClient.get('/secure-data')
      const calledHeaders = (global.fetch as any).mock.calls[0][1].headers
      expect(calledHeaders.get('Authorization')).toBe('Bearer test-secret-token')
    })

    it('should send POST request with serialized body', async () => {
      const newClient = { name: 'New Client Inc.', kind: 'Employer' as const }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ id: 'c-new', ...newClient })
      })

      const res = await apiClient.post('/clients', newClient)
      expect(res).toEqual({ id: 'c-new', ...newClient })
      const callOptions = (global.fetch as any).mock.calls[0][1]
      expect(callOptions.method).toBe('POST')
      expect(callOptions.body).toBe(JSON.stringify(newClient))
    })

    it('should throw ApiError with FastAPI validation details on 422', async () => {
      const errorPayload = {
        detail: [
          { loc: ['body', 'email'], msg: 'field required', type: 'value_error.missing' }
        ]
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => errorPayload
      })

      await expect(apiClient.post('/clients', {})).rejects.toThrow(ApiError)
    })
  })

  describe('Resource API Wrappers', () => {
    it('clientsApi.getAll should invoke GET /clients', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => []
      })

      await clientsApi.getAll()
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/clients'),
        expect.objectContaining({ method: 'GET' })
      )
    })

    it('mattersApi.updateStage should invoke PATCH with new stage', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ id: 'M-1', stage: 4 })
      })

      await mattersApi.updateStage('M-1', 4)
      const callArgs = (global.fetch as any).mock.calls[0]
      expect(callArgs[0]).toContain('/matters/M-1/stage')
      expect(callArgs[1].method).toBe('PATCH')
      expect(JSON.parse(callArgs[1].body)).toEqual({ stage: 4 })
    })

    it('tasksApi.complete should invoke POST to complete task', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ id: 'T-1', status: 'Completed' })
      })

      await tasksApi.complete('T-1', 'Finished review', 'Inderpreet')
      const callArgs = (global.fetch as any).mock.calls[0]
      expect(callArgs[0]).toContain('/tasks/T-1/complete')
      expect(callArgs[1].method).toBe('POST')
      expect(JSON.parse(callArgs[1].body)).toEqual({ result: 'Finished review', completedBy: 'Inderpreet' })
    })
  })
})
