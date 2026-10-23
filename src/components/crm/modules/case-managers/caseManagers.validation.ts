import { z } from 'zod'
import * as yup from 'yup'

/**
 * ==============================================================================
 * Case Managers Module - Validation Schemas (Zod & Yup)
 * ==============================================================================
 */

export const caseManagerZodSchema = z.object({
  name: z.string().min(2, 'Case manager name is required'),
  email: z.string().email('Valid email address is required'),
  role: z.string().min(1, 'Role is required'),
  activeFiles: z.number().nonnegative().optional()
})

export type CaseManagerFormValues = z.infer<typeof caseManagerZodSchema>

export const caseManagerYupSchema = yup.object().shape({
  name: yup.string().required('Case manager name is required').min(2),
  email: yup.string().email('Valid email is required').required('Email is required'),
  role: yup.string().required('Role is required')
})
