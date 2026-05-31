# NP Account Management & Password Reset Feature

## Overview

The **Account Management tab** in the NP Dashboard allows Derrick (the nurse practitioner) to manage family member credentials and reset passwords if family members forget theirs.

This is a critical **account security feature** that balances usability (family members can regain access) with safety (NP maintains control, cannot reset own password to prevent lockout).

---

## Feature Location

**Tab Name:** 🔐 Account Management  
**Access:** NP Demo View → Click "Account Management" tab  
**Role:** Derrick (NP) only  
**Visibility:** Family members cannot see this tab

---

## Password Reset Management Section

### Three Family Member Cards

Each family member has a card showing:

#### **1. Derrick (You) - DISABLED**

**Status:** 🔒 Locked (Cannot Reset Self)

**Card Details:**
- Name: "👨‍⚕️ Derrick (You)"
- Last password change: May 20, 2026
- Button: "🔒 Cannot Reset Self" (grayed out, disabled)

**Reason for Disabling Self-Reset:**
- **Prevents NP lockout:** If NP accidentally resets own password and emails fail, they're locked out
- **Security best practice:** NP should use "Forgot Password" link on login screen for self-reset
- **Enforces hierarchy:** Admin cannot lock themselves out through account management tools

**What NP Should Do If They Forget Password:**
1. Go back to login screen
2. Click "Forgot Password" link
3. Verify identity via email recovery
4. Reset password securely

---

#### **2. [Wife's Name] - ENABLED**

**Status:** ✅ Can Reset Password

**Card Details:**
- Name: "👩 [Wife's Name]"
- Email: wife@example.com
- Last login: May 28, 2026
- Button: "🔑 Send Reset Link" (purple, clickable)

**How It Works:**
1. NP clicks "Send Reset Link"
2. System generates secure reset token (expires in 24 hours)
3. Email sent to wife@example.com with reset link
4. Wife clicks link, creates new password
5. System logs action with timestamp: "Reset link sent to wife@example.com • May 25, 2026 • 10:30 AM"

**Example Alert (Demo):**
```
Password reset link sent to wife@example.com

In production, this would:
1. Generate a secure reset token
2. Send reset link via email
3. Log the reset action with timestamp
4. Expire link after 24 hours
```

---

#### **3. [Child's Name] - ENABLED**

**Status:** ✅ Can Reset Password

**Card Details:**
- Name: "👧 [Child's Name]"
- Email: child@example.com
- Last login: Today at 2:15 PM
- Button: "🔑 Send Reset Link" (emerald, clickable)

**How It Works:**
Same as wife's reset, but for child's account.

**Parental Consideration:**
- NP resets child's password after initial account setup if child forgets
- Reset link goes to child's email
- Child is responsible for choosing new strong password
- May want to discuss with child first before initiating reset

---

## Recent Password Reset Activity Log

Shows history of all password reset actions for compliance and security audit:

| Action | User | Timestamp |
|--------|------|-----------|
| Reset link sent to wife@example.com | Derrick (NP) | May 25, 2026 • 10:30 AM |
| Reset link sent to child@example.com | Derrick (NP) | May 15, 2026 • 3:45 PM |
| Password reset by child@example.com (successfully) | Child | May 15, 2026 • 4:20 PM |

**Why This Matters:**
- **Audit Trail:** Shows who initiated reset and when
- **Compliance:** Meets HIPAA/security requirements for credential change logging
- **Troubleshooting:** If someone claims they didn't request a reset, you have evidence
- **Security:** Detects unauthorized reset attempts

---

## Security Best Practices Section

**Display:**
```
🔒 Security Best Practices

✓ Reset links expire after 24 hours for security
✓ All password reset actions are logged with timestamp
✓ Family members receive email confirmation of reset request
✓ You (NP) cannot reset your own password through this interface
✓ Two-factor authentication recommended for NP accounts
```

**Meaning of Each:**

1. **Reset links expire after 24 hours**
   - If email intercepted, attacker can't use old link
   - Family member loses access if they don't reset within 24 hours
   - Must request another reset (generating audit trail)

