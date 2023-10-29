import styling from "./CandidateMatchesTab.module.css";

import { Candidate, Company, Job } from "../../../../../types/types";
import { JobCard } from "../../../../shared/jobCard/JobCard";
import { useNavigate } from "react-router-dom";

interface Props {
  candidate: Candidate;
  companies: Company[];
  matchingJobs: Job[];
}

const CandidateMatchesTab: React.FC<Props> = ({
  candidate,
  companies,
  matchingJobs,
}) => {
  const navigate = useNavigate();
  return (
    <div className={styling.main}>
      {matchingJobs?.length > 0 ? (
        <>
          <h1>Matches</h1>
          {matchingJobs?.map((job, index) => (
            <div key={index}></div>
          ))}
          <div className={styling.cardContainer}>
            {matchingJobs &&
              matchingJobs?.map((job) => (
                <JobCard
                  key={job?.id}
                  job={job}
                  companies={companies}
                  candidate={candidate}
                  onClick={() => navigate(`/job/${job?.id}`)}
                  isMatchVisible={true}
                />
              ))}
          </div>
        </>
      ) : (
        <h1>Ooops, no matches found!</h1>
      )}
    </div>
  );
};

export { CandidateMatchesTab };
