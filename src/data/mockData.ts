import { 
  Client, 
  Matter, 
  Appointment, 
  OfficeTask, 
  PFLRecord, 
  PersonalReminder,
  ConsultationRecord,
  DocumentItem,
  StageConfig,
  Deal,
  Contact,
  Activity
} from '@/types/crm'

export const TODAY = '2026-10-07'
export const STAFF_MEMBERS = ['Inderpreet', 'Sukhman', 'Amanpreet']
export const CONSULTANTS = ['Tejinder']

export const MATTER_STAGES = [
  'Intake',
  'Document Collection',
  'Preparation',
  'RCIC Review',
  'Final Preparation',
  'Government Processing',
  'Closed'
]

export const STAGES: StageConfig[] = [
  { id: 'lead', label: 'Lead', color: 'bg-slate-500', borderAccent: 'border-l-slate-500' },
  { id: 'qualified', label: 'Qualified', color: 'bg-blue-500', borderAccent: 'border-l-blue-500' },
  { id: 'demo', label: 'Demo', color: 'bg-cyan-500', borderAccent: 'border-l-cyan-500' },
  { id: 'proposal', label: 'Proposal', color: 'bg-amber-500', borderAccent: 'border-l-amber-500' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-purple-500', borderAccent: 'border-l-purple-500' },
  { id: 'closed-won', label: 'Closed Won', color: 'bg-emerald-500', borderAccent: 'border-l-emerald-500' },
  { id: 'closed-lost', label: 'Closed Lost', color: 'bg-rose-500', borderAccent: 'border-l-rose-500' },
]

export const INITIAL_DEALS: Deal[] = []
export const CONTACTS_DATA: Contact[] = []
export const ACTIVITIES: Activity[] = []

export const APPLICATION_TYPES = [
  'Spousal Sponsorship',
  'Common-law Sponsorship',
  'TRV',
  'Work Permit',
  'Study Permit',
  'PGWP',
  'PRRA',
  'RAD',
  'H&C',
  'Refugee',
  'Express Entry',
  'PNP',
  'LMIA',
  'Restoration',
  'TRP',
  'Federal Court',
  'Citizenship',
  'Other services'
]

export const DOCUMENT_TEMPLATES: Record<string, string[]> = {
  'Spousal Sponsorship': [
    'Passport',
    'Marriage certificate',
    'Sponsor PR card / status document',
    'Police certificate',
    'Photos',
    'Relationship evidence',
    'Travel history'
  ],
  'Common-law Sponsorship': [
    'Passport',
    'Sponsor status document',
    'Evidence of cohabitation',
    'Relationship evidence',
    'Police certificate',
    'Travel history'
  ],
  'Work Permit': [
    'Passport',
    'Current work permit',
    'Employment documents',
    'Education documents'
  ],
  PRRA: [
    'Identity documents',
    'Risk narrative',
    'Supporting evidence',
    'Prior decisions'
  ],
  RAD: [
    'RPD decision and reasons',
    'Notice of appeal record',
    'Appeal evidence',
    'Client instructions'
  ],
  LMIA: [
    'Business registration',
    'Financial documents',
    'Recruitment records',
    'Position and wage details'
  ],
  'Express Entry': [
    'Passport',
    'Language test',
    'Education assessment',
    'Employment evidence'
  ],
  TRV: [
    'Passport',
    'Status document',
    'Travel purpose',
    'Financial evidence'
  ],
  'Study Permit': [
    'Passport',
    'Letter of acceptance',
    'Funding evidence',
    'Education history'
  ],
  PGWP: [
    'Passport',
    'Completion letter',
    'Final transcript',
    'Current status document'
  ],
  Refugee: [
    'Identity documents',
    'Client narrative',
    'Supporting evidence',
    'Immigration history'
  ],
  PNP: [
    'Passport',
    'Nomination documents',
    'Employment evidence',
    'Status documents'
  ],
  default: [
    'Passport',
    'Current status document',
    'Previous decisions',
    'Supporting evidence'
  ]
}

export const TASK_TEMPLATES: Record<string, string[]> = {
  default: [
    'Review client information',
    'Complete forms',
    'Check address and travel history',
    'Review previous refusals',
    'Draft explanations and submissions',
    'Organize evidence and final package'
  ]
}

export function docsFor(type: string): DocumentItem[] {
  const names = DOCUMENT_TEMPLATES[type] || DOCUMENT_TEMPLATES.default
  return names.map((name) => ({
    name,
    status: 'Requested',
    version: 0,
    history: []
  }))
}

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'C-1',
    name: 'Aman Gill',
    kind: 'Individual',
    phone: '604-555-0101',
    email: 'aman.gill@example.com',
    dob: '1992-05-12',
    status: 'Work permit',
    expiry: '2027-03-01',
    type: 'Spousal Sponsorship',
    notes: 'Initial consultation completed. Review pathway and evidence requirements. Married in Vancouver.',
    history: 'Prior visitor visa granted in 2021; UK visitor refusal in 2018.',
    risks: 'Previous marriage; UK refusal noted in records.',
    strategy: 'Confirm pathway, sponsor eligibility and client history. Obtain divorce judgment.',
    address: '14280 72 Ave, Surrey, BC',
    uci: '11-0492-9182',
    receptionAlert: ''
  },
  {
    id: 'C-2',
    name: 'Meera Sandhu',
    kind: 'Individual',
    phone: '604-555-0102',
    email: 'meera.s@example.com',
    dob: '1989-11-24',
    status: 'Out of status',
    expiry: '2026-08-15',
    type: 'PRRA',
    notes: 'PRRA response deadline approaching. Gather risk narrative and country condition evidence.',
    history: 'RPD claim refused June 2026.',
    risks: 'Time-sensitive response; verify evidence chronology carefully.',
    strategy: 'Prepare comprehensive PRRA submissions addressing changed country conditions.',
    address: '9350 128 St, Surrey, BC',
    uci: '11-8273-0192'
  },
  {
    id: 'C-3',
    name: 'Rohan Malik',
    kind: 'Individual',
    phone: '604-555-0103',
    email: 'rohan.m@example.com',
    dob: '1995-03-18',
    status: 'Work permit',
    expiry: '2026-11-30',
    type: 'Work Permit',
    notes: 'Current work permit expires late November. Needs employer LMIA or extension.',
    history: 'Initial study permit 2019, PGWP 2022.',
    risks: 'Passport expires in 8 months; needs renewal.',
    strategy: 'Apply for employer-specific work permit before expiry to maintain maintained status.',
    address: '7420 120 St, Delta, BC',
    uci: '11-9382-7104'
  },
  {
    id: 'C-4',
    name: 'Jasleen Bains',
    kind: 'Individual',
    phone: '604-555-0104',
    email: 'jasleen.b@example.com',
    dob: '1993-08-30',
    status: 'Work permit',
    expiry: '2027-01-15',
    type: 'Express Entry',
    notes: 'ITA received under Canadian Experience Class. Gathering reference letters.',
    history: 'Completed BBA in BC, 2 years skilled NOC 21232 experience.',
    risks: 'Verify job duties in reference letter match NOC lead statement.',
    strategy: 'Review final PR application package before submission deadline.',
    address: '15150 108 Ave, Surrey, BC',
    uci: '11-4829-0193'
  },
  {
    id: 'C-5',
    name: 'Northstar Millwork Ltd.',
    kind: 'Employer',
    phone: '604-555-0105',
    email: 'contact@northstarmillwork.ca',
    type: 'LMIA',
    notes: 'High-wage Carpenter LMIA recruitment completed. Reviewing 8 applicants.',
    contacts: 'Harinder Singh (General Manager)',
    locations: '12480 82 Ave, Surrey, BC',
    workers: '1 foreign worker position',
    history: 'Prior positive LMIA issued in 2023.',
    risks: 'Job posting advertisement expiry window needs monitoring.',
    strategy: 'Complete LMIA submission before Job Bank advertisement expires.',
    uci: 'EMP-90281'
  },
  {
    id: 'C-6',
    name: 'Kiran Sethi',
    kind: 'Individual',
    phone: '604-555-0106',
    email: 'kiran.s@example.com',
    dob: '1987-02-14',
    status: 'Visitor',
    expiry: '2026-12-10',
    type: 'TRV',
    notes: 'Visitor visa extension for mother. Financial proof and travel purpose finalized.',
    history: 'Entered Canada on 6-month stamp April 2026.',
    risks: 'Ensure proof of ties to home country is robust.',
    strategy: 'Collect signatures on representative forms and submit application.',
    address: '6820 144 St, Surrey, BC',
    uci: '11-9201-4492'
  },
  {
    id: 'C-7',
    name: 'Navdeep Rai',
    kind: 'Individual',
    phone: '604-555-0107',
    email: 'navdeep.rai@example.com',
    dob: '1984-07-09',
    status: 'Out of status',
    type: 'H&C',
    notes: 'Humanitarian and Compassionate considerations application submitted.',
    history: '12 years established in Canada, two Canadian citizen children.',
    risks: 'Monitor government correspondence and address updates.',
    strategy: 'Track file status in GCMS and IRCC correspondence queues.',
    address: '8120 120A St, Surrey, BC',
    uci: '11-6629-1029'
  },
  {
    id: 'C-8',
    name: 'Simran Ahuja',
    kind: 'Individual',
    phone: '604-555-0108',
    email: 'simran.ahuja@example.com',
    dob: '1998-09-15',
    status: 'Refugee Claimant',
    type: 'RAD',
    notes: 'Notice of Appeal to Refugee Appeal Division filed. Draft submissions underway.',
    history: 'RPD hearing decision received late September 2026.',
    risks: 'Strict statutory RAD appeal record filing deadline: 2026-10-13.',
    strategy: 'Finalize memorandum of fact and law highlighting RPD legal and factual errors.',
    address: '13880 74 Ave, Surrey, BC',
    uci: '11-5510-9921'
  }
]

