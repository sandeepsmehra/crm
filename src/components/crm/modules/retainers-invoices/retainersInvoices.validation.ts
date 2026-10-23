import { z } from 'zod'
import * as yup from 'yup'

/**
 * ==============================================================================
 * Retainers & Invoices Module - Validation Schemas (Zod & Yup)
 * ==============================================================================
 */

export const invoiceZodSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  clientId: z.string().min(1, 'Client is required'),
  amount: z.number().positive('Amount must be positive'),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  status: z.enum(['Draft', 'Sent', 'Paid', 'Overdue']).default('Draft')
})

export type InvoiceFormValues = z.infer<typeof invoiceZodSchema>

export const invoiceYupSchema = yup.object().shape({
  invoiceNumber: yup.string().required('Invoice number is required'),
  clientId: yup.string().required('Client is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  issueDate: yup.string().required('Issue date is required'),
  dueDate: yup.string().required('Due date is required')
})
