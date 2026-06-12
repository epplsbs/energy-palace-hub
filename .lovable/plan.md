## Energy Palace — Community Page & EV Chalak Loyalty System

A phased proposal to add the Support Partners community page and the full driver management + loyalty backend described in the brochure.

---

### Phase 1 — Community Page (Frontend + minimal backend)

**Goal:** publicly list opted-in support-partner drivers.

- New route `/community` ("Support Partners") added to navigation (Index, About, Media, Community, Contact).
- Driver card grid: driver photo, name, masked phone (e.g. `98••••••12`), vehicle number, vehicle photo, tier badge (Silver/Gold/Platinum).
- Filters: tier, search by name/vehicle. Responsive, matches existing dark/energy theme.
- Backend: `drivers` table + public masked view (only `approved=true AND public_consent=true` rows). Storage buckets `driver-photos`, `vehicle-photos` (public read, admin write).
- Admin tab "Drivers" to approve/edit/remove and toggle public display.

### Phase 2 — Driver Registration & Admin Management

- Public `/community/join` form: name, phone, vehicle number, vehicle model, driver photo, vehicle photo, consent checkbox. Submissions land as `pending`.
- Admin Drivers manager: list, filter by status, approve/reject, edit profile, assign unique **referral code** (auto-generated, e.g. `EP-XXXX`), reset tier.
- Driver auth (optional, phase 2b): phone/email login → driver portal at `/driver` showing profile, sales, commissions earned, referrals, tier progress.

### Phase 3 — Sales Commission Tracking

- New `driver_sales` table: driver_id, amount, source (`charging` | `restaurant` | `coffee` | `manual`), reference (order id), recorded_by, occurred_at.
- POS/admin "Record Sale" form lets staff attribute a sale to a driver (search by code/name/vehicle).
- Server-side function computes commission per sale using tiers from brochure (Rs.125 / 250 / 500 / 500+meal). Stored on the row + aggregated.
- `commission_payouts` table: status `pending` → `paid`, with payout date and admin note. Admin payout report with CSV export.

### Phase 4 — Referral Bonus

- `referrals` table: referrer_id, referred_id, status, bonus_awarded_at.
- On driver registration, optional "Referred by code" field.
- Trigger: when a referred driver's lifetime sales cross **Rs. 5,000+** (brochure threshold — note: brochure also says Rs. 7,500+; will confirm with you), insert Rs.100 bonus payout for referrer.

### Phase 5 — EV Chalak Club & Leaderboard

- Tier rules (visit-count based per brochure): 10 visits → Silver (10% off), 25 → Gold (25% off), 50 → Platinum (50% off). Tier recomputed via DB function after each sale.
- `driver_visits` increment on each recorded sale (or explicit check-in).
- Leaderboard section on `/community` (top 10 by visits / sales / referrals — tabbed).
- Discount surfaces: shown on driver card, applied at POS when staff selects driver on an order (POS discount integration).

---

### Technical / Database

```text
drivers(id, user_id?, full_name, phone, phone_masked, vehicle_number,
        vehicle_model, driver_photo_url, vehicle_photo_url,
        referral_code UNIQUE, referred_by_code,
        status: pending|approved|rejected,
        public_consent bool, visit_count int, lifetime_sales numeric,
        tier: none|silver|gold|platinum, created_at, updated_at)

driver_sales(id, driver_id, amount, source, reference, commission_amount,
             includes_meal bool, recorded_by, occurred_at)

commission_payouts(id, driver_id, amount, includes_meal, status,
                   paid_at, note, created_at)

referrals(id, referrer_driver_id, referred_driver_id, status,
          bonus_amount, bonus_paid_at)
```

- RLS: anon → only the `public_support_partners` view (masked phone, approved + consented). Authenticated drivers → their own rows. POS staff (`is_pos_staff()`) → full read/write on sales/payouts. Admin tab gated like other admin managers.
- Storage: two public buckets, admin-only write policies (mirrors existing `menu-items` / `contacts` pattern).
- Tier + commission logic in `SECURITY DEFINER` functions with `SET search_path = ''`, invoked via triggers on `driver_sales`.
- Phone privacy: stored plain (admin-only), masked in the public view.

### Open questions before I start

1. Brochure shows both **Rs. 5,000+** and **Rs. 7,500+** as the top commission/referral threshold — which is correct?
2. Should drivers have their own login (portal at `/driver`), or is everything admin-managed for now?
3. Should the POS automatically apply the tier discount, or just display it for staff to apply manually?
4. Confirm: build all 5 phases now, or ship Phase 1 (Community Page + admin) first and iterate?

I'll wait for your answers before creating migrations or code.