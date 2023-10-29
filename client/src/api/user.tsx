import configureAxios from "./../config";

const axios = configureAxios();

/**
 * Fetches all the users
 * @returns
 */
export async function getAllUsers(): Promise<any> {
  try {
    const response = await axios.get("/api/get_all_users", {
      withCredentials: true,
    });

    if (response.status === 200) {
      return response.data.users;
    } else {
      return response.data.message;
    }
  } catch (error) {
    console.error("Error:", error);
    return "Error occurred during the API call.";
  }
}

/**
 * Fetches all the users
 * @param userId the id of the user
 * @returns
 */
export async function deleteUser(userId: string): Promise<any> {
  try {
    const response = await axios.post(
      "/api/delete_user",
      { user_id: userId },
      { withCredentials: true }
    );

    return response.status;
  } catch (error) {
    console.error("Error:", error);
    return "Error occurred during the API call.";
  }
}

/**
 * Change password
 * @param userId the id of the user
 * @returns
 */

export async function changePassword(
  userId: string,
  newPassword: string,
  currentPassword: string
): Promise<any> {
  try {
    const response = await axios.post(
      "/api/change_password",
      {
        user_id: userId,
        current_password: currentPassword,
        new_password: newPassword,
      },
      { withCredentials: true }
    );

    return response.status;
  } catch (error: any) {
    console.error("Error:", error);
    return error.response.status;
  }
}
