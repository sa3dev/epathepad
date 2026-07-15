import type { Discipline } from "@/lib/constants/disciplines";

export type UserRole = "EHPAD" | "ARTIST";

export interface User {
  id: string;
  email: string;
  emailVerified: Date | null;
  passwordHash: string | null;
  name: string | null;
  role: UserRole | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EhpadProfile {
  id: string;
  userId: string;
  facilityName: string;
  address: string;
  city: string;
  postalCode: string;
  region: string;
  description: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtistProfile {
  id: string;
  userId: string;
  stageName: string;
  bio: string | null;
  discipline: Discipline;
  regionsServed: string[];
  contactPhone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type MediaType = "IMAGE" | "VIDEO";

export interface Media {
  id: string;
  artistProfileId: string;
  url: string;
  type: MediaType;
  order: number;
  createdAt: Date;
}

export type ContactRequestStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface ContactRequest {
  id: string;
  ehpadProfileId: string;
  artistProfileId: string;
  message: string;
  status: ContactRequestStatus;
  artistReply: string | null;
  respondedAt: Date | null;
  createdAt: Date;
}
