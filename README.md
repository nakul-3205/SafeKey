# SafeKey
SafeKey is a zero-knowledge password vault where all sensitive data is encrypted client-side using a user-owned master password.
The backend never sees raw passwords.
The system continuously checks for email breaches (XposedOrNot) and password breaches (HIBP) using hashed / k-anonymity queries, and alerts users via email up to 5 times per breach, unless the user marks it as resolved