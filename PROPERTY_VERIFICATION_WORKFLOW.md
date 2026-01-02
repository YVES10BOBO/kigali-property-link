# 🛡️ Property Verification & Availability Workflow

## 🎯 Your Requirements (Clear Goals)

1. ✅ **Owner lists property** → Admin verifies → Property appears on website
2. ✅ **Auto-check availability** → If owner doesn't confirm → Hide property
3. ✅ **Prevent stale listings** → Auto-hide if not confirmed as available
4. ✅ **Admin approval** → Only verified, real properties shown
5. ✅ **Anti-fake + Anti-stale** → Always accurate information

---

## 📋 Complete Workflow System

### **Step 1: Owner Lists Property** 🏠
**What happens:**
1. Owner registers/logs in
2. Owner fills property form:
   - Title, description, price, location
   - Bedrooms, bathrooms, area
   - Features, amenities
   - Uploads photos (their own)
   - Sets initial status: "Available"
3. Owner submits property
4. Property status: **"Pending Approval"** (hidden from public)

**System Action:**
- ✅ Property saved to database
- ✅ Status: `pending_approval`
- ✅ Not visible to public
- ✅ Admin notified (email)

---

### **Step 2: Admin Reviews & Verifies** ✅
**What happens:**
1. Admin sees property in "Pending Approval" queue
2. Admin reviews:
   - Property information (complete?)
   - Photos (original? quality?)
   - Ownership documents (if uploaded)
   - Contact information
3. Admin actions:
   - **Approve** → Property becomes "Available" (visible)
   - **Reject** → Property stays hidden, owner notified
   - **Request Changes** → Send back to owner for edits

**System Action:**
- ✅ If approved: Status → `available` (visible to public)
- ✅ If rejected: Status → `rejected` (hidden, owner notified)
- ✅ If changes needed: Status → `needs_revision` (owner can edit)

---

### **Step 3: Property Goes Live** 🌐
**What happens:**
1. Approved property appears on website
2. Clients can view, search, inquire
3. Owner can manage property (edit, update status)

**System Action:**
- ✅ Property visible in search results
- ✅ Property detail page accessible
- ✅ Inquiry form active
- ✅ Owner can update status anytime

---

### **Step 4: Availability Confirmation System** ⏰ (Anti-Stale)
**What happens:**
1. **Every 30 days** (or custom period), system sends email to owner:
   - "Is your property still available?"
   - Link to confirm: "Yes, Still Available" or "No, Sold/Rented"
2. Owner responds:
   - **Confirms Available** → Status stays `available`
   - **Marks Sold/Rented** → Status → `sold` or `rented` (auto-hide)
   - **No Response** → After 7 days → Status → `unverified` (auto-hide)

**System Action:**
- ✅ If confirmed: Status remains `available`, reset confirmation timer
- ✅ If sold/rented: Status → `sold`/`rented`, hidden from public
- ✅ If no response: Status → `unverified`, hidden from public
- ✅ Owner can manually update status anytime

---

### **Step 5: Auto-Hide Unverified/Stale Properties** 🚫
**What happens:**
1. System checks property status daily
2. Properties with status:
   - `sold` → Hidden from public
   - `rented` → Hidden from public
   - `unverified` → Hidden from public (not confirmed)
   - `pending_approval` → Hidden from public
   - `rejected` → Hidden from public
3. Only `available` properties shown to clients

**System Action:**
- ✅ Public search only shows `available` properties
- ✅ Sold/rented properties archived (not deleted)
- ✅ Unverified properties hidden until owner confirms
- ✅ Owner can reactivate by confirming availability

---

## 🔄 Complete Status Flow

```
Owner Lists Property
        ↓
[Pending Approval] ← Admin reviews
        ↓
   [Approved] → [Available] ← Visible to public
        ↓                    ↓
   [Rejected]          [Owner Updates]
        ↓                    ↓
   [Hidden]        [Sold/Rented] → [Hidden]
                          ↓
                   [Unverified] → [Hidden]
                          ↓
              (After 30 days, confirmation email)
                          ↓
              [Confirmed Available] → [Available]
              [No Response] → [Unverified] → [Hidden]
```

---

## 📊 Status Types & Visibility

| Status | Visible to Public? | Owner Can Update? | Auto-Hide? |
|--------|-------------------|-------------------|------------|
| `pending_approval` | ❌ No | ❌ No (admin only) | ✅ Yes |
| `available` | ✅ Yes | ✅ Yes | ❌ No |
| `reserved` | ⚠️ Maybe (optional) | ✅ Yes | ❌ No |
| `sold` | ❌ No | ✅ Yes | ✅ Yes |
| `rented` | ❌ No | ✅ Yes | ✅ Yes |
| `unverified` | ❌ No | ✅ Yes | ✅ Yes |
| `rejected` | ❌ No | ✅ Yes (can resubmit) | ✅ Yes |
| `needs_revision` | ❌ No | ✅ Yes | ✅ Yes |

---

## 🛡️ Protection Mechanisms

### **1. Anti-Fake Protection** 🚫
**How it works:**
- ✅ Admin approval required (all properties)
- ✅ Ownership document upload (optional but recommended)
- ✅ Photo verification (original, quality check)
- ✅ Information completeness check
- ✅ Rejection system for suspicious listings

