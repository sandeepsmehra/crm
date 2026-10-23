import { describe, it, expect } from 'vitest'
import {
  CLIENTS_BASE_PATH,
  getClientDetailPath,
  getClientMattersPath,
  MATTERS_BASE_PATH,
  getMatterDetailPath,
  getMatterStagePath,
  getMatterSubmissionDuePath,
  getMatterContactsPath,
  getMatterSubmissionPath,
  getMatterDeadlinesPath,
  getResolveDeadlinePath,
  APPOINTMENTS_BASE_PATH,
  getAppointmentDetailPath,
  getAppointmentCellPath,
  TASKS_BASE_PATH,
  getTaskDetailPath,
  getTaskCompletePath,
  getTaskReassignPath,
  getTaskStatusPath,
  PFL_BASE_PATH,
  getPflDetailPath,
  DEADLINES_BASE_PATH,
  AUTH_LOGIN_PATH,
  AUTH_ME_PATH,
  AUTH_LOGOUT_PATH,
  HEALTH_CHECK_PATH,
  API_ENDPOINTS
} from '@/apiEndpoints'

describe('API Endpoints & Path Builders', () => {
  describe('Clients endpoints', () => {
    it('should build correct client paths', () => {
      expect(CLIENTS_BASE_PATH).toBe('/clients')
      expect(getClientDetailPath('C-101')).toBe('/clients/C-101')
      expect(getClientMattersPath('C-101')).toBe('/clients/C-101/matters')
    })

    it('should safely encode special characters in client ids', () => {
      expect(getClientDetailPath('client#1/test')).toBe('/clients/client%231%2Ftest')
    })
  })

  describe('Matters endpoints', () => {
    it('should build correct matter paths', () => {
      expect(MATTERS_BASE_PATH).toBe('/matters')
      expect(getMatterDetailPath('M-001')).toBe('/matters/M-001')
      expect(getMatterStagePath('M-001')).toBe('/matters/M-001/stage')
      expect(getMatterSubmissionDuePath('M-001')).toBe('/matters/M-001/submission-due')
      expect(getMatterContactsPath('M-001')).toBe('/matters/M-001/contacts')
      expect(getMatterSubmissionPath('M-001')).toBe('/matters/M-001/submission')
      expect(getMatterDeadlinesPath('M-001')).toBe('/matters/M-001/deadlines')
      expect(getResolveDeadlinePath('M-001', 2)).toBe('/matters/M-001/deadlines/2/resolve')
    })
  })

  describe('Appointments endpoints', () => {
    it('should build correct appointment paths', () => {
      expect(APPOINTMENTS_BASE_PATH).toBe('/appointments')
      expect(getAppointmentDetailPath(12)).toBe('/appointments/12')
      expect(getAppointmentCellPath(12)).toBe('/appointments/12/cell')
    })
  })

  describe('Tasks endpoints', () => {
    it('should build correct task paths', () => {
      expect(TASKS_BASE_PATH).toBe('/tasks')
      expect(getTaskDetailPath('T-50')).toBe('/tasks/T-50')
      expect(getTaskCompletePath('T-50')).toBe('/tasks/T-50/complete')
      expect(getTaskReassignPath('T-50')).toBe('/tasks/T-50/reassign')
      expect(getTaskStatusPath('T-50')).toBe('/tasks/T-50/status')
    })
  })

  describe('PFL & Deadlines & Auth endpoints', () => {
    it('should build correct paths', () => {
      expect(PFL_BASE_PATH).toBe('/pfl')
      expect(getPflDetailPath('PFL-1')).toBe('/pfl/PFL-1')
      expect(DEADLINES_BASE_PATH).toBe('/deadlines')
      expect(AUTH_LOGIN_PATH).toBe('/auth/token')
      expect(AUTH_ME_PATH).toBe('/auth/me')
      expect(AUTH_LOGOUT_PATH).toBe('/auth/logout')
      expect(HEALTH_CHECK_PATH).toBe('/health')
    })
  })

  describe('Centralized API_ENDPOINTS structure', () => {
    it('should export all sub-endpoints correctly', () => {
      expect(API_ENDPOINTS.CLIENTS.BASE).toBe('/clients')
      expect(API_ENDPOINTS.MATTERS.BASE).toBe('/matters')
      expect(API_ENDPOINTS.APPOINTMENTS.BASE).toBe('/appointments')
      expect(API_ENDPOINTS.TASKS.BASE).toBe('/tasks')
      expect(API_ENDPOINTS.PFL.BASE).toBe('/pfl')
      expect(API_ENDPOINTS.DEADLINES.BASE).toBe('/deadlines')
      expect(API_ENDPOINTS.AUTH.LOGIN).toBe('/auth/token')
    })
  })
})
