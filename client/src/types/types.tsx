export interface Language {
  name: string;
  levelName: string;
  score: number; // Allow null for initial values
}

export interface TimeAgoProps {
  timestamp: string;
}

export interface PackageAccepted {
  visible_info: string[];
  position: string | null;
  key: number | null;
  company: string;
  companyId: string;
}

export interface User {
  user_id: string;
  saved_items: string[];
}

export interface Candidate {
  id: string;
  user_id: string;
  password: string;
  email: string;
  associations: string[];
  first_name?: string;
  last_name?: string;
  preferred_title?: string;
  city?: string;
  country?: string;
  cv_reference?: string | null;
  address?: string;
  phone_number?: string;
  notice_period?: string | null;
  job_status?: string;
  preferred_jobs?: string[];
  company_type?: string[];
  matching_jobs?: { [key: string]: any };
  matching_companies?: { [key: string]: any };
  values?: string[];
  skills?: { [key: string]: any }[];
  soft_skills?: string[];
  languages?: { [key: string]: any }[];
  links?: { [key: string]: any }[];
  certificates?: { [key: string]: any }[] | null;
  visible_information?: string[];
  experience?: { [key: string]: any }[] | null;
  visa_status?: string[] | null;
  salary_expectation?: string[] | null;
  possible_work_locations?: string[] | null;
  type_of_work?: string[] | null;
  saved_items?: string[] | null;
  date_created?: string;
  package_requested?: { [key: string]: any }[] | null;
  package_accepted?: PackageAccepted[];
  requested_jobs?: string[] | null;
  initiatives_accepted?: { [key: string]: any }[] | null;
}

export interface EditInputProps<Candidate> {
  visible: boolean;
  setVisible: (arg: boolean) => void;
  setValuesToEdit: (arg: Candidate) => void;
  fieldsToDisplay: string[];
  showModal: () => void;
  onSave?: (arg: Candidate) => void;
  candidate: Candidate;
  fieldKeysToEdit: string[];
}

export interface Company {
  id: string;
  user_id: string;
  password: string;
  email: string;
  associations: string[];
  company_name?: string;
  address?: string;
  logo?: string;
  linkedin_url?: string;
  values?: string[];
  job_types?: string[];
  contact_details?: Record<string, any>;
  kununu_url?: string;
  open_positions?: string[];
  company_size?: string;
  company_type?: string;
  company_description?: string;
  company_culture?: string;
  company_website?: string;
  company_industry?: string[];
  saved_items?: string[];
  shared_candidate_packages?: string[];
  interested_candidates?: object[];
}

export interface Experience {
  role: string;
  industries: string;
  years_of_experience?: string;
}

export interface Job {
  id: string;
  associations: string[];
  company_id: string;
  title?: string;
  description?: string;
  values?: string[];
  skills?: Skill[];
  soft_skills?: string[];
  hiring_process_duration?: string;
  matching_candidates?: { [key: string]: any }[];
  salary?: string[]; // array of 2 strings, min and max salary range
  location_city?: string;
  location_country?: string;
  work_location?: string;
  employment_type?: string;
  date_created?: string;
}

export interface Iniciatives {
  id?: string;
  associations: string[];
  title?: string;
  description?: string;
  skills?: Skill[];
  participants?: string[];
  location_address?: string;
  work_location?: string;
  link: string;
  date_created?: string;
}

export interface Association {
  id: string;
  user_id: string;
  password: string;
  email: string;
  association_name: string;
  logo: string;
  address: string;
  url: string;
  contact_details: {
    [key: string]: any;
  };
  description: string;
  iniciatives: Iniciatives[];
  invites: {
    [key: string]: any;
  }[];
  requests: {
    [key: string]: any;
  }[];
  size: string;
}

export interface Skill {
  skill_name: string;
  skill_id?: string;
  skill_level?: string;
  category?: "hard_skill" | "soft_skill";
}

export interface AllValues {
  name: string;
  id: string;
}

export interface AllSkill {
  name: string;
  id: string;
  category: "hard_skill" | "soft_skill";
}

export interface Section {
  title: string;
  subtitle?: string;
  text?: string;
  subtext?: string;
  icon?: JSX.Element;
  type?: string;
}

export interface Payload {
  name: string;
  user_type: string | null;
  recipient_email: string;
  association_name: string;
}

export interface SendInviteModalProps {
  isOpen: boolean;
  defaultOption: string;
  handleSend: (payload: Payload) => void;
  onClose: () => void;
}

export interface Invite {
  key: number;
  name: string;
  email: string;
  user_type: string;
  expiresIn: string;
}

export interface InvitesComponentProps {
  association: Association;
  callback?: () => void;
}

export interface TableRecord {
  key: string;
  candidate: string;
  candidateId: string;
  project: string;
  associationId: string;
}
