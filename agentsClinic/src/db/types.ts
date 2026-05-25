export type Agent = {
  id: string;
  name: string;
  model_type: string;
  status: string;
  presenting_complaints: string | null;
};

export type Ailment = {
  id: string;
  name: string;
  description: string;
};
