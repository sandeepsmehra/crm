# Complete UI functional inventory

Source revision: `430beb1782e639d935eaa391df94b751a1047fb7`. Generated UTC: 2026-10-14T22:36:46.223528+00:00. Source snapshot in `SOURCE_CODE/`. All line references are to that snapshot.



Coverage is exhaustive for the discovered source sites, not certified exhaustive for reachable browser controls. There are nine registered modules and 56 named screen/tab/modal contracts. These are not 56 distinct URL routes. All application views share the CRM frontend. 602 inline-event/modal-submit sites have individual CSV contracts. Additional helper fields and literal inputs follow below. The historical synthetic samples are preserved only in REFERENCE_HANDOVER; this audit newly renders the nine modules under four roles (36 VM renders). Native form validity, CSS visibility, keyboard/focus, downloads and real clicks remain blocked.

## Runtime navigation

| Module | Role render | Entry/exit |
| --- | --- | --- |
| Dashboard | Owner, case_manager, reception, viewer: VM renders without exceptions | nav('Dashboard'); switch module through sidebar. Backend may reject actions visible in UI. |
| Task Manager | Owner, case_manager, reception, viewer: VM renders without exceptions | nav('Task Manager'); switch module through sidebar. Backend may reject actions visible in UI. |
| Appointments | Owner, case_manager, reception, viewer: VM renders without exceptions | nav('Appointments'); switch module through sidebar. Backend may reject actions visible in UI. |
| Clients | Owner, case_manager, reception, viewer: VM renders without exceptions | nav('Clients'); switch module through sidebar. Backend may reject actions visible in UI. |
| To-Do List | Owner, case_manager, reception, viewer: VM renders without exceptions | nav('To-Do List'); switch module through sidebar. Backend may reject actions visible in UI. |
| Case Managers | Owner, case_manager, reception, viewer: VM renders without exceptions | nav('Case Managers'); switch module through sidebar. Backend may reject actions visible in UI. |
| Retainers and Invoices | Owner, case_manager, reception, viewer: VM renders without exceptions | nav('Retainers and Invoices'); switch module through sidebar. Backend may reject actions visible in UI. |
| Deadline Centre | Owner, case_manager, reception, viewer: VM renders without exceptions | nav('Deadline Centre'); switch module through sidebar. Backend may reject actions visible in UI. |
| Settings | Owner, case_manager, reception, viewer: VM renders without exceptions | nav('Settings'); switch module through sidebar. Backend may reject actions visible in UI. |


## SCR-001 — Dashboard / File Submission Deadlines

Purpose: Prioritize submissions that staff have dated.

Entry: shared CRM page through Dashboard or its listed dialog action. Source anchor: submissionReminderGroups (SOURCE_CODE/public/crm.html:1348). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Overdue plus exclusive 0–3, 4–5, 6–10 calendar-day groups; client/application, due date, owner, countdown.

Actions: Open file, Open To-Do List, View all deadlines.

Business rules and dependencies: Derived from saved submissionDue; Vancouver calendar dates, weekends included; submitted/closed handling follows submissionReminderGroups. Clicking clears relevant list filters and locates the file; inactive destination is supported.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-002 — Dashboard / LMIA Deadlines

Purpose: Monitor advertisement expiry, submission and paused-file reviews.

Entry: shared CRM page through Dashboard or its listed dialog action. Source anchor: lmiaReminderItems (SOURCE_CODE/public/crm.html:1364). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Groups: Overdue, Within 3 Days, Within 5 Days (Week), Within 10 Days (2 Weeks), Later; company/file, reminder type/date, status/countdown.

Actions: Open LMIA company profile from row.

Business rules and dependencies: Job ad expiry only prompts preparation. On Hold contributes review-date reminder; paused categories are handled separately by lmiaReminderItems. No government feed or calculated recruitment compliance.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-003 — Dashboard / Updates

Purpose: Record results and whether staff informed the client.

Entry: shared CRM page through Dashboard or its listed dialog action. Source anchor: updatesPage (SOURCE_CODE/public/crm.html:708). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Updates / Update Sent tabs; Date, Client Name, Type of Application, Update, Checked By, Comments, Action.

Actions: Create an Update, open/edit pending update, view sent record.

Business rules and dependencies: Pending vs sent derived from actionStatus/sent compatibility; Sent locks record and is shown 30 days. No outgoing message.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-004 — Dashboard / Create/Edit Client Update

Purpose: Record external result communication.

Entry: shared CRM page through Dashboard or its listed dialog action. Source anchor: saveFileUpdate (SOURCE_CODE/public/crm.html:713). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Client name and application type required; date required; update Approved/Refused/Documents Requested/Other; checkedBy; comments; action Not Sent/Pending Further/Sent; method Email/Text/Other and sentBy manager for Sent.

Actions: Save update; cancel; view read-only Sent details.

Business rules and dependencies: Valid date; allowed enums; Sent requires method and sender. Saves with rollback on failure. Does not automatically create an application, a PFL deadline, or actual email.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-005 — Dashboard / PFL / Request Letters — Open Requests

Purpose: Keep manually entered government requests visible.

Entry: shared CRM page through Dashboard or its listed dialog action. Source anchor: pflOverviewTable (SOURCE_CODE/public/crm.html:1410). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Client, application, request category, case manager, deadline, days left.

Actions: Create a PFL / Request; open/edit; complete; switch Completed.

Business rules and dependencies: Nearest deadline first; overdue/within-three-day highlighting; standalone fileUpdates and matter deadlineItems combined. New records require file number.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-006 — Dashboard / PFL / Request Letters — Completed

Purpose: Review recently resolved requests.

Entry: shared CRM page through Dashboard or its listed dialog action. Source anchor: pflCompletedVisible (SOURCE_CODE/public/crm.html:1408). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Same client/request identity; completion information; recorded manager/method/comments.

Actions: Open read-only record; return Open Requests.

Business rules and dependencies: Resolved records visible 30 days after completion. Backend rejects subsequent changes/deletion. Hiding does not erase saved record.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-007 — Dashboard / PFL Create/Edit and Completion dialogs

Purpose: Record source request and proof of manual completion.

Entry: shared CRM page through Dashboard or its listed dialog action. Source anchor: savePflRecord (SOURCE_CODE/public/crm.html:1393). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: File Number, Client Name, Application Type, request category, action required, received date, deadline, owner, comments, documents. Completion: Completed By, Comments, Method Email/Webform/Other.

Actions: Save request; Move to Completed Requests.

Business rules and dependencies: File number/name/type/action/valid dates and manager constraints are in savePflRecord; completion requires active manager, nonblank comments and method. Linked task completes and linked hard date recomputes. Failure rolls arrays back.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-008 — Dashboard / Personal Reminders

Purpose: Track shared dated work reminders, optionally application-linked.

Entry: shared CRM page through Dashboard or its listed dialog action. Source anchor: personalReminderRows (SOURCE_CODE/public/crm.html:1443). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: All Reminders plus five deadline windows; manager filter; date, reminder, reminder-for, related application, action.

Actions: Create Reminder; edit; Mark Complete; open linked application.

Business rules and dependencies: Shared team visibility, not private to creator. Open reminders on closed applications suppressed; inactive-file reminders remain. Completion persists timestamp/user; no email notification.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-009 — Dashboard / Personal Reminder dialog

Purpose: Create/edit reminder without discarding application draft.

Entry: shared CRM page through Dashboard or its listed dialog action. Source anchor: savePersonalReminder (SOURCE_CODE/public/crm.html:1464). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Text, due date, reminderFor from manager/consultant names, optional application; preserves application label.

Actions: Save Reminder; cancel.

Business rules and dependencies: Text required <=5000, valid date and selected person, status Open/Completed on backend; application editor flushes before opening. Dedicated nested dialog isolates its save from main application.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-010 — Dashboard / News

Purpose: Open immigration information sources.

Entry: shared CRM page through Dashboard or its listed dialog action. Source anchor: immigrationNewsContent (SOURCE_CODE/public/crm.html:472). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Static notice date/title/link cards.

Actions: Open linked IRCC notices and source pages.

Business rules and dependencies: Curated hardcoded content; not automatically refreshed or verified current by CRM. No scrape/API integration.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-011 — Task Manager / Client Calls — Active Tasks

Purpose: Route telephone enquiries to staff.

Entry: shared CRM page through Task Manager or its listed dialog action. Source anchor: taskManager (SOURCE_CODE/public/crm.html:1336). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Name/phone or general task; enquiry text, assigned by/to, received date/time, due date, priority and status. Manager filter.

Actions: Assign Task; open task; select client match; complete.

Business rules and dependencies: Client name optional; phone-only/general calls allowed. Client link optional. Calls at least 72 hours old qualify for Reminders.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-012 — Task Manager / Staff Tasks — Active Tasks

Purpose: Assign general office work.

Entry: shared CRM page through Task Manager or its listed dialog action. Source anchor: officeTaskDialog (SOURCE_CODE/public/crm.html:1311). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Optional client/company/file reference; instructions; assigned by/to; received date/time; due date; priority Normal/Medium/Urgent.

Actions: Assign Task; open/edit; complete.

Business rules and dependencies: Assignment choices from active manager names. Switching creation category preserves typed draft values. No client profile required.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-013 — Task Manager / Completed Tasks

Purpose: Inspect completed work for seven days.

Entry: shared CRM page through Task Manager or its listed dialog action. Source anchor: taskPreviewTables (SOURCE_CODE/public/crm.html:1333). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Client/Task, Type, Assigned to, Completed by, Completed on, Auto-removal.

Actions: View completion details; status controls where available.

Business rules and dependencies: Sorted latest completion first; expired rows hidden then purged server-side. Completion dialog requires selected manager and result text; server controls timestamp/expiry.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-014 — Task Manager / Reminders — Calls waiting 3+ days

Purpose: Highlight unanswered/unfinished calls.

Entry: shared CRM page through Task Manager or its listed dialog action. Source anchor: taskNeedsReminder (SOURCE_CODE/public/crm.html:1299). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Client calls only, received time, age, instructions, manager.

Actions: Open/complete call; manager filter.

Business rules and dependencies: 72 elapsed hours using Vancouver conversion, not three business days. Completion removes from open reminder list.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-015 — Task Manager / Assign/Edit/Complete Task dialogs

Purpose: Capture instructions and accountable completion.

Entry: shared CRM page through Task Manager or its listed dialog action. Source anchor: finishOfficeTask (SOURCE_CODE/public/crm.html:1322). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: All create fields listed above; completion Completed By dropdown and action taken.

Actions: Save task; Complete; cancel; choose client result.

Business rules and dependencies: Assigned-to required; current/legacy assignee handling differs by wrapper. Completion requires managerNames and nonblank action; prepareTaskCompletions repeats server checks.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-016 — Appointments / Consultations

Purpose: Reception daily consultation schedule.

Entry: shared CRM page through Appointments or its listed dialog action. Source anchor: appointmentsPage (SOURCE_CODE/public/crm.html:1261). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Time, Client, Contact, Meeting with, Coming for, Notes, Status, Client Type, Referred By; current day and name/phone search.

Actions: Previous/next day; Today; Tomorrow; calendar picker; Book Appointment; open notes/profile; status change; meeting-with edit.

Business rules and dependencies: Visible statuses Booked/Confirmed/Arrived/Completed/Cancelled/No-show normalize earlier names. Date list includes cancelled and unresolved imported entries. Inline staff/time collisions checked in frontend.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-017 — Appointments / Staff Appointments

Purpose: Schedule an existing client with a staff member.

Entry: shared CRM page through Appointments or its listed dialog action. Source anchor: updateBookingCategory (SOURCE_CODE/public/crm.html:964). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Same daily controls; assigned staff and existing application choices.

Actions: Book appointment with For Staff category; edit/reschedule; view client.

Business rules and dependencies: Must select existing client. Uses staff manager list, excludes consultation record creation. Related application selector persistence needs confirmation (GAP-04).

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-018 — Appointments / Potential Clients

Purpose: Follow up after a consultation without opening active work.

Entry: shared CRM page through Appointments or its listed dialog action. Source anchor: receptionClients (SOURCE_CODE/public/crm.html:938). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Client, Contact, Service, Solution/latest follow-up, Follow-up date, Action; name/phone search.

Actions: Action Retained; Follow-up; Close File; open profile.

Business rules and dependencies: Requires explicit potential state; hide after 15 elapsed days without recorded action. Viewing does not refresh age. Follow-up/close require notes; potential close is not closing an active application.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-019 — Appointments / Booking modal

Purpose: Create/reuse client and schedule a visit.

Entry: shared CRM page through Appointments or its listed dialog action. Source anchor: saveAppointment (SOURCE_CODE/public/crm.html:780). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Type New appointment/consultation or For Staff; phone and name; optional email; service; Vancouver date/time; consultant/staff; consultation type; New/Existing client label; referred by; notes; hidden appointment sequence; reception-alert acknowledgement when present.

Actions: Choose matched profile; create separate profile; Book/Save changes; cancel.

Business rules and dependencies: Name and >=7 normalized phone digits for consultation, email format if provided, valid service/date/HH:mm, sequence 1–999, default 30min, before midnight and no overlapping noncancelled/non-no-show same-person booking. Required reception instruction agreement. Browser checks do not have equivalent server overlap uniqueness.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-020 — Appointments / Calendar picker and appointment details

Purpose: Navigate dates or inspect a booked visit.

Entry: shared CRM page through Appointments or its listed dialog action. Source anchor: appointmentDetails (SOURCE_CODE/public/crm.html:1266). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Month/day grid with counts; details date/time, staff, service, contacts, notes/special notes/overview and history.

Actions: Previous/next month; choose day; Edit/Reschedule; Open Client Profile.

Business rules and dependencies: Calendar navigates view only. Booking updates shared client contact copies and consultation records. Notes are recordkeeping, not a communication transport.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-021 — Appointments / Potential action dialog

Purpose: Record meaningful follow-up or close enquiry.

Entry: shared CRM page through Appointments or its listed dialog action. Source anchor: potentialActionDialog (SOURCE_CODE/public/crm.html:940). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Required action notes; follow-up date for follow-up.

Actions: Save follow-up / close; cancel.

Business rules and dependencies: Appends potential history and client communication log; does not delete profile or other active applications. Retained creates/reuses intake application.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-022 — Clients / Directory

Purpose: Find a reusable individual or employer.

Entry: shared CRM page through Clients or its listed dialog action. Source anchor: clientsPage (SOURCE_CODE/public/crm.html:631). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Name/phone/email search; client identity/contact and associated file links.

Actions: New Client; open client profile; open related application.

Business rules and dependencies: Current directory replaces earlier Clients & Intake views. Client uniqueness varies across UI and backend; normalized phone uniqueness is server-enforced.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-023 — Clients / Profile — Contact Information

Purpose: Maintain shared client identity.

Entry: shared CRM page through Clients or its listed dialog action. Source anchor: saveTabbedClientProfile (SOURCE_CODE/public/crm.html:1038). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Name; phone/email; DOB; address; UCI; status/expiry; preferred language; Reception Alert; employer contacts/locations/workers when applicable. Emergency contact data is also used by Application Client Information.

Actions: Save profile; cancel; switch tabs.

Business rules and dependencies: Name required; phone if present >=7 digits; email if present valid; duplicate normalized phone rejected. Reception Alert requires acknowledgement during later bookings. Exact backend field validation is weaker than form checks.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-024 — Clients / Profile — Consultation Notes

Purpose: Keep separate consultation records and outcomes.

Entry: shared CRM page through Clients or its listed dialog action. Source anchor: consultationEditor (SOURCE_CODE/public/crm.html:1013). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Expandable numbered consultation rows; date/type; instructions, special notes, immigration history/refusals, risks, recommended strategy. Outcome no change/Retained/Potential/Closed; conditional service/reason/follow-up date.

Actions: Expand/collapse; Add Consultation; Close and Save.

Business rules and dependencies: One pending outcome at a time; linked appointment date read-only; staff appointments excluded. Retained routes to intake; Potential requires reason/date; Closed requires reason. Shared profile/appointment/outcome rollback on failed save.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-025 — Clients / Profile — Applications

Purpose: View multiple files under one client.

Entry: shared CRM page through Clients or its listed dialog action. Source anchor: applicationListMarkup (SOURCE_CODE/public/crm.html:1095). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Type/detail/subtype; application serial; created date; retained/active/inactive state; submission deadline; overview; dependants; closure history.

Actions: Start Application; Open application; Case work & documents.

Business rules and dependencies: Serial numbers stored per client; newer first; scoped profile may show only selected matter. Inactive label supersedes active label.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-026 — Clients / Profile — Communication Log

Purpose: Record contact and connect calls/tasks.

Entry: shared CRM page through Clients or its listed dialog action. Source anchor: clientActivity (SOURCE_CODE/public/crm.html:1018). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Type Phone call/Email/WhatsApp/In person/Internal note/Other; date; summary/follow-up; reverse log; linked calls/tasks.

Actions: Save log entry; Save & record call / assign task.

Business rules and dependencies: Nonblank log and valid date when adding; records actor and timestamp; no send action. Linked task client is shared.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-027 — Clients / Profile — Appointments & History

Purpose: Review previous visits and imports.

Entry: shared CRM page through Clients or its listed dialog action. Source anchor: clientActivity (SOURCE_CODE/public/crm.html:1018). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Newest-first appointment details/notes/special notes/overview; imported sheet/row raw fields.

Actions: Save & book appointment; Save & edit appointment; expand history.

