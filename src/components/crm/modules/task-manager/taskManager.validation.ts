import { z } from 'zod'
import * as yup from 'yup'

/**
 * ==============================================================================
 * Task Manager Module - Validation Schemas (Zod & Yup)
 * ==============================================================================
 */

export const officeTaskZodSchema = z.object({
  text: z.string().min(3, 'Task enquiry/instructions must be at least 3 characters'),
  taskCategory: z.enum(['Client Calls', 'Staff Tasks']),
  assignedTo: z.string().min(1, 'Please select an assignee'),
  assignedBy: z.string().min(1, 'Please specify who assigned this'),
  due: z.string().min(1, 'Please specify a due date'),
  priority: z.enum(['Normal', 'Urgent']).default('Normal'),
  clientName: z.string().optional(),
  clientPhone: z.string().optional()
})

export type OfficeTaskFormValues = z.infer<typeof officeTaskZodSchema>

export const officeTaskYupSchema = yup.object().shape({
  text: yup.string().required('Task instructions are required').min(3),
  assignedTo: yup.string().required('Assignee is required'),
  due: yup.string().required('Due date is required')
})
