import configureAxios from "./../config";

const axios = configureAxios();

/**
 * Fetches all associations from the database
 * @returns all associations data object
 */
export async function getAllAssociations() {
  try {
    const response = await axios.get("/api/get_all_associations");
    if (response.status === 200) {

      return response.data.associations;
    } else {
      throw new Error("Failed to fetch associations");
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches the association data object by id
 * @param userId the id of the association
 * @returns the association data object
 */
export async function getAssociationById(userId: string) {
  try {
    const response = await axios.post(
      "/api/get_association_by_id",
      { user_id: userId },
      { withCredentials: true }
    );
    if (response.status === 200) {
      return response.data.associations;
    } else if (response.status === 404) {
      throw new Error("Association not found");
    } else {
      throw new Error("Failed to fetch association");
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Updates the association data object by id
 * @param userId the id of the association
 * @param updateData the data to update
 * @returns
 */
export async function updateAssociationById(
  userId: string,
  updateData: object
) {
  try {
    const response = await axios.put(
      "/api/update_association",
      {
        user_id: userId,
        ...updateData,
      },
      { withCredentials: true }
    );

    if (response.status === 200) {
      return { message: "Association updated successfully" };
    } else if (response.status === 404) {
      throw new Error("Association not found");
    } else {
      throw new Error("Failed to update association");
    }
  } catch (error) {
    throw error;
  }
}
