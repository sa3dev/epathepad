-- One-time tokens for the "forgot password" flow. Mirrors verification_tokens'
-- shape but kept separate from Auth.js's own table to avoid mixing concerns.
CREATE TABLE password_reset_tokens (
  identifier TEXT NOT NULL,
  token      TEXT NOT NULL UNIQUE,
  expires    TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);