Business rules and dependencies: History remains in profile after queue hiding. Raw import text is escaped for display.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-028 — To-Do List / Retained Clients

Purpose: Hold retained applications until intake is complete.

Entry: shared CRM page through To-Do List or its listed dialog action. Source anchor: retainedCreateDialog (SOURCE_CODE/public/crm.html:1207). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Client/phone, application, retained date, manager, overview; enlarged red header tab/count.

Actions: Create Application; open retained intake.

Business rules and dependencies: Create dialog requires name/phone/email and searches existing profiles; autosaved partial application remains retained; Move validates required contact/overview/deadline.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-029 — To-Do List / Temporary Files

Purpose: Manage non-PR production work.

Entry: shared CRM page through To-Do List or its listed dialog action. Source anchor: workRows (SOURCE_CODE/public/crm.html:1236). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: No./selection, client contact, application, overview, retained date, submission deadline, case manager, stage; manager and name/phone search.

Actions: Open file; select visible files; reassign; stage dropdown; Move to Inactive.

Business rules and dependencies: Excludes retained-intake/submitted/closed/inactive. Type list includes TRP, BCPNP Profile and EE Profile. Stage options Not Started/Under Process/Ready/Submitted/Closed. No enforced RCIC approval before Ready.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-030 — To-Do List / PR Applications

Purpose: Manage PR production and document attention.

Entry: shared CRM page through To-Do List or its listed dialog action. Source anchor: workOverview (SOURCE_CODE/public/crm.html:1237). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: No./selection, client contact, application, ITA Received, Attention, deadline, case manager, stage; manager/type/name-phone filters.

Actions: Open file; document attention links; bulk reassign; stage; Move to Inactive.

Business rules and dependencies: isPRMatter honors applicationCategory first, then prTypes and legacy aliases. PR Refugee and Refugee PR coexist. Does not treat EE Profile/BCPNP Profile as PR application.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-031 — To-Do List / LMIA — In Process

Purpose: Track employer applications separately.

Entry: shared CRM page through To-Do List or its listed dialog action. Source anchor: lmiaPage (SOURCE_CODE/public/crm.html:1363). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Applicant, Company, Position, job posting expiry/status fields, TFW, Job Bank and LMIA status; company/applicant/position search. Status filter All/Active/On Hold/Not Proceeding.

Actions: Create LMIA; open company profile; status dropdown; deadline subtab.

Business rules and dependencies: Same employer may hold multiple applications. Existing LMIA paused states are separate from new Inactive Files. Closed and submitted filtering follows wrappers.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-032 — To-Do List / LMIA — Deadlines

Purpose: Inspect recruitment expiry queues.

Entry: shared CRM page through To-Do List or its listed dialog action. Source anchor: lmiaAdDeadlinePage (SOURCE_CODE/public/crm.html:612). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Advertisement expiry, status/countdown and company; date windows inherited from lmiaAdDeadlinePage.

Actions: Open LMIA profile; return In Process.

Business rules and dependencies: Legacy internal LMIA deadline view remains in wrapper chain; new Dashboard LMIA reminders are separate. Verify exact visible subtab layout in browser.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-033 — To-Do List / LMIA company/application modal

Purpose: Store employer and recruitment details.

Entry: shared CRM page through To-Do List or its listed dialog action. Source anchor: saveLmiaProfile (SOURCE_CODE/public/crm.html:537). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Company name, phone, optional email, operating name/contact; position, openings, wage, Job Bank/posting/TFW statuses, posted/expiry dates, required submission deadline, notes; existing applicant/status and pause reason/review date.

Actions: Use existing profile; Create/Save LMIA Application; create reminder inside profile; submit flow when selected.

Business rules and dependencies: Company name/valid phone; duplicate match selection; positive integer openings; nonnegative wage up to 2 decimals; valid date order; On Hold requires review date today/later; Not Proceeding requires reason; resume checkbox confirms dates reviewed.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-034 — To-Do List / Inactive Files

Purpose: Pause a file without closure.

Entry: shared CRM page through To-Do List or its listed dialog action. Source anchor: inactiveFilesPage (SOURCE_CODE/public/crm.html:1645). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Client/phone, application, previous stage, reason, moved date/by, case manager, return category, actions.

Actions: Open Application; Reactivate.

Business rules and dependencies: Tab immediately after LMIA; newest inactive first; no expiry; retains all content; existing deadlines/reminders stay active; no LMIA/retained/submitted/closed pausing.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-035 — To-Do List / Inactive / Reactivate dialogs

Purpose: Move safely between work and pause queues.

Entry: shared CRM page through To-Do List or its listed dialog action. Source anchor: saveInactiveFile (SOURCE_CODE/public/crm.html:1648). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Required reason <=2000 characters for pause; return category, previous stage and manager for reactivation.

Actions: Move to Inactive; Reactivate File; cancel.

Business rules and dependencies: Owner/case_manager only; server requires transition history; preserves stage/owner/content/deadlines during transition; rollback on failure. Reactivated category determined by isPRMatter.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-036 — To-Do List / Submitted

Purpose: Inspect recent externally filed applications.

Entry: shared CRM page through To-Do List or its listed dialog action. Source anchor: submittedPage (SOURCE_CODE/public/crm.html:878). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Client/file, application, submission date, leaves-view date, application number, case manager/status; text search.

Actions: Open file; edit/add submission date; Reopen; special LMIA delete action where permitted.

Business rules and dependencies: View lasts seven calendar days from filing date. Records remain in client history afterward. Reopen retains submission details.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-037 — To-Do List / Record Submission dialog

Purpose: Record work already done in government portal.

Entry: shared CRM page through To-Do List or its listed dialog action. Source anchor: recordSubmission (SOURCE_CODE/public/crm.html:886). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Submission date; portal/authority; application number; submitted by; confirmation document name.

Actions: Save as submitted; cancel.

Business rules and dependencies: Valid nonfuture date and nonempty details; no actual file upload requirement for confirmation name; sets stage 5/ball Government/due +30 days. Inactive must reactivate first.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-038 — To-Do List / Closed Files

Purpose: Inspect recently closed applications.

Entry: shared CRM page through To-Do List or its listed dialog action. Source anchor: closedFilesPage (SOURCE_CODE/public/crm.html:1630). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Client, application, reason/notes, closed date/by, actions.

Actions: Open read-only application; Reopen File.

Business rules and dependencies: 30 elapsed day queue only; files remain in client profile indefinitely. Closed content is server-locked, except coordinated client-name update.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-039 — To-Do List / Close / Reopen dialogs

Purpose: Record final pause/termination reason or resume a closed file.

Entry: shared CRM page through To-Do List or its listed dialog action. Source anchor: saveFileReopen (SOURCE_CODE/public/crm.html:1634). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Close: required reason and active manager, optional notes. Reopen: case manager and new submission deadline.

Actions: Close File; Reopen File.

Business rules and dependencies: Close stage6 with historical metadata; reopen stage2, deadline today/later in UI, record history; personal reminders resume and must be reviewed. Separate from Inactive.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-040 — Applications / Application Details

Purpose: Edit a specific client engagement in a full-page-style dialog.

Entry: shared CRM page through Applications or its listed dialog action. Source anchor: applicationEditor (SOURCE_CODE/public/crm.html:1106). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Grouped application type; optional custom text; conditional WP subtype/custom; manager; submission deadline; Case Overview; Extra Notes; dependants; PR ITA/notes; retainer/payment disclosure.

Actions: Back to Client Profile; View Client Profile; Delete Application owner only; Move from Retained; pause/reactivate/close/reopen according to state.

Business rules and dependencies: 600ms autosave, draft status text, navigation flush. Active save validates type/deadline/payment format. Drafts may be partial. Terms lock for signed administrative completion.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-041 — Applications / Application Type and Dependants

Purpose: Choose service/category and preserve family context.

Entry: shared CRM page through Applications or its listed dialog action. Source anchor: groupedApplicationType (SOURCE_CODE/public/crm.html:1185). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: PR types: Spousal, Common-law, Express Entry PR Application, H&C, Refugee PR, Parents Sponsorship, BCPNP, PR Refugee; Other PR custom. Temporary types: TRP, BCPNP Profile, EE Profile, Super Visa, Visitor Visa, Visitor Record, TRV, Work Permit, Study Permit, Study Permit Extension, Citizenship, PR Card; Other custom. WP: PGWP, PGWP Extension, LMIA Work Permit, Work Permit Extension, Refugee Work Permit Extension, Other. Dependants yes/no; name/DOB/relationship/overview.

Actions: Change type; Add/Remove Dependant.

Business rules and dependencies: Type/custom detail <=120 and no control chars; dependant DOB valid/nonfuture; subtype required for active Work Permit. New profile types are distinct temporary categories. Existing unknown types preserved as custom.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-042 — Applications / Client Information

Purpose: Edit shared client data while inside an application.

Entry: shared CRM page through Applications or its listed dialog action. Source anchor: applicationClientFields (SOURCE_CODE/public/crm.html:1559). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Name, phone, email, DOB, address, UCI, status/expiry; emergency name/relationship/phone/email.

Actions: Edit fields; autosave; switch tabs.

Business rules and dependencies: Contact edits staged and merged; changing name updates all related matter names. This is not an application-specific copy.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-043 — Applications / Reminders

Purpose: Manage reminders for selected application.

Entry: shared CRM page through Applications or its listed dialog action. Source anchor: applicationRemindersMarkup (SOURCE_CODE/public/crm.html:1448). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Open reminder text, due date, assigned person/countdown.

Actions: Create Reminder; Edit; Mark Complete.

Business rules and dependencies: Flush application first, then nested reminder dialog. Closed-file reminders suppressed; inactive reminders continue.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-044 — Applications / Case Work & Notes

Purpose: Keep dated internal progress/instructions.

Entry: shared CRM page through Applications or its listed dialog action. Source anchor: saveApplicationWorkspaceNote (SOURCE_CODE/public/crm.html:1563). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: New note text <=12000; expandable timestamped existing entries.

Actions: Save Note; expand/collapse.

Business rules and dependencies: Actor and createdAt recorded; explicit note save. Pending note flushed on app navigation. Reception backend permits caseWork-only changes but form-wide drafts can trigger other blocked changes; test role path.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-045 — Applications / Documents Received / Verified

Purpose: Review important PR documents.

Entry: shared CRM page through Applications or its listed dialog action. Source anchor: documentInlineChange (SOURCE_CODE/public/crm.html:1595). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Document kind/custom name, person, received date, review due, countdown, status, Verified by, notes. PCC rows for adult applicant/dependants; IELTS and experience defaults.

Actions: Add Document; edit inline; choose verifier; change status; open via attention badge.

Business rules and dependencies: PR only. Four main statuses Not received/Received/Issue notified/Verified, legacy Not applicable preserved. Received nonfuture; review due default two business days; Verified requires verifier. Issue notified records current date/actor but not mandatory method/instruction text in simpleTracking mode.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-046 — Applications / Case Work & Documents modal / document manager

Purpose: View notes and actual uploaded files.

Entry: shared CRM page through Applications or its listed dialog action. Source anchor: documentManager (SOURCE_CODE/public/crm.html:807). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Notes plus expandable Documents; document manager file input/category and list filename/size/uploaded metadata.

Actions: Add Note; Save/Cancel note; Open documents; upload PDF/JPEG/PNG; download; back to application/profile.

Business rules and dependencies: Notes timestamped; uploads separate API, max 10MB. UI checklist labels and actual stored uploads are not automatically one versioned requirement record.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-047 — Case Managers / Directory and add/edit/remove/reassign dialogs

Purpose: Manage assignment names and redistribute workload.

Entry: shared CRM page through Case Managers or its listed dialog action. Source anchor: caseManagersPage (SOURCE_CODE/public/crm.html:1225). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Name; open file count; select source/target; selected application IDs.

Actions: Add, Edit, Delete Case Manager owner only; View files; Reassign Files; active-list selection.

Business rules and dependencies: Must reassign open files before removal. Historical names remain. Directory is config not crm_members; no login invitation. Filtering may not surface every paused/LMIA file identically—acceptance test required.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-048 — Retainers and Invoices / Retainers & Invoices — pending

Purpose: Track administrative paperwork status.

Entry: shared CRM page through Retainers and Invoices or its listed dialog action. Source anchor: retainersInvoicesPage (SOURCE_CODE/public/crm.html:692). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Client, application, retained date, assigned-to; retainer Not prepared/Prepared/Sent/Signed/Closed; invoice Not prepared/Prepared/Sent/Paid.

Actions: Change status; open client; Open Application.

Business rules and dependencies: Appears after active intake move (or LMIA create). Inactive files remain eligible. Closing retainer removes admin row. No billing API or payment collection.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-049 — Retainers and Invoices / Signed Retainers

Purpose: Protect completed administrative record.

Entry: shared CRM page through Retainers and Invoices or its listed dialog action. Source anchor: signedRetainerComplete (SOURCE_CODE/public/crm.html:688). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Same table with locked retainer/invoice labels.

Actions: Open Application; view terms.

Business rules and dependencies: Signed retainer and invoice Sent or Paid yields signedRetainerComplete; backend locks statuses and terms once complete, including Sent-to-Paid later. Case work remains editable.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-050 — Deadline Centre / All deadline/request views

Purpose: Review derived deadlines and manually recorded government requests.

Entry: shared CRM page through Deadline Centre or its listed dialog action. Source anchor: deadlines (SOURCE_CODE/public/crm.html:480). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Source deadlines, clients/types/owners/date/status; request category tabs/filters in retained deadline-center functions.

Actions: Open file/request; add deadline/request; record request completion.

Business rules and dependencies: Dashboard is simplified current entry; old general deadline editor may still be reachable. Verify every legacy category/time/source field in browser; source definitions in appendices.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-051 — Settings / Access

Purpose: Manage real account authorization.

Entry: shared CRM page through Settings or its listed dialog action. Source anchor: loadAdministration (SOURCE_CODE/public/crm.html:821). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Staff email; role case_manager/reception/viewer; existing role/enabled/joined list.

Actions: Add/update staff; Enable/Disable.

Business rules and dependencies: Owner only; bootstrap owner cannot be edited by endpoint. Site sharing must separately permit user. No invitation sent.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-052 — Settings / Import

Purpose: Plan and reconcile prepared spreadsheet imports.

Entry: shared CRM page through Settings or its listed dialog action. Source anchor: commitCrmImport (SOURCE_CODE/public/crm.html:834). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: JSON file; counts; review-only checkbox; search; first100 matching source rows; original workbook links.

Actions: Preview; Import all new rows; Review/history; select existing profile; create confirmed appointment where allowed.

Business rules and dependencies: Owner; <=8MB input, format nationrise-import-v1, <=10k rows, stable IDs; saves in batches and preserves raw data; no generic workbook-to-JSON converter included.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-053 — Settings / Audit History

Purpose: Inspect record-change accountability.

Entry: shared CRM page through Settings or its listed dialog action. Source anchor: loadAdministration (SOURCE_CODE/public/crm.html:821). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Time, staff email, action, changes.

Actions: Open tab/load.

Business rules and dependencies: Owner; latest200 audit rows; no pagination or built-in field-diff UI. Shows which records changed, not every before/after field.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-054 — Settings / Recovery Points

Purpose: Export or restore prior records.

Entry: shared CRM page through Settings or its listed dialog action. Source anchor: restoreRecovery (SOURCE_CODE/public/crm.html:825). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Version, timestamp, saved-by and restore action; export records/document index.

Actions: Export; Restore then confirm.

Business rules and dependencies: Owner; latest100 recovery points; current dirty state must save first. Restore passes modern invariants and can fail; document bytes unchanged.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-055 — Settings / Templates

Purpose: Edit default document/task templates.

Entry: shared CRM page through Settings or its listed dialog action. Source anchor: templateEditor (SOURCE_CODE/public/crm.html:322). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: Service from types; client requirements and internal tasks one per line.

Actions: Save Template; expand workflow rules.

Business rules and dependencies: Owner configuration persistence; changes apply to new matters only. Legacy demo wording remains. Separate applicationTypes and configurable types can diverge.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## SCR-056 — Residual source / Legacy / hidden screens

Purpose: Preserve discoverability without claiming current scope.

Entry: shared CRM page through Residual source or its listed dialog action. Source anchor: page (SOURCE_CODE/public/crm.html:1238). Exit: close modal or nav to another registered module; application drafts flush through current nav/close wrappers.

Fields, filters and columns: All Matters, My Work, RCIC Review, Matter overview/strategy/checklist/preparation/review/timeline variants, questionnaire, Client Portal, Workflow Templates, Developer Guide, Reports, earlier weekly appointments, old profile Emergency/Status panels, imported-sheet auxiliary views.

Actions: See complete handler and template inventory.

Business rules and dependencies: Not primary navigation after live boot. Some remain reachable through older buttons/functions, others are replaced or explicitly removed. Each source control is indexed and marked visibility unresolved rather than asserted live.

Find individual controls in 03_BUTTON_ACTION_MATRIX.csv by enclosing function and in QA_EVIDENCE/EFFECTIVE_FUNCTIONS.md by handler name. Server authorization is per collection/action, not this display label (09). Current runtime status: source-backed contract; no browser pass.

## Field helper sites

