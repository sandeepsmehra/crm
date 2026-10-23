import { describe, it, expect } from 'vitest'

// Module validation schemas
import {
  appointmentZodSchema,
  appointmentYupSchema,
  followUpZodSchema
} from '@/components/crm/modules/appointments/appointments.validation'

import {
  clientZodSchema,
  clientYupSchema
} from '@/components/crm/modules/clients/clients.validation'

import {
  clientUpdateZodSchema,
  clientUpdateYupSchema,
  pflZodSchema,
  pflYupSchema,
  personalReminderZodSchema
} from '@/components/crm/modules/dashboard/dashboard.validation'

import {
  officeTaskZodSchema,
  officeTaskYupSchema
} from '@/components/crm/modules/task-manager/taskManager.validation'

import {
  contactLogZodSchema,
  contactLogYupSchema,
  editAssignmentZodSchema,
  editAssignmentYupSchema
} from '@/components/crm/modules/matter/matter.validation'

import {
  staffAccessZodSchema,
  staffAccessYupSchema
} from '@/components/crm/modules/settings/settings.validation'

import {
  deadlineZodSchema,
  deadlineYupSchema
} from '@/components/crm/modules/deadline-centre/deadlineCentre.validation'

import {
  newMatterZodSchema,
  lmiaZodSchema,
  submissionZodSchema
} from '@/components/crm/modules/todo-list/todoList.validation'

import {
  caseManagerZodSchema,
  caseManagerYupSchema
} from '@/components/crm/modules/case-managers/caseManagers.validation'

import {
  invoiceZodSchema,
  invoiceYupSchema
} from '@/components/crm/modules/retainers-invoices/retainersInvoices.validation'

