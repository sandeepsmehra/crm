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
  stage: z.number().min(0).max(6)
})

export type EditAssignmentFormValues = z.infer<typeof editAssignmentZodSchema>

export const editAssignmentYupSchema = yup.object().shape({
  owner: yup.string().required('Case Manager is required'),
  ball: yup.string().required('Ball in court is required')
})
