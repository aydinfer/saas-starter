# Waitlist Setup Instructions

## 1. Create the Waitlist Table in Supabase

Go to your Supabase project SQL Editor and run this:

```sql
-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'landing_page',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist(email);
CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON waitlist(created_at DESC);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for signup)
CREATE POLICY "Allow public signups" ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only authenticated users can view
CREATE POLICY "Only admins can view waitlist" ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);
```

## 2. Access Your Waitlist Page

Navigate to: **http://localhost:3000/waitlist**

## 3. Features Included

✅ **Split-screen demo** - Left side shows revenue leak dashboard, right shows Sherlock AI analyzing
✅ **Auto-cycling analysis** - Rotates through 3 different revenue leaks every 8 seconds
✅ **Animated waitlist counter** - Increments every 5 seconds for social proof
✅ **Email collection** - Full form with validation and API integration
✅ **Hover effects** - Problem cards flip to reveal revenue losses
✅ **Responsive design** - Works on desktop, tablet, and mobile
✅ **Success state** - Shows confirmation after signup

## 4. Customization

### Change the hero numbers:
Edit `/app/waitlist/page.tsx` lines 42-73 (the `analyses` array)

### Change the waitlist count:
Edit line 12: `const [waitlistCount, setWaitlistCount] = useState(2847);`

### Change the brand colors:
- Teal accent: `#14b8a6`
- Red (danger): `#ef4444`
- Green (success): `#10b981`
- Background: `#0a0a0a`

## 5. Deploy to Production

When ready to launch:

1. Update the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in production
2. Make sure the waitlist table is created in production Supabase
3. Deploy to Vercel/Netlify
4. Point your domain to the deployment

## 6. View Signups

Query your waitlist in Supabase:

```sql
SELECT
  email,
  created_at,
  source
FROM waitlist
ORDER BY created_at DESC;
```

## 7. Export to CSV

```sql
COPY (
  SELECT email, created_at
  FROM waitlist
  ORDER BY created_at DESC
) TO STDOUT WITH CSV HEADER;
```

---

**That's it! Your waitlist page is ready to collect emails! 🚀**

Visit: http://localhost:3000/waitlist
