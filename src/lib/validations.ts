import { z } from 'zod'
import * as yup from 'yup'

// ==========================================
// 1. Client Validation
// ==========================================
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

// ==========================================
// 2. Appointment Booking Validation
// ==========================================
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

// ==========================================
// 3. Office Task Validation
// ==========================================
export const officeTaskZodSchema = z.object({
  text: z.string().min(3, 'Task enquiry/instructions must be at least 3 characters'),
  taskCategory: z.enum(['Client Calls', 'Staff Tasks']),
  assignedTo: z.string().min(1, 'Please select an assignee'),
  assignedBy: z.string().min(1, 'Please specify who assigned this'),
  due: z.string().min(1, 'Please specify a due date'),
  priority: z.enum(['Normal', 'Urgent']).default('Normal'),
  clientName: z.string().optional(),
  clientPhone: z.string().optional()
})

export type OfficeTaskFormValues = z.infer<typeof officeTaskZodSchema>

export const officeTaskYupSchema = yup.object().shape({
  text: yup.string().required('Task instructions are required').min(3),
  assignedTo: yup.string().required('Assignee is required'),
  due: yup.string().required('Due date is required')
})

// ==========================================
// 4. Client Update Validation (SCR-004)
// ==========================================
export const clientUpdateZodSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  clientName: z.string().min(1, 'Client name is required'),
  applicationType: z.string().optional(),
  updateType: z.string().min(1, 'Update type is required'),
  checkedBy: z.string().optional(),
  comments: z.string().optional(),
  status: z.enum(['Not Sent', 'Pending Further', 'Sent']).optional(),
  method: z.string().optional(),
  sentBy: z.string().optional()
})

export type ClientUpdateFormValues = z.infer<typeof clientUpdateZodSchema>

export const clientUpdateYupSchema = yup.object().shape({
  date: yup.string().required('Date is required'),
  clientName: yup.string().required('Client name is required'),
  updateType: yup.string().required('Update type is required')
})

// ==========================================
// 5. PFL / Government Request Validation (SCR-007)
// ==========================================
export const pflZodSchema = z.object({
  clientName: z.string().min(2, 'Client name is required'),
  applicationType: z.string().min(1, 'Application type is required'),
  fileNumber: z.string().min(2, 'File Number is required'),
  category: z.string().min(1, 'Category is required'),
  owner: z.string().min(1, 'Assigned case manager is required'),
  actionRequired: z.string().min(3, 'Action required is required'),
  receivedDate: z.string().min(1, 'Date received is required'),
  deadline: z.string().min(1, 'Deadline date is required'),
  comments: z.string().optional(),
  documents: z.array(z.string()).optional()
})

export type PflFormValues = z.infer<typeof pflZodSchema>

export const pflYupSchema = yup.object().shape({
  clientName: yup.string().required('Client name is required'),
  fileNumber: yup.string().required('File Number is required'),
  category: yup.string().required('Category is required'),
  deadline: yup.string().required('Deadline is required')
})

// ==========================================
// 6. Personal Reminder Validation (SCR-009)
// ==========================================
export const personalReminderZodSchema = z.object({
  text: z.string().min(3, 'Reminder text is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  reminderFor: z.string().min(1, 'Staff member is required'),
  applicationLabel: z.string().optional()
})

export type PersonalReminderFormValues = z.infer<typeof personalReminderZodSchema>

export const personalReminderYupSchema = yup.object().shape({
  text: yup.string().required('Reminder text is required'),
  dueDate: yup.string().required('Due date is required'),
  reminderFor: yup.string().required('Staff member is required')
})

// ==========================================
// 7. LMIA Company & Application Validation (SCR-033)
// ==========================================
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

// ==========================================
// 8. Record Submission Validation (SCR-037)
// ==========================================
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

// ==========================================
// 9. Potential Client Follow-up Validation (SCR-021)
// ==========================================
export const followUpZodSchema = z.object({
  notes: z.string().min(3, 'Follow-up reason / notes are required'),
  nextDate: z.string().optional()
})

export type FollowUpFormValues = z.infer<typeof followUpZodSchema>

export const followUpYupSchema = yup.object().shape({
  notes: yup.string().required('Follow-up reason is required').min(3)
})

// ==========================================
// 10. Staff Access Validation (SCR-051)
// ==========================================
export const staffAccessZodSchema = z.object({
  email: z.string().email('Please enter a valid staff email'),
  role: z.enum(['owner', 'case_manager', 'reception', 'viewer'])
})

export type StaffAccessFormValues = z.infer<typeof staffAccessZodSchema>

export const staffAccessYupSchema = yup.object().shape({
  email: yup.string().required('Staff email is required').email('Valid email required'),
  role: yup.string().required('Role is required')
})