**Result:** Only real, verified properties shown

---

### **2. Anti-Stale Protection** ⏰
**How it works:**
- ✅ Periodic confirmation emails (every 30 days)
- ✅ Auto-hide if not confirmed (after 7 days)
- ✅ Owner can manually update status anytime
- ✅ Status change notifications
- ✅ Archive sold/rented properties

**Result:** Always accurate availability

---

### **3. Auto-Hide System** 🔒
**How it works:**
- ✅ Only `available` properties in public search
- ✅ All other statuses hidden automatically
- ✅ Owner can reactivate by confirming
- ✅ Admin can override if needed

**Result:** Clients only see available properties

---

## 🎯 Implementation Features Needed

### **1. Property Status Management**
- Status field in database
- Status options (enum)
- Status change history
- Status-based filtering

### **2. Admin Approval Dashboard**
- Pending properties queue
- Review interface
- Approve/reject actions
- Request changes option

### **3. Availability Confirmation System**
- Scheduled email reminders (cron job)
- Confirmation link in email
- Response tracking
- Auto-status update

### **4. Auto-Hide Logic**
- Filter by status in API
- Only show `available` to public
- Archive sold/rented
- Reactivation system

### **5. Owner Dashboard**
- View property status
- Update status manually
- Respond to confirmation emails
- Edit property details

### **6. Email Notifications**
- New property pending (admin)
- Property approved/rejected (owner)
- Availability confirmation (owner)
- Status change notifications

---

## 📋 Database Schema Updates Needed

### **Properties Table:**
```sql
- status: enum (pending_approval, available, reserved, sold, rented, unverified, rejected, needs_revision)
- last_confirmed_at: timestamp (when owner last confirmed availability)
- confirmation_due_date: timestamp (next confirmation date)
- admin_notes: text (admin review notes)
- rejection_reason: text (if rejected)
```

### **Property Status History Table:**
```sql
- property_id: uuid
- old_status: text
- new_status: text
- changed_by: uuid (user_id)
- changed_at: timestamp
- reason: text
```

---

## 🔔 Email Templates Needed

### **1. Property Pending Approval (Admin)**
```
Subject: New Property Pending Approval

A new property has been submitted and requires your review.
Property: [Title]
Owner: [Name]
View: [Link to admin dashboard]
```

### **2. Property Approved (Owner)**
```
Subject: Your Property Has Been Approved!

Your property "[Title]" has been approved and is now live on our website.
View Property: [Link]
```

### **3. Property Rejected (Owner)**
```
Subject: Property Listing Needs Changes

Your property "[Title]" requires changes before it can be approved.
Reason: [Reason]
Edit Property: [Link]
```

### **4. Availability Confirmation (Owner)**
```
Subject: Confirm Your Property is Still Available

Is your property "[Title]" still available?
- [Yes, Still Available] - [No, Sold/Rented]

If you don't respond within 7 days, your property will be hidden.
```

### **5. Property Auto-Hidden (Owner)**
```
Subject: Your Property Has Been Hidden

Your property "[Title]" has been hidden because availability was not confirmed.
Reactivate: [Link]
```

---

## ✅ Complete Feature Checklist

### **Phase 1: Core Workflow**
- [ ] Property status field (enum)
- [ ] Admin approval dashboard
- [ ] Approve/reject actions
- [ ] Auto-hide logic (only show available)
- [ ] Owner status update

### **Phase 2: Anti-Stale System**
- [ ] Confirmation email system
- [ ] Scheduled reminders (cron)
- [ ] Confirmation response handling
- [ ] Auto-hide unverified
- [ ] Reactivation system

### **Phase 3: Notifications**
- [ ] Email to admin (new property)
- [ ] Email to owner (approved/rejected)
- [ ] Confirmation emails
- [ ] Status change notifications

### **Phase 4: Advanced**
- [ ] Status history tracking
- [ ] Admin notes
- [ ] Rejection reasons
- [ ] Analytics dashboard

---

## 🚀 How It Works (Simple Flow)

### **Owner Side:**
1. Owner lists property → Status: "Pending"
2. Admin approves → Status: "Available" (visible)
3. Every 30 days → Email: "Still available?"
4. Owner confirms → Stays visible
5. Owner marks sold → Status: "Sold" (hidden)
6. No response → Status: "Unverified" (hidden)

### **Admin Side:**
1. See pending properties
2. Review and verify
3. Approve or reject
4. Monitor all properties

### **Client Side:**
1. Search properties
2. Only see "Available" properties
3. No confusion
4. Always accurate

---

## 🎯 What You Get

### **Protection:**
- ✅ Anti-fake (admin approval)
- ✅ Anti-stale (confirmation system)
- ✅ Auto-hide (unavailable properties)
- ✅ Always accurate (verified status)

### **Workflow:**
- ✅ Owner lists → Admin approves → Goes live
- ✅ Periodic confirmation → Auto-hide if not confirmed
- ✅ Owner can update anytime
- ✅ System manages automatically

### **Result:**
- ✅ Professional platform
- ✅ Always accurate
- ✅ No client confusion
- ✅ Legal protection

---

**Ready to implement? I'll build:**
1. Status management system
2. Admin approval dashboard
3. Availability confirmation system
4. Auto-hide logic
5. Email notifications

**Should I start building?** 🚀
