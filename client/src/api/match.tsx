import configureAxios from "./../config";

const axios = configureAxios();

/**
 * Fetches all the matching candidates for the job
 * @param id the id of the job
 */
export async function getMatchCandidates(id: string) {
  try {
    const response = await axios.post(
      "/api/match_candidates",
      { job_id: id },
      { withCredentials: true }
    );

    if (response.status === 200) {
    } else {
      throw new Error("Error matching candidates");
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches the match jobs for the candidate
 * @param id the id of the candidate
 */
export async function getMatchJobs(id: string) {
  try {
    const response = await axios.post(
      "/api/match_jobs",
      { user_id: id },
      { withCredentials: true }
    );

    if (response.status === 200) {
      console.log("Matching jobs result:", response.data);
    } else {
      throw new Error("Error matching jobs");
    }
  } catch (error) {
    throw error;
  }
}
