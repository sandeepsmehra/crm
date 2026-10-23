import { z } from 'zod'
import * as yup from 'yup'

/**
 * ==============================================================================
 * Matter Detail Module - Validation Schemas (Zod & Yup)
 * ==============================================================================
 */

// 1. Record Contact Log Entry Validation
export const contactLogZodSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  method: z.enum([
    'Phone call',
    'Email',
    'WhatsApp',
    'In person',
    'Internal note',
    'Other'
  ]),
  person: z.string().min(1, 'Contact person name is required'),
  staff: z.string().min(1, 'Staff member is required'),
  explanation: z.string().min(2, 'Contact explanation is required')
})

export type ContactLogFormValues = z.infer<typeof contactLogZodSchema>

export const contactLogYupSchema = yup.object().shape({
  date: yup.string().required('Date is required'),
  person: yup.string().required('Contact person is required'),
  staff: yup.string().required('Staff member is required'),
  explanation: yup.string().required('Explanation is required').min(2)
})

// 2. Edit Assignment Validation
export const editAssignmentZodSchema = z.object({
  owner: z.string().min(1, 'Case Manager is required'),
  ball: z.string().min(1, 'Ball in court is required'),
  stage: z.number().min(0).max(6).optional(),
  next: z.string().min(1, 'Next action is required').optional(),
  due: z.string().optional()
})

export type EditAssignmentFormValues = z.infer<typeof editAssignmentZodSchema>

export const editAssignmentYupSchema = yup.object().shape({
  owner: yup.string().required('Case Manager is required'),
  ball: yup.string().required('Ball in court is required')
})

export const editAssignmentModalZodSchema = z.object({
  owner: z.string().min(1, 'Case Manager is required'),
  ball: z.string().min(1, 'Ball in court is required'),
  next: z.string().min(2, 'Next action description is required'),
  due: z.string().min(1, 'Due date is required')
})

export type EditAssignmentModalValues = z.infer<typeof editAssignmentModalZodSchema>

// 3. Document Manager Validation
export const documentManagerZodSchema = z.object({
  kind: z.string().min(1, 'Document category is required'),
  customName: z.string().optional(),
  received: z.string().min(1, 'Received date is required'),
  reviewDue: z.string().min(1, 'Review due date is required'),
  status: z.string().min(1, 'Verification status is required'),
  verifiedBy: z.string().min(1, 'Staff member is required')
}).refine((data) => {
  if (data.kind === 'Other') {
    return !!data.customName && data.customName.trim().length >= 2
  }
  return true
}, {
  message: 'Custom document title is required (at least 2 characters)',
  path: ['customName']
})

export type DocumentManagerFormValues = z.infer<typeof documentManagerZodSchema>

