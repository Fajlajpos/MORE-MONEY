INSERT INTO "User" ("id", "email", "passwordHash", "name", "role", "tier", "createdAt", "updatedAt", "isActive", "currency", "language", "theme")
VALUES (
  'admin-user-id-123', 
  'filipmayer7@gmail.com', 
  '$2b$12$Qk0V/x6qnjJ4WSCBAcClvO7fyKg45jNss7pAphcEjgwo8x/6hU.Vu',
  'Admin Filip',
  'ADMIN'::"UserRole",
  'PREMIUM_PLUS'::"SubscriptionTier",
  NOW(),
  NOW(),
  true,
  'CZK',
  'cs',
  'system'
)
ON CONFLICT ("email") DO UPDATE SET
  "passwordHash" = EXCLUDED."passwordHash",
  "role" = 'ADMIN'::"UserRole",
  "tier" = 'PREMIUM_PLUS'::"SubscriptionTier";
