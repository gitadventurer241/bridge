import axios from "axios";

export async function sendInvite(invite: object) {
  try {
    const response = await axios.post(
      "/api/send_invite",
      { ...invite },
      { withCredentials: true }
    );
    if (response.status === 200) {

      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    throw error;
  }
}
