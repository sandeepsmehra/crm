import { z } from 'zod'
import * as yup from 'yup'

/**
 * ==============================================================================
 * To-Do List (Matters) Module - Validation Schemas (Zod & Yup)
 * ==============================================================================
 */

// 1. LMIA Company & Application Validation (SCR-033)
export const lmiaZodSchema = z.object({
  companyName: z.string().min(2, 'Company / client name is required'),
  operatingName: z.string().optional(),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  jobTitle: z.string().min(2, 'Job title is required'),
  positions: z.number().min(1, 'Number of positions must be at least 1'),
  wage: z.string().min(1, 'Hourly wage is required'),
  jobBankStatus: z.string().optional(),
  jobPostingStatus: z.string().optional()
})

export type LmiaFormValues = z.infer<typeof lmiaZodSchema>

export const lmiaYupSchema = yup.object().shape({
  companyName: yup.string().required('Company name is required'),
  jobTitle: yup.string().required('Job title is required'),
  wage: yup.string().required('Hourly wage is required')
})

// 2. Record Submission Validation (SCR-037)
export const submissionZodSchema = z.object({
  date: z.string().min(1, 'Submission date is required'),
  portal: z.string().min(1, 'Portal / authority is required'),
  ref: z.string().min(1, 'Application reference / number is required'),
  by: z.string().min(1, 'Submitted by is required'),
  confirmation: z.string().optional()
})

export type SubmissionFormValues = z.infer<typeof submissionZodSchema>

export const submissionYupSchema = yup.object().shape({
  date: yup.string().required('Submission date is required'),
  portal: yup.string().required('Portal is required'),
  ref: yup.string().required('Application number is required'),
  by: yup.string().required('Submitted by is required')
})

// 3. New Matter Opening Validation
export const newMatterZodSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  type: z.string().min(1, 'Matter application type is required'),
  owner: z.string().min(1, 'Assigned case manager is required'),
  retainedDate: z.string().min(1, 'Retained date is required'),
  firstActionDue: z.string().min(1, 'First action deadline is required')
})

export type NewMatterFormValues = z.infer<typeof newMatterZodSchema>

export const newMatterYupSchema = yup.object().shape({
  clientId: yup.string().required('Client is required'),
  type: yup.string().required('Application type is required'),
  owner: yup.string().required('Case manager is required')
})
