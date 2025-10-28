# Sherlock AI - MVP Go-Live Roadmap
## 2-Week Execution Plan (Days 1-14)

**Launch Date:** 14 days from start
**Goal:** Ship functional MVP that lets store owners see real revenue leaks
**North Star Metric:** First paying customer finds and fixes a revenue leak

---

## Current State Assessment

### ✅ What We Have (70% Complete Backend)
- [x] 20+ Supabase Edge Functions deployed and working
- [x] Cart abandonment analysis service built
- [x] Shopify/GA4/Social OAuth functions exist
- [x] Database schema for users/teams
- [x] Sign-in/sign-up pages built
- [x] Demo6 dashboard with professional UI
- [x] Sherlock AI panel component
- [x] Observable Plot charts working
- [x] Waitlist page with email collection

### ❌ Critical Gaps (Must Fix for MVP)
- [ ] Auth not connected to Supabase (uses custom DB)
- [ ] No real data collection from stores
- [ ] No store connection onboarding flow
- [ ] Dashboard shows fake data only
- [ ] OAuth flows not integrated into UI
- [ ] No revenue leak detection running on real data

---

## Week 1: Foundation (Days 1-7)
**Goal:** User can sign up, connect Shopify store, see "Analyzing..." state

### Day 1: Supabase Auth Integration (8 hours)
**Epic:** Replace custom auth with Supabase Auth

**Task 1.1: Set up Supabase Auth config** (1 hour)
- [ ] Enable Email auth in Supabase dashboard
- [ ] Configure redirect URLs (localhost:3000 + production)
- [ ] Set up email templates (welcome, reset password)
- **Test:** Can create user in Supabase dashboard manually
- **File:** `supabase/config.toml`

**Task 1.2: Update sign-up page to use Supabase** (2 hours)
- [ ] Replace `/app/(login)/actions.ts` to call `supabase.auth.signUp()`
- [ ] Remove custom password hashing
- [ ] Handle email confirmation flow
- **Test:** Sign up with new email, receive confirmation email
- **Files:** `app/(login)/actions.ts`, `lib/supabase/client.ts`

**Task 1.3: Update sign-in page to use Supabase** (2 hours)
- [ ] Replace sign-in action to use `supabase.auth.signInWithPassword()`
- [ ] Handle session creation
- [ ] Store session in cookies
- **Test:** Sign in with existing user, session persists on refresh
- **Files:** `app/(login)/actions.ts`, `lib/auth/middleware.ts`

**Task 1.4: Protected routes middleware** (2 hours)
- [ ] Update middleware to check Supabase session
- [ ] Redirect to sign-in if no session
- [ ] Pass user data to dashboard pages
- **Test:** Access /dashboard without login → redirects. Login → access granted
- **Files:** `middleware.ts`, `lib/auth/middleware.ts`

**Task 1.5: User profile API** (1 hour)
- [ ] Create `/api/user/profile` endpoint
- [ ] Fetch user data from Supabase
- [ ] Return user + organization data
- **Test:** Call API with valid session → gets user data
- **Files:** `app/api/user/profile/route.ts`

**End of Day 1 Checkpoint:**
- ✅ User can sign up with Supabase Auth
- ✅ User can sign in and session persists
- ✅ Dashboard is protected (login required)
- ⚠️  **Blocker if fails:** Can't proceed to store connection

---

### Day 2: Store Connection UI (6 hours)
**Epic:** Build onboarding wizard for Shopify connection

**Task 2.1: Create onboarding page** (2 hours)
- [ ] Create `/app/onboarding/page.tsx`
- [ ] 3-step wizard: Welcome → Connect Store → Analyzing
- [ ] Progress indicator (Step 1 of 3)
- **Test:** Navigate to /onboarding, see welcome step
- **Files:** `app/onboarding/page.tsx`, `components/onboarding/OnboardingWizard.tsx`

