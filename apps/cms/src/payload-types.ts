/* tslint:disable */
/**
 * This file was automatically generated by Payload CMS.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "overview".
 */
export interface Overview {
  id: string;
  launches: number;
  successes: number;
  rocketModels: number;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "member_groups".
 */
export interface MemberGroups {
  id: string;
  groups?: {
    name: string;
    members: {
      member: string | User;
      title?: string;
      id?: string;
    }[];
    id?: string;
  }[];
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  email?: string;
  resetPasswordToken?: string;
  resetPasswordExpiration?: string;
  enableAPIKey?: boolean;
  apiKey?: string;
  apiKeyIndex?: string;
  loginAttempts?: number;
  lockUntil?: string;
  name: string;
  profilePhoto?: string | Media;
  admin?: boolean;
  bio?: {
    [k: string]: unknown;
  }[];
  linkedin?: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  url?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  ref?: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "team_groups".
 */
export interface TeamGroups {
  id: string;
  groups?: {
    name: string;
    urlName: string;
    teams: {
      team: string | Team;
      id?: string;
    }[];
    id?: string;
  }[];
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "teams".
 */
export interface Team {
  id: string;
  name: string;
  urlName: string;
  shortDescription?: string;
  description?: {
    [k: string]: unknown;
  }[];
  coverImage?: string | Media;
  members?: {
    user: string | User;
    title?: string;
    allowEdit?: boolean;
    id?: string;
  }[];
  projects?: {
    name: string;
    start: string;
    end: string;
    id?: string;
  }[];
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "sponsors".
 */
export interface Sponsors {
  id: string;
  tiers?: {
    name: string;
    logoHeight: number;
    sponsors?: {
      url: string;
      logo: string | Media;
      id?: string;
    }[];
    id?: string;
  }[];
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "recruitment".
 */
export interface Recruitment {
  id: string;
  positions?: {
    name: string;
    url: string;
    description: {
      [k: string]: unknown;
    }[];
    id?: string;
  }[];
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "blogs".
 */
export interface Blog {
  id: string;
  title: string;
  coverImage?: string | Media;
  summary: {
    [k: string]: unknown;
  }[];
  content: {
    [k: string]: unknown;
  }[];
  authors?: {
    user: string | User;
    id?: string;
  }[];
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "messages".
 */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  recaptchaScore: number;
  emailSent: boolean;
}
