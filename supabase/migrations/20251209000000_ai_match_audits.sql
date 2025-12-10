create table if not exists ai_match_audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  student_id uuid,
  opportunity_id uuid,
  blind_match_enforced boolean default false,
  province text,
  languages text[],
  gender_proxy text,
  feature_log jsonb,
  bias_assessment jsonb,
  match_score integer,
  decision_notes text
);

comment on table ai_match_audits is 'Audit log for AI match scoring requests and decisions';
comment on column ai_match_audits.feature_log is 'Sanitized feature log shared with scoring service';
comment on column ai_match_audits.bias_assessment is 'Bias evaluation metadata per request';