2. **All password reset actions are logged with timestamp**
   - Prevents someone from denying they requested reset
   - Shows exactly when reset was initiated
   - Helps identify suspicious activity

3. **Family members receive email confirmation of reset request**
   - If spouse sees reset email they didn't request, they know account is compromised
   - Creates additional security check

4. **You (NP) cannot reset your own password through this interface**
   - Prevents accidental lockout
   - Forces use of official "Forgot Password" flow for NP
   - Ensures proper identity verification for NP account recovery

5. **Two-factor authentication recommended for NP accounts**
   - Extra security layer for clinical decision-making account
   - Prevents unauthorized access even if password is compromised
   - Typical: SMS code or authenticator app required on login

---

## Production Implementation Details

### Backend Requirements

**Password Reset Workflow:**

```
1. NP clicks "Send Reset Link"
   ↓
2. System generates:
   - Random secure token (e.g., 32-char alphanumeric)
   - Expiration time (24 hours from now)
   - Timestamp of request
   ↓
3. Store in database:
   - user_id
   - reset_token (hashed)
   - token_expiration
   - created_at
   - created_by (Derrick's NP ID)
   ↓
4. Send email to family member:
   - Subject: "Password Reset Request"
   - Body: "Click link to reset password: https://yourapp.com/reset?token=<token>"
   - "Link expires in 24 hours"
   ↓
5. Log action:
   - User: Derrick (NP)
   - Action: "password_reset_initiated"
   - Target: wife@example.com
   - Timestamp: May 25, 2026 • 10:30 AM
   ↓
6. Family member receives email
   ↓
7. Clicks link → system validates token
   - Is token in database?
   - Has token expired?
   ↓
8. If valid: redirect to password reset form
   - Enter new password
   - Submit
   - Hash new password
   - Delete reset token (one-time use)
   - Log successful reset
   ↓
9. Send confirmation email:
   - "Your password was reset on May 25, 2026"
   - If not requested by you, contact support
```

### Database Schema

```sql
-- Reset tokens table
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  reset_token VARCHAR(255) NOT NULL UNIQUE,
  token_expiration TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID NOT NULL,  -- NP who initiated reset
  used_at TIMESTAMP,         -- When reset was completed
  status ENUM('pending', 'used', 'expired') DEFAULT 'pending'
);

-- Audit log
CREATE TABLE account_activity_log (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  action VARCHAR(100) NOT NULL,  -- 'password_reset_initiated', 'password_changed', etc.
  initiated_by UUID,             -- Who initiated (NP) or null if self-initiated
  timestamp TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT
);
```

### Security Considerations

1. **Token Generation:**
   - Use cryptographically secure random generator
   - 32+ character tokens (no easy guessing)
   - Hash tokens before storing in database (hash tokens like passwords)

2. **Email Security:**
   - Use HTTPS-only links
   - Domain should be verified
   - Include "do not click if unsolicited" warning

3. **Rate Limiting:**
   - Limit reset requests: max 3 per day per user
   - Prevents spam/abuse
   - Log repeated requests for fraud detection

4. **Password Requirements:**
   - Minimum 12 characters (recommended for healthcare)
   - Mix of uppercase, lowercase, numbers, symbols
   - No reuse of last 5 passwords
   - Password expires every 90 days (depending on facility policy)

5. **Logging:**
   - Log EVERY reset request (even failed ones)
   - Include: who initiated, who was affected, timestamp, IP address
   - Retain logs for 2+ years (HIPAA requirement)

6. **Notification:**
   - Send confirmation email after successful reset
   - Include: when reset happened, IP address, device type
   - Include: "If this wasn't you, click here to report"

---

## Dark Mode Support

**Password reset section fully supports dark mode:**
- Card backgrounds adjust (slate-700 in dark, slate-50 in light)
- Text colors optimized for readability
- Button colors adapt (purple, emerald for family members)
- All text maintains sufficient contrast

---

## User Flows

### Scenario 1: Wife Forgets Password

**Wife's Actions:**
1. Goes to login screen
2. Clicks "Forgot Password"
3. Receives reset email

