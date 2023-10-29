import configureAxios from "./../config";

const axios = configureAxios();

/**
 * Fetches all the candidates
 * @returns an array of all candidate data objects
 */
export async function getAllCandidates() {
  try {
    const response = await axios("/api/get_all_candidates", {
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.candidates;
    } else {
      throw new Error("Failed to fetch candidates");
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches the candidate data object by id
 * @param userId the id of the candidate
 * @returns an object with the candidate data
 */
export async function getCandidateById(userId: string) {
  try {
    const response = await axios.post(
      "/api/get_candidate_by_id",
      { user_id: userId },
      { withCredentials: true }
    );

    if (response.status === 200) {
      return response.data.candidates;
    } else if (response.status === 404) {
      throw new Error("Candidate not found");
    } else {
      throw new Error("Failed to fetch candidate");
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Updates the candidate data object by id
 * @param userId the id of the candidate
 * @param updateData the data to update
 * @returns
 */
export async function updateCandidateById(userId: string, updateData: object) {
  try {
    const response = await axios.put(
      "/api/update_candidate",
      { user_id: userId, ...updateData },
      { withCredentials: true }
    );

    if (response.status === 200) {
      return { message: "Candidate updated successfully" };
    } else if (response.status === 404) {
      throw new Error("Candidate not found");
    } else {
      throw new Error("Failed to update candidate");
    }
  } catch (error) {
    throw error;
  }
}
