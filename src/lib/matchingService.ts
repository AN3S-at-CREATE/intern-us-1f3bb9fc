import type { Database } from '@/integrations/supabase/types';

type StudentProfile = Partial<Database['public']['Tables']['student_profiles']['Row']> & {
  skills?: string[];
  experience?: string;
  languages?: string[];
  language?: string | string[];
};

type Opportunity = Partial<Database['public']['Tables']['opportunities']['Row']>;

export interface NormalizedDemographics {
  province: string | null;
  languages: string[];
  genderProxy: string | null;
}

export interface FeatureLog {
  removedFields: string[];
  normalized: NormalizedDemographics;
  blindMatchEnforced: boolean;
  notes: string[];
}

export interface BiasAssessment {
  risk: 'low' | 'medium' | 'high';
  dimensions: NormalizedDemographics;
  flags: string[];
}

interface MatchRequestPayload {
  studentProfile: Record<string, unknown>;
  opportunity: Opportunity;
  normalizedDemographics: NormalizedDemographics;
  featureLog: FeatureLog;
  biasAssessment: BiasAssessment;
  blindMatchEnforced: boolean;
}

const PROVINCE_MAP: Record<string, string> = {
  'gp': 'Gauteng',
  'gauteng': 'Gauteng',
  'wc': 'Western Cape',
  'western cape': 'Western Cape',
  'kzn': 'KwaZulu-Natal',
  'kwazulu natal': 'KwaZulu-Natal',
  'kwa zulu natal': 'KwaZulu-Natal',
  'ec': 'Eastern Cape',
  'eastern cape': 'Eastern Cape',
  'nc': 'Northern Cape',
  'northern cape': 'Northern Cape',
  'nw': 'North West',
  'north west': 'North West',
  'fs': 'Free State',
  'free state': 'Free State',
  'lp': 'Limpopo',
  'limpopo': 'Limpopo',
  'mp': 'Mpumalanga',
  'mpumalanga': 'Mpumalanga',
};

const LANGUAGE_MAP: Record<string, string> = {
  'english': 'English',
  'isiZulu': 'isiZulu',
  'zulu': 'isiZulu',
  'isiXhosa': 'isiXhosa',
  'xhosa': 'isiXhosa',
  'afrikaans': 'Afrikaans',
  'sesotho': 'Sesotho',
  'setswana': 'Setswana',
  'sepedi': 'Sepedi',
  'tshivenda': 'Tshivenda',
  'xitsonga': 'Xitsonga',
  'siswati': 'SiSwati',
  'swati': 'SiSwati',
  'isindebele': 'isiNdebele',
  'ndebele': 'isiNdebele',
  'seped': 'Sepedi',
};

export const normalizeProvince = (province?: string | null): string | null => {
  if (!province) return null;
  const key = province.toLowerCase().trim();
  return PROVINCE_MAP[key] || province.trim();
};

export const normalizeLanguages = (languages?: string[] | string | null): string[] => {
  if (!languages) return [];
  const list = Array.isArray(languages) ? languages : languages.split(',');
  return list
    .map((lang) => lang.trim())
    .filter(Boolean)
    .map((lang) => LANGUAGE_MAP[lang.toLowerCase()] || lang)
    .filter((lang, index, arr) => arr.indexOf(lang) === index);
};

export const stripPII = (profile: StudentProfile, blindMatchEnforced: boolean): Record<string, unknown> => {
  const { id_number, linkedin_url, cv_url, portfolio_url, date_of_birth, race, nationality, user_id, ...rest } = profile;
  const sanitized: Record<string, unknown> = {
    field_of_study: rest.field_of_study,
    qualification: rest.qualification,
    institution: rest.institution,
    location: rest.location,
    skills: rest.skills || [],
    experience: rest.experience || rest.bio,
    headline: rest.headline,
    year_of_study: rest.year_of_study,
  };

  if (blindMatchEnforced) {
    sanitized.location = normalizeProvince(typeof rest.location === 'string' ? rest.location : null);
    sanitized.headline = rest.headline ? 'Blind profile enabled' : null;
  }

  return sanitized;
};

export const assessBias = (demographics: NormalizedDemographics): BiasAssessment => {
  const flags: string[] = [];
  if (!demographics.province) flags.push('province_missing');
  if (demographics.languages.length === 0) flags.push('language_missing');
  if (!demographics.genderProxy) flags.push('gender_proxy_missing');

  const risk = flags.length >= 2 ? 'high' : flags.length === 1 ? 'medium' : 'low';

  return {
    risk,
    dimensions: demographics,
    flags,
  };
};

export const buildMatchRequestPayload = (
  studentProfile: StudentProfile,
  opportunity: Opportunity,
  options: { blindMatchMode?: boolean }
): MatchRequestPayload => {
  const blindMatchEnforced = Boolean(options.blindMatchMode);
  const languagesField = Array.isArray(studentProfile.languages)
    ? studentProfile.languages
    : Array.isArray(studentProfile.language)
      ? studentProfile.language
      : studentProfile.language
        ? [studentProfile.language]
        : [];
  const normalized: NormalizedDemographics = {
    province: normalizeProvince(studentProfile.location || null),
    languages: normalizeLanguages(languagesField),
    genderProxy: studentProfile.gender ? studentProfile.gender.toLowerCase() : null,
  };

  const featureLog: FeatureLog = {
    removedFields: ['id_number', 'linkedin_url', 'cv_url', 'portfolio_url', 'date_of_birth', 'race', 'nationality', 'user_id'],
    normalized,
    blindMatchEnforced,
    notes: [
      'PII stripped before scoring',
      normalized.province ? `Province normalized to ${normalized.province}` : 'Province missing',
      normalized.languages.length > 0 ? `Languages normalized (${normalized.languages.join(', ')})` : 'Languages missing',
    ],
  };

  const biasAssessment = assessBias(normalized);
  const sanitizedProfile = stripPII(studentProfile, blindMatchEnforced);

  return {
    studentProfile: sanitizedProfile,
    opportunity,
    normalizedDemographics: normalized,
    featureLog,
    biasAssessment,
    blindMatchEnforced,
  };
};

export type MatchRequest = ReturnType<typeof buildMatchRequestPayload>;