**OR NP Proactively Resets:**
1. NP opens NP Dashboard
2. Clicks "Account Management" tab
3. Under "Wife's Name", clicks "🔑 Send Reset Link"
4. Email sent to wife@example.com
5. Wife receives email, clicks link, sets new password

**Why NP Might Do This:**
- Wife locked out, needs access urgently
- Wife doesn't see "Forgot Password" link
- NP proactively managing accounts after password expiration

---

### Scenario 2: Child Account Compromised

**What Happened:**
- Child account accessed by unauthorized person
- NP suspects password was shared or guessed

**NP Actions:**
1. Go to Account Management tab
2. Find "[Child's Name]" card
3. Click "🔑 Send Reset Link"
4. Email sent to child@example.com
5. NP notifies child: "Your password has been reset. Check your email for a new link."
6. Child creates strong new password
7. NP documents in Account Activity Log that reset was due to security concern

**Result:**
- Old password is no longer valid
- Unauthorized person locked out
- Audit trail shows reason for reset

---

### Scenario 3: New Family Member Gets Access

**Setup Flow:**
1. Wife creates login credentials for new phone
2. Forgets password after setup
3. NP sends reset link
4. Wife uses link to create permanent password
5. New device can now log in

---

## Audit & Compliance

### What Gets Logged

```
Timestamp | Action | Initiated By | Target User | Result | Notes
----------|--------|--------------|-------------|--------|-------
May 25, 10:30 AM | Password reset initiated | Derrick (NP) | wife@example.com | Email sent | Initial reset request
May 25, 10:45 AM | Password reset completed | wife@example.com | wife@example.com | Success | New password set
May 28, 2:15 PM | Password reset initiated | Derrick (NP) | child@example.com | Email sent | Account reset after device loss
May 28, 2:30 PM | Password reset failed | child@example.com | child@example.com | Token expired | Link was older than 24 hours
May 28, 2:31 PM | Password reset initiated | Derrick (NP) | child@example.com | Email sent | New reset request after expiration
```

### HIPAA Compliance

✅ **This feature helps meet HIPAA requirements:**
- **Audit trails:** Every credential change is logged
- **Access control:** Only NP can manage family credentials
- **User accountability:** System knows who reset which account
- **Incident response:** Can prove password was reset if unauthorized access suspected
- **Data retention:** Logs kept for minimum 6 years per HIPAA

---

## Troubleshooting

**Problem: Family member says they didn't request reset**
- **Check logs:** See exactly when reset was initiated
- **Check email:** Confirm reset email was sent
- **Action:** If unauthorized reset detected, investigate for compromised NP account

**Problem: Family member didn't receive reset email**
- **Check email on file:** Is it correct in system?
- **Check spam:** Might be filtered
- **Resend:** NP can send another reset link
- **Alternative:** NP can log in with temporary password until email is fixed

**Problem: Reset link expired before family member used it**
- **Resolution:** NP resends reset link (generates new 24-hour token)
- **Limit:** Not more than 3-5 times in 24 hours (fraud prevention)

**Problem: NP locked themselves out**
- **Cannot use:** Account Management tab (self-reset disabled)
- **Solution:** Use "Forgot Password" on login screen
- **Contact:** Support if email recovery doesn't work

---

## Future Enhancements

**Phase 2:**
- SMS reset option (text code instead of email)
- Security questions as backup authentication
- Password strength meter during reset

**Phase 3:**
- Biometric unlock for family members (fingerprint, Face ID)
- Single Sign-On (SSO) with hospital system
- Multi-factor authentication (MFA) for all users

**Phase 4:**
- Role-based password policies (NP = 12+ chars, longer expiration; Child = 8+ chars)
- Automated password expiration notifications
- Passwordless authentication (FIDO2 keys)

---

## Summary

The **Account Management tab** provides:
✅ Safe password reset for family members  
✅ NP maintains control (cannot reset self)  
✅ Complete audit trail of all resets  
✅ Email confirmation and 24-hour token expiration  
✅ HIPAA-compliant logging  
✅ Security best practices displayed to NP  
✅ Dark mode support  

This ensures **family members can regain access if needed** while maintaining **NP oversight and accountability** for credential management.
