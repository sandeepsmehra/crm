export type ClientKind = 'Individual' | 'Employer'

export interface Client {
  id: string
  name: string
  kind: ClientKind
  phone: string
  email: string
  dob?: string
  status?: string
  expiry?: string
  type: string
  notes: string
  history?: string
  risks?: string
  strategy?: string
  address?: string
  uci?: string
  contacts?: string
  locations?: string
  workers?: string
  receptionAlert?: string
  preferredLanguage?: string
  createdAt?: string
  mattersCount?: number
}

export type DocumentStatus = 
  | 'Requested' 
  | 'Uploaded — Review Required' 
  | 'Approved' 
  | 'Correction Required' 
  | 'Not Applicable'

export interface DocumentItem {
  name: string
  status: DocumentStatus
  version: number
  history: string[]
}

export interface StaffTask {
  name: string
  done: boolean
  owner?: string
  due?: string
}

export interface FormItem {
  name: string
  status: 'Not Started' | 'In Progress' | 'Complete'
}

export type DeadlineKind = 'Hard Deadline' | 'Internal Target' | 'Normal Task Deadline'

export interface DeadlineItem {
  id?: string
  kind: DeadlineKind
  label: string
  date: string
  time?: string
  zone?: string
  source?: string
  status: 'Open' | 'Resolved'
}

export interface SubmissionRecord {
  date: string
  portal: string
  ref: string
  by?: string
  confirmation?: string
}

export interface ContactLogEntry {
  id: string
  date: string
  time: string
  method: 'Phone call' | 'Email' | 'WhatsApp' | 'In person' | 'Internal note' | 'Other'
  person: string
  staff: string
  explanation: string
}

export type MatterStage = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type BallHolder = 
  | 'Case Manager' 
  | 'Client' 
  | 'RCIC' 
  | 'Government' 
  | 'Reception' 
  | 'Third Party' 
  | 'None'

export interface Matter {
  id: string
  fileNumber?: string
  clientId: string
  name: string
  type: string
  owner: string
  stage: MatterStage
  ball: BallHolder
  next: string
  due: string
  hard: string
  risk: string
  strategy: string
  docs: DocumentItem[]
  tasks: StaffTask[]
  forms: FormItem[]
  verified: boolean
  signature: boolean
  final: boolean
  ready: boolean
  corrections: string[]
  submission: SubmissionRecord | null
  noChase: boolean
  events: string[]
  notes: Array<{ type: string; text: string; date: string } | string>
  dates: Array<{ label: string; date: string; kind: string }>
  deadlineItems: DeadlineItem[]
  retained: boolean
  retainedDate: string
  caseOverview: string
  overview?: string
  submissionDue?: string
  contactsLog?: ContactLogEntry[]
  retainedIntake?: boolean
  isPR?: boolean
  lastActivity?: string
  created?: string
  openedAt?: number | null
  checklistAt?: number | null
  reviewAt?: number | null
  approvedAt?: number | null
  messages?: Array<{ from: string; text: string }>
  requests?: Array<{ text: string; done: boolean; answer?: string }>
  questionnaire?: {
    history: string
    married: string
    spouse?: string
    marriage?: string
    separation?: string
    divorce?: string
    purpose?: string
  }
  finalChecks?: Record<string, boolean>
  lmia?: {
    position: string
    noc: string
    wage: string
    location: string
    recruitment: string
    applicants: string
    results: string
    interview: string
    postingExpiry?: string
    status?: string
    reviewDate?: string
  }
  retainerStatus?: 'Not prepared' | 'Prepared' | 'Sent' | 'Signed' | 'Closed'
  invoiceStatus?: 'Not prepared' | 'Prepared' | 'Sent' | 'Paid'
}

export type AppointmentStatus = 
  | 'Scheduled' 
  | 'Confirmed' 
  | 'Waiting' 
  | 'In Consultation' 
  | 'Completed' 
  | 'Cancelled' 
  | 'No-show'

