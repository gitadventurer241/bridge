import configureAxios from "./../config";

const axios = configureAxios();

/**
 * Fetches all values from the server
 * @returns all values data object
 */
export async function getAllValues() {
  try {
    const response = await axios("/api/get_all_values", {
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.values;
    } else {
      throw new Error("Failed to fetch values");
    }
  } catch (error) {
    throw error;
  }
}
