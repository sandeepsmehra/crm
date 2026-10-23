import { z } from 'zod'
import * as yup from 'yup'

/**
 * ==============================================================================
 * Client Portal Module - Validation Schemas (Zod & Yup)
 * ==============================================================================
 */

export const clientPortalZodSchema = z.object({
  matterId: z.string().min(1, 'Matter ID is required'),
  clientId: z.string().min(1, 'Client ID is required'),
  token: z.string().optional()
})

export type ClientPortalFormValues = z.infer<typeof clientPortalZodSchema>

export const clientPortalYupSchema = yup.object().shape({
  matterId: yup.string().required('Matter ID is required'),
  clientId: yup.string().required('Client ID is required')
})
