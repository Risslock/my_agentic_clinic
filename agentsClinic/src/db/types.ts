export type Agent = {
  id: string;
  name: string;
  model_type: string;
  status: "active" | "in-treatment" | "discharged";
  presenting_complaints: string | null;
};

export type Ailment = {
  id: string;
  name: string;
  description: string;
};

export type Therapy = {
  id: string;
  name: string;
  description: string;
  instructions: string | null;
};

export type Visit = {
  id: string;
  agent_id: string;
  symptoms: string;
  triage_output: string | null;
  severity: "low" | "medium" | "high" | "critical" | null;
  diagnosis_ailment_ids: string | null;
  prescription: string | null;
  status: "open" | "triaged" | "diagnosed" | "prescribed";
  created_at: string;
};

export type Appointment = {
  id: string;
  agent_id: string;
  therapist_name: string;
  scheduled_at: string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
};