export const INITIAL_MATTERS: Matter[] = [
  {
    id: 'NR-26001',
    clientId: 'C-1',
    name: 'Aman Gill',
    type: 'Spousal Sponsorship',
    owner: 'Inderpreet',
    stage: 2,
    ball: 'Case Manager',
    next: 'Complete forms and evidence index',
    due: '2026-10-06',
    hard: '',
    risk: 'Previous marriage; prior visa refusal in UK.',
    strategy: 'Confirm the pathway and client history. Review previous decisions, identify evidence gaps and record consultant instructions before preparation.',
    docs: [
      { name: 'Passport', status: 'Approved', version: 1, history: ['v1 — Approved by Inderpreet'] },
      { name: 'Marriage certificate', status: 'Approved', version: 1, history: ['v1 — Approved by Inderpreet'] },
      { name: 'Sponsor PR card / status document', status: 'Approved', version: 1, history: ['v1 — Approved by Inderpreet'] },
      { name: 'Police certificate', status: 'Uploaded — Review Required', version: 1, history: ['v1 — Uploaded by client'] },
      { name: 'Photos', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Relationship evidence', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Travel history', status: 'Requested', version: 0, history: [] }
    ],
    tasks: [
      { name: 'Review client information', done: true, owner: 'Inderpreet', due: '2026-10-06' },
      { name: 'Prepare forms and submissions', done: false, owner: 'Inderpreet', due: '2026-10-08' },
      { name: 'Complete internal quality check', done: false, owner: 'Inderpreet', due: '2026-10-09' }
    ],
    forms: [
      { name: 'IMM 1344 Application to Sponsor', status: 'In Progress' },
      { name: 'IMM 0008 Generic Application Form', status: 'Complete' },
      { name: 'IMM 5532 Relationship Information', status: 'In Progress' },
      { name: 'IMM 5476 Use of a Representative', status: 'Complete' }
    ],
    verified: false,
    signature: false,
    final: false,
    ready: false,
    corrections: [],
    submission: null,
    noChase: false,
    events: [
      'Checklist personalized and sent to client',
      'Matter opened and workflow assigned'
    ],
    notes: [
      { type: 'Client Call', text: 'Spoke with Aman regarding previous divorce certificate. Client will upload by tomorrow.', date: '2026-10-06' }
    ],
    dates: [
      { label: 'Status expiry', date: '2027-03-01', kind: 'Status date' }
    ],
    deadlineItems: [],
    retained: true,
    retainedDate: '2026-10-02',
    caseOverview: 'Inland Spousal Sponsorship with open work permit application. Verified marriage certificate and cohabitation proofs.'
  },
  {
    id: 'NR-26002',
    clientId: 'C-2',
    name: 'Meera Sandhu',
    type: 'PRRA',
    owner: 'Sukhman',
    stage: 3,
    ball: 'RCIC',
    next: 'Review evidence and submissions',
    due: '2026-10-09',
    hard: '2026-10-12',
    risk: 'Time-sensitive response; statutory 15-day PRRA deadline.',
    strategy: 'Establish personalized risk profile under s. 96 and s. 97 IRPA following refusal of RPD claim.',
    docs: [
      { name: 'Identity documents', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Risk narrative', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Supporting evidence', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Prior decisions', status: 'Approved', version: 1, history: ['v1 — Approved'] }
    ],
    tasks: [
      { name: 'Review client information', done: true, owner: 'Sukhman', due: '2026-10-06' },
      { name: 'Prepare forms and submissions', done: true, owner: 'Sukhman', due: '2026-10-07' },
      { name: 'Complete internal quality check', done: true, owner: 'Sukhman', due: '2026-10-07' }
    ],
    forms: [
      { name: 'PRRA Application form', status: 'Complete' },
      { name: 'Written submissions', status: 'Complete' },
      { name: 'Representative authorization', status: 'Complete' }
    ],
    verified: true,
    signature: false,
    final: false,
    ready: false,
    corrections: [],
    submission: null,
    noChase: false,
    events: [
      'Application package prepared and submitted for RCIC review',
      'All documents approved and client facts locked'
    ],
    notes: [
      { type: 'RCIC Instruction', text: 'Ensure country conditions report citations match newest Amnesty International release.', date: '2026-10-06' }
    ],
    dates: [
      { label: 'PRRA Filing Deadline', date: '2026-10-12', kind: 'Hard Deadline' }
    ],
    deadlineItems: [
      { kind: 'Hard Deadline', label: 'PRRA statutory filing deadline', date: '2026-10-12', time: '16:00', zone: 'America/Vancouver', source: 'CBSA PRRA Notification letter', status: 'Open' }
    ],
    retained: true,
    retainedDate: '2026-09-28',
    caseOverview: 'Post-claim PRRA submission with new documentary evidence and risk narrative.'
  },
  {
    id: 'NR-26003',
    clientId: 'C-3',
    name: 'Rohan Malik',
    type: 'Work Permit',
    owner: 'Amanpreet',
    stage: 1,
    ball: 'Client',
    next: 'Provide updated passport',
    due: '2026-10-12',
    hard: '',
    risk: 'Passport expiration requires immediate extension before permit submission.',
    strategy: 'Maintain legal status via timely online submission prior to permit expiry date.',
    docs: [
      { name: 'Passport', status: 'Correction Required', version: 1, history: ['v1 — Correction Required: image cut off and expires within 6 months'] },
      { name: 'Current work permit', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Employment documents', status: 'Requested', version: 0, history: [] },
      { name: 'Education documents', status: 'Requested', version: 0, history: [] }
    ],
    tasks: [
      { name: 'Review client information', done: false, owner: 'Amanpreet', due: '2026-10-12' },
      { name: 'Prepare forms and submissions', done: false, owner: 'Amanpreet', due: '2026-10-15' },
      { name: 'Complete internal quality check', done: false, owner: 'Amanpreet', due: '2026-10-16' }
    ],
    forms: [
      { name: 'IMM 5710 Application to Change Conditions or Extend Stay', status: 'Not Started' },
      { name: 'IMM 5476 Representative', status: 'In Progress' }
    ],
    verified: false,
    signature: false,
    final: false,
    ready: false,
    corrections: [],
    submission: null,
    noChase: false,
    events: [
      'Passport photo copy rejected for blurriness; requested re-upload'
    ],
    notes: [
      { type: 'Internal Note', text: 'Client has applied for Indian passport renewal at BLS Surrey.', date: '2026-10-05' }
    ],
    dates: [
      { label: 'Work permit expiry', date: '2026-11-30', kind: 'Status date' }
    ],
    deadlineItems: [],
    retained: true,
    retainedDate: '2026-10-01',
    caseOverview: 'Work permit extension under employer exemption or maintained status bridge.'
  },
  {
    id: 'NR-26004',
    clientId: 'C-4',
    name: 'Jasleen Bains',
    type: 'Express Entry',
    owner: 'Inderpreet',
    stage: 3,
    ball: 'RCIC',
    next: 'Review final application',
    due: '2026-10-08',
    hard: '2026-10-16',
    risk: 'Verify job reference letter hours match paystubs and T4 statements.',
    strategy: 'CEC application with comprehensive Canadian employment documentation and proof of funds.',
    docs: [
      { name: 'Passport', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Language test', status: 'Approved', version: 1, history: ['v1 — Approved: CLB 9'] },
      { name: 'Education assessment', status: 'Approved', version: 1, history: ['v1 — Approved: WES verified'] },
      { name: 'Employment evidence', status: 'Approved', version: 1, history: ['v1 — Approved: 24 months continuous full-time'] }
    ],
    tasks: [
      { name: 'Review client information', done: true, owner: 'Inderpreet', due: '2026-10-06' },
      { name: 'Prepare forms and submissions', done: true, owner: 'Inderpreet', due: '2026-10-07' },
      { name: 'Complete internal quality check', done: true, owner: 'Inderpreet', due: '2026-10-07' }
    ],
    forms: [
      { name: 'e-APR PR application', status: 'Complete' },
      { name: 'Schedule A Background', status: 'Complete' },
      { name: 'Representative Form', status: 'Complete' }
    ],
    verified: true,
    signature: false,
    final: false,
    ready: false,
    corrections: [],
    submission: null,
    noChase: false,
    events: [
      'Document package complete and ready for RCIC Tejinder review'
    ],
    notes: [
      { type: 'Internal Note', text: '60-day ITA window closes Oct 16. Submission scheduled for Oct 10.', date: '2026-10-04' }
    ],
    dates: [
      { label: '60-Day ITA Deadline', date: '2026-10-16', kind: 'Hard Deadline' }
    ],
    deadlineItems: [
      { kind: 'Hard Deadline', label: '60-Day Express Entry ITA Deadline', date: '2026-10-16', time: '17:00', zone: 'America/Vancouver', source: 'IRCC ITA Invitation', status: 'Open' }
    ],
    retained: true,
    retainedDate: '2026-08-20',
    caseOverview: 'Express Entry CEC candidate with 512 CRS points. ITA received August 17.'
  },
  {
    id: 'NR-26005',
    clientId: 'C-5',
    name: 'Northstar Millwork Ltd.',
    type: 'LMIA',
    owner: 'Sukhman',
    stage: 2,
    ball: 'Case Manager',
    next: 'Review recruitment results',
    due: '2026-10-10',
    hard: '',
    risk: 'Job posting expiry on Job Bank requires timely submission before advertisement lapses.',
    strategy: 'High-wage stream NOC 72310 Carpenter. Complete recruitment summary matrix.',
    docs: [
      { name: 'Business registration', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Financial documents', status: 'Approved', version: 1, history: ['v1 — Approved: Notice of Assessment'] },
      { name: 'Recruitment records', status: 'Approved', version: 1, history: ['v1 — Approved: Job Bank, Indeed, WorkBC'] },
      { name: 'Position and wage details', status: 'Approved', version: 1, history: ['v1 — Approved: $34.50/hr'] }
    ],
    tasks: [
      { name: 'Review client information', done: true, owner: 'Sukhman', due: '2026-10-06' },
      { name: 'Prepare forms and submissions', done: false, owner: 'Sukhman', due: '2026-10-10' },
      { name: 'Complete internal quality check', done: false, owner: 'Sukhman', due: '2026-10-11' }
    ],
    forms: [
      { name: 'EMP5626 LMIA Application form', status: 'In Progress' },
      { name: 'Recruitment Summary Report', status: 'In Progress' }
    ],
    verified: true,
    signature: false,
    final: false,
    ready: false,
    corrections: [],
    submission: null,
    noChase: false,
    events: [
      'Recruitment printouts indexed; Canadian applicant screening log drafted'
    ],
    notes: [
      { type: 'Client Call', text: 'Spoke with General Manager Harinder. 8 resumes received, none met skilled journeyman criteria.', date: '2026-10-06' }
    ],
    dates: [
      { label: 'Job Bank Ad Expiry', date: '2026-10-28', kind: 'Internal Target' }
    ],
    deadlineItems: [
      { kind: 'Internal Target', label: 'LMIA Advertisement Expiry Window', date: '2026-10-28', time: '17:00', zone: 'America/Vancouver', source: 'Job Bank Posting #192837', status: 'Open' }
    ],
    retained: true,
    retainedDate: '2026-09-01',
    caseOverview: 'High-wage LMIA for Carpenter position at Surrey woodworking facility.',
    lmia: {
      position: 'Carpenter',
      noc: '72310',
      wage: '$34.50/hr',
      location: '12480 82 Ave, Surrey, BC',
      recruitment: 'Complete - 30 days advertisement',
      applicants: '8 Canadian/PR applicants screened',
      results: 'None met required 4 years finish-carpentry experience',
      interview: 'Not scheduled'
    }
  },
  {
    id: 'NR-26006',
    clientId: 'C-6',
    name: 'Kiran Sethi',
    type: 'TRV',
    owner: 'Amanpreet',
    stage: 4,
    ball: 'Case Manager',
    next: 'Collect signatures and finalize package',
    due: '2026-10-08',
    hard: '',
    risk: 'Verify financial support affidavits and return flight itineraries.',
    strategy: 'Visitor extension application showing daughter supporting stay with stable bank balance.',
    docs: [
      { name: 'Passport', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Status document', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Travel purpose', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Financial evidence', status: 'Approved', version: 1, history: ['v1 — Approved'] }
    ],
    tasks: [
      { name: 'Review client information', done: true, owner: 'Amanpreet', due: '2026-10-04' },
      { name: 'Prepare forms and submissions', done: true, owner: 'Amanpreet', due: '2026-10-06' },
      { name: 'Complete internal quality check', done: true, owner: 'Amanpreet', due: '2026-10-07' }
    ],
    forms: [
      { name: 'IMM 5708 Visitor Extension Form', status: 'Complete' },
      { name: 'IMM 5476 Representative', status: 'Complete' },
      { name: 'Letter of Explanation', status: 'Complete' }
    ],
    verified: true,
    signature: true,
    final: true,
    ready: true,
    corrections: [],
    submission: null,
    noChase: false,
    events: [
      'Approved by RCIC Tejinder; ready for final submission'
    ],
    notes: [
      { type: 'Internal Note', text: 'Signatures collected during in-person office visit.', date: '2026-10-07' }
    ],
    dates: [
      { label: 'Visitor status expiry', date: '2026-12-10', kind: 'Status date' }
    ],
    deadlineItems: [],
    retained: true,
    retainedDate: '2026-09-15',
    caseOverview: 'In-Canada visitor record extension for applicant’s visiting mother.'
  },
  {
    id: 'NR-26007',
    clientId: 'C-7',
    name: 'Navdeep Rai',
    type: 'H&C',
    owner: 'Sukhman',
    stage: 5,
    ball: 'Government',
    next: 'Check for correspondence',
    due: '2026-11-07',
    hard: '',
    risk: 'Long-term processing; keep contact information and BIOC evidence refreshed.',
    strategy: 'H&C stage 1 approval monitoring; maintain regular client contact.',
    docs: [
      { name: 'Identity documents', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Client narrative', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Supporting evidence', status: 'Approved', version: 1, history: ['v1 — Approved'] }
    ],
    tasks: [
      { name: 'Review client information', done: true, owner: 'Sukhman' },
      { name: 'Prepare forms and submissions', done: true, owner: 'Sukhman' },
      { name: 'Complete internal quality check', done: true, owner: 'Sukhman' }
    ],
    forms: [
      { name: 'IMM 0008 Generic Application Form', status: 'Complete' },
      { name: 'IMM 5476 Representative', status: 'Complete' }
    ],
    verified: true,
    signature: true,
    final: true,
    ready: false,
    corrections: [],
    submission: {
      date: '2026-09-15',
      portal: 'IRCC Permanent Residence Portal',
      ref: 'HC-2026-09281',
      by: 'Sukhman',
      confirmation: 'HC-Submission-Receipt.pdf'
    },
    noChase: false,
    events: [
      'Application submitted successfully to IRCC PR portal on 2026-09-15'
    ],
    notes: [
      { type: 'Government Communication', text: 'Acknowledgment of Receipt (AOR) received via email.', date: '2026-09-29' }
    ],
    dates: [
      { label: 'Follow-up with IRCC', date: '2026-11-07', kind: 'Internal Target' }
    ],
    deadlineItems: [],
    retained: true,
    retainedDate: '2026-07-10',
    caseOverview: 'Humanitarian and Compassionate permanent residence application under section 25(1).'
  },
  {
    id: 'NR-26008',
    clientId: 'C-8',
    name: 'Simran Ahuja',
    type: 'RAD',
    owner: 'Inderpreet',
    stage: 2,
    ball: 'Case Manager',
    next: 'Complete draft submissions',
    due: '2026-10-08',
    hard: '2026-10-13',
    risk: 'Statutory 30-day RAD Record perfection deadline (2026-10-13) cannot be extended.',
    strategy: 'Draft written appellant arguments highlighting Member credibility errors under Vavilov standards.',
    docs: [
      { name: 'RPD decision and reasons', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Notice of appeal record', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Appeal evidence', status: 'Approved', version: 1, history: ['v1 — Approved'] },
      { name: 'Client instructions', status: 'Approved', version: 1, history: ['v1 — Approved'] }
    ],
    tasks: [
      { name: 'Review client information', done: true, owner: 'Inderpreet', due: '2026-10-06' },
      { name: 'Prepare forms and submissions', done: false, owner: 'Inderpreet', due: '2026-10-08' },
      { name: 'Complete internal quality check', done: false, owner: 'Inderpreet', due: '2026-10-09' }
    ],
    forms: [
      { name: 'RAD Appellant Record', status: 'In Progress' },
      { name: 'Written Submissions (Rule 3)', status: 'In Progress' }
    ],
    verified: true,
    signature: false,
    final: false,
    ready: false,
    corrections: [],
    submission: null,
    noChase: false,
    events: [
      'Appeal record draft compiled; written argument in progress'
    ],
    notes: [
      { type: 'Internal Note', text: 'Hearing audio transcript reviewed. RPD ignored documentary proof of extortion.', date: '2026-10-05' }
    ],
    dates: [
      { label: 'RAD Filing Deadline', date: '2026-10-13', kind: 'Hard Deadline' }
    ],
    deadlineItems: [
      { kind: 'Hard Deadline', label: 'RAD Appellant Record Perfection Deadline', date: '2026-10-13', time: '17:00', zone: 'America/Vancouver', source: 'IRB RAD Notice of Appeal Confirmation', status: 'Open' }
    ],
    retained: true,
    retainedDate: '2026-09-22',
    caseOverview: 'Refugee Appeal Division appeal from negative RPD determination.'
  }
]

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    client: 'C-1',
    date: '2026-10-05',
    time: '10:00',
    duration: 30,
    consultant: 'Tejinder',
    status: 'Completed',
    confirmation: 'Confirmed',
    section: 'Clients',
    phone: '604-555-0101',
    email: 'aman.gill@example.com',
    source: 'Referral',
    called: '2026-10-02',
    notes: 'Discuss spousal sponsorship documents and sponsor eligibility.',
    service: 'Spousal Sponsorship',
    reminder: 'Recorded',
    followup: '2026-10-08',
    kind: 'Initial Consultation',
    mode: 'In person',
    location: 'Surrey office',
    retainedMatterId: 'NR-26001',
    history: ['Sample appointment created', 'Completed by Tejinder']
  },
  {
    id: 2,
    client: 'C-3',
    date: '2026-10-06',
    time: '13:00',
    duration: 30,
    consultant: 'Tejinder',
    status: 'Completed',
    confirmation: 'Confirmed',
    section: 'Clients',
    phone: '604-555-0103',
    email: 'rohan.m@example.com',
    source: 'Website',
    called: '2026-10-02',
    notes: 'Work permit extension consultation.',
    service: 'Work Permit',
    reminder: 'Recorded',
    followup: '',
    kind: 'Initial Consultation',
    mode: 'In person',
    location: 'Surrey office',
    retainedMatterId: 'NR-26003',
    history: ['Sample appointment created', 'Completed by Tejinder']
  },
  {
    id: 3,
    client: 'C-2',
    date: '2026-10-07',
    time: '10:30',
    duration: 60,
    consultant: 'Tejinder',
    status: 'Waiting',
    confirmation: 'Confirmed',
    section: 'Clients',
    phone: '604-555-0102',
    email: 'meera.s@example.com',
    source: 'Existing client',
    called: '2026-10-05',
    notes: 'Review supporting evidence for PRRA.',
    service: 'PRRA',
    reminder: 'Recorded',
    followup: '',
    kind: 'Case Review',
    mode: 'In person',
    location: 'Surrey office',
    retainedMatterId: 'NR-26002',
    history: ['Sample appointment created', 'Client marked Waiting in reception']
  },
  {
    id: 4,
    client: 'C-4',
    date: '2026-10-07',
    time: '14:00',
    duration: 30,
    consultant: 'Tejinder',
    status: 'Confirmed',
    confirmation: 'Confirmed',
    section: 'Clients',
    phone: '604-555-0104',
    email: 'jasleen.b@example.com',
    source: 'Referral',
    called: '2026-10-05',
    notes: 'Final review discussion for Express Entry submission.',
    service: 'Express Entry',
    reminder: 'Pending',
    followup: '',
    kind: 'Case Review',
    mode: 'In person',
    location: 'Surrey office',
    retainedMatterId: 'NR-26004',
    history: ['Sample appointment created', 'Confirmed by phone']
  },
  {
    id: 5,
    client: 'C-6',
    date: '2026-10-08',
    time: '11:00',
    duration: 30,
    consultant: 'Tejinder',
    status: 'Scheduled',
    confirmation: 'Pending',
    section: 'Clients',
    phone: '604-555-0106',
    email: 'kiran.s@example.com',
    source: 'Website',
    called: '2026-10-06',
    notes: 'Signing appointment for visitor extension.',
    service: 'TRV',
    reminder: 'Pending',
    followup: '',
    kind: 'Document Signing',
    mode: 'In person',
    location: 'Surrey office',
    retainedMatterId: 'NR-26006',
    history: ['Sample appointment created']
  },
  {
    id: 6,
    client: 'C-8',
    date: '2026-10-09',
    time: '15:00',
    duration: 45,
    consultant: 'Tejinder',
    status: 'Confirmed',
    confirmation: 'Confirmed',
    section: 'Clients',
    phone: '604-555-0108',
    email: 'simran.ahuja@example.com',
    source: 'Existing client',
    called: '2026-10-06',
    notes: 'Appeal preparation update and affidavit review.',
    service: 'RAD',
    reminder: 'Recorded',
    followup: '',
    kind: 'Follow-up',
    mode: 'In person',
    location: 'Surrey office',
    retainedMatterId: 'NR-26008',
    history: ['Sample appointment created']
  },
  {
    id: 7,
    client: 'C-5',
    date: '2026-10-07',
    time: '12:00',
    duration: 30,
    consultant: 'Tejinder',
    status: 'Confirmed',
    confirmation: 'Confirmed',
    section: 'Staff',
    phone: '604-555-0105',
    email: 'contact@northstarmillwork.ca',
    source: 'Internal',
    called: '2026-10-06',
    notes: 'Staff discussion: review employer documents before sending the checklist.',
    service: 'LMIA',
    reminder: 'Pending',
    followup: '',
    kind: 'Staff Appointment',
    mode: 'In person',
    location: 'Surrey office',
    retainedMatterId: 'NR-26005',
    history: ['Fictional staff appointment created']
  },
  {
    id: 8,
    client: 'C-7',
    date: '2026-10-07',
    time: '15:30',
    duration: 30,
    consultant: 'Tejinder',
    status: 'Scheduled',
    confirmation: 'Not answered',
    section: 'Follow-ups',
    phone: '604-555-0107',
    email: 'navdeep.rai@example.com',
    source: 'Existing client',
    called: '2026-10-05',
    notes: 'Call to confirm next steps and documents still required.',
    service: 'H&C',
    reminder: 'Pending',
    followup: '2026-10-09',
    kind: 'Follow-up',
    mode: 'Phone',
    location: 'Call client',
    retainedMatterId: 'NR-26007',
    history: ['Fictional follow-up created']
  }
]

export const INITIAL_OFFICE_TASKS: OfficeTask[] = [
  {
    id: 'T-001',
    text: 'Simran called at 11:30 am asking for an update on the file. Review progress and call back.',
    taskCategory: 'Client Calls',
    client: 'C-8',
    clientName: 'Simran Ahuja',
    clientPhone: '604-555-0108',
    assignedTo: 'Inderpreet',
    assignedBy: 'Reception',
    date: '2026-10-07',
    time: '11:30',
    due: '2026-10-07',
    priority: 'Normal',
    status: 'Pending',
    result: '',
    completedAt: '',
    history: ['Reception assigned to Inderpreet on 2026-10-07 11:30']
  },
  {
    id: 'T-002',
    text: 'Please check the replacement passport and confirm whether the copy is clear.',
    taskCategory: 'Staff Tasks',
    client: 'C-3',
    clientName: 'Rohan Malik',
    clientPhone: '604-555-0103',
    assignedTo: 'Amanpreet',
    assignedBy: 'Sukhman',
    date: '2026-10-07',
    time: '10:15',
    due: '2026-10-09',
    priority: 'Normal',
    status: 'In Progress',
    result: '',
    completedAt: '',
    history: ['Sukhman assigned to Amanpreet on 2026-10-07 10:15']
  },
  {
    id: 'T-003',
    text: 'Call client to confirm tomorrow’s signing appointment.',
    taskCategory: 'Client Calls',
    client: 'C-6',
    clientName: 'Kiran Sethi',
    clientPhone: '604-555-0106',
    assignedTo: 'Reception',
    assignedBy: 'Tejinder',
    date: '2026-10-07',
    time: '15:00',
    due: '2026-10-07',
    priority: 'Normal',
    status: 'Completed',
    result: 'Client confirmed attendance for 11:00 am appointment tomorrow.',
    completedAt: '2026-10-08 09:15',
    history: ['Completed by Reception: Client confirmed attendance.']
  }
]

export const INITIAL_PFL_RECORDS: PFLRecord[] = [
  {
    id: 'PFL-001',
    fileNumber: 'WP-782910',
    clientName: 'Gurpreet Singh',
    applicationType: 'Work Permit',
    category: 'Procedural Fairness Letter',
    actionRequired: 'Respond to officer concerns regarding prior unauthorized employment history',
    receivedDate: '2026-10-01',
    deadline: '2026-10-15',
    owner: 'Inderpreet',
    comments: 'Obtain statutory declaration from prior employer and paystub records.',
    status: 'Open'
  },
  {
    id: 'PFL-002',
    fileNumber: 'SP-109283',
    clientName: 'Harinder Cheema',
    applicationType: 'Spousal Sponsorship',
    category: 'Document Request',
    actionRequired: 'Provide updated national police clearance certificate within 30 days',
    receivedDate: '2026-09-22',
    deadline: '2026-10-22',
    owner: 'Sukhman',
    comments: 'Client submitted request to Indian High Commission; tracking receipt uploaded.',
    status: 'Open'
  }
]

export const INITIAL_PERSONAL_REMINDERS: PersonalReminder[] = [
  {
    id: 'PR-001',
    text: 'Follow up with General Manager Harinder for Job Bank printouts and invoice receipt.',
    dueDate: '2026-10-09',
    reminderFor: 'Sukhman',
    applicationId: 'NR-26005',
    applicationLabel: 'Northstar Millwork Ltd. · LMIA',
    status: 'Open'
  },
  {
    id: 'PR-002',
    text: 'Check GCMS / online IRCC portal for Navdeep Rai AOR confirmation letter.',
    dueDate: '2026-10-15',
    reminderFor: 'Sukhman',
    applicationId: 'NR-26007',
    applicationLabel: 'Navdeep Rai · H&C',
    status: 'Open'
  }
]

export const INITIAL_CONSULTATIONS: ConsultationRecord[] = [
  {
    id: 'CONS-001',
    clientId: 'C-1',
    date: '2026-10-05',
    type: 'Initial Consultation',
    instructions: 'Spousal sponsorship application with concurrent inland work permit.',
    specialNotes: 'Previous divorce in India was finalized in 2020. Valid judgment obtained.',
    history: 'Prior visitor visa granted in 2021; UK visitor refusal in 2018.',
    risks: 'Must address UK refusal transparently in IMM 5669.',
    strategy: 'Assemble comprehensive cohabitation proof (joint lease, joint accounts, photos).',
    outcome: 'Retained',
    serviceRequested: 'Spousal Sponsorship'
  }
]
