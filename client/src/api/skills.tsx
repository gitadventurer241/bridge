import configureAxios from "./../config";

const axios = configureAxios();
/**
 * Fetches all skills data from the server
 * @returns all skills data object
 */
export async function getAllSkills() {
  try {
    const response = await axios.get("/api/get_all_skills", {
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.skills;
    } else {
      throw new Error("Failed to fetch skills");
    }
  } catch (error) {
    throw error;
  }
}