**Task 2.2: "Connect Shopify" button** (2 hours)
- [ ] Add Shopify logo + "Connect Store" button
- [ ] Button triggers OAuth flow
- [ ] Explain: "We'll analyze your last 90 days of data"
- **Test:** Click button → redirects to Shopify OAuth (can mock for now)
- **Files:** `components/onboarding/ConnectShopify.tsx`

**Task 2.3: OAuth callback handler** (2 hours)
- [ ] Create `/app/api/auth/shopify/callback/route.ts`
- [ ] Handle OAuth code exchange
- [ ] Save access token to database
- [ ] Redirect to dashboard with success message
- **Test:** Complete OAuth flow → token saved → redirects to dashboard
- **Files:** `app/api/auth/shopify/callback/route.ts`

**End of Day 2 Checkpoint:**
- ✅ Onboarding wizard displays correctly
- ✅ Shopify OAuth button visible
- ✅ OAuth callback URL ready (can test with mock)
- ⚠️  **Blocker if fails:** User can't connect store (critical path)

---

### Day 3: Shopify OAuth Integration (8 hours)
**Epic:** Actually connect to Shopify and fetch store data

**Task 3.1: Register Shopify app** (1 hour)
- [ ] Create Shopify Partner account
- [ ] Create new Shopify app
- [ ] Set redirect URLs
- [ ] Get API key + secret
- [ ] Add to .env.local
- **Test:** API key visible in Shopify Partner dashboard
- **Files:** `.env.local`, `SHOPIFY_SETUP.md`

**Task 3.2: Build OAuth initiation** (2 hours)
- [ ] Generate Shopify install URL with scopes
- [ ] Scopes needed: `read_orders`, `read_customers`, `read_analytics`
- [ ] Include state parameter for security
- [ ] Redirect user to Shopify
- **Test:** Click "Connect" → goes to Shopify OAuth consent page
- **Files:** `lib/shopify/oauth.ts`

**Task 3.3: Complete OAuth exchange** (3 hours)
- [ ] Receive code in callback
- [ ] Exchange code for permanent access token
- [ ] Store token encrypted in database
- [ ] Create `store_connections` table if doesn't exist
- **Test:** Complete OAuth → token saved → can query Shopify API
- **Files:** `app/api/auth/shopify/callback/route.ts`, `lib/shopify/client.ts`

**Task 3.4: Test data fetch** (2 hours)
- [ ] Call Shopify API to get store name
- [ ] Call API to get last 30 days of orders
- [ ] Display "Connected: {store_name}" in dashboard
- **Test:** See real store name from Shopify in UI
- **Files:** `lib/shopify/client.ts`, `app/dashboard/page.tsx`

**End of Day 3 Checkpoint:**
- ✅ Shopify OAuth working end-to-end
- ✅ Access token stored securely
- ✅ Can fetch store data via API
- ⚠️  **Blocker if fails:** No data to analyze (critical path)

---

### Day 4: Data Collection Setup (8 hours)
**Epic:** Collect cart and checkout events for analysis

**Task 4.1: Design event schema** (1 hour)
- [ ] Create `cart_events` table in Supabase
- [ ] Columns: id, store_id, user_id, event_type, cart_data, timestamp
- [ ] Create indexes for fast queries
- **Test:** Can insert sample event manually
- **Files:** `supabase/migrations/001_cart_events.sql`

