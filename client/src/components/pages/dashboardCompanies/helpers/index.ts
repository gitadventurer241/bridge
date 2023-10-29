/* eslint-disable */
export const getMatchingCandidatesInfo = (jobData: any, candidateData: any) => {
  const resultArray: any = [];

  jobData?.forEach((job: any) => {
    if (!job) {
      return;
    }
    const jobId = job?.id;
    const jobTitle = job?.title;

    job?.matching_candidates?.forEach((matchingCandidate: any) => {
      const matchedCandidate = candidateData?.filter(
        (candidate: any) => candidate?.user_id === matchingCandidate?.id
      );

      if (matchedCandidate) {
        const candidateId = matchedCandidate[0]?.user_id;
        const candidateFirstName = matchedCandidate[0]?.first_name;
        const candidateLastName = matchedCandidate[0]?.last_name;
        const candidateScore = matchingCandidate?.score;

        const resultObject = {
          jobId,
          jobTitle,
          candidateId,
          candidateFirstName,
          candidateLastName,
          candidateScore,
        };

        resultArray.push(resultObject);
      }
    });
  });

  return resultArray;
};

export default getMatchingCandidatesInfo;
