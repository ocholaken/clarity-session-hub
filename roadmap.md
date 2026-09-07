# Roadmap

## Phase 1 — Accounts & admin access (in progress)
- [x] Remove public "Admin" links from header
- [x] Wire /admin/login + protected /admin/* routes to real screens
- [x] Real sign up / sign in / sign out for users (backend auth)
- [ ] Create first administrator account (secure setup)
- [x] Delete old demo admin page with hardcoded password

## Phase 2 — Booking system
- [x] Availability (time slots) storage + double-booking prevention
- [x] Real booking flow: service → date → slot → details → confirm → stored
- [x] User booking history page
- [ ] Admin booking management (search, filter, status changes)

## Phase 3 — Payments
- [ ] Payments table with pending/successful/failed/cancelled/refunded
- [ ] Server-side M-Pesa (Daraja) integration + callback verification
- [ ] Booking marked paid only after provider confirmation
- [ ] Admin payment records view

## Phase 4 — Polish
- [ ] Animated statistic counters on scroll (once per visit)
- [ ] Button responsiveness, hover/active/disabled, loading + feedback states
- [ ] Password reset page
- [ ] Full testing pass (mobile + desktop)

## Phase 5 — Visual polish (requested)
- [ ] Hero: user photo as full-width soft-blurred background with dark overlay, responsive
- [ ] Reviews section: animated keyword circles (scroll-triggered fade/scale + hover motion)