describe('Module Validation Schemas (Zod & Yup)', () => {
  describe('Appointments Validation', () => {
    it('should validate valid appointment booking', () => {
      const valid = {
        client: 'Aman Deep',
        phone: '604-555-1234',
        date: '2026-11-01',
        time: '10:00 AM',
        consultant: 'Sukhman',
        service: 'Study Permit Extension'
      }

      const zodResult = appointmentZodSchema.safeParse(valid)
      expect(zodResult.success).toBe(true)
      expect(() => appointmentYupSchema.validateSync(valid)).not.toThrow()
    })

    it('should fail appointment when phone is missing or too short', () => {
      const invalid = {
        client: 'Aman Deep',
        phone: '123',
        date: '2026-11-01',
        time: '10:00 AM',
        consultant: 'Sukhman',
        service: 'Study Permit Extension'
      }

      const zodResult = appointmentZodSchema.safeParse(invalid)
      expect(zodResult.success).toBe(false)
    })

    it('should validate followUp schema', () => {
      expect(followUpZodSchema.safeParse({ notes: 'Follow up about LMIA draft' }).success).toBe(true)
      expect(followUpZodSchema.safeParse({ notes: '' }).success).toBe(false)
    })
  })

  describe('Clients Validation', () => {
    it('should validate valid client', () => {
      const valid = {
        name: 'Carlos Ruiz',
        phone: '778-555-9090',
        email: 'carlos@example.com',
        type: 'Express Entry',
        kind: 'Individual' as const
      }

      expect(clientZodSchema.safeParse(valid).success).toBe(true)
      expect(() => clientYupSchema.validateSync(valid)).not.toThrow()
    })

    it('should reject invalid client email', () => {
      const invalid = {
        name: 'Carlos Ruiz',
        phone: '778-555-9090',
        email: 'not-an-email',
        type: 'Express Entry',
        kind: 'Individual' as const
      }

      expect(clientZodSchema.safeParse(invalid).success).toBe(false)
    })
  })

  describe('Dashboard Validation', () => {
    it('should validate client update entry', () => {
      const valid = {
        date: '2026-10-23',
        clientName: 'Sarah Jenkins',
        applicationType: 'Spousal Sponsorship',
        updateType: 'Biometrics Completed',
        checkedBy: 'Amanpreet',
        comments: 'Biometrics letter uploaded to portal',
        status: 'Sent' as const
      }

      expect(clientUpdateZodSchema.safeParse(valid).success).toBe(true)
      expect(() => clientUpdateYupSchema.validateSync(valid)).not.toThrow()
    })

    it('should validate PFL record', () => {
      const validPfl = {
        clientName: 'Omar Siddiqui',
        applicationType: 'Express Entry PR',
        fileNumber: 'DEMO-E654321',
        category: 'PFL',
        owner: 'Inderpreet',
        actionRequired: 'Provide updated police clearance',
        receivedDate: '2026-10-15',
        deadline: '2026-11-15'
      }

      expect(pflZodSchema.safeParse(validPfl).success).toBe(true)
      expect(() => pflYupSchema.validateSync(validPfl)).not.toThrow()
    })

    it('should validate personal reminder', () => {
      const reminder = {
        text: 'Verify IRCC bulletin on TRV',
        dueDate: '2026-10-25',
        reminderFor: 'Sukhman'
      }
      expect(personalReminderZodSchema.safeParse(reminder).success).toBe(true)
    })
  })

  describe('Task Manager Validation', () => {
    it('should validate office task assignment', () => {
      const validTask = {
        text: 'Call back regarding study permit document list',
        taskCategory: 'Client Calls' as const,
        assignedTo: 'Inderpreet',
        assignedBy: 'Reception',
        due: '2026-10-24',
        priority: 'Urgent' as const,
        clientName: 'Mei Lin Chen'
      }

      expect(officeTaskZodSchema.safeParse(validTask).success).toBe(true)
      expect(() => officeTaskYupSchema.validateSync(validTask)).not.toThrow()
    })
  })

  describe('Matter Detail Validation', () => {
    it('should validate matter assignment change', () => {
      const assignment = {
        owner: 'Amanpreet',
        ball: 'Staff',
        stage: 2
      }
      expect(editAssignmentZodSchema.safeParse(assignment).success).toBe(true)
      expect(() => editAssignmentYupSchema.validateSync(assignment)).not.toThrow()
    })

    it('should validate contact log entry', () => {
      const contact = {
        date: '2026-10-23',
        time: '14:30',
        method: 'Phone call' as const,
        person: 'Mei Lin Chen',
        staff: 'Sukhman',
        explanation: 'Discussed police certificate timeline with client'
      }
      expect(contactLogZodSchema.safeParse(contact).success).toBe(true)
      expect(() => contactLogYupSchema.validateSync(contact)).not.toThrow()
    })
  })

  describe('Settings Validation', () => {
    it('should validate staff access with known roles', () => {
      const staff = {
        email: 'advisor@nationrise.ca',
        name: 'advisor',
        role: 'case_manager' as const
      }

      expect(staffAccessZodSchema.safeParse(staff).success).toBe(true)
      expect(() => staffAccessYupSchema.validateSync(staff)).not.toThrow()
    })

    it('should reject invalid role in staff access', () => {
      const invalid = {
        email: 'advisor@nationrise.ca',
        name: 'advisor',
        role: 'super_admin' as any
      }

      expect(staffAccessZodSchema.safeParse(invalid).success).toBe(false)
    })
  })

  describe('Deadline Centre Validation', () => {
    it('should validate deadline item', () => {
      const deadline = {
        matterId: 'NR-MAT-1',
        kind: 'Hard Deadline' as const,
        label: 'Submit Police Clearance Certificate',
        date: '2026-11-20',
        verified: true
      }

      expect(deadlineZodSchema.safeParse(deadline).success).toBe(true)
      expect(() => deadlineYupSchema.validateSync(deadline)).not.toThrow()
    })
  })

  describe('Todo List & Submissions Validation', () => {
    it('should validate new matter creation', () => {
      const matter = {
        clientId: 'C-01',
        type: 'Express Entry',
        owner: 'Inderpreet',
        retainedDate: '2026-10-23',
        firstActionDue: '2026-10-30'
      }
      expect(newMatterZodSchema.safeParse(matter).success).toBe(true)
    })

    it('should validate LMIA record and submission', () => {
      const lmia = {
        companyName: 'Maple Ridge Farms Ltd.',
        jobTitle: 'Farm Supervisor',
        positions: 2,
        wage: '$25.50/hr'
      }
      expect(lmiaZodSchema.safeParse(lmia).success).toBe(true)

      const submission = {
        date: '2026-10-23',
        portal: 'IRCC Portal',
        ref: 'E001293847',
        by: 'Inderpreet'
      }
      expect(submissionZodSchema.safeParse(submission).success).toBe(true)
    })
  })

  describe('Case Managers & Invoices Validation', () => {
    it('should validate case manager info', () => {
      const manager = {
        name: 'Tejinder Singh',
        email: 'tejinder@nationrise.ca',
        role: 'Senior Consultant'
      }
      expect(caseManagerZodSchema.safeParse(manager).success).toBe(true)
      expect(() => caseManagerYupSchema.validateSync(manager)).not.toThrow()
    })

    it('should validate invoice data', () => {
      const invoice = {
        invoiceNumber: 'INV-2026-001',
        clientId: 'C-101',
        amount: 2500,
        issueDate: '2026-10-23',
        dueDate: '2026-11-07',
        status: 'Sent' as const
      }
      expect(invoiceZodSchema.safeParse(invoice).success).toBe(true)
      expect(() => invoiceYupSchema.validateSync(invoice)).not.toThrow()
    })

    it('should reject non-positive invoice amounts', () => {
      const invalid = {
        invoiceNumber: 'INV-2026-001',
        clientId: 'C-101',
        amount: -100,
        issueDate: '2026-10-23',
        dueDate: '2026-11-07'
      }
      expect(invoiceZodSchema.safeParse(invalid).success).toBe(false)
    })
  })
})
