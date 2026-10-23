import { z } from 'zod'
import * as yup from 'yup'

/**
 * ==============================================================================
 * Clients Module - Validation Schemas (Zod & Yup)
 * ==============================================================================
 */

export const clientZodSchema = z.object({
  name: z.string().min(2, 'Client name must be at least 2 characters'),
  phone: z.string().min(7, 'Please provide a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  type: z.string().min(1, 'Please select application type'),
  kind: z.enum(['Individual', 'Employer']).default('Individual'),
  dob: z.string().optional(),
  uci: z.string().optional(),
  status: z.string().optional(),
  expiry: z.string().optional(),
  address: z.string().optional(),
  receptionAlert: z.string().optional(),
  notes: z.string().optional()
})

export type ClientFormValues = z.infer<typeof clientZodSchema>

export const clientYupSchema = yup.object().shape({
  name: yup.string().required('Client name is required').min(2, 'At least 2 characters'),
  phone: yup.string().required('Phone number is required').min(7, 'Valid phone required'),
  email: yup.string().required('Email is required').email('Valid email required'),
  type: yup.string().required('Application type is required'),
  kind: yup.string().oneOf(['Individual', 'Employer']).default('Individual')
})
