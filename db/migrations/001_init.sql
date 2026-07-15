-- Initial schema: users/auth, EHPAD & artist profiles, media, contact requests.
-- gen_random_uuid() is built into Postgres core since v13, no extension needed.

CREATE TABLE users (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT NOT NULL UNIQUE,
  email_verified TIMESTAMPTZ,
  password_hash  TEXT,
  name           TEXT,
  role           TEXT CHECK (role IN ('EHPAD', 'ARTIST')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Required by the Auth.js email/magic-link provider.
CREATE TABLE verification_tokens (
  identifier TEXT NOT NULL,
  token      TEXT NOT NULL UNIQUE,
  expires    TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

CREATE TABLE ehpad_profiles (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  facility_name  TEXT NOT NULL,
  address        TEXT NOT NULL,
  city           TEXT NOT NULL,
  postal_code    TEXT NOT NULL,
  region         TEXT NOT NULL,
  description    TEXT,
  contact_phone  TEXT,
  contact_email  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE artist_profiles (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  stage_name     TEXT NOT NULL,
  bio            TEXT,
  discipline     TEXT NOT NULL CHECK (
    discipline IN ('MUSIC', 'DANCE', 'THEATER', 'MAGIC', 'CIRCUS', 'STORYTELLING', 'OTHER')
  ),
  regions_served TEXT[] NOT NULL DEFAULT '{}',
  contact_phone  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_artist_profiles_discipline ON artist_profiles (discipline);
CREATE INDEX idx_artist_profiles_regions_served ON artist_profiles USING GIN (regions_served);

CREATE TABLE media (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_profile_id UUID NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
  url               TEXT NOT NULL,
  type              TEXT NOT NULL CHECK (type IN ('IMAGE', 'VIDEO')),
  "order"           INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_artist_profile_id ON media (artist_profile_id);

CREATE TABLE contact_requests (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ehpad_profile_id  UUID NOT NULL REFERENCES ehpad_profiles(id) ON DELETE CASCADE,
  artist_profile_id UUID NOT NULL REFERENCES artist_profiles(id) ON DELETE CASCADE,
  message           TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'DECLINED')),
  artist_reply      TEXT,
  responded_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_requests_ehpad_profile_id ON contact_requests (ehpad_profile_id);
CREATE INDEX idx_contact_requests_artist_profile_id ON contact_requests (artist_profile_id, status);
