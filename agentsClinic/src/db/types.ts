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
