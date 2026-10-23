import { z } from 'zod'
import * as yup from 'yup'

/**
 * ==============================================================================
 * Appointments Module - Validation Schemas (Zod & Yup)
 * ==============================================================================
 */

// 1. Appointment Booking Validation
export const appointmentZodSchema = z.object({
  client: z.string().min(1, 'Client name is required'),
  phone: z.string().min(7, 'Valid phone number is required'),
  date: z.string().min(1, 'Please choose an appointment date'),
  time: z.string().min(1, 'Please choose a time slot'),
  consultant: z.string().min(1, 'Consultant is required'),
  service: z.string().min(1, 'Purpose/service is required'),
  notes: z.string().optional(),
  appointmentType: z.string().optional()
})

export type AppointmentFormValues = z.infer<typeof appointmentZodSchema>

export const appointmentYupSchema = yup.object().shape({
  client: yup.string().required('Client is required'),
  phone: yup.string().required('Phone is required'),
  date: yup.string().required('Date is required'),
  time: yup.string().required('Time is required'),
  consultant: yup.string().required('Consultant is required'),
  service: yup.string().required('Purpose is required')
})

// 2. Potential Client Follow-up Validation (SCR-021)
export const followUpZodSchema = z.object({
  notes: z.string().min(3, 'Follow-up reason / notes are required'),
  nextDate: z.string().optional()
})

export type FollowUpFormValues = z.infer<typeof followUpZodSchema>

export const followUpYupSchema = yup.object().shape({
  notes: yup.string().required('Follow-up reason is required').min(3)
})
