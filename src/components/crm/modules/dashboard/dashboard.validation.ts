import { z } from 'zod'
import * as yup from 'yup'

/**
 * ==============================================================================
 * Dashboard Module - Validation Schemas (Zod & Yup)
 * ==============================================================================
 */

// 1. Client Update Validation (SCR-004)
export const clientUpdateZodSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  clientName: z.string().min(1, 'Client name is required'),
  applicationType: z.string().optional(),
  updateType: z.string().min(1, 'Update type is required'),
  checkedBy: z.string().optional(),
  comments: z.string().optional(),
  status: z.enum(['Not Sent', 'Pending Further', 'Sent']).optional(),
  method: z.string().optional(),
  sentBy: z.string().optional()
})

export type ClientUpdateFormValues = z.infer<typeof clientUpdateZodSchema>

export const clientUpdateYupSchema = yup.object().shape({
  date: yup.string().required('Date is required'),
  clientName: yup.string().required('Client name is required'),
  updateType: yup.string().required('Update type is required')
})

// 2. PFL / Government Request Validation (SCR-007)
export const pflZodSchema = z.object({
  clientName: z.string().min(2, 'Client name is required'),
  applicationType: z.string().min(1, 'Application type is required'),
  fileNumber: z.string().min(2, 'File Number is required'),
  category: z.string().min(1, 'Category is required'),
  owner: z.string().min(1, 'Assigned case manager is required'),
  actionRequired: z.string().min(3, 'Action required is required'),
  receivedDate: z.string().min(1, 'Date received is required'),
  deadline: z.string().min(1, 'Deadline date is required'),
  comments: z.string().optional(),
  documents: z.array(z.string()).optional()
})

export type PflFormValues = z.infer<typeof pflZodSchema>

export const pflYupSchema = yup.object().shape({
  clientName: yup.string().required('Client name is required'),
  fileNumber: yup.string().required('File Number is required'),
  category: yup.string().required('Category is required'),
  deadline: yup.string().required('Deadline is required')
})

// 3. Personal Reminder Validation (SCR-009)
export const personalReminderZodSchema = z.object({
  text: z.string().min(3, 'Reminder text is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  reminderFor: z.string().min(1, 'Staff member is required'),
  applicationLabel: z.string().optional()
})

export type PersonalReminderFormValues = z.infer<typeof personalReminderZodSchema>

export const personalReminderYupSchema = yup.object().shape({
  text: yup.string().required('Reminder text is required'),
  dueDate: yup.string().required('Due date is required'),
  reminderFor: yup.string().required('Staff member is required')
})
