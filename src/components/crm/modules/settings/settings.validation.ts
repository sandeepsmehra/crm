import { z } from 'zod'
import * as yup from 'yup'

/**
 * ==============================================================================
 * Settings Module - Validation Schemas (Zod & Yup)
 * ==============================================================================
 */

// Staff Access / Invite Validation (SCR-051)
export const staffAccessZodSchema = z.object({
  email: z.string().email('Please enter a valid staff email'),
  role: z.enum(['owner', 'case_manager', 'reception', 'viewer'])
})

export type StaffAccessFormValues = z.infer<typeof staffAccessZodSchema>

export const staffAccessYupSchema = yup.object().shape({
  email: yup.string().required('Staff email is required').email('Valid email required'),
  role: yup.string().required('Role is required')
})
