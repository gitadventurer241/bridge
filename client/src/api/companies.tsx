import configureAxios from "./../config";

const axios = configureAxios();

/**
 * Fetches all companies from the server
 * @returns an array of all company objects
 */
export async function getAllCompanies() {
  try {
    const response = await axios.get("/api/get_all_companies", {
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.companies;
    } else {
      throw new Error("Failed to fetch companies");
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches the company data object by id
 * @param userId the id of the company
 * @returns the company data object
 */
export async function getCompanyById(userId: string) {
  try {
    const response = await axios.post(
      "/api/get_company_by_id",
      { user_id: userId },
      { withCredentials: true }
    );
    if (response.status === 200) {
      return response.data.companies;
    } else if (response.status === 404) {
      throw new Error("Company not found");
    } else {
      throw new Error("Failed to fetch company");
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Updates the company data object by id
 * @param userId the id of the company
 * @param updateData the data to update
 * @returns
 */
export async function updateCompanyById(userId: string, updateData: object) {
  try {
    const response = await axios.put(
      "/api/update_company",
      { user_id: userId, ...updateData },
      { withCredentials: true }
    );

    if (response.status === 200) {
      return { message: "Company updated successfully" };
    } else if (response.status === 404) {
      throw new Error("Company not found");
    } else {
      throw new Error("Failed to update company");
    }
  } catch (error) {
    throw error;
  }
}
