import { z } from 'zod'
import * as yup from 'yup'

/**
 * ==============================================================================
 * Deadline Centre Module - Validation Schemas (Zod & Yup)
 * ==============================================================================
 */

export const deadlineZodSchema = z.object({
  matterId: z.string().min(1, 'Please select related matter'),
  kind: z.enum(['Hard Deadline', 'Internal Target', 'Normal Task Deadline']),
  label: z.string().min(2, 'Deadline description is required'),
  date: z.string().min(1, 'Deadline date is required'),
  time: z.string().optional(),
  zone: z.string().optional(),
  source: z.string().optional(),
  verified: z.boolean().refine((val) => val === true, {
    message: 'Please confirm date and time verification'
  })
})

export type DeadlineFormValues = z.infer<typeof deadlineZodSchema>

export const deadlineYupSchema = yup.object().shape({
  matterId: yup.string().required('Matter is required'),
  label: yup.string().required('Description is required').min(2),
  date: yup.string().required('Deadline date is required'),
  verified: yup.boolean().oneOf([true], 'Verification is required')
})