export interface Appointment {
  id: number
  client: string
  date: string
  time: string
  duration: number
  consultant: string
  status: AppointmentStatus
  confirmation: string
  phone: string
  email?: string
  source: string
  called: string
  notes: string
  reminder: string
  followup: string
  service: string
  section: 'Clients' | 'Staff' | 'Follow-ups'
  kind?: string
  mode?: string
  location?: string
  retainedMatterId?: string | null
  history: string[]
}

export interface OfficeTask {
  id: string
  text: string
  taskCategory: 'Client Calls' | 'Staff Tasks'
  client?: string
  clientName?: string
  clientPhone?: string
  assignedTo: string
  assignedBy: string
  date: string
  time: string
  due: string
  priority: 'Normal' | 'Urgent'
  status: 'Pending' | 'In Progress' | 'Completed'
  result: string
  completedAt: string
  history: string[]
  fileReference?: string
}

export interface PFLRecord {
  id: string
  fileNumber: string
  clientName: string
  applicationType: string
  category: string
  actionRequired: string
  receivedDate: string
  deadline: string
  owner: string
  comments: string
  status: 'Open' | 'Completed'
  completedBy?: string
  completionMethod?: string
  completionComments?: string
  completedDate?: string
  documents?: string[]
}

export interface PersonalReminder {
  id: string
  text: string
  dueDate: string
  dueTime?: string
  priority?: 'Normal' | 'High' | 'Urgent'
  person?: string
  reminderFor?: string
  applicationId?: string
  applicationLabel?: string
  status?: 'Open' | 'Completed'
  completed?: boolean
  completedBy?: string
  completedAt?: string
  notes?: string
}

export interface ClientUpdate {
  id: string
  date: string
  clientName: string
  applicationType: string
  updateType: 'Approved' | 'Refused' | 'Documents Requested' | 'Other'
  checkedBy: string
  comments: string
  actionStatus?: 'Not Sent' | 'Pending Further' | 'Sent'
  status?: 'Not Sent' | 'Pending Further' | 'Sent'
  actionMethod?: string
  method?: string
  sentBy?: string
  sentAt?: string
  matterId?: string
}

export interface NewsArticle {
  id: string
  date: string
  source: string
  title: string
  category?: string
  summary?: string
  url?: string
}

export interface DocumentRecord {
  id: string
  kind: string
  label: string
  customName?: string
  received: string
  reviewDue: string
  status: 'Pending' | 'Verified' | 'Rejected'
  verifiedBy: string
  notes?: string
  fileName?: string
}

export interface ConsultationRecord {
  id: string
  clientId: string
  date: string
  type: string
  instructions: string
  specialNotes?: string
  history?: string
  risks?: string
  strategy?: string
  outcome: 'No Change' | 'Retained' | 'Potential' | 'Closed'
  outcomeReason?: string
  outcomeDate?: string
  serviceRequested?: string
}

export type CRMView = 
  | 'Dashboard' 
  | 'Task Manager' 
  | 'Appointments' 
  | 'Clients' 
  | 'To-Do List' 
  | 'Case Managers'
  | 'Retainers and Invoices'
  | 'Matter' 
  | 'Deadline Centre' 
  | 'Client Portal' 
  | 'Settings'

// Backward-compatible placeholders for components that might import Deal
export type DealStage = 'lead' | 'qualified' | 'demo' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export interface Deal {
  id: string
  title: string
  company: string
  contactName: string
  contactEmail: string
  value: number
  stage: DealStage
  probability: number
  expectedClose: string
  owner: { name: string; avatar: string; role: string }
  priority: Priority
  tags: string[]
  createdAt: string
  notes?: string
}
export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  title: string
  company: string
  avatar: string
  leadScore: number
  status: 'active' | 'prospect' | 'customer' | 'churned'
  lastContacted: string
  dealsCount: number
  totalValue: number
}
export interface Activity {
  id: string
  type: 'call' | 'email' | 'meeting' | 'stage_change' | 'note'
  title: string
  description: string
  timestamp: string
  user: { name: string; avatar: string }
  dealTitle?: string
}

export interface StageConfig {
  id: DealStage
  label: string
  color: string
  borderAccent: string
}