| Field site | Source owner | Location | Helper | Exact arguments/defaults/options |
| --- | --- | --- | --- | --- |
| FLD-0001 | newClient | SOURCE_CODE/public/crm.html:189 | field | 'cname'; 'Full name' |
| FLD-0002 | newClient | SOURCE_CODE/public/crm.html:189 | field | 'cemail'; 'Email'; 'example@example.com'; 'email' |
| FLD-0003 | newClient | SOURCE_CODE/public/crm.html:189 | field | 'cphone'; 'Phone'; '555-0100' |
| FLD-0004 | newClient | SOURCE_CODE/public/crm.html:189 | options | 'ctype'; 'Inquiry type'; types |
| FLD-0005 | newMatter | SOURCE_CODE/public/crm.html:193 | options | 'type'; 'Matter type'; types; c.type |
| FLD-0006 | newMatter | SOURCE_CODE/public/crm.html:193 | options | 'owner'; 'Case manager'; staff; staff[0] |
| FLD-0007 | newMatter | SOURCE_CODE/public/crm.html:193 | field | 'mdue'; 'First action due'; '2026-10-08'; 'date' |
| FLD-0008 | editMatter | SOURCE_CODE/public/crm.html:195 | options | 'owner'; 'Case manager'; staff; m.owner |
| FLD-0009 | editMatter | SOURCE_CODE/public/crm.html:195 | options | 'ball'; 'Who has the ball?'; ['Case Manager','Client','RCIC','Government','Reception','Third Party']; m.ball |
| FLD-0010 | editMatter | SOURCE_CODE/public/crm.html:195 | field | 'next'; 'Next action'; m.next |
| FLD-0011 | editMatter | SOURCE_CODE/public/crm.html:195 | field | 'mdue'; 'Due / follow-up date'; m.due; 'date' |
| FLD-0012 | addDoc | SOURCE_CODE/public/crm.html:199 | field | 'docname'; 'Document name' |
| FLD-0013 | submitDialog | SOURCE_CODE/public/crm.html:209 | field | 'sdate'; 'Submission date'; TODAY; 'date' |
| FLD-0014 | submitDialog | SOURCE_CODE/public/crm.html:209 | field | 'sportal'; 'Portal / authority'; 'IRCC portal' |
| FLD-0015 | submitDialog | SOURCE_CODE/public/crm.html:209 | field | 'sref'; 'Application / confirmation number'; 'DEMO-2026-001' |
| FLD-0016 | governmentRequest | SOURCE_CODE/public/crm.html:211 | field | 'gtype'; 'Request / next action'; 'Respond to additional document request' |
| FLD-0017 | governmentRequest | SOURCE_CODE/public/crm.html:211 | field | 'gdate'; 'Verified response deadline'; '2026-10-20'; 'date' |
| FLD-0018 | governmentRequest | SOURCE_CODE/public/crm.html:211 | options | 'gowner'; 'Responsible case manager'; staff; mget().owner |
| FLD-0019 | closeMatter | SOURCE_CODE/public/crm.html:213 | options | 'decision'; 'Decision'; ['Approved','Refused','Withdrawn','Other'] |
| FLD-0020 | appointmentDialog | SOURCE_CODE/public/crm.html:266 | field | 'adate'; 'Date'; a.date\|\|TODAY; 'date' |
| FLD-0021 | appointmentDialog | SOURCE_CODE/public/crm.html:266 | field | 'atime'; 'Time'; a.time\|\|'11:00'; 'time' |
| FLD-0022 | appointmentDialog | SOURCE_CODE/public/crm.html:266 | field | 'aduration'; 'Minutes'; a.duration\|\|30; 'number' |
| FLD-0023 | appointmentDialog | SOURCE_CODE/public/crm.html:266 | field | 'aconsult'; 'Consultant'; a.consultant\|\|'Tejinder' |
| FLD-0024 | appointmentDialog | SOURCE_CODE/public/crm.html:266 | field | 'anotes'; 'Appointment notes'; a.notes\|\|'Consultation' |
| FLD-0025 | appointmentDialog | SOURCE_CODE/public/crm.html:266 | field | 'asource'; 'Reference / source'; a.source\|\|'Phone inquiry' |
| FLD-0026 | appointmentDialog | SOURCE_CODE/public/crm.html:266 | options | 'areminder'; 'Reminder record'; ['Pending','Recorded']; a.reminder\|\|'Pending' |
| FLD-0027 | newClient | SOURCE_CODE/public/crm.html:270 | options | 'ckind'; 'Profile type'; ['Individual','Employer']; 'Individual' |
| FLD-0028 | newClient | SOURCE_CODE/public/crm.html:270 | field | 'cname'; 'Name / company name' |
| FLD-0029 | newClient | SOURCE_CODE/public/crm.html:270 | field | 'cphone'; 'Phone' |
| FLD-0030 | newClient | SOURCE_CODE/public/crm.html:270 | field | 'cemail'; 'Email'; ''; 'email' |
| FLD-0031 | newClient | SOURCE_CODE/public/crm.html:270 | options | 'cstatus'; 'Current immigration status'; ['Not applicable','Work permit','Study permit','Visitor','Permanent resident','Out of status','Other']; 'Work permit' |
| FLD-0032 | newClient | SOURCE_CODE/public/crm.html:270 | options | 'ctype'; 'Inquiry type'; types; 'Work Permit' |
| FLD-0033 | consultation | SOURCE_CODE/public/crm.html:272 | field | 'contacts'; 'Company contacts'; c.contacts |
| FLD-0034 | consultation | SOURCE_CODE/public/crm.html:272 | field | 'locations'; 'Work locations'; c.locations |
| FLD-0035 | consultation | SOURCE_CODE/public/crm.html:272 | field | 'workers'; 'Foreign workers'; c.workers |
| FLD-0036 | consultation | SOURCE_CODE/public/crm.html:272 | field | 'uci'; 'UCI / reference'; c.uci\|\|'DEMO-PENDING' |
| FLD-0037 | consultation | SOURCE_CODE/public/crm.html:272 | field | 'address'; 'Address'; c.address\|\|'To be collected' |
| FLD-0038 | consultation | SOURCE_CODE/public/crm.html:272 | options | 'cstatus'; 'Immigration status'; ['Work permit','Study permit','Visitor','Permanent resident','Out of status','Other']; c.status |
| FLD-0039 | editMatter | SOURCE_CODE/public/crm.html:277 | options | 'ball'; 'Who has the ball?'; ['Case Manager','Client','RCIC','Reception','Government','Third Party']; m.ball |
| FLD-0040 | editMatter | SOURCE_CODE/public/crm.html:277 | field | 'next'; 'Next action'; m.next |
| FLD-0041 | editMatter | SOURCE_CODE/public/crm.html:277 | field | 'mdue'; 'Due / follow-up date'; m.due; 'date' |
| FLD-0042 | submitDialog | SOURCE_CODE/public/crm.html:288 | field | 'sdate'; 'Submission date'; TODAY; 'date' |
| FLD-0043 | submitDialog | SOURCE_CODE/public/crm.html:288 | field | 'sportal'; 'Portal / authority'; 'IRCC portal' |
| FLD-0044 | submitDialog | SOURCE_CODE/public/crm.html:288 | field | 'sref'; 'Application number'; 'DEMO-2026-001' |
| FLD-0045 | submitDialog | SOURCE_CODE/public/crm.html:288 | field | 'sby'; 'Submitted by'; mget().owner |
| FLD-0046 | submitDialog | SOURCE_CODE/public/crm.html:288 | field | 'sconfirmation'; 'Confirmation document name'; 'sample-confirmation.pdf' |
| FLD-0047 | requestClientInfo | SOURCE_CODE/public/crm.html:290 | field | 'inforequest'; 'Information needed' |
| FLD-0048 | requestClientInfo | SOURCE_CODE/public/crm.html:290 | field | 'infodue'; 'Client follow-up date'; addDays(TODAY,3); 'date' |
| FLD-0049 | taskDialog | SOURCE_CODE/public/crm.html:292 | field | 'taskname'; 'Action' |
| FLD-0050 | taskDialog | SOURCE_CODE/public/crm.html:292 | field | 'taskdue'; 'Due date'; mget().due; 'date' |
| FLD-0051 | deadlineDialog | SOURCE_CODE/public/crm.html:295 | options | 'dkind'; 'Deadline type'; ['Hard Deadline','Internal Target','Normal Task Deadline']; 'Internal Target' |
| FLD-0052 | deadlineDialog | SOURCE_CODE/public/crm.html:295 | field | 'dlabel'; 'Action / deadline name' |
| FLD-0053 | deadlineDialog | SOURCE_CODE/public/crm.html:295 | field | 'ddate'; 'Date'; addDays(TODAY,7); 'date' |
| FLD-0054 | deadlineDialog | SOURCE_CODE/public/crm.html:295 | field | 'dtime'; 'Due time'; '16:00'; 'time' |
| FLD-0055 | deadlineDialog | SOURCE_CODE/public/crm.html:295 | field | 'dzone'; 'Time zone'; 'America/Vancouver' |
| FLD-0056 | deadlineDialog | SOURCE_CODE/public/crm.html:295 | field | 'dsource'; 'Source / reason'; 'Internal target' |
| FLD-0057 | governmentRequest | SOURCE_CODE/public/crm.html:299 | field | 'gtype'; 'Request type'; 'Additional document request' |
| FLD-0058 | governmentRequest | SOURCE_CODE/public/crm.html:299 | field | 'greceived'; 'Date received'; TODAY; 'date' |
| FLD-0059 | governmentRequest | SOURCE_CODE/public/crm.html:299 | field | 'gdate'; 'Verified deadline'; addDays(TODAY,10); 'date' |
| FLD-0060 | communication | SOURCE_CODE/public/crm.html:301 | options | 'notetype'; 'Note type'; noteTypes; 'Internal Note' |
| FLD-0061 | questionnaireMarkup | SOURCE_CODE/public/crm.html:306 | options | 'qmarried'; 'Have you been married before?'; ['Select','No','Yes']; q.married\|\|'Select' |
| FLD-0062 | questionnaireMarkup | SOURCE_CODE/public/crm.html:306 | field | 'qspouse'; 'Previous spouse'; q.spouse |
| FLD-0063 | questionnaireMarkup | SOURCE_CODE/public/crm.html:306 | field | 'qmarriage'; 'Marriage date'; q.marriage; 'date' |
| FLD-0064 | questionnaireMarkup | SOURCE_CODE/public/crm.html:306 | field | 'qseparation'; 'Separation date'; q.separation; 'date' |
| FLD-0065 | questionnaireMarkup | SOURCE_CODE/public/crm.html:306 | field | 'qdivorce'; 'Divorce date'; q.divorce; 'date' |
| FLD-0066 | appointmentDialog | SOURCE_CODE/public/crm.html:349 | options | 'akind'; 'Appointment type'; ['Initial Consultation','Follow-up','Case Review','Document Signing','Employer Meeting','Other']; a.kind\|\|'Initial Consultation' |
| FLD-0067 | appointmentDialog | SOURCE_CODE/public/crm.html:349 | options | 'aconsult'; 'Consultant'; consultants; a.consultant\|\|'Tejinder' |
| FLD-0068 | appointmentDialog | SOURCE_CODE/public/crm.html:349 | field | 'adate'; 'Date'; date\|\|a.date\|\|TODAY; 'date' |
| FLD-0069 | appointmentDialog | SOURCE_CODE/public/crm.html:349 | field | 'atime'; 'Start time'; time\|\|a.time\|\|'09:00'; 'time' |
| FLD-0070 | appointmentDialog | SOURCE_CODE/public/crm.html:349 | options | 'aduration'; 'Duration (minutes)'; ['15','30','45','60','90','120']; String(a.duration\|\|30) |
| FLD-0071 | appointmentDialog | SOURCE_CODE/public/crm.html:349 | options | 'amode'; 'Meeting type'; ['In person','Phone','Video call']; a.mode\|\|'In person' |
| FLD-0072 | appointmentDialog | SOURCE_CODE/public/crm.html:349 | options | 'astatus'; 'Status'; appointmentStatuses; a.status\|\|'Scheduled' |
| FLD-0073 | appointmentDialog | SOURCE_CODE/public/crm.html:349 | field | 'asource'; 'Reference / source'; a.source\|\|'Phone inquiry' |
| FLD-0074 | appointmentDialog | SOURCE_CODE/public/crm.html:349 | options | 'areminder'; 'Reminder record'; ['Pending','Recorded']; a.reminder\|\|'Pending' |
| FLD-0075 | appointmentDialog | SOURCE_CODE/public/crm.html:370 | options | 'asection'; 'Show under'; ['Clients','Staff','Follow-ups']; a?.section\|\|preferredSheetSection |
| FLD-0076 | officeTaskDialog | SOURCE_CODE/public/crm.html:395 | options | 'otby'; 'Assigned by'; taskPeople; t.assignedBy\|\|'Tejinder' |
| FLD-0077 | officeTaskDialog | SOURCE_CODE/public/crm.html:395 | taskManagerSelect | 'otto'; 'Assigned to'; t.assignedTo\|\|'' |
| FLD-0078 | officeTaskDialog | SOURCE_CODE/public/crm.html:395 | field | 'otdate'; 'Received date'; t.date\|\|TODAY; 'date' |
| FLD-0079 | officeTaskDialog | SOURCE_CODE/public/crm.html:395 | field | 'ottime'; 'Time received'; t.time\|\|'11:30'; 'time' |
| FLD-0080 | officeTaskDialog | SOURCE_CODE/public/crm.html:395 | field | 'otdue'; 'Due date'; t.due\|\|TODAY; 'date' |
| FLD-0081 | officeTaskDialog | SOURCE_CODE/public/crm.html:395 | options | 'otpriority'; 'Priority'; ['Normal','Urgent']; t.priority\|\|'Normal' |
| FLD-0082 | appointmentDialog | SOURCE_CODE/public/crm.html:403 | options | 'aservice'; 'Service / application requested'; types; a?.service\|\|'Spousal Sponsorship' |
| FLD-0083 | newMatter | SOURCE_CODE/public/crm.html:412 | field | 'retaineddate'; 'Date retained'; TODAY; 'date' |
| FLD-0084 | contactDialog | SOURCE_CODE/public/crm.html:442 | field | 'contactdate'; 'Contact date'; TODAY; 'date' |
| FLD-0085 | contactDialog | SOURCE_CODE/public/crm.html:442 | field | 'contacttime'; 'Contact time (Vancouver)'; '11:30'; 'time' |
| FLD-0086 | contactDialog | SOURCE_CODE/public/crm.html:442 | options | 'contactmethod'; 'Contact method'; ['Phone call','Email','In person','Video call','Text / WhatsApp']; 'Phone call' |
| FLD-0087 | contactDialog | SOURCE_CODE/public/crm.html:442 | options | 'contactstaff'; 'Staff member'; ['Reception','Tejinder',...staff]; m.owner\|\|'Reception' |
| FLD-0088 | contactDialog | SOURCE_CODE/public/crm.html:442 | field | 'contactperson'; 'Contact with'; m.name |
| FLD-0089 | requestDeadlineDialog | SOURCE_CODE/public/crm.html:481 | options | 'rqcategory'; 'Category'; ['PFLs','IRCC Document Requests','File Submission','Other deadline']; requestDeadlineTab==='All deadlines'?'PFLs':requestDeadlineTab |
| FLD-0090 | requestDeadlineDialog | SOURCE_CODE/public/crm.html:481 | field | 'rqlabel'; 'Request / action required' |
| FLD-0091 | requestDeadlineDialog | SOURCE_CODE/public/crm.html:481 | field | 'rqreceived'; 'Date received'; TODAY; 'date' |
| FLD-0092 | requestDeadlineDialog | SOURCE_CODE/public/crm.html:481 | field | 'rqdate'; 'Deadline from letter'; ''; 'date' |
| FLD-0093 | requestDeadlineDialog | SOURCE_CODE/public/crm.html:481 | field | 'rqtime'; 'Exact deadline time'; ''; 'time' |
| FLD-0094 | requestDeadlineDialog | SOURCE_CODE/public/crm.html:481 | field | 'rqzone'; 'Time zone from letter' |
| FLD-0095 | requestDeadlineDialog | SOURCE_CODE/public/crm.html:481 | field | 'rqowner'; 'Assigned staff — type name' |
| FLD-0096 | requestDeadlineDialog | SOURCE_CODE/public/crm.html:481 | field | 'rqsource'; 'Source letter / reference' |
| FLD-0097 | resolveRequestDialog | SOURCE_CODE/public/crm.html:483 | taskManagerSelect | 'rqcompletedby'; 'Completed by — required' |
| FLD-0098 | resolveRequestDialog | SOURCE_CODE/public/crm.html:483 | field | 'rqresponse'; 'Submission confirmation / completion explanation' |
| FLD-0099 | resolveRequestDialog | SOURCE_CODE/public/crm.html:483 | field | 'rqnext'; 'Next action after completion'; 'Check for government correspondence' |
| FLD-0100 | resolveRequestDialog | SOURCE_CODE/public/crm.html:483 | field | 'rqfollow'; 'Next follow-up date'; addDays(TODAY,7); 'date' |
| FLD-0101 | fileUpdateDialog | SOURCE_CODE/public/crm.html:502 | options | 'fucategory'; 'Section'; ['Request / follow-up','Application result']; u.category\|\|'Request / follow-up' |
| FLD-0102 | fileUpdateDialog | SOURCE_CODE/public/crm.html:502 | field | 'fudate'; 'Date'; u.date\|\|TODAY; 'date' |
| FLD-0103 | fileUpdateDialog | SOURCE_CODE/public/crm.html:502 | field | 'fuworker'; 'Who’s working — type name'; u.worker\|\|'' |
| FLD-0104 | fileUpdateDialog | SOURCE_CODE/public/crm.html:502 | options | 'fustatus'; 'Follow-up status'; ['Pending','In Progress','Completed','Recorded']; u.status\|\|'Pending' |
| FLD-0105 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | field | 'lcname'; 'Company / client name'; c?.name\|\|'' |
| FLD-0106 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | profileInput | 'lcoperating'; 'Operating / business name'; c?.operatingName\|\|'' |
| FLD-0107 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | profileInput | 'lccontact'; 'Contact person'; c?.contacts\|\|'' |
| FLD-0108 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | field | 'lcphone'; 'Phone'; c?.phone\|\|''; 'tel' |
| FLD-0109 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | profileInput | 'lcemail'; 'Email'; c?.email\|\|''; 'email' |
| FLD-0110 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | profileInput | 'llposition'; 'Job title'; l.position\|\|'' |
| FLD-0111 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | profileInput | 'llopenings'; 'Number of positions'; l.openings\|\|''; 'number' |
| FLD-0112 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | profileInput | 'llwage'; 'Hourly wage (CAD)'; l.wage\|\|''; 'number' |
| FLD-0113 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | options | 'lljobBank'; 'Job Bank status'; lmiaJobBankStatuses; l.jobBank\|\|'To confirm' |
| FLD-0114 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | options | 'llpostingStatus'; 'Job posting status'; lmiaPostingStatuses; l.postingStatus\|\|'Not posted' |
| FLD-0115 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | profileInput | 'llpostedDate'; 'Job posted date'; l.postedDate\|\|''; 'date' |
| FLD-0116 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | profileInput | 'llpostingExpiry'; 'Job posting expiry date'; l.postingExpiry\|\|''; 'date' |
| FLD-0117 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | field | 'llsubmissionDue'; 'Submission deadline'; m?.submissionDue\|\|''; 'date' |
| FLD-0118 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | profileInput | 'llapplicant'; 'Applicant'; l.applicant\|\|'' |
| FLD-0119 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | options | 'llstatus'; 'LMIA status'; [...lmiaOverviewStatuses.filter(v=>v!=='Erased'),'In process','Recruitment','Preparing application','Officer review','Approved','Refused','Withdrawn']; l.status\|\|'In process' |
| FLD-0120 | newLmiaFile | SOURCE_CODE/public/crm.html:534 | profileText | 'llnotes'; 'Additional Notes'; l.notes\|\|''; 5 |
| FLD-0121 | retainedIntakeDialog | SOURCE_CODE/public/crm.html:593 | field | 'riname'; 'Client name'; c.name |
| FLD-0122 | retainedIntakeDialog | SOURCE_CODE/public/crm.html:593 | field | 'riphone'; 'Phone'; c.phone |
| FLD-0123 | retainedIntakeDialog | SOURCE_CODE/public/crm.html:593 | field | 'riemail'; 'Email'; c.email; 'email' |
| FLD-0124 | retainedIntakeDialog | SOURCE_CODE/public/crm.html:593 | options | 'ritype'; 'Application type'; types; m.type |
| FLD-0125 | retainedIntakeDialog | SOURCE_CODE/public/crm.html:593 | field | 'riowner'; 'Case manager — type name'; m.owner |
| FLD-0126 | retainedIntakeDialog | SOURCE_CODE/public/crm.html:593 | field | 'rinext'; 'Next action'; m.retainedIntake?'Prepare the file':m.next |
| FLD-0127 | retainedIntakeDialog | SOURCE_CODE/public/crm.html:593 | field | 'ridue'; 'Next action due'; m.due; 'date' |
| FLD-0128 | editAdExpiry | SOURCE_CODE/public/crm.html:613 | field | 'adexpirydate'; 'Confirmed job ad expiry date'; lmiaTracking(m).postingExpiry; 'date' |
| FLD-0129 | changeSimpleFileStage | SOURCE_CODE/public/crm.html:645 | field | 'sdate'; 'Submission date'; TODAY; 'date' |
| FLD-0130 | changeSimpleFileStage | SOURCE_CODE/public/crm.html:645 | field | 'sportal'; 'Portal / authority'; 'IRCC portal' |
| FLD-0131 | changeSimpleFileStage | SOURCE_CODE/public/crm.html:645 | field | 'sref'; 'Application number' |
| FLD-0132 | changeSimpleFileStage | SOURCE_CODE/public/crm.html:645 | field | 'sby'; 'Submitted by'; m.owner |
| FLD-0133 | changeSimpleFileStage | SOURCE_CODE/public/crm.html:645 | field | 'sconfirmation'; 'Confirmation document name' |
| FLD-0134 | changeSimpleFileStage | SOURCE_CODE/public/crm.html:645 | field | 'simplereason'; 'Decision / reason for closure' |
| FLD-0135 | fileUpdateDialog | SOURCE_CODE/public/crm.html:712 | field | 'fureceived'; 'Date'; u.date\|\|TODAY; 'date' |
| FLD-0136 | fileUpdateDialog | SOURCE_CODE/public/crm.html:712 | field | 'funame'; 'Client Name'; u.clientName??m?.name??'' |
| FLD-0137 | fileUpdateDialog | SOURCE_CODE/public/crm.html:712 | field | 'futype'; 'Type of Application'; u.applicationType??m?.type??'' |
| FLD-0138 | fileUpdateDialog | SOURCE_CODE/public/crm.html:712 | options | 'fuupdateType'; 'Update type'; ['Approved','Refused','Documents Requested','Other']; u.id?updateKind(u):'Approved' |
| FLD-0139 | fileUpdateDialog | SOURCE_CODE/public/crm.html:712 | options | 'fusent'; 'Status'; ['Not Sent','Pending Further','Sent']; updateSentValue(u) |
| FLD-0140 | fileUpdateDialog | SOURCE_CODE/public/crm.html:712 | options | 'fumethod'; 'Method'; ['','Email','Text','Other']; u.actionMethod\|\|'' |
| FLD-0141 | appointmentDialog | SOURCE_CODE/public/crm.html:734 | field | 'qbname'; 'Name'; c?.name\|\|'' |
| FLD-0142 | appointmentDialog | SOURCE_CODE/public/crm.html:734 | options | 'qbservice'; 'Service needed'; types; a?.service\|\|c?.type\|\|types[0] |
| FLD-0143 | appointmentDialog | SOURCE_CODE/public/crm.html:734 | field | 'qbdate'; 'Appointment date'; date\|\|a?.date\|\|TODAY; 'date' |
| FLD-0144 | appointmentDialog | SOURCE_CODE/public/crm.html:734 | field | 'qbtime'; 'Appointment time'; time\|\|a?.time\|\|'09:00'; 'time' |
| FLD-0145 | retainedIntakeDialog | SOURCE_CODE/public/crm.html:742 | field | 'riname'; 'Client name'; c.name |
| FLD-0146 | retainedIntakeDialog | SOURCE_CODE/public/crm.html:742 | field | 'riphone'; 'Phone'; c.phone |
| FLD-0147 | retainedIntakeDialog | SOURCE_CODE/public/crm.html:742 | field | 'riemail'; 'Email'; c.email\|\|''; 'email' |
| FLD-0148 | retainedIntakeDialog | SOURCE_CODE/public/crm.html:742 | options | 'ritype'; 'Application type'; types; m.type |
| FLD-0149 | retainedIntakeDialog | SOURCE_CODE/public/crm.html:742 | field | 'riowner'; 'Case manager — type name'; m.owner\|\|'' |
| FLD-0150 | retainedIntakeDialog | SOURCE_CODE/public/crm.html:742 | field | 'rinext'; 'Next action'; m.retainedIntake?'Prepare the file':m.next |
| FLD-0151 | retainedIntakeDialog | SOURCE_CODE/public/crm.html:742 | field | 'ridue'; 'Next action due'; m.due; 'date' |
| FLD-0152 | newClient | SOURCE_CODE/public/crm.html:800 | field | 'cname'; 'Full name' |
| FLD-0153 | newClient | SOURCE_CODE/public/crm.html:800 | field | 'cphone'; 'Phone number' |
| FLD-0154 | newClient | SOURCE_CODE/public/crm.html:800 | options | 'ctype'; 'Service needed'; types |
| FLD-0155 | loadAdministration | SOURCE_CODE/public/crm.html:821 | field | 'memberEmail'; 'Staff email'; ''; 'email' |
| FLD-0156 | loadAdministration | SOURCE_CODE/public/crm.html:821 | options | 'memberRole'; 'Role'; ['case_manager','reception','viewer']; 'case_manager' |
| FLD-0157 | reviewImportRow | SOURCE_CODE/public/crm.html:837 | field | 'importName'; 'Confirmed name'; e.name |
| FLD-0158 | reviewImportRow | SOURCE_CODE/public/crm.html:837 | field | 'importPhone'; 'Confirmed phone'; e.phone |
| FLD-0159 | reviewImportRow | SOURCE_CODE/public/crm.html:837 | field | 'importDate'; 'Confirmed appointment date'; e.date; 'date' |
| FLD-0160 | reviewImportRow | SOURCE_CODE/public/crm.html:837 | field | 'importTime'; 'Confirmed appointment time'; e.time; 'time' |
| FLD-0161 | submissionDialog | SOURCE_CODE/public/crm.html:883 | field | 'sdate'; 'Submission date'; s.date\|\|crmToday(); 'date' |
| FLD-0162 | submissionDialog | SOURCE_CODE/public/crm.html:883 | field | 'sportal'; 'Portal / authority'; s.portal\|\|(m.type==='LMIA'?'ESDC':'IRCC portal') |
| FLD-0163 | submissionDialog | SOURCE_CODE/public/crm.html:883 | field | 'sref'; 'Application number'; s.ref\|\|'' |
| FLD-0164 | submissionDialog | SOURCE_CODE/public/crm.html:883 | field | 'sby'; 'Submitted by'; s.by\|\|liveUser?.email\|\|m.owner\|\|'' |
| FLD-0165 | submissionDialog | SOURCE_CODE/public/crm.html:883 | field | 'sconfirmation'; 'Confirmation document name'; s.confirmation\|\|'' |
| FLD-0166 | appointmentDialog | SOURCE_CODE/public/crm.html:919 | field | 'qbname'; 'Client name'; c?.name\|\|'' |
| FLD-0167 | appointmentDialog | SOURCE_CODE/public/crm.html:919 | options | 'qbservice'; 'Service requested'; bookingServices(); a?.service\|\|c?.type\|\|bookingServices()[0] |
| FLD-0168 | appointmentDialog | SOURCE_CODE/public/crm.html:919 | field | 'qbdate'; 'Date'; date\|\|a?.date\|\|crmToday(); 'date' |
| FLD-0169 | appointmentDialog | SOURCE_CODE/public/crm.html:919 | field | 'qbtime'; 'Time · Vancouver'; time\|\|a?.time\|\|'09:00'; 'time' |
| FLD-0170 | appointmentDialog | SOURCE_CODE/public/crm.html:919 | options | 'qbconsultant'; 'Consultant'; [...new Set([...consultants,a?.consultant].filter(Boolean))]; a?.consultant\|\|consultants[0] |
| FLD-0171 | appointmentDialog | SOURCE_CODE/public/crm.html:919 | profileInput | 'qbconsultationtype'; 'Consultation type'; a?.consultationType\|\|'' |
| FLD-0172 | appointmentDialog | SOURCE_CODE/public/crm.html:919 | options | 'qbclienttype'; 'Client type'; ['New Client','Existing Client']; a?.clientType\|\|(c?'Existing Client':'New Client') |
| FLD-0173 | appointmentDialog | SOURCE_CODE/public/crm.html:919 | profileInput | 'qbreferredby'; 'Referred by (name, Google, Instagram, etc.)'; a?.referredBy\|\|'' |
| FLD-0174 | potentialActionDialog | SOURCE_CODE/public/crm.html:940 | profileText | 'potentialActionNotes'; action==='close'?'Closing reason / notes — required':'Follow-up reason / notes — required'; ''; 4 |
| FLD-0175 | potentialActionDialog | SOURCE_CODE/public/crm.html:940 | profileInput | 'potentialNextDate'; 'Next follow-up date (optional)'; c.followupDate\|\|''; 'date' |
| FLD-0176 | profileInput | SOURCE_CODE/public/crm.html:1000 | field | id; label; value; type |
| FLD-0177 | consultationOutcomeEditor | SOURCE_CODE/public/crm.html:1008 | options | 'visitservice'; 'Application / service'; applicationTypes(); r.outcomeService\|\|types[0] |
| FLD-0178 | consultationOutcomeEditor | SOURCE_CODE/public/crm.html:1008 | profileText | 'visitreason'; r.pendingOutcome==='Closed'?'Closing reason / notes — required':'Follow-up notes — required'; r.outcomeReason\|\|''; 8 |
| FLD-0179 | consultationOutcomeEditor | SOURCE_CODE/public/crm.html:1008 | profileInput | 'visitfollowup'; 'Follow-up date — required'; r.outcomeFollowup\|\|''; 'date' |
| FLD-0180 | consultationEditor | SOURCE_CODE/public/crm.html:1013 | profileInput | 'visitdate'; 'Consultation date'; r.date\|\|''; 'date' |
| FLD-0181 | consultationEditor | SOURCE_CODE/public/crm.html:1013 | profileInput | 'visitdate'; 'Consultation date'; r.date\|\|''; 'date' |
| FLD-0182 | consultationEditor | SOURCE_CODE/public/crm.html:1013 | profileInput | 'visittype'; 'Consultation type'; r.consultationType\|\|'' |
| FLD-0183 | consultationEditor | SOURCE_CODE/public/crm.html:1013 | profileText | 'visit'+key; label; r[key]\|\|''; 5 |
| FLD-0184 | clientActivity | SOURCE_CODE/public/crm.html:1023 | profileText | 'cpreceptionalert'; 'Reception Alert — internal booking instructions'; c.receptionAlert\|\|''; 2 |
| FLD-0185 | clientActivity | SOURCE_CODE/public/crm.html:1023 | profileInput | 'cpname'; 'Full name'; c.name |
| FLD-0186 | clientActivity | SOURCE_CODE/public/crm.html:1023 | profileInput | 'cpphone'; 'Phone number'; c.phone; 'tel' |
| FLD-0187 | clientActivity | SOURCE_CODE/public/crm.html:1023 | profileInput | 'cpemail'; 'Email'; c.email; 'email' |
| FLD-0188 | clientActivity | SOURCE_CODE/public/crm.html:1023 | profileInput | 'cpdob'; 'Date of birth'; c.dob; 'date' |
| FLD-0189 | clientActivity | SOURCE_CODE/public/crm.html:1023 | profileInput | 'cpaddress'; 'Address'; c.address |
| FLD-0190 | clientActivity | SOURCE_CODE/public/crm.html:1023 | profileInput | 'cpuci'; 'UCI / reference'; c.uci |
| FLD-0191 | clientActivity | SOURCE_CODE/public/crm.html:1023 | profileInput | 'cpstatus'; 'Current immigration status'; c.status |
| FLD-0192 | clientActivity | SOURCE_CODE/public/crm.html:1023 | profileInput | 'cpexpiry'; 'Status expiry'; c.expiry; 'date' |
| FLD-0193 | clientActivity | SOURCE_CODE/public/crm.html:1023 | profileInput | 'cplanguage'; 'Preferred language'; c.preferredLanguage |
| FLD-0194 | clientActivity | SOURCE_CODE/public/crm.html:1023 | profileInput | 'cpcontacts'; 'Company contacts'; c.contacts |
| FLD-0195 | clientActivity | SOURCE_CODE/public/crm.html:1023 | profileInput | 'cplocations'; 'Work locations'; c.locations |
| FLD-0196 | clientActivity | SOURCE_CODE/public/crm.html:1023 | profileInput | 'cpworkers'; 'Foreign workers'; c.workers |
| FLD-0197 | clientActivity | SOURCE_CODE/public/crm.html:1024 | profileInput | 'cpemname'; 'Contact name'; em.name |
| FLD-0198 | clientActivity | SOURCE_CODE/public/crm.html:1024 | profileInput | 'cpemrelationship'; 'Relationship to client'; em.relationship |
| FLD-0199 | clientActivity | SOURCE_CODE/public/crm.html:1024 | profileInput | 'cpemphone'; 'Phone number'; em.phone; 'tel' |
| FLD-0200 | clientActivity | SOURCE_CODE/public/crm.html:1024 | profileInput | 'cpememail'; 'Email'; em.email; 'email' |
| FLD-0201 | clientActivity | SOURCE_CODE/public/crm.html:1024 | profileInput | 'cpemaddress'; 'Address (optional)'; em.address |
| FLD-0202 | clientActivity | SOURCE_CODE/public/crm.html:1024 | profileText | 'cpemnotes'; 'Contact instructions'; em.notes |
| FLD-0203 | clientActivity | SOURCE_CODE/public/crm.html:1025 | profileText | 'cpnotes'; 'Consultation notes / instructions'; c.notes; 6 |
| FLD-0204 | clientActivity | SOURCE_CODE/public/crm.html:1025 | profileText | 'cpspecial'; 'Special Notes'; c.specialNotes |
| FLD-0205 | clientActivity | SOURCE_CODE/public/crm.html:1025 | profileText | 'cphistory'; 'Immigration history / previous refusals'; c.history |
| FLD-0206 | clientActivity | SOURCE_CODE/public/crm.html:1025 | profileText | 'cprisks'; 'Risks & important facts'; c.risks |
| FLD-0207 | clientActivity | SOURCE_CODE/public/crm.html:1025 | profileText | 'cpstrategy'; 'Recommended strategy'; c.strategy |
| FLD-0208 | clientActivity | SOURCE_CODE/public/crm.html:1027 | options | 'cplogtype'; 'Communication type'; ['Phone call','Email','WhatsApp','In person','Internal note','Other']; 'Phone call' |
| FLD-0209 | clientActivity | SOURCE_CODE/public/crm.html:1027 | profileInput | 'cplogdate'; 'Date'; crmToday(); 'date' |
| FLD-0210 | clientActivity | SOURCE_CODE/public/crm.html:1027 | profileText | 'cplogtext'; 'Summary / follow-up'; ''; 3 |
| FLD-0211 | clientActivity | SOURCE_CODE/public/crm.html:1030 | profileText | 'cpsolution'; 'What solution did we provide?'; c.solutionProvided\|\|c.followupNotes\|\|''; 5 |
| FLD-0212 | clientActivity | SOURCE_CODE/public/crm.html:1030 | profileInput | 'cpfollowup'; 'When should we follow up?'; c.followupDate\|\|''; 'date' |
| FLD-0213 | clientActivity | SOURCE_CODE/public/crm.html:1030 | options | 'cpintakeservice'; 'Application / service'; types; c.type\|\|types[0] |
| FLD-0214 | dependantSections | SOURCE_CODE/public/crm.html:1099 | profileInput | 'depname'+i; 'Dependant name'; d.name |
| FLD-0215 | dependantSections | SOURCE_CODE/public/crm.html:1099 | profileInput | 'depdob'+i; 'Date of birth'; d.dob\|\|''; 'date' |
| FLD-0216 | dependantSections | SOURCE_CODE/public/crm.html:1099 | profileInput | 'deprelationship'+i; 'Relationship to applicant'; d.relationship\|\|'' |
| FLD-0217 | dependantSections | SOURCE_CODE/public/crm.html:1099 | profileText | 'depoverview'+i; 'Brief dependant case overview'; d.caseOverview; 3 |
| FLD-0218 | applicationEditor | SOURCE_CODE/public/crm.html:1110 | managerSelect | 'appowner'; 'Case Manager'; m?.owner\|\|'Unassigned' |
| FLD-0219 | applicationEditor | SOURCE_CODE/public/crm.html:1110 | field | 'appdeadline'; 'Deadline to Submit'; m?.submissionDue\|\|''; 'date' |
| FLD-0220 | applicationEditor | SOURCE_CODE/public/crm.html:1110 | profileText | 'appoverview'; 'Case Overview'; m?.caseOverview\|\|''; 8 |
| FLD-0221 | applicationEditor | SOURCE_CODE/public/crm.html:1110 | profileText | 'appextranotes'; 'Extra Notes'; m?.extraNotes\|\|''; 3 |
| FLD-0222 | prTrackingEditorFields | SOURCE_CODE/public/crm.html:1203 | profileInput | 'apprita'; 'ITA date'; p.ita; 'date' |
| FLD-0223 | prTrackingEditorFields | SOURCE_CODE/public/crm.html:1203 | field | 'appdeadline'; 'Deadline to Submit'; m.submissionDue\|\|''; 'date' |
| FLD-0224 | prTrackingEditorFields | SOURCE_CODE/public/crm.html:1203 | profileText | 'apprupdate'; 'Notes'; p.update; 3 |
| FLD-0225 | managerSelect | SOURCE_CODE/public/crm.html:1221 | options | id; label; ['Unassigned',...names]; value\|\|'Unassigned' |
| FLD-0226 | managerDialog | SOURCE_CODE/public/crm.html:1227 | field | 'managerName'; 'Case manager name'; name |
| FLD-0227 | reassignDialog | SOURCE_CODE/public/crm.html:1229 | managerSelect | 'reassignTarget'; 'New case manager'; 'Unassigned'; removeName |
| FLD-0228 | newMatter | SOURCE_CODE/public/crm.html:1286 | field | 'newApplicationDeadline'; 'Submission deadline'; ''; 'date' |
| FLD-0229 | officeTaskDialog | SOURCE_CODE/public/crm.html:1311 | field | 'otfileref'; 'Client / Company / File Reference (optional)'; t.fileReference\|\|t.clientName\|\|c?.name\|\|'' |
| FLD-0230 | officeTaskDialog | SOURCE_CODE/public/crm.html:1311 | field | 'otclientname'; 'Client name (editable)'; t.clientName??c?.name??t.pflClientName??'' |
| FLD-0231 | officeTaskDialog | SOURCE_CODE/public/crm.html:1311 | options | 'otby'; 'Assigned by'; taskStaffOptions(t.assignedBy); t.assignedBy\|\|'Tejinder' |
| FLD-0232 | officeTaskDialog | SOURCE_CODE/public/crm.html:1311 | taskManagerSelect | 'otto'; 'Assigned to'; t.assignedTo\|\|'' |
| FLD-0233 | officeTaskDialog | SOURCE_CODE/public/crm.html:1311 | field | 'otdate'; 'Received date'; t.date\|\|crmToday(); 'date' |
| FLD-0234 | officeTaskDialog | SOURCE_CODE/public/crm.html:1311 | field | 'ottime'; 'Time received'; t.time\|\|taskReceivedTime(); 'time' |
| FLD-0235 | officeTaskDialog | SOURCE_CODE/public/crm.html:1311 | field | 'otdue'; 'Due date'; t.due\|\|crmToday(); 'date' |
| FLD-0236 | officeTaskDialog | SOURCE_CODE/public/crm.html:1311 | options | 'otpriority'; 'Priority'; ['Normal','Medium','Urgent']; t.priority\|\|'Normal' |
| FLD-0237 | completeOfficeTask | SOURCE_CODE/public/crm.html:1321 | taskManagerSelect | 'otcompletedby'; 'Completed by — required' |
| FLD-0238 | lmiaPauseFields | SOURCE_CODE/public/crm.html:1354 | profileText | 'llpauseReason'; 'Reason for not proceeding'; l.pauseReason\|\|''; 3 |
| FLD-0239 | lmiaPauseFields | SOURCE_CODE/public/crm.html:1354 | field | 'llreviewDate'; 'On hold — review date'; l.reviewDate\|\|''; 'date' |
| FLD-0240 | requestDeadlineDialog | SOURCE_CODE/public/crm.html:1390 | field | 'rqname'; 'Client name'; d.id\|\|e.m?pflName(e):'' |
| FLD-0241 | requestDeadlineDialog | SOURCE_CODE/public/crm.html:1390 | field | 'rqtype'; 'Application type'; d.id\|\|e.m?pflType(e):'' |
| FLD-0242 | requestDeadlineDialog | SOURCE_CODE/public/crm.html:1390 | options | 'rqcategory'; 'Category'; ['PFLs','IRCC Document Requests','Other deadline']; d.requestCategory\|\|'PFLs' |
| FLD-0243 | requestDeadlineDialog | SOURCE_CODE/public/crm.html:1390 | taskManagerSelect | 'rqowner'; 'Assigned case manager'; d.owner\|\|e.m?.owner\|\|'' |
| FLD-0244 | requestDeadlineDialog | SOURCE_CODE/public/crm.html:1390 | field | 'rqlabel'; 'Request / action required'; d.label\|\|'' |
| FLD-0245 | requestDeadlineDialog | SOURCE_CODE/public/crm.html:1390 | field | 'rqreceived'; 'Date received'; d.received\|\|TODAY; 'date' |
| FLD-0246 | requestDeadlineDialog | SOURCE_CODE/public/crm.html:1390 | field | 'rqdate'; 'Deadline from letter'; d.date\|\|''; 'date' |
| FLD-0247 | resolveRequestDialog | SOURCE_CODE/public/crm.html:1397 | taskManagerSelect | 'rqcompletedby'; 'Completed By — required' |
| FLD-0248 | resolveRequestDialog | SOURCE_CODE/public/crm.html:1397 | options | 'rqmethod'; 'Method'; ['','Email','Webform','Other']; '' |
| FLD-0249 | personalReminderDialog | SOURCE_CODE/public/crm.html:1460 | field | 'prmdate'; 'Reminder date'; r?.due\|\|''; 'date' |
| FLD-0250 | simpleCaseWork | SOURCE_CODE/public/crm.html:1492 | profileText | 'cwnewnote'; 'New note'; ''; 5 |
| FLD-0251 | applicationClientFields | SOURCE_CODE/public/crm.html:1559 | profileInput | 'awclient'+key; label; key.startsWith('em')&&key!=='email'?em[key.slice(2)]:c[key]; type\|\|'text' |
| FLD-0252 | documentReviewDialog | SOURCE_CODE/public/crm.html:1605 | options | 'drperson'; 'Person'; documentPeople(m).map(p=>p.id); row.personId |
| FLD-0253 | documentReviewDialog | SOURCE_CODE/public/crm.html:1605 | profileInput | 'drlabel'; row.kind==='PCC'?'Country':row.kind==='Experience Letters'?'Employer / letter':'Test details'; row.label\|\|'' |
| FLD-0254 | documentReviewDialog | SOURCE_CODE/public/crm.html:1605 | options | 'drstatus'; 'Status'; [...documentReviewStatuses,...(simpleDocumentStatus(row)==='Not applicable'?['Not applicable']:[])]; simpleDocumentStatus(row) |
| FLD-0255 | documentReviewDialog | SOURCE_CODE/public/crm.html:1605 | profileText | 'drnotes'; 'Notes'; row.notes\|\|''; 3 |
| FLD-0256 | fileClosureDialog | SOURCE_CODE/public/crm.html:1631 | field | 'closefilereason'; 'Reason for closing — required' |
| FLD-0257 | fileClosureDialog | SOURCE_CODE/public/crm.html:1631 | profileText | 'closefilenotes'; 'Closing notes / remaining follow-up'; ''; 4 |
| FLD-0258 | fileClosureDialog | SOURCE_CODE/public/crm.html:1631 | managerSelect | 'closefileby'; 'Closed by — required'; m.owner |
| FLD-0259 | fileReopenDialog | SOURCE_CODE/public/crm.html:1633 | managerSelect | 'reopenfileby'; 'Case manager — required'; 'Unassigned' |
| FLD-0260 | fileReopenDialog | SOURCE_CODE/public/crm.html:1633 | field | 'reopenfiledeadline'; 'New submission deadline — required'; ''; 'date' |
| FLD-0261 | inactiveFileDialog | SOURCE_CODE/public/crm.html:1646 | profileText | 'inactivereason'; 'Reason for Inactive — required'; ''; 3 |


