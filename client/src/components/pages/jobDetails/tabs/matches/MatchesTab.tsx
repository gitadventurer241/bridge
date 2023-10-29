import { Job } from "../../../../../types/types";
import { useNavigate } from "react-router-dom";
import { CandidateCard } from "../../../../shared/CandidateCard/CandidateCard";

import styling from "./MatchesTab.module.css";
import { getAllCandidates } from "../../../../../api/candidates";
import { useEffect, useState } from "react";

interface Props {
  job: Job;
}

const JobMatchesTab: React.FC<Props> = ({ job }) => {
  const navigate = useNavigate();

  const [allCandidates, setAllCandidates] = useState([]);

  const fetchCandidates = async () => {
    const candidates = await getAllCandidates();
    setAllCandidates(candidates);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Match candidates from matchingCandidates with allCandidates
  const matchingCandidates = allCandidates.filter((candidate: any) => {
    return job?.matching_candidates?.some((matchedCandidate) => {
      return candidate?.user_id === matchedCandidate?.id;
    });
  });

  return (
    <div className={styling.main}>
      {matchingCandidates.length > 0 ? (
        <>
          <h1>Matches</h1>
          {matchingCandidates?.map((job: object, index: number) => (
            <div key={index}></div>
          ))}
          <div className={styling.cardContainer}>
            {matchingCandidates &&
              matchingCandidates?.map((candidate: any) => (
                <CandidateCard
                  key={candidate?.id}
                  candidate={candidate}
                  header={candidate?.preferred_title}
                  subheader={candidate?.job_status}
                  skills={candidate?.skills}
                  values={candidate?.values}
                  associations={candidate?.associations}
                  onClickRedirect={() =>
                    navigate(`/candidate/${candidate?.user_id}`)
                  }
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

export default JobMatchesTab;
