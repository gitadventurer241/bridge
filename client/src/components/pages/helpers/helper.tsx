import { Candidate, Experience, TimeAgoProps } from "../../../types/types";
import React from "react";

const fieldsToDisplayContactInfo = ["Phone number", "Email", "Address"];
const fieldsToDisplayProfile = [
  "First name",
  "Last name",
  "Preferred Title",
  "Job status",
  "City",
  "Country",
];

const allCategories = [
  "Job Preferences",
  "Experience",
  "Skills",
  "Values",
  "Languages",
  "Personal Info",
  "Contact info",
  "Type of jobs",
  "Documents",
];

const companySizes = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5001-10,000",
  "10,001+",
];

const workLocationTypes: string[] = ["Hybrid", "Remote", "On-site"];

const allTypeOfJob: string[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
  "Freelance",
];

const TimeAgo: React.FC<TimeAgoProps> = ({ timestamp }) => {
  const getTimeAgo = (timestampStr: string): string => {
    const timestampDate = new Date(timestampStr);
    const now = new Date();
    const secondsAgo = Math.floor(
      (now.getTime() - timestampDate.getTime()) / 1000
    );
    if (secondsAgo < 60) {
      return `${secondsAgo} second${secondsAgo !== 1 ? "s" : ""} ago`;
    } else if (secondsAgo < 3600) {
      const minutesAgo = Math.floor(secondsAgo / 60);
      return `${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`;
    } else if (secondsAgo < 86400) {
      const hoursAgo = Math.floor(secondsAgo / 3600);
      return `${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;
    } else {
      const daysAgo = Math.floor(secondsAgo / 86400);
      return `${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`;
    }
  };

  return <span>{getTimeAgo(timestamp)}</span>;
};

type FieldCategoryMapping = Record<keyof Candidate, string>;
const fieldCategoryMapping: FieldCategoryMapping = {
  id: "",
  user_id: "",
  password: "",
  email: "Contact info",
  associations: "",
  first_name: "Personal Info",
  last_name: "Personal Info",
  city: "Contact info",
  country: "Contact info",
  cv_reference: "Documents",
  address: "Contact info",
  phone_number: "Contact info",
  notice_period: "Job Preferences",
  job_status: "Personal Info",
  preferred_jobs: "Type of jobs",
  preferred_title: "Profile",
  company_type: "",
  matching_jobs: "",
  matching_companies: "",
  values: "Values",
  skills: "Skills",
  soft_skills: "Skills",
  languages: "Languages",
  links: "Personal Info",
  certificates: "Documents",
  visible_information: "Personal Info",
  experience: "Experience",
  visa_status: "Job Preferences",
  salary_expectation: "Job Preferences",
  possible_work_locations: "Job Preferences",
  type_of_work: "Job Preferences",
  package_requested: "",
  package_accepted: "",
  saved_items: "",
  date_created: "",
  requested_jobs: "",
  initiatives_accepted: "",
};

const categoryFieldMapping: Record<string, number> = {};

const countNullFieldsByCategory = (
  candidate: Candidate,
  allCategories: string[]
) => {
  // Count the number of null fields for each category
  allCategories.forEach((category) => {
    const fieldsForCategory = Object.keys(fieldCategoryMapping).filter(
      (field) =>
        (fieldCategoryMapping as Record<string, string>)[field] === category
    ) as (keyof Candidate)[];

    const totalFieldsForCategory = fieldsForCategory.length;

    const nullFieldsCount = fieldsForCategory?.reduce((count, field) => {
      if (Array.isArray(candidate[field])) {
        if (candidate[field]?.length === 0) {
          // Empty array should be counted as null
          return count + 1;
        }
      } else if (candidate[field] === null) {
        return count + 1;
      }
      return count;
    }, 0);
    // Assign the number of null fields to the category
    categoryFieldMapping[category] = totalFieldsForCategory - nullFieldsCount;
  });

  return categoryFieldMapping;
};

const completedCategories = Object.values(categoryFieldMapping).filter(
  (fraction) => fraction > 0
).length;

const percentage = ({
  completedCategories,
  totalCategories,
}: {
  completedCategories: number;
  totalCategories: number;
}) => {
  const progress = (completedCategories / totalCategories) * 100;
  return Math.round(progress);
};

function transformCandidateDocs(candidate: Candidate) {
  const transformedData = [];

  // Transform CV data
  if (candidate.cv_reference) {
    transformedData.push({ title: "CV", subtext: "", type: "cv" });
  }

  // Transform certificate data
  if (candidate.certificates && Array.isArray(candidate.certificates)) {
    candidate.certificates.forEach((certificate) => {
      const title = "Certificate";
      const subtext = `${certificate.name}`;
      const type = "certificate";
      transformedData.push({ title, subtext, type });
    });
  }

  return transformedData;
}

function transformCandidateJobPref(candidate: Candidate) {
  const sectionsVisibleInfo = [];

  // Transform salary_expectation
  if (
    candidate.salary_expectation &&
    candidate.salary_expectation.length === 2
  ) {
    sectionsVisibleInfo.push({
      title: "Salary bracket",
      subtitle: `CHF ${candidate.salary_expectation[0]} - ${candidate.salary_expectation[1]} CHF`,
    });
  }

  // Transform notice_period
  if (candidate.notice_period) {
    sectionsVisibleInfo.push({
      title: "Notice",
      subtitle: candidate.notice_period,
    });
  }

  // Transform visa_status
  if (candidate.visa_status && candidate.visa_status.length > 0) {
    sectionsVisibleInfo.push({
      title: "Visa Status",
      subtitle: `(${candidate.visa_status.join(
        ") valid visa \n ("
      )}) valid visa`,
    });
  }

  // transform locations
  if (
    candidate.possible_work_locations &&
    candidate.possible_work_locations.length > 0
  ) {
    sectionsVisibleInfo.push({
      title: "Locations",
      subtitle: candidate.possible_work_locations.join(", "),
    });
  }

  if (candidate.type_of_work && candidate.type_of_work.length > 0) {
    sectionsVisibleInfo.push({
      title: "Type of work",
      subtitle: candidate.type_of_work.join(", "),
    });
  }

  return sectionsVisibleInfo;
}

function transformExperience(experience: Experience[]) {
  const sectionsExperience = [];
  let subtext = "";

  if (experience && experience.length > 0) {
    const firstExperience = experience[0];
    if (firstExperience.role) {
      subtext = experience
        .map((exp, index) =>
          index === 0 ? "" : ` ${exp.years_of_experience} in ${exp.role}`
        )
        .join(" ");

      if (experience.length > 1) {
        sectionsExperience.push({
          title: "Roles",
          text: `${firstExperience.years_of_experience} ${firstExperience.role}`,
          subtext: `+ ${subtext},`,
        });
      } else {
        sectionsExperience.push({
          title: "Role",
          text: `${firstExperience.years_of_experience} ${firstExperience.role}`,
        });
      }
    }

    if (firstExperience.industries) {
      subtext = experience
        .map((exp, index) => (index === 0 ? "" : `${exp.industries}`))
        .join(" ");

      if (experience.length > 1) {
        sectionsExperience.push({
          title: "Industries",
          text: `${firstExperience.industries}`,
          subtext: `+ ${subtext},`,
        });
      } else {
        sectionsExperience.push({
          title: "Industry",
          text: `${firstExperience.industries}`,
        });
      }
    }
  }

  return sectionsExperience;
}

export {
  fieldsToDisplayContactInfo,
  fieldsToDisplayProfile,
  allTypeOfJob,
  countNullFieldsByCategory,
  percentage,
  fieldCategoryMapping,
  completedCategories,
  transformCandidateDocs,
  transformCandidateJobPref,
  transformExperience,
  TimeAgo,
  allCategories,
  workLocationTypes,
  companySizes,
};
