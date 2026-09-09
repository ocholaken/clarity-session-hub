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

## Phase 6 — Professional polish brief (requested 7 Sep)
- [ ] Hero: full-width blurred photo bg + overlay, clear value prop, primary/secondary CTA
- [ ] Consistent spacing/typography/cards/radius/buttons sitewide
- [ ] Mobile/tablet/desktop responsiveness pass
- [ ] Services section: icon, name, description, Book Now, hover animation
- [ ] "How it works" 4-step section with icons + scroll animation
- [ ] Reviews: authentic layout + animated keyword circles on scroll
- [ ] Statistics counting up on scroll
- [ ] Booking states (available/selected/unavailable/pending/confirmed/cancelled)
- [ ] Booking review page before payment with edit-back
- [ ] Payment architecture ready for M-Pesa (no fake confirmations)
- [ ] Single login with role-based routing (user dashboard vs admin dashboard); drop separate admin login
- [ ] Admin dashboard cards + charts (users, bookings by status, payments, services, slots)
- [ ] Sticky responsive navbar with active-page highlight + hamburger
- [ ] CTAs throughout
- [ ] Professional footer (links, services, contact, socials, privacy, terms, copyright)
- [ ] Micro-animations on viewport entry
- [ ] Accessibility: contrast, focus states, labels, alt text
- [ ] Final end-to-end test pass

## Phase 7 - Lucide icon system
- [x] Hero: trust badges (ShieldCheck, Calendar, Lock, Clock) #7A9E7E icons / #5A6B7A text
- [x] Services: 6 cards, 56px circles bg #E8F0E9, sage icons 28px
- [x] Counselors cards: BadgeCheck, Globe, Banknote(KSh), CalendarCheck, specialty pills
- [x] Resources: filter icons + card footer icons (Clock, FileText/PlayCircle/BookOpen)
- [x] Footer: Phone/WhatsApp, Mail, MapPin, Clock; social circles bg #3A3D4D