## Literal input/select/textarea sites

| Site | Source | Opening tag and constraints |
| --- | --- | --- |
| CTL-0001 | SOURCE_CODE/public/crm.html:167 | &lt;input aria-label=&quot;Search matters&quot; placeholder=&quot;Search clients, matters or next actions&quot; value=&quot;${esc(query)}&quot; oninput=&quot;search(this.value)&quot;&gt; |
| CTL-0002 | SOURCE_CODE/public/crm.html:176 | &lt;select aria-label=&quot;Case manager&quot; onchange=&quot;currentStaff=this.value;render()&quot;&gt; |
| CTL-0003 | SOURCE_CODE/public/crm.html:181 | &lt;textarea id=&quot;strategy&quot;&gt; |
| CTL-0004 | SOURCE_CODE/public/crm.html:181 | &lt;input id=&quot;risk&quot; value=&quot;${esc(m.risk)}&quot;&gt; |
| CTL-0005 | SOURCE_CODE/public/crm.html:182 | &lt;select aria-label=&quot;Review ${esc(d.name)}&quot; onchange=&quot;docStatus(${i},this.value)&quot;&gt; |
| CTL-0006 | SOURCE_CODE/public/crm.html:182 | &lt;input type=&quot;checkbox&quot; ${m.noChase?&#x27;checked&#x27;:&#x27;&#x27;} onchange=&quot;mget().noChase=this.checked;log(mget(),&#x27;Reminder preference changed&#x27;);toast(&#x27;Demo reminder preference updated&#x27;)&quot;&gt; |
| CTL-0007 | SOURCE_CODE/public/crm.html:183 | &lt;input type=&quot;checkbox&quot; ${t.done?&#x27;checked&#x27;:&#x27;&#x27;} onchange=&quot;toggleTask(${i},this.checked)&quot;&gt; |
| CTL-0008 | SOURCE_CODE/public/crm.html:183 | &lt;select aria-label=&quot;${esc(f.name)} status&quot; onchange=&quot;mget().forms[${i}].status=this.value;log(mget(),&#x27;Form status updated&#x27;);render()&quot;&gt; |
| CTL-0009 | SOURCE_CODE/public/crm.html:184 | &lt;textarea id=&quot;corrections&quot; placeholder=&quot;Complete missing address history&amp;#10;Clarify prior refusal&quot;&gt; |
| CTL-0010 | SOURCE_CODE/public/crm.html:186 | &lt;textarea id=&quot;note&quot; placeholder=&quot;Add a client call note or case instruction&quot;&gt; |
| CTL-0011 | SOURCE_CODE/public/crm.html:187 | &lt;input type=&quot;checkbox&quot; ${m.signature?&#x27;checked&#x27;:&#x27;&#x27;} onchange=&quot;mget().signature=this.checked&quot;&gt; |
| CTL-0012 | SOURCE_CODE/public/crm.html:187 | &lt;input type=&quot;checkbox&quot; ${m.final?&#x27;checked&#x27;:&#x27;&#x27;} onchange=&quot;mget().final=this.checked&quot;&gt; |
| CTL-0013 | SOURCE_CODE/public/crm.html:188 | &lt;input id=&quot;${id}&quot; type=&quot;${type}&quot; value=&quot;${esc(val)}&quot; required&gt; |
| CTL-0014 | SOURCE_CODE/public/crm.html:188 | &lt;select id=&quot;${id}&quot;&gt; |
| CTL-0015 | SOURCE_CODE/public/crm.html:189 | &lt;textarea id=&quot;cnotes&quot;&gt; |
| CTL-0016 | SOURCE_CODE/public/crm.html:191 | &lt;textarea id=&quot;cnotes&quot;&gt; |
| CTL-0017 | SOURCE_CODE/public/crm.html:193 | &lt;select id=&quot;client&quot;&gt; |
| CTL-0018 | SOURCE_CODE/public/crm.html:193 | &lt;input id=&quot;retained&quot; type=&quot;checkbox&quot; required&gt; |
| CTL-0019 | SOURCE_CODE/public/crm.html:211 | &lt;input required type=&quot;checkbox&quot;&gt; |
| CTL-0020 | SOURCE_CODE/public/crm.html:213 | &lt;textarea id=&quot;decisionnote&quot; required&gt; |
| CTL-0021 | SOURCE_CODE/public/crm.html:215 | &lt;select aria-label=&quot;Preview client&quot; onchange=&quot;portalId=this.value;render()&quot;&gt; |
| CTL-0022 | SOURCE_CODE/public/crm.html:252 | &lt;input aria-label=&quot;Search all records&quot; placeholder=&quot;Search name, phone, UCI, notes or documents&quot; value=&quot;${esc(query)}&quot; oninput=&quot;search(this.value)&quot;&gt; |
| CTL-0023 | SOURCE_CODE/public/crm.html:262 | &lt;select aria-label=&quot;Case manager&quot; onchange=&quot;currentStaff=this.value;render()&quot;&gt; |
| CTL-0024 | SOURCE_CODE/public/crm.html:265 | &lt;select aria-label=&quot;Appointment status&quot; onchange=&quot;appointmentFilter=this.value;render()&quot;&gt; |
| CTL-0025 | SOURCE_CODE/public/crm.html:265 | &lt;select aria-label=&quot;Appointment status for ${esc(c.name)}&quot; onchange=&quot;changeAppointment(${a.id},this.value)&quot;&gt; |
| CTL-0026 | SOURCE_CODE/public/crm.html:266 | &lt;select id=&quot;aclient&quot;&gt; |
| CTL-0027 | SOURCE_CODE/public/crm.html:266 | &lt;input id=&quot;afollow&quot; type=&quot;date&quot; value=&quot;${a.followup\|\|&#x27;&#x27;}&quot;&gt; |
| CTL-0028 | SOURCE_CODE/public/crm.html:270 | &lt;input id=&quot;cdob&quot; type=&quot;date&quot;&gt; |
| CTL-0029 | SOURCE_CODE/public/crm.html:270 | &lt;input id=&quot;cexpiry&quot; type=&quot;date&quot;&gt; |
| CTL-0030 | SOURCE_CODE/public/crm.html:270 | &lt;input id=&quot;cappointment&quot; type=&quot;datetime-local&quot;&gt; |
| CTL-0031 | SOURCE_CODE/public/crm.html:270 | &lt;textarea id=&quot;cnotes&quot;&gt; |
| CTL-0032 | SOURCE_CODE/public/crm.html:272 | &lt;input type=&quot;date&quot; id=&quot;cexpiry&quot; value=&quot;${c.expiry\|\|&#x27;&#x27;}&quot;&gt; |
| CTL-0033 | SOURCE_CODE/public/crm.html:272 | &lt;textarea id=&quot;chistory&quot;&gt; |
| CTL-0034 | SOURCE_CODE/public/crm.html:272 | &lt;textarea id=&quot;cnotes&quot;&gt; |
| CTL-0035 | SOURCE_CODE/public/crm.html:272 | &lt;textarea id=&quot;crisk&quot;&gt; |
| CTL-0036 | SOURCE_CODE/public/crm.html:272 | &lt;textarea id=&quot;cstrategy&quot;&gt; |
| CTL-0037 | SOURCE_CODE/public/crm.html:276 | &lt;select id=&quot;${id}&quot;&gt; |
| CTL-0038 | SOURCE_CODE/public/crm.html:280 | &lt;textarea id=&quot;strategy&quot;&gt; |
| CTL-0039 | SOURCE_CODE/public/crm.html:280 | &lt;textarea id=&quot;risk&quot;&gt; |
| CTL-0040 | SOURCE_CODE/public/crm.html:282 | &lt;input type=&quot;checkbox&quot; ${t.done?&#x27;checked&#x27;:&#x27;&#x27;} onchange=&quot;toggleTask(${i},this.checked)&quot;&gt; |
| CTL-0041 | SOURCE_CODE/public/crm.html:282 | &lt;select aria-label=&quot;Form status&quot; onchange=&quot;updateForm(${i},this.value)&quot;&gt; |
| CTL-0042 | SOURCE_CODE/public/crm.html:285 | &lt;input type=&quot;checkbox&quot; ${m.finalChecks[k]?&#x27;checked&#x27;:&#x27;&#x27;} onchange=&quot;updateFinal(&#x27;${k}&#x27;,this.checked)&quot;&gt; |
| CTL-0043 | SOURCE_CODE/public/crm.html:295 | &lt;input id=&quot;dverified&quot; type=&quot;checkbox&quot; required&gt; |
| CTL-0044 | SOURCE_CODE/public/crm.html:299 | &lt;textarea id=&quot;gnotes&quot;&gt; |
| CTL-0045 | SOURCE_CODE/public/crm.html:299 | &lt;textarea id=&quot;gdocs&quot;&gt; |
| CTL-0046 | SOURCE_CODE/public/crm.html:299 | &lt;input type=&quot;checkbox&quot; required&gt; |
| CTL-0047 | SOURCE_CODE/public/crm.html:301 | &lt;textarea id=&quot;note&quot; placeholder=&quot;Record a call, instruction or note. Use @Inderpreet to mention staff.&quot;&gt; |
| CTL-0048 | SOURCE_CODE/public/crm.html:301 | &lt;textarea id=&quot;staffmessage&quot; placeholder=&quot;Message to the demo client&quot;&gt; |
| CTL-0049 | SOURCE_CODE/public/crm.html:306 | &lt;textarea id=&quot;qhistory&quot;&gt; |
| CTL-0050 | SOURCE_CODE/public/crm.html:306 | &lt;textarea id=&quot;qpurpose&quot;&gt; |
| CTL-0051 | SOURCE_CODE/public/crm.html:312 | &lt;textarea id=&quot;clientmessage&quot; placeholder=&quot;Message your Nationrise team&quot;&gt; |
| CTL-0052 | SOURCE_CODE/public/crm.html:313 | &lt;textarea id=&quot;infoanswer&quot; required&gt; |
| CTL-0053 | SOURCE_CODE/public/crm.html:315 | &lt;input id=&quot;lmia-${k}&quot; value=&quot;${esc(x[k])}&quot;&gt; |
| CTL-0054 | SOURCE_CODE/public/crm.html:318 | &lt;select id=&quot;quickmatter&quot;&gt; |
| CTL-0055 | SOURCE_CODE/public/crm.html:322 | &lt;select id=&quot;template&quot; onchange=&quot;chosenTemplate=this.value;render()&quot;&gt; |
| CTL-0056 | SOURCE_CODE/public/crm.html:322 | &lt;textarea id=&quot;templateDocs&quot; style=&quot;min-height:220px&quot;&gt; |
| CTL-0057 | SOURCE_CODE/public/crm.html:322 | &lt;textarea id=&quot;templateTasks&quot; style=&quot;min-height:220px&quot;&gt; |
| CTL-0058 | SOURCE_CODE/public/crm.html:343 | &lt;select aria-label=&quot;Filter by consultant&quot; onchange=&quot;consultantFilter=this.value;render()&quot;&gt; |
| CTL-0059 | SOURCE_CODE/public/crm.html:343 | &lt;select aria-label=&quot;Filter by appointment status&quot; onchange=&quot;appointmentFilter=this.value;render()&quot;&gt; |
| CTL-0060 | SOURCE_CODE/public/crm.html:343 | &lt;input type=&quot;checkbox&quot; ${showWeekend?&#x27;checked&#x27;:&#x27;&#x27;} onchange=&quot;showWeekend=this.checked;render()&quot;&gt; |
| CTL-0061 | SOURCE_CODE/public/crm.html:348 | &lt;select id=&quot;detailstatus&quot; onchange=&quot;changeAppointment(${id},this.value);closeModal();appointmentDetails(${id})&quot;&gt; |
| CTL-0062 | SOURCE_CODE/public/crm.html:349 | &lt;select id=&quot;aclient&quot; onchange=&quot;toggleNewBookingClient()&quot;&gt; |
| CTL-0063 | SOURCE_CODE/public/crm.html:349 | &lt;input id=&quot;anewname&quot;&gt; |
| CTL-0064 | SOURCE_CODE/public/crm.html:349 | &lt;input id=&quot;anewphone&quot; type=&quot;tel&quot;&gt; |
| CTL-0065 | SOURCE_CODE/public/crm.html:349 | &lt;input id=&quot;anewemail&quot; type=&quot;email&quot;&gt; |
| CTL-0066 | SOURCE_CODE/public/crm.html:349 | &lt;input id=&quot;alocation&quot; value=&quot;${esc(a.location\|\|&#x27;Surrey office&#x27;)}&quot;&gt; |
| CTL-0067 | SOURCE_CODE/public/crm.html:349 | &lt;textarea id=&quot;anotes&quot; placeholder=&quot;What does the consultant need to know?&quot;&gt; |
| CTL-0068 | SOURCE_CODE/public/crm.html:349 | &lt;input type=&quot;date&quot; id=&quot;afollow&quot; value=&quot;${a.followup\|\|&#x27;&#x27;}&quot;&gt; |
| CTL-0069 | SOURCE_CODE/public/crm.html:361 | &lt;input aria-label=&quot;Search appointments&quot; placeholder=&quot;Search name, phone or notes&quot; value=&quot;${esc(sheetSearch)}&quot; oninput=&quot;sheetSearch=this.value;refreshSheet()&quot;&gt; |
| CTL-0070 | SOURCE_CODE/public/crm.html:361 | &lt;select aria-label=&quot;Consultant filter&quot; onchange=&quot;consultantFilter=this.value;render()&quot;&gt; |
| CTL-0071 | SOURCE_CODE/public/crm.html:365 | &lt;input aria-label=&quot;Date called for ${esc(c?.name)}&quot; type=&quot;date&quot; value=&quot;${a.called}&quot; onchange=&quot;editSheetCell(${a.id},&#x27;called&#x27;,this.value)&quot;&gt; |
| CTL-0072 | SOURCE_CODE/public/crm.html:365 | &lt;input aria-label=&quot;Contact number for ${esc(c?.name)}&quot; value=&quot;${esc(a.phone)}&quot; onchange=&quot;editSheetCell(${a.id},&#x27;phone&#x27;,this.value)&quot;&gt; |
| CTL-0073 | SOURCE_CODE/public/crm.html:365 | &lt;textarea rows=&quot;2&quot; aria-label=&quot;Appointment notes for ${esc(c?.name)}&quot; onchange=&quot;editSheetCell(${a.id},&#x27;notes&#x27;,this.value)&quot;&gt; |
| CTL-0074 | SOURCE_CODE/public/crm.html:365 | &lt;input aria-label=&quot;Reference for ${esc(c?.name)}&quot; value=&quot;${esc(a.source)}&quot; onchange=&quot;editSheetCell(${a.id},&#x27;source&#x27;,this.value)&quot;&gt; |
| CTL-0075 | SOURCE_CODE/public/crm.html:365 | &lt;select class=&quot;confirmation-${a.confirmation===&#x27;Confirmed&#x27;?&#x27;yes&#x27;:a.confirmation===&#x27;Not answered&#x27;?&#x27;pending&#x27;:&#x27;other&#x27;}&quot; aria-label=&quot;Confirmation for ${esc(c?.name)}&quot; onchange=&quot;editSheetCell(${a.id},&#x27;confirmation&#x27;,this.value)&quot;&gt; |
| CTL-0076 | SOURCE_CODE/public/crm.html:365 | &lt;input type=&quot;date&quot; aria-label=&quot;Follow-up date for ${esc(c?.name)}&quot; value=&quot;${a.followup\|\|&#x27;&#x27;}&quot; onchange=&quot;editSheetCell(${a.id},&#x27;followup&#x27;,this.value)&quot;&gt; |
| CTL-0077 | SOURCE_CODE/public/crm.html:394 | &lt;select aria-label=&quot;Filter assigned staff&quot; onchange=&quot;taskAssignee=this.value;render()&quot;&gt; |
| CTL-0078 | SOURCE_CODE/public/crm.html:394 | &lt;input type=&quot;checkbox&quot; ${taskStatus===&#x27;All&#x27;?&#x27;checked&#x27;:&#x27;&#x27;} onchange=&quot;taskStatus=this.checked?&#x27;All&#x27;:&#x27;Open&#x27;;render()&quot;&gt; |
| CTL-0079 | SOURCE_CODE/public/crm.html:394 | &lt;input aria-label=&quot;Assign ${t.id}&quot; value=&quot;${esc(t.assignedTo)}&quot; placeholder=&quot;Type staff name&quot; onchange=&quot;reassignOfficeTask(&#x27;${t.id}&#x27;,this.value)&quot;&gt; |
| CTL-0080 | SOURCE_CODE/public/crm.html:394 | &lt;select aria-label=&quot;Task status for ${t.id}&quot; onchange=&quot;changeTaskStatus(&#x27;${t.id}&#x27;,this.value)&quot;&gt; |
| CTL-0081 | SOURCE_CODE/public/crm.html:395 | &lt;textarea id=&quot;ottext&quot; required placeholder=&quot;Simran called at 11:30 am asking for an update on the file…&quot;&gt; |
| CTL-0082 | SOURCE_CODE/public/crm.html:395 | &lt;select id=&quot;otclient&quot;&gt; |
| CTL-0083 | SOURCE_CODE/public/crm.html:399 | &lt;textarea id=&quot;otresult&quot; required placeholder=&quot;Called client and provided a file update.&quot;&gt; |
| CTL-0084 | SOURCE_CODE/public/crm.html:401 | &lt;select aria-label=&quot;Case manager filter&quot; onchange=&quot;todoOwner=this.value;render()&quot;&gt; |
| CTL-0085 | SOURCE_CODE/public/crm.html:401 | &lt;input id=&quot;submission-${m.id}&quot; type=&quot;date&quot; value=&quot;${esc(m.submissionDue\|\|&#x27;&#x27;)}&quot; onchange=&quot;setSubmissionDeadline(&#x27;${m.id}&#x27;,this.value)&quot;&gt; |
| CTL-0086 | SOURCE_CODE/public/crm.html:401 | &lt;select aria-label=&quot;File stage for ${esc(m.name)}&quot; onchange=&quot;changeSimpleFileStage(&#x27;${m.id}&#x27;,this.value)&quot;&gt; |
| CTL-0087 | SOURCE_CODE/public/crm.html:409 | &lt;textarea&#x27;);row=row.slice(0,at)+`&lt;td&gt; |
| CTL-0088 | SOURCE_CODE/public/crm.html:409 | &lt;select aria-label=&quot;Service requested for ${esc(clients.find(c=&gt; |
| CTL-0089 | SOURCE_CODE/public/crm.html:412 | &lt;input type=&quot;date&quot; id=&quot;retainhard&quot;&gt; |
| CTL-0090 | SOURCE_CODE/public/crm.html:412 | &lt;input id=&quot;retainhardSource&quot; placeholder=&quot;Officer letter or verified filing instruction&quot;&gt; |
| CTL-0091 | SOURCE_CODE/public/crm.html:412 | &lt;input type=&quot;checkbox&quot; id=&quot;retainhardVerified&quot;&gt; |
| CTL-0092 | SOURCE_CODE/public/crm.html:412 | &lt;textarea id=&quot;retainoverview&quot; required&gt; |
| CTL-0093 | SOURCE_CODE/public/crm.html:422 | &lt;input id=&quot;${scope}Phone&quot; type=&quot;tel&quot; placeholder=&quot;e.g. 604-555-0101&quot; oninput=&quot;showPhoneMatches(&#x27;${scope}&#x27;)&quot; style=&quot;flex:1;min-width:180px&quot;&gt; |
| CTL-0094 | SOURCE_CODE/public/crm.html:442 | &lt;textarea id=&quot;contactexplanation&quot; required placeholder=&quot;Example: Client called asking for a file update. Explained the current stage and the documents still needed.&quot;&gt; |
| CTL-0095 | SOURCE_CODE/public/crm.html:458 | &lt;select aria-label=&quot;${esc(key)} for ${esc(m.name)}&quot; onchange=&quot;savePRField(&#x27;${m.id}&#x27;,&#x27;${key}&#x27;,this.value)&quot;&gt; |
| CTL-0096 | SOURCE_CODE/public/crm.html:459 | &lt;input aria-label=&quot;${esc(key)} for ${esc(m.name)}&quot; type=&quot;${type}&quot; value=&quot;${esc(value)}&quot; onchange=&quot;savePRField(&#x27;${m.id}&#x27;,&#x27;${key}&#x27;,this.value)&quot;&gt; |
| CTL-0097 | SOURCE_CODE/public/crm.html:460 | &lt;input id=&quot;prsubmission-${m.id}&quot; type=&quot;date&quot; value=&quot;${esc(m.submissionDue\|\|&#x27;&#x27;)}&quot; onchange=&quot;setSubmissionDeadline(&#x27;${m.id}&#x27;,this.value)&quot;&gt; |
| CTL-0098 | SOURCE_CODE/public/crm.html:460 | &lt;select aria-label=&quot;File stage for ${esc(m.name)}&quot; onchange=&quot;changeSimpleFileStage(&#x27;${m.id}&#x27;,this.value);render()&quot;&gt; |
| CTL-0099 | SOURCE_CODE/public/crm.html:462 | &lt;select aria-label=&quot;PR application type&quot; onchange=&quot;prTypeFilter=this.value;render()&quot;&gt; |
| CTL-0100 | SOURCE_CODE/public/crm.html:462 | &lt;select aria-label=&quot;PR case manager&quot; onchange=&quot;prOwnerFilter=this.value;render()&quot;&gt; |
| CTL-0101 | SOURCE_CODE/public/crm.html:462 | &lt;input aria-label=&quot;Search PR applications&quot; placeholder=&quot;Search client or application&quot; value=&quot;${esc(prText)}&quot; oninput=&quot;prText=this.value;refreshPRRows()&quot;&gt; |
| CTL-0102 | SOURCE_CODE/public/crm.html:462 | &lt;input type=&quot;checkbox&quot; ${prShowClosed?&#x27;checked&#x27;:&#x27;&#x27;} onchange=&quot;prShowClosed=this.checked;render()&quot;&gt; |
| CTL-0103 | SOURCE_CODE/public/crm.html:480 | &lt;input type=&quot;checkbox&quot; ${showResolvedRequests?&#x27;checked&#x27;:&#x27;&#x27;} onchange=&quot;showResolvedRequests=this.checked;render()&quot;&gt; |
| CTL-0104 | SOURCE_CODE/public/crm.html:481 | &lt;select id=&quot;rqmatter&quot;&gt; |
| CTL-0105 | SOURCE_CODE/public/crm.html:481 | &lt;textarea id=&quot;rqnotes&quot;&gt; |
| CTL-0106 | SOURCE_CODE/public/crm.html:481 | &lt;textarea id=&quot;rqdocs&quot;&gt; |
| CTL-0107 | SOURCE_CODE/public/crm.html:481 | &lt;input id=&quot;rqverified&quot; type=&quot;checkbox&quot; required&gt; |
| CTL-0108 | SOURCE_CODE/public/crm.html:502 | &lt;select id=&quot;fumatter&quot;&gt; |
| CTL-0109 | SOURCE_CODE/public/crm.html:502 | &lt;textarea id=&quot;futext&quot; required&gt; |
| CTL-0110 | SOURCE_CODE/public/crm.html:502 | &lt;textarea id=&quot;furemarks&quot;&gt; |
| CTL-0111 | SOURCE_CODE/public/crm.html:502 | &lt;input id=&quot;fuchecked&quot; value=&quot;${esc(u.checkedBy)}&quot;&gt; |
| CTL-0112 | SOURCE_CODE/public/crm.html:512 | &lt;input type=&quot;${type}&quot; aria-label=&quot;${key} for ${esc(m.name)}&quot; value=&quot;${esc(lmiaTracking(m)[key]\|\|&#x27;&#x27;)}&quot; onchange=&quot;saveLmiaTracking(&#x27;${m.id}&#x27;,&#x27;${key}&#x27;,this.value)&quot;&gt; |
| CTL-0113 | SOURCE_CODE/public/crm.html:513 | &lt;select aria-label=&quot;${key} for ${esc(m.name)}&quot; onchange=&quot;saveLmiaTracking(&#x27;${m.id}&#x27;,&#x27;${key}&#x27;,this.value)&quot;&gt; |
| CTL-0114 | SOURCE_CODE/public/crm.html:515 | &lt;select aria-label=&quot;LMIA status for ${esc(m.name)}&quot; ${[&#x27;viewer&#x27;,&#x27;reception&#x27;].includes(liveUser?.role)?&#x27;disabled&#x27;:&#x27;&#x27;} onchange=&quot;changeLmiaOverviewStatus(&#x27;${m.id}&#x27;,this.value)&quot;&gt; |
| CTL-0115 | SOURCE_CODE/public/crm.html:518 | &lt;input aria-label=&quot;Search LMIA files&quot; placeholder=&quot;Search company or position&quot; value=&quot;${esc(lmiaSearch)}&quot; oninput=&quot;lmiaSearch=this.value;refreshLmiaRows()&quot;&gt; |
| CTL-0116 | SOURCE_CODE/public/crm.html:518 | &lt;input type=&quot;checkbox&quot; ${lmiaIncludeClosed?&#x27;checked&#x27;:&#x27;&#x27;} onchange=&quot;lmiaIncludeClosed=this.checked;render()&quot;&gt; |
| CTL-0117 | SOURCE_CODE/public/crm.html:525 | &lt;select id=&quot;lltfwStatus&quot; required&gt; |
| CTL-0118 | SOURCE_CODE/public/crm.html:593 | &lt;textarea id=&quot;rioverview&quot; required&gt; |
| CTL-0119 | SOURCE_CODE/public/crm.html:593 | &lt;input type=&quot;date&quot; id=&quot;risubmission&quot; value=&quot;${m.submissionDue\|\|&#x27;&#x27;}&quot;&gt; |
| CTL-0120 | SOURCE_CODE/public/crm.html:593 | &lt;textarea id=&quot;ririsk&quot;&gt; |
| CTL-0121 | SOURCE_CODE/public/crm.html:597 | &lt;input id=&quot;taskClientSearch&quot; type=&quot;search&quot; oninput=&quot;filterTaskClients(this.value)&quot;&gt; |
| CTL-0122 | SOURCE_CODE/public/crm.html:653 | &lt;input aria-label=&quot;Date called for ${esc(c?.name)}&quot; type=&quot;date&quot; value=&quot;${a.called}&quot; onchange=&quot;editSheetCell(${a.id},&#x27;called&#x27;,this.value)&quot;&gt; |
| CTL-0123 | SOURCE_CODE/public/crm.html:653 | &lt;input aria-label=&quot;Contact number for ${esc(c?.name)}&quot; value=&quot;${esc(a.phone)}&quot; onchange=&quot;editSheetCell(${a.id},&#x27;phone&#x27;,this.value)&quot;&gt; |
| CTL-0124 | SOURCE_CODE/public/crm.html:653 | &lt;select aria-label=&quot;Service requested for ${esc(c?.name)}&quot; onchange=&quot;setAppointmentService(${a.id},this.value)&quot;&gt; |
| CTL-0125 | SOURCE_CODE/public/crm.html:653 | &lt;textarea rows=&quot;1&quot; aria-label=&quot;Appointment notes for ${esc(c?.name)}&quot; onchange=&quot;editSheetCell(${a.id},&#x27;notes&#x27;,this.value)&quot;&gt; |
| CTL-0126 | SOURCE_CODE/public/crm.html:653 | &lt;input aria-label=&quot;Reference for ${esc(c?.name)}&quot; value=&quot;${esc(a.source)}&quot; onchange=&quot;editSheetCell(${a.id},&#x27;source&#x27;,this.value)&quot;&gt; |
| CTL-0127 | SOURCE_CODE/public/crm.html:653 | &lt;select aria-label=&quot;Confirmation for ${esc(c?.name)}&quot; onchange=&quot;editSheetCell(${a.id},&#x27;confirmation&#x27;,this.value)&quot;&gt; |
| CTL-0128 | SOURCE_CODE/public/crm.html:653 | &lt;input type=&quot;date&quot; aria-label=&quot;Follow-up date for ${esc(c?.name)}&quot; value=&quot;${a.followup\|\|&#x27;&#x27;}&quot; onchange=&quot;editSheetCell(${a.id},&#x27;followup&#x27;,this.value)&quot;&gt; |
| CTL-0129 | SOURCE_CODE/public/crm.html:671 | &lt;input type=&quot;date&quot; aria-label=&quot;Follow-up date[\s\S]*?&lt;\/td&gt; |
| CTL-0130 | SOURCE_CODE/public/crm.html:678 | &lt;input id=&quot;clientFollowupDate&quot; type=&quot;date&quot; value=&quot;${c.followupDate\|\|&#x27;&#x27;}&quot; onchange=&quot;saveClientFollowup(&#x27;${cid}&#x27;)&quot;&gt; |
| CTL-0131 | SOURCE_CODE/public/crm.html:678 | &lt;input id=&quot;clientFollowupNotes&quot; value=&quot;${esc(c.followupNotes\|\|&#x27;&#x27;)}&quot; placeholder=&quot;What needs to be discussed?&quot; onchange=&quot;saveClientFollowup(&#x27;${cid}&#x27;)&quot;&gt; |
| CTL-0132 | SOURCE_CODE/public/crm.html:692 | &lt;select aria-label=&quot;Retainer status for ${esc(m.name)}&quot; onchange=&quot;updateAdministration(&#x27;${m.id}&#x27;,&#x27;retainerStatus&#x27;,this.value)&quot;&gt; |
| CTL-0133 | SOURCE_CODE/public/crm.html:692 | &lt;select aria-label=&quot;Invoice status for ${esc(m.name)}&quot; onchange=&quot;updateAdministration(&#x27;${m.id}&#x27;,&#x27;invoiceStatus&#x27;,this.value)&quot;&gt; |
| CTL-0134 | SOURCE_CODE/public/crm.html:712 | &lt;select id=&quot;fuchecked&quot;&gt; |
| CTL-0135 | SOURCE_CODE/public/crm.html:712 | &lt;textarea id=&quot;fucomments&quot; style=&quot;min-height:100px&quot;&gt; |
| CTL-0136 | SOURCE_CODE/public/crm.html:712 | &lt;select id=&quot;fuby&quot;&gt; |
| CTL-0137 | SOURCE_CODE/public/crm.html:734 | &lt;input id=&quot;qbphone&quot; type=&quot;tel&quot; required value=&quot;${esc(c?.phone\|\|&#x27;&#x27;)}&quot; oninput=&quot;quickBookingMatches()&quot;&gt; |
| CTL-0138 | SOURCE_CODE/public/crm.html:734 | &lt;input id=&quot;qbemail&quot; type=&quot;email&quot; value=&quot;${esc(c?.email\|\|&#x27;&#x27;)}&quot;&gt; |
| CTL-0139 | SOURCE_CODE/public/crm.html:734 | &lt;input id=&quot;qbnumber&quot; type=&quot;number&quot; readonly value=&quot;${a?appointmentSequence(a):nextBookingSequence(c?.id)}&quot;&gt; |
| CTL-0140 | SOURCE_CODE/public/crm.html:734 | &lt;textarea id=&quot;qboverview&quot; placeholder=&quot;Brief summary of the client’s situation&quot; style=&quot;min-height:65px&quot;&gt; |
| CTL-0141 | SOURCE_CODE/public/crm.html:734 | &lt;textarea id=&quot;qbcomments&quot; placeholder=&quot;Reason for the appointment or anything the consultant should know&quot; style=&quot;min-height:75px&quot;&gt; |
| CTL-0142 | SOURCE_CODE/public/crm.html:734 | &lt;textarea id=&quot;qbadditional&quot; placeholder=&quot;Any other details&quot; style=&quot;min-height:65px&quot;&gt; |
| CTL-0143 | SOURCE_CODE/public/crm.html:742 | &lt;textarea id=&quot;rioverview&quot;&gt; |
| CTL-0144 | SOURCE_CODE/public/crm.html:742 | &lt;input type=&quot;date&quot; id=&quot;risubmission&quot; value=&quot;${m.submissionDue\|\|&#x27;&#x27;}&quot;&gt; |
| CTL-0145 | SOURCE_CODE/public/crm.html:742 | &lt;textarea id=&quot;ririsk&quot;&gt; |
| CTL-0146 | SOURCE_CODE/public/crm.html:767 | &lt;select id=&quot;photoIdType&quot; onchange=&quot;savePhotoIdField(&#x27;${cid}&#x27;,&#x27;type&#x27;,this.value)&quot;&gt; |
| CTL-0147 | SOURCE_CODE/public/crm.html:767 | &lt;select id=&quot;photoIdStatus&quot; onchange=&quot;savePhotoIdField(&#x27;${cid}&#x27;,&#x27;status&#x27;,this.value)&quot;&gt; |
| CTL-0148 | SOURCE_CODE/public/crm.html:767 | &lt;input id=&quot;photoIdReceived&quot; type=&quot;date&quot; value=&quot;${esc(p.received\|\|&#x27;&#x27;)}&quot; onchange=&quot;savePhotoIdField(&#x27;${cid}&#x27;,&#x27;received&#x27;,this.value)&quot;&gt; |
| CTL-0149 | SOURCE_CODE/public/crm.html:767 | &lt;input id=&quot;photoIdChecked&quot; value=&quot;${esc(p.checkedBy\|\|&#x27;&#x27;)}&quot; onchange=&quot;savePhotoIdField(&#x27;${cid}&#x27;,&#x27;checkedBy&#x27;,this.value)&quot;&gt; |
| CTL-0150 | SOURCE_CODE/public/crm.html:767 | &lt;input id=&quot;photoIdReference&quot; placeholder=&quot;Where staff saved the ID document&quot; value=&quot;${esc(p.reference\|\|&#x27;&#x27;)}&quot; onchange=&quot;savePhotoIdField(&#x27;${cid}&#x27;,&#x27;reference&#x27;,this.value)&quot;&gt; |
| CTL-0151 | SOURCE_CODE/public/crm.html:767 | &lt;textarea id=&quot;photoIdNotes&quot; onchange=&quot;savePhotoIdField(&#x27;${cid}&#x27;,&#x27;notes&#x27;,this.value)&quot;&gt; |
| CTL-0152 | SOURCE_CODE/public/crm.html:800 | &lt;input id=&quot;cemail&quot; type=&quot;email&quot;&gt; |
| CTL-0153 | SOURCE_CODE/public/crm.html:800 | &lt;textarea id=&quot;cnotes&quot;&gt; |
| CTL-0154 | SOURCE_CODE/public/crm.html:807 | &lt;input type=&quot;file&quot; id=&quot;liveUpload&quot; accept=&quot;application/pdf,image/jpeg,image/png&quot;&gt; |
| CTL-0155 | SOURCE_CODE/public/crm.html:832 | &lt;input type=&quot;file&quot; accept=&quot;.json,application/json&quot; onchange=&quot;previewCrmImport(this.files[0])&quot;&gt; |
| CTL-0156 | SOURCE_CODE/public/crm.html:832 | &lt;input type=&quot;checkbox&quot; ${importReviewOnly?&#x27;checked&#x27;:&#x27;&#x27;} onchange=&quot;importReviewOnly=this.checked;renderImportPanel()&quot;&gt; |
| CTL-0157 | SOURCE_CODE/public/crm.html:832 | &lt;input value=&quot;${esc(importSearch)}&quot; onchange=&quot;importSearch=this.value;renderImportPanel()&quot;&gt; |
| CTL-0158 | SOURCE_CODE/public/crm.html:837 | &lt;select id=&quot;importClient&quot;&gt; |
| CTL-0159 | SOURCE_CODE/public/crm.html:837 | &lt;input type=&quot;checkbox&quot; id=&quot;importCreateAppointment&quot;&gt; |
| CTL-0160 | SOURCE_CODE/public/crm.html:851 | &lt;select onchange=&quot;importedSheetFilter=this.value;importedPage=0;render()&quot;&gt; |
| CTL-0161 | SOURCE_CODE/public/crm.html:851 | &lt;input placeholder=&quot;Name, phone, date or notes&quot; value=&quot;${esc(importedQuery)}&quot; onchange=&quot;importedQuery=this.value;importedPage=0;render()&quot;&gt; |
| CTL-0162 | SOURCE_CODE/public/crm.html:851 | &lt;select onchange=&quot;importedPageSize=Number(this.value);importedPage=0;render()&quot;&gt; |
| CTL-0163 | SOURCE_CODE/public/crm.html:855 | &lt;select aria-label=&quot;Confirmation[^&gt; |
| CTL-0164 | SOURCE_CODE/public/crm.html:855 | &lt;input aria-label=&quot;Date called[^&gt; |
| CTL-0165 | SOURCE_CODE/public/crm.html:858 | &lt;input type=&quot;date&quot; value=&quot;${/^\d{4}-\d{2}-\d{2}$/.test(sheetDay)?sheetDay:TODAY}&quot; onchange=&quot;sheetDay=this.value;weekStart=addDays(this.value,-((new Date(this.value+&#x27;T12:00:00&#x27;).getDay()+6)%7));render()&quot;&gt; |
| CTL-0166 | SOURCE_CODE/public/crm.html:878 | &lt;input value=&quot;${esc(submittedSearch)}&quot; onchange=&quot;submittedSearch=this.value;render()&quot; placeholder=&quot;Client, file number, application or case manager&quot;&gt; |
| CTL-0167 | SOURCE_CODE/public/crm.html:898 | &lt;select aria-label=&quot;More appointment records&quot; onchange=&quot;receptionMenu(this.value)&quot;&gt; |
| CTL-0168 | SOURCE_CODE/public/crm.html:903 | &lt;input aria-label=&quot;Appointment date&quot; type=&quot;date&quot; value=&quot;${sheetDay}&quot; onchange=&quot;receptionDate(this.value)&quot;&gt; |
| CTL-0169 | SOURCE_CODE/public/crm.html:903 | &lt;select aria-label=&quot;Schedule view&quot; onchange=&quot;receptionView=this.value;render()&quot;&gt; |
| CTL-0170 | SOURCE_CODE/public/crm.html:903 | &lt;input aria-label=&quot;Search appointments&quot; placeholder=&quot;Search name, phone or notes&quot; value=&quot;${esc(sheetSearch)}&quot; onchange=&quot;sheetSearch=this.value;render()&quot;&gt; |
| CTL-0171 | SOURCE_CODE/public/crm.html:903 | &lt;select aria-label=&quot;Consultant filter&quot; onchange=&quot;consultantFilter=this.value;render()&quot;&gt; |
| CTL-0172 | SOURCE_CODE/public/crm.html:914 | &lt;input type=&quot;checkbox&quot; id=&quot;qbalertagreed&quot;&gt; |
| CTL-0173 | SOURCE_CODE/public/crm.html:919 | &lt;select id=&quot;qbcategory&quot; onchange=&quot;updateBookingCategory();quickBookingMatches()&quot;&gt; |
| CTL-0174 | SOURCE_CODE/public/crm.html:919 | &lt;input id=&quot;qbphone&quot; type=&quot;tel&quot; autocomplete=&quot;tel&quot; required placeholder=&quot;e.g. 604 555 0123&quot; value=&quot;${esc(c?.phone\|\|a?.phone\|\|&#x27;&#x27;)}&quot; oninput=&quot;quickBookingMatches()&quot;&gt; |
| CTL-0175 | SOURCE_CODE/public/crm.html:919 | &lt;input id=&quot;qbemail&quot; type=&quot;email&quot; value=&quot;${esc(c?.email\|\|&#x27;&#x27;)}&quot;&gt; |
| CTL-0176 | SOURCE_CODE/public/crm.html:919 | &lt;select id=&quot;qbapplication&quot;&gt; |
| CTL-0177 | SOURCE_CODE/public/crm.html:919 | &lt;input type=&quot;hidden&quot; id=&quot;qbrelationship&quot; value=&quot;${esc(quickBookingStatus)}&quot;&gt; |
| CTL-0178 | SOURCE_CODE/public/crm.html:919 | &lt;input id=&quot;qbnumber&quot; type=&quot;hidden&quot; value=&quot;${a?appointmentSequence(a):nextBookingSequence(c?.id)}&quot;&gt; |
| CTL-0179 | SOURCE_CODE/public/crm.html:919 | &lt;textarea id=&quot;qbcomments&quot; placeholder=&quot;What does the client need help with?&quot; rows=&quot;2&quot;&gt; |
| CTL-0180 | SOURCE_CODE/public/crm.html:938 | &lt;input aria-label=&quot;Search potential clients&quot; placeholder=&quot;Search name or phone&quot; value=&quot;${esc(receptionClientQuery)}&quot; onchange=&quot;receptionClientQuery=this.value;render()&quot;&gt; |
| CTL-0181 | SOURCE_CODE/public/crm.html:938 | &lt;select class=&quot;potential-action&quot; aria-label=&quot;Action for ${esc(c.name)}&quot; ${liveUser?.role===&#x27;viewer&#x27;?&#x27;disabled&#x27;:&#x27;&#x27;} onchange=&quot;const action=this.value;this.value=&#x27;&#x27;;choosePotentialAction(&#x27;${c.id}&#x27;,action)&quot;&gt; |
| CTL-0182 | SOURCE_CODE/public/crm.html:1001 | &lt;textarea id=&quot;${id}&quot; rows=&quot;${rows}&quot;&gt; |
| CTL-0183 | SOURCE_CODE/public/crm.html:1008 | &lt;select id=&quot;visitoutcome&quot; onchange=&quot;changeConsultationOutcome(this.value)&quot;&gt; |
| CTL-0184 | SOURCE_CODE/public/crm.html:1013 | &lt;input &#x27;,&#x27;&lt;input readonly &#x27;):profileInput(&#x27;visitdate&#x27;,&#x27;Consultation date&#x27;,r.date\|\|&#x27;&#x27;,&#x27;date&#x27;)}${profileInput(&#x27;visittype&#x27;,&#x27;Consultation type&#x27;,r.consultationType\|\|&#x27;&#x27;)}&lt;/div&gt; |
| CTL-0185 | SOURCE_CODE/public/crm.html:1030 | &lt;select id=&quot;cpdisposition&quot; onchange=&quot;updateProfileDisposition(true)&quot;&gt; |
| CTL-0186 | SOURCE_CODE/public/crm.html:1097 | &lt;select id=&quot;apphasdependants&quot; onchange=&quot;setApplicationDependants(this.value===&#x27;Yes&#x27;)&quot;&gt; |
| CTL-0187 | SOURCE_CODE/public/crm.html:1099 | &lt;input &#x27;,&#x27;&lt;input placeholder=&quot;e.g. Spouse, son, daughter&quot; &#x27;)}&lt;/div&gt; |
| CTL-0188 | SOURCE_CODE/public/crm.html:1099 | &lt;textarea &#x27;,&#x27;&lt;textarea style=&quot;height:82px;min-height:82px;resize:vertical&quot; &#x27;)}&lt;/section&gt; |
| CTL-0189 | SOURCE_CODE/public/crm.html:1110 | &lt;textarea &#x27;, &#x27;&lt;textarea maxlength=&quot;12000&quot; placeholder=&quot;Additional notes for this application&quot; style=&quot;height:72px;min-height:72px;resize:vertical&quot; &#x27;)}&lt;/section&gt; |
| CTL-0190 | SOURCE_CODE/public/crm.html:1110 | &lt;textarea id=&quot;appretainerterms&quot; rows=&quot;5&quot; maxlength=&quot;12000&quot; ${m&amp;&amp;signedRetainerComplete(m)?&#x27;readonly&#x27;:&#x27;&#x27;} placeholder=&quot;For example: $1,000 deposit now, $500 by November 15, and the remaining balance before submission.&quot;&gt; |
| CTL-0191 | SOURCE_CODE/public/crm.html:1110 | &lt;input type=&quot;number&quot; min=&quot;0&quot; step=&quot;0.01&quot; id=&quot;appdeposit&quot; value=&quot;${m?.paymentAmounts?(m.paymentAmounts.depositCents/100).toFixed(2):&#x27;&#x27;}&quot; oninput=&quot;applicationPaymentTotal()&quot;&gt; |
| CTL-0192 | SOURCE_CODE/public/crm.html:1110 | &lt;input type=&quot;number&quot; min=&quot;0&quot; step=&quot;0.01&quot; id=&quot;appsubmission&quot; value=&quot;${m?.paymentAmounts?(m.paymentAmounts.submissionCents/100).toFixed(2):&#x27;&#x27;}&quot; oninput=&quot;applicationPaymentTotal()&quot;&gt; |
| CTL-0193 | SOURCE_CODE/public/crm.html:1110 | &lt;input id=&quot;apptotal&quot; readonly&gt; |
| CTL-0194 | SOURCE_CODE/public/crm.html:1110 | &lt;textarea id=&quot;awnewnote&quot; rows=&quot;4&quot; maxlength=&quot;12000&quot; oninput=&quot;applicationWorkspaceNoteDraft=this.value&quot;&gt; |
| CTL-0195 | SOURCE_CODE/public/crm.html:1189 | &lt;select id=&quot;apptype&quot; required onchange=&quot;updateApplicationTypeFields()&quot;&gt; |
| CTL-0196 | SOURCE_CODE/public/crm.html:1189 | &lt;input id=&quot;appcustomtype&quot; maxlength=&quot;120&quot; value=&quot;${esc(custom?type:m?.applicationTypeDetails\|\|&#x27;&#x27;)}&quot; placeholder=&quot;e.g. with Restoration&quot;&gt; |
| CTL-0197 | SOURCE_CODE/public/crm.html:1189 | &lt;select id=&quot;appwpsubtype&quot; onchange=&quot;updateApplicationTypeFields()&quot;&gt; |
| CTL-0198 | SOURCE_CODE/public/crm.html:1189 | &lt;input id=&quot;appwpcustom&quot; maxlength=&quot;120&quot; value=&quot;${customWP?esc(subtype):&#x27;&#x27;}&quot; placeholder=&quot;e.g. Work Permit Extension with Restoration&quot;&gt; |
| CTL-0199 | SOURCE_CODE/public/crm.html:1207 | &lt;input id=&quot;rcname&quot; required autocomplete=&quot;name&quot; oninput=&quot;retainedClientSearch()&quot;&gt; |
| CTL-0200 | SOURCE_CODE/public/crm.html:1207 | &lt;input id=&quot;rcphone&quot; type=&quot;tel&quot; required autocomplete=&quot;tel&quot; oninput=&quot;retainedClientSearch()&quot;&gt; |
| CTL-0201 | SOURCE_CODE/public/crm.html:1207 | &lt;input id=&quot;rcemail&quot; type=&quot;email&quot; required autocomplete=&quot;email&quot; oninput=&quot;retainedClientSearch()&quot;&gt; |
| CTL-0202 | SOURCE_CODE/public/crm.html:1236 | &lt;input type=&quot;checkbox&quot; aria-label=&quot;Select ${esc(m.name)} ${esc(applicationDisplayType(m))}&quot; ${workSelected.has(m.id)?&#x27;checked&#x27;:&#x27;&#x27;} ${m.stage===6?&#x27;disabled&#x27;:&#x27;&#x27;} onchange=&quot;toggleWorkFile(&#x27;${m.id}&#x27;,this.checked)&quot;&gt; |
| CTL-0203 | SOURCE_CODE/public/crm.html:1236 | &lt;select aria-label=&quot;File stage for ${esc(m.name)}&quot; onchange=&quot;changeSimpleFileStage(&#x27;${m.id}&#x27;,this.value)&quot;&gt; |
| CTL-0204 | SOURCE_CODE/public/crm.html:1237 | &lt;select aria-label=&quot;View by Case Manager&quot; onchange=&quot;setWorkManager(this.value)&quot;&gt; |
| CTL-0205 | SOURCE_CODE/public/crm.html:1237 | &lt;input id=&quot;workSearch&quot; aria-label=&quot;Search by client name or phone number&quot; placeholder=&quot;Search by client name or phone number&quot; value=&quot;${esc(workSearch)}&quot; oninput=&quot;changeWorkSearch(this.value)&quot;&gt; |
| CTL-0206 | SOURCE_CODE/public/crm.html:1237 | &lt;select aria-label=&quot;PR application type&quot; onchange=&quot;prTypeFilter=this.value;workSelected.clear();render()&quot;&gt; |
| CTL-0207 | SOURCE_CODE/public/crm.html:1237 | &lt;input type=&quot;checkbox&quot; onchange=&quot;selectVisibleWork(this.checked)&quot;&gt; |
| CTL-0208 | SOURCE_CODE/public/crm.html:1251 | &lt;select aria-label=&quot;Meeting with for ${esc(name)}&quot; ${liveUser?.role===&#x27;viewer&#x27;?&#x27;disabled&#x27;:&#x27;&#x27;} onchange=&quot;saveReceptionField(${a.id},&#x27;consultant&#x27;,this.value)&quot;&gt; |
| CTL-0209 | SOURCE_CODE/public/crm.html:1252 | &lt;select aria-label=&quot;Paid appointment for ${esc(name)}&quot; ${liveUser?.role===&#x27;viewer&#x27;?&#x27;disabled&#x27;:&#x27;&#x27;} onchange=&quot;saveReceptionField(${a.id},&#x27;paidAppointment&#x27;,this.value)&quot;&gt; |
| CTL-0210 | SOURCE_CODE/public/crm.html:1255 | &lt;select class=&quot;status-pill&quot; aria-label=&quot;Appointment status for ${esc(name)}&quot; data-tone=&quot;${crmTone(receptionStatus(a))}&quot; ${liveUser?.role===&#x27;viewer&#x27;?&#x27;disabled&#x27;:&#x27;&#x27;} onchange=&quot;setReceptionStatus(${a.id},this.value)&quot;&gt; |
| CTL-0211 | SOURCE_CODE/public/crm.html:1261 | &lt;input aria-label=&quot;Search appointments by name or phone&quot; placeholder=&quot;Search client name or phone&quot; value=&quot;${esc(sheetSearch)}&quot; oninput=&quot;receptionSearch(this.value)&quot;&gt; |
| CTL-0212 | SOURCE_CODE/public/crm.html:1264 | &lt;input id=&quot;receptionJump&quot; type=&quot;date&quot; value=&quot;${validUpdateReceivedDate(sheetDay)?sheetDay:crmToday()}&quot; onchange=&quot;if(validUpdateReceivedDate(this.value)){closeModal();receptionDate(this.value)}&quot;&gt; |
| CTL-0213 | SOURCE_CODE/public/crm.html:1305 | &lt;select aria-label=&quot;Completed or Pending for ${esc(t.id)}&quot; ${liveUser?.role===&#x27;viewer&#x27;?&#x27;disabled&#x27;:&#x27;&#x27;} onchange=&quot;changeTaskStatus(&#x27;${t.id}&#x27;,this.value)&quot;&gt; |
| CTL-0214 | SOURCE_CODE/public/crm.html:1311 | &lt;input type=&quot;hidden&quot; id=&quot;ottaskcategory&quot; value=&quot;${category}&quot;&gt; |
| CTL-0215 | SOURCE_CODE/public/crm.html:1311 | &lt;input type=&quot;hidden&quot; id=&quot;otclient&quot; value=&quot;${esc(t.client\|\|&#x27;&#x27;)}&quot;&gt; |
| CTL-0216 | SOURCE_CODE/public/crm.html:1311 | &lt;input type=&quot;hidden&quot; id=&quot;otclientname&quot; value=&quot;${esc(t.clientName\|\|&#x27;&#x27;)}&quot;&gt; |
| CTL-0217 | SOURCE_CODE/public/crm.html:1311 | &lt;input type=&quot;hidden&quot; id=&quot;taskClientSearch&quot; value=&quot;${esc(t.clientPhone\|\|&#x27;&#x27;)}&quot;&gt; |
| CTL-0218 | SOURCE_CODE/public/crm.html:1311 | &lt;input id=&quot;taskClientSearch&quot; type=&quot;tel&quot; autocomplete=&quot;off&quot; placeholder=&quot;Type a phone number&quot; value=&quot;${esc(t.clientPhone??c?.phone??&#x27;&#x27;)}&quot; oninput=&quot;filterTaskClients(this.value)&quot;&gt; |
| CTL-0219 | SOURCE_CODE/public/crm.html:1311 | &lt;input id=&quot;otclient&quot; type=&quot;hidden&quot; value=&quot;${esc(t.client\|\|&#x27;&#x27;)}&quot;&gt; |
| CTL-0220 | SOURCE_CODE/public/crm.html:1311 | &lt;textarea id=&quot;ottext&quot; required placeholder=&quot;What did the client ask, and what needs to be done?&quot;&gt; |
| CTL-0221 | SOURCE_CODE/public/crm.html:1320 | &lt;select id=&quot;${id}&quot; required&gt; |
| CTL-0222 | SOURCE_CODE/public/crm.html:1321 | &lt;textarea id=&quot;otresult&quot; required placeholder=&quot;Called client and provided a file update.&quot;&gt; |
| CTL-0223 | SOURCE_CODE/public/crm.html:1336 | &lt;select aria-label=&quot;Case Managers&quot; onchange=&quot;taskAssignee=this.value;render()&quot;&gt; |
| CTL-0224 | SOURCE_CODE/public/crm.html:1354 | &lt;input type=&quot;checkbox&quot; id=&quot;llresumeReviewed&quot;&gt; |
| CTL-0225 | SOURCE_CODE/public/crm.html:1363 | &lt;select aria-label=&quot;LMIA status filter&quot; onchange=&quot;lmiaStatusFilter=this.value;refreshLmiaRows()&quot;&gt; |
| CTL-0226 | SOURCE_CODE/public/crm.html:1390 | &lt;input id=&quot;rqfile&quot; required value=&quot;${esc(d.fileNumber\|\|&#x27;&#x27;)}&quot; placeholder=&quot;Enter file number&quot;&gt; |
| CTL-0227 | SOURCE_CODE/public/crm.html:1390 | &lt;textarea id=&quot;rqnotes&quot;&gt; |
| CTL-0228 | SOURCE_CODE/public/crm.html:1390 | &lt;textarea id=&quot;rqdocs&quot;&gt; |
| CTL-0229 | SOURCE_CODE/public/crm.html:1390 | &lt;input id=&quot;rqverified&quot; type=&quot;checkbox&quot; required&gt; |
| CTL-0230 | SOURCE_CODE/public/crm.html:1397 | &lt;textarea id=&quot;rqresponse&quot; required placeholder=&quot;Record how the request was completed&quot;&gt; |
| CTL-0231 | SOURCE_CODE/public/crm.html:1447 | &lt;select onchange=&quot;personalReminderManager=this.value;render()&quot;&gt; |
| CTL-0232 | SOURCE_CODE/public/crm.html:1460 | &lt;textarea id=&quot;prmtext&quot; required maxlength=&quot;5000&quot; rows=&quot;4&quot; placeholder=&quot;What do you need to do?&quot;&gt; |
| CTL-0233 | SOURCE_CODE/public/crm.html:1460 | &lt;select id=&quot;prmperson&quot; required&gt; |
| CTL-0234 | SOURCE_CODE/public/crm.html:1460 | &lt;select id=&quot;prmapplication&quot;&gt; |
| CTL-0235 | SOURCE_CODE/public/crm.html:1559 | &lt;input &#x27;,`&lt;input oninput=&quot;editApplicationClient(&#x27;${key}&#x27;,this.value)&quot; `)).join(&#x27;&#x27;)+&#x27;&lt;/div&gt; |
| CTL-0236 | SOURCE_CODE/public/crm.html:1593 | &lt;select aria-label=&quot;Document&quot; ${disabled} onchange=&quot;${change(&#x27;kind&#x27;)}&quot;&gt; |
| CTL-0237 | SOURCE_CODE/public/crm.html:1593 | &lt;input id=&quot;doc-other-${r.id}&quot; aria-label=&quot;Custom document name&quot; placeholder=&quot;Document name&quot; value=&quot;${esc(r.customName\|\| (r.kind===&#x27;Other&#x27;?r.label:&#x27;&#x27;)\|\|&#x27;&#x27;)}&quot; ${r.kind!==&#x27;Other&#x27;?&#x27;hidden&#x27;:&#x27;&#x27;} ${disabled} oninput=&quot;${change(&#x27;customName&#x27;)}&quot;&gt; |
| CTL-0238 | SOURCE_CODE/public/crm.html:1593 | &lt;input aria-label=&quot;Received date&quot; type=&quot;date&quot; value=&quot;${esc(r.received\|\|&#x27;&#x27;)}&quot; ${disabled} onchange=&quot;${change(&#x27;received&#x27;)}&quot;&gt; |
| CTL-0239 | SOURCE_CODE/public/crm.html:1593 | &lt;input id=&quot;doc-due-${r.id}&quot; aria-label=&quot;Review due&quot; type=&quot;date&quot; value=&quot;${esc(r.reviewDue??documentReviewDue(r.received))}&quot; ${disabled} onchange=&quot;${change(&#x27;reviewDue&#x27;)}&quot;&gt; |
| CTL-0240 | SOURCE_CODE/public/crm.html:1593 | &lt;select aria-label=&quot;Status&quot; ${disabled} onchange=&quot;${change(&#x27;status&#x27;)}&quot;&gt; |
| CTL-0241 | SOURCE_CODE/public/crm.html:1593 | &lt;select aria-label=&quot;Verified by&quot; ${disabled} onchange=&quot;${change(&#x27;verifiedBy&#x27;)}&quot;&gt; |
| CTL-0242 | SOURCE_CODE/public/crm.html:1593 | &lt;textarea rows=&quot;2&quot; aria-label=&quot;Notes&quot; placeholder=&quot;Type notes…&quot; ${disabled} oninput=&quot;${change(&#x27;notes&#x27;)}&quot;&gt; |
| CTL-0243 | SOURCE_CODE/public/crm.html:1646 | &lt;textarea &#x27;,&#x27;&lt;textarea required maxlength=&quot;2000&quot; placeholder=&quot;For example: Client has not responded to calls or messages&quot; &#x27;)}&lt;p class=&quot;small muted&quot;&gt; |


## Residual and unreachable candidates

Old All Matters, My Work, RCIC Review, Client Portal, Workflow Templates, Developer Guide and Reports functions remain in source or routing branches. They are not all registered in the final sidebar. A defined function is not evidence of a reachable screen. Old control source occurrences remain individually indexed in 03 rather than discarded. None is labeled working without execution. Reports, professional-review controls and portal surfaces require browser/call-path review before anyone treats them as shipped modules.

## Corrected findings

Staff booking Related application is displayed but selected value is not persisted (UI-01 / DEF-06). The application wrapper and handler chain are evaluated, not inferred solely from the last textual declaration. Settings is asynchronous: the VM captures shells, not completion of access/audit/import/recovery content. Input helper calls can emit controls also counted as literal templates; counts must not be summed as unique visible controls.