**Task 4.2: Create tracking script** (3 hours)
- [ ] Build lightweight JS tracker (`sherlock-track.js`)
- [ ] Track events: cart_add, cart_remove, checkout_start, checkout_complete
- [ ] Send events to `/api/track` endpoint
- [ ] Handle errors gracefully (don't break store)
- **Test:** Run script in console → events logged to API
- **Files:** `public/sherlock-track.js`, `app/api/track/route.ts`

**Task 4.3: API endpoint to receive events** (2 hours)
- [ ] Create `/app/api/track/route.ts`
- [ ] Validate event payload
- [ ] Save to `cart_events` table
- [ ] Return 200 OK quickly (async processing)
- **Test:** Send test event via curl → saved in database
- **Files:** `app/api/track/route.ts`

**Task 4.4: Shopify script tag installation** (2 hours)
- [ ] After OAuth, install sherlock-track.js via Script Tag API
- [ ] Inject script into customer's store automatically
- [ ] Verify script is loading on storefront
- **Test:** Visit connected store → sherlock-track.js loads → events fire
- **Files:** `lib/shopify/install-tracker.ts`

**End of Day 4 Checkpoint:**
- ✅ Tracking script deployed to customer stores
- ✅ Cart events flowing into database
- ✅ Can query events via SQL
- ⚠️  **Blocker if fails:** No data to analyze (critical)

---

### Day 5: Analysis Pipeline (8 hours)
**Epic:** Run cart abandonment analysis on real data

**Task 5.1: Query cart abandonment data** (2 hours)
- [ ] Write SQL query to find abandoned carts
- [ ] Logic: `checkout_start` event without `checkout_complete` within 24h
- [ ] Calculate abandonment rate
- [ ] Test with fake data first
- **Test:** Query returns correct abandoned cart count
- **Files:** `lib/analytics/cart-abandonment-query.ts`

**Task 5.2: Connect to Edge Function** (2 hours)
- [ ] Call `cart-abandonment-analysis` Supabase function
- [ ] Pass real store data (revenue, cart events)
- [ ] Handle response (primary causes, fixes, recovery estimates)
- **Test:** Function returns analysis with real numbers
- **Files:** `app/api/analyze/cart-abandonment/route.ts`

**Task 5.3: Store analysis results** (2 hours)
- [ ] Create `revenue_leak_detections` table
- [ ] Save analysis results to database
- [ ] Include: leak_type, estimated_impact, severity, recommended_fixes
- **Test:** Analysis results saved and queryable
- **Files:** `supabase/migrations/002_revenue_leaks.sql`

**Task 5.4: Trigger analysis on schedule** (2 hours)
- [ ] Set up cron job (Supabase Edge Function cron)
- [ ] Run analysis every 6 hours for active stores
- [ ] Only analyze stores with >100 events (enough data)
- **Test:** Cron triggers analysis → results appear in DB
- **Files:** `supabase/functions/cron-analyze-stores/index.ts`

**End of Day 5 Checkpoint:**
- ✅ Cart abandonment analysis running on real data
- ✅ Results saved to database
- ✅ Can query analysis results via API
- ⚠️  **Blocker if fails:** Dashboard has no insights to show

---

### Day 6: Dashboard Integration (8 hours)
**Epic:** Replace fake data with real analysis results

**Task 6.1: Fetch real revenue leaks** (2 hours)
- [ ] Update `/app/api/dashboard-data/route.ts`
- [ ] Query `revenue_leak_detections` for logged-in user's store
- [ ] Return top 3 leaks by estimated impact
- **Test:** API returns real leaks, not fake data
- **Files:** `app/api/dashboard-data/route.ts`

**Task 6.2: Update demo6 to use real data** (3 hours)
- [ ] Replace hardcoded `priorityFixes` with API call
- [ ] Show loading state while fetching
- [ ] Handle "no data yet" state (store just connected)
- [ ] Display real numbers in cards
- **Test:** Dashboard shows actual revenue leaks from user's store
- **Files:** `app/dashboard/page.tsx`

**Task 6.3: Update Sherlock panel with real analysis** (2 hours)
- [ ] Fetch analysis details when card is clicked
- [ ] Show real recommended fixes (not hardcoded)
- [ ] Display implementation time estimates
- **Test:** Click revenue leak → Sherlock shows real fix steps
- **Files:** `components/SherlockPanel.tsx`

**Task 6.4: Add "no data" empty state** (1 hour)
- [ ] If no events yet, show "Collecting data... check back in 24 hours"
- [ ] Show progress: "X events collected so far"
- **Test:** New store with 0 events → sees helpful message
- **Files:** `app/dashboard/page.tsx`

**End of Day 6 Checkpoint:**
- ✅ Dashboard displays real revenue leaks
- ✅ Sherlock panel shows real analysis
- ✅ Loading and empty states handled
- 🎉  **Milestone:** Core MVP functionality complete!

---

### Day 7: Testing & Bug Fixes (8 hours)
**Epic:** End-to-end testing and critical bug fixes

**Task 7.1: Complete user journey test** (2 hours)
- [ ] Test 1: Sign up → verify email → log in
- [ ] Test 2: Connect Shopify store → OAuth completes
- [ ] Test 3: Wait for data collection (or inject test events)
- [ ] Test 4: View dashboard → see revenue leaks
- [ ] Test 5: Click leak → Sherlock shows fix
- **Test:** Full flow works without errors
- **Files:** Document findings in `BUGS_WEEK1.md`

**Task 7.2: Fix critical bugs** (4 hours)
- [ ] Fix highest priority bugs from testing
- [ ] Focus on blockers (auth, OAuth, data display)
- [ ] Defer nice-to-haves to Week 2
- **Test:** Re-test failed scenarios → all pass
- **Files:** Various (based on bugs found)

**Task 7.3: Error handling** (2 hours)
- [ ] Add try/catch to all API routes
- [ ] Show user-friendly error messages
- [ ] Log errors to console for debugging
- **Test:** Trigger errors intentionally → see helpful messages
- **Files:** All `route.ts` files

**End of Day 7 Checkpoint:**
- ✅ Core user flow tested and working
- ✅ Critical bugs fixed
- ✅ Error handling in place
- 📊  **Week 1 Complete:** Foundation is solid

---

## Week 2: Polish & Launch (Days 8-14)
**Goal:** Production-ready MVP that we're proud to ship

### Day 8: Waitlist Page Polish (6 hours)
**Epic:** Build beautiful waitlist landing page

**Task 8.1: Implement scroll-trigger animations** (3 hours)
- [ ] Install GSAP + ScrollTrigger
- [ ] Act 1: Problem fades in on scroll
- [ ] Act 2: Solution steps reveal sequentially
- [ ] Act 3: CTA scales in at bottom
- **Test:** Scroll through page → smooth animations
- **Files:** `app/waitlist/page.tsx`, `lib/animations/scroll-trigger.ts`

**Task 8.2: Sticky Sherlock panel** (2 hours)
- [ ] Make Sherlock panel position: sticky
- [ ] Show ONE static analysis example
- [ ] Panel stays visible while left content scrolls
- **Test:** Scroll page → Sherlock stays in view
- **Files:** `app/waitlist/page.tsx`, `components/waitlist/SherlockPreview.tsx`

**Task 8.3: Glassmorphism navbar** (1 hour)
- [ ] Add backdrop-filter: blur(10px)
- [ ] Semi-transparent background
- [ ] Pill-shaped "Join Waitlist" button
- **Test:** Navbar looks premium and modern
- **Files:** `app/waitlist/page.tsx`

**End of Day 8 Checkpoint:**
- ✅ Waitlist page looks stunning
- ✅ Scroll animations working smoothly
- ✅ Design matches brand guidelines

---

### Day 9: Onboarding UX (6 hours)
**Epic:** Make first-time experience delightful

**Task 9.1: Welcome email** (2 hours)
- [ ] Design HTML email template
- [ ] Send via Supabase Auth hooks
- [ ] Include: "Next step: Connect your store"
- **Test:** Sign up → receive email in inbox
- **Files:** `supabase/functions/send-welcome-email/index.ts`

**Task 9.2: First-time user tutorial** (2 hours)
- [ ] Add tooltips to dashboard (use Shepherd.js or similar)
- [ ] Highlight: "Connect your store here"
- [ ] Show: "Revenue leaks will appear in 24 hours"
- **Test:** New user sees helpful guidance
- **Files:** `components/tutorial/FirstTimeTutorial.tsx`

**Task 9.3: Loading states** (2 hours)
- [ ] Show skeleton screens while loading
- [ ] "Analyzing your store..." with progress spinner
- [ ] Smooth transitions when data loads
- **Test:** No flash of empty content
- **Files:** `components/ui/skeleton.tsx`, various pages

**End of Day 9 Checkpoint:**
- ✅ New users feel guided and confident
- ✅ Clear expectations set (24hr wait for data)
- ✅ Professional loading states

---

### Day 10: Mobile Responsive (6 hours)
**Epic:** Works perfectly on all devices

**Task 10.1: Mobile dashboard layout** (2 hours)
- [ ] Stack cards vertically on mobile
- [ ] Sherlock panel becomes bottom sheet
- [ ] Touch-friendly tap targets (44px min)
- **Test:** View on iPhone/Android → everything accessible
- **Files:** `app/dashboard/page.tsx`, responsive CSS

**Task 10.2: Mobile waitlist page** (2 hours)
- [ ] Stack split-screen vertically
- [ ] Sherlock panel below main content
- [ ] Email form full-width
- **Test:** Looks great on mobile
- **Files:** `app/waitlist/page.tsx`

**Task 10.3: Mobile navigation** (2 hours)
- [ ] Hamburger menu for nav items
- [ ] Drawer component for mobile menu
- [ ] CTA button always visible
- **Test:** Navigate entire app on mobile
- **Files:** `components/layout/MobileNav.tsx`

**End of Day 10 Checkpoint:**
- ✅ Fully responsive on all screen sizes
- ✅ Mobile UX is great (not just "works")
- ✅ Touch interactions feel native

---

### Day 11: Performance & SEO (6 hours)
**Epic:** Fast loading, good SEO

**Task 11.1: Optimize images** (1 hour)
- [ ] Use Next.js Image component
- [ ] Compress all images (TinyPNG)
- [ ] Lazy load below-fold images
- **Test:** Lighthouse score >90 performance
- **Files:** Various image imports

**Task 11.2: Add meta tags** (2 hours)
- [ ] Title: "Sherlock AI - Find Revenue Leaks in Your E-commerce Store"
- [ ] Description: Use oneliner from messaging guide
- [ ] Open Graph images for social sharing
- [ ] Twitter cards
- **Test:** Share on Twitter/LinkedIn → looks professional
- **Files:** `app/layout.tsx`, `app/waitlist/page.tsx`

**Task 11.3: Add analytics** (1 hour)
- [ ] Install Plausible or PostHog (privacy-friendly)
- [ ] Track: page views, waitlist signups, store connections
- [ ] No cookies, GDPR compliant
- **Test:** Events appear in analytics dashboard
- **Files:** `app/layout.tsx`, `lib/analytics.ts`

**Task 11.4: Error boundaries** (2 hours)
- [ ] Add React Error Boundaries to critical sections
- [ ] Show friendly "Something went wrong" page
- [ ] Log errors to Sentry or similar
- **Test:** Trigger error → see fallback UI
- **Files:** `components/ErrorBoundary.tsx`

**End of Day 11 Checkpoint:**
- ✅ Site loads in <2 seconds
- ✅ SEO optimized for Google
- ✅ Analytics tracking key metrics

---

### Day 12: Security & Compliance (6 hours)
**Epic:** Protect user data, follow best practices

**Task 12.1: Rate limiting** (2 hours)
- [ ] Add rate limits to all API endpoints
- [ ] 100 requests/minute per IP for public endpoints
- [ ] 1000 requests/hour for authenticated users
- **Test:** Exceed limit → get 429 error
- **Files:** `middleware.ts`, `lib/rate-limit.ts`

**Task 12.2: Input validation** (2 hours)
- [ ] Validate all user inputs server-side
- [ ] Sanitize HTML (prevent XSS)
- [ ] Use Zod schemas for type safety
- **Test:** Submit malicious input → rejected safely
- **Files:** All `route.ts` files

**Task 12.3: Privacy policy & ToS** (2 hours)
- [ ] Write privacy policy (template + customize)
- [ ] Write terms of service
- [ ] Add links to footer
- [ ] Create `/privacy` and `/terms` pages
- **Test:** Pages display correctly
- **Files:** `app/privacy/page.tsx`, `app/terms/page.tsx`

**End of Day 12 Checkpoint:**
- ✅ App is secure against common attacks
- ✅ User data protected
- ✅ Legal compliance covered

---

### Day 13: Final Testing (8 hours)
**Epic:** Break everything, then fix it

**Task 13.1: Browser compatibility** (2 hours)
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on latest 2 versions
- [ ] Fix any browser-specific bugs
- **Test:** Works identically across browsers
- **Files:** Various (browser-specific fixes)

**Task 13.2: User acceptance testing** (3 hours)
- [ ] Get 3-5 beta testers
- [ ] Watch them use the product (screen share)
- [ ] Note confusion points
- [ ] Fix critical UX issues
- **Test:** Users complete signup → connection → see insights
- **Files:** Document in `USER_FEEDBACK.md`

**Task 13.3: Load testing** (2 hours)
- [ ] Use k6 or Artillery to simulate 100 concurrent users
- [ ] Test API endpoints under load
- [ ] Identify bottlenecks
- **Test:** No errors under 100 concurrent users
- **Files:** `tests/load-test.js`

**Task 13.4: Final bug fixes** (1 hour)
- [ ] Fix any bugs discovered in testing
- [ ] Prioritize: critical > high > medium
- [ ] Defer low-priority bugs to post-launch
- **Test:** Re-test all critical flows → pass
- **Files:** Various

**End of Day 13 Checkpoint:**
- ✅ App tested by real users
- ✅ All critical bugs fixed
- ✅ Confident in stability

---

### Day 14: Launch Day! 🚀 (6 hours)
**Epic:** Ship it!

**Task 14.1: Production deployment** (2 hours)
- [ ] Deploy to Vercel/Netlify
- [ ] Set environment variables
- [ ] Test production build locally first
- [ ] Deploy to production URL
- **Test:** Visit production URL → works!
- **Files:** `vercel.json`, `.env.production`

**Task 14.2: Database migrations** (1 hour)
- [ ] Run all migrations on production Supabase
- [ ] Verify tables exist
- [ ] Test with production credentials
- **Test:** App connects to prod database
- **Files:** `supabase/migrations/*.sql`

**Task 14.3: Email waitlist** (1 hour)
- [ ] Export waitlist emails from database
- [ ] Send launch email: "Sherlock is live!"
- [ ] Include signup link + early access code
- **Test:** Waitlist receives email
- **Files:** Email template, Supabase SQL query

**Task 14.4: Launch tweet/post** (1 hour)
- [ ] Write launch post
- [ ] Share on Twitter, LinkedIn, Reddit (r/shopify)
- [ ] Post in relevant communities
- **Test:** Post goes live, traffic arrives
- **Files:** `LAUNCH_POST.md`

**Task 14.5: Monitor & respond** (1 hour)
- [ ] Watch analytics for traffic
- [ ] Monitor error logs (Sentry)
- [ ] Respond to first users on social media
- [ ] Fix any critical bugs immediately
- **Test:** App stays up, users signing up
- **Tools:** Analytics dashboard, Sentry, Twitter

**End of Day 14:**
- 🎉  **LAUNCHED!**
- 🚀  MVP live and accepting users
- 💰  First revenue leaks detected

---

## Critical Path (Must Be Sequential)

1. **Auth** (Day 1) → **Store Connection** (Days 2-3) → **Data Collection** (Day 4) → **Analysis** (Day 5) → **Dashboard** (Day 6)

These tasks CANNOT be parallelized. Each depends on the previous.

---

## Parallel Work Opportunities

While one person works on critical path, another can work on:
- Waitlist page polish (Day 8)
- Email templates (Day 9)
- Mobile responsive (Day 10)
- SEO/analytics (Day 11)
- Legal pages (Day 12)

---

## Risk Mitigation

### Risk 1: Shopify OAuth approval delay
**Likelihood:** Medium
**Impact:** High (can't launch without it)
**Mitigation:**
- Submit OAuth app for review on Day 3
- While waiting, use test stores
- If delayed >3 days, launch with "Request Access" form

### Risk 2: Not enough real data to analyze
**Likelihood:** High
**Impact:** Medium (users see empty dashboard)
**Mitigation:**
- Set expectation: "Results in 24-48 hours"
- Show "Collecting data..." state with progress
- Inject synthetic test data for demo accounts

### Risk 3: Analysis gives poor/wrong recommendations
**Likelihood:** Medium
**Impact:** High (kills trust)
**Mitigation:**
- Manual review of first 10 analyses
- Add "feedback" button to report bad recommendations
- Conservative language: "Consider trying..." not "You must fix..."

### Risk 4: Performance issues under load
**Likelihood:** Low
**Impact:** High (site goes down on launch day)
**Mitigation:**
- Load test on Day 13
- Use Vercel Pro (auto-scales)
- Database connection pooling (Supabase handles this)

---

## Daily Standup Checklist

**Every morning, review:**
1. ✅ What shipped yesterday?
2. 🎯 What's the goal today?
3. 🚧 Any blockers?
4. ⏰ Are we on schedule?
5. 🐛 Critical bugs to fix first?

**Every evening, ask:**
1. Did we hit today's checkpoint?
2. What's at risk for tomorrow?
3. Do we need to adjust the plan?

---

## Success Criteria (How We Know We're Done)

**MVP is launch-ready when:**
- [ ] User can sign up and log in (Supabase Auth)
- [ ] User can connect their Shopify store (OAuth)
- [ ] Store data flows into our system (tracking script works)
- [ ] Revenue leaks are detected automatically (analysis runs)
- [ ] Dashboard shows real leaks with real numbers
- [ ] Sherlock panel provides actionable fix steps
- [ ] Responsive on mobile and desktop
- [ ] No critical bugs (P0 issues)
- [ ] Legal pages exist (Privacy, ToS)
- [ ] Site performs well (Lighthouse >80)

**Nice-to-haves for v1.1 (post-launch):**
- Email notifications when new leaks detected
- Team collaboration (invite team members)
- Historical trend graphs
- More revenue leak types (beyond cart abandonment)
- Integrations beyond Shopify (WooCommerce, BigCommerce)

---

## Post-Launch (Day 15+)

**Week 3 Goals:**
- Monitor user feedback
- Fix bugs reported by users
- Iterate on messaging based on conversion rates
- Add most-requested features

**Metrics to Track:**
- Waitlist → Signup conversion rate
- Signup → Store connection rate
- Store connection → First insight shown
- Users who implement a recommended fix
- Revenue recovered (ask users to report)

---

## Emergency Contacts & Resources

**If stuck:**
- Supabase Docs: https://supabase.com/docs
- Shopify API Docs: https://shopify.dev/docs
- GSAP ScrollTrigger: https://greensock.com/docs/v3/Plugins/ScrollTrigger
- Next.js App Router: https://nextjs.org/docs

**Support:**
- Supabase Discord: For auth/database issues
- Shopify Community: For OAuth/API questions
- Vercel Support: For deployment issues

---

## Commitment

We commit to shipping the MVP in 14 days. This roadmap is aggressive but achievable. Every task is bite-sized and testable. We focus on "done" over "perfect."

**Let's ship it! 🚀**
