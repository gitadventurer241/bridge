import configureAxios from "./../config";

const axios = configureAxios();

/**
 * Fetches all the jobs
 * @returns an array of all job data objects
 */
export async function getAllJobs() {
  try {
    const response = await axios("/api/get_all_jobs", {
      withCredentials: true,
    });
    if (response.status === 200) {
      return response.data.jobs;
    } else {
      throw new Error("Failed to fetch jobs");
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches the job data object by id
 * @param userId the id of the job
 * @returns an object with the job data
 */
export async function getJobById(id: string) {
  try {
    const response = await axios.post(
      "/api/get_job_by_id",
      { job_id: id },
      { withCredentials: true }
    );

    if (response.status === 200) {
      return response.data.jobs;
    } else if (response.status === 404) {
      throw new Error("job not found");
    } else {
      throw new Error("Failed to fetch job");
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Updates the job data object by id
 * @param userId the id of the job
 * @param updateData the data to update
 * @returns
 */
export async function updateJobById(id: string, updateData: object) {
  try {
    const response = await axios.put(
      "/api/update_job",
      { job_id: id, ...updateData },
      { withCredentials: true }
    );

    if (response.status === 200) {
      return { message: "Job updated successfully" };
    } else if (response.status === 404) {
      throw new Error("Job not found");
    } else {
      throw new Error("Failed to update job");
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Adds a new job data object
 * @param jobData the data to add
 * @returns
 */
export async function addJob(jobData: object) {
  try {
    const response = await axios.post(
      "/api/add_job",
      { ...jobData },
      { withCredentials: true }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      return response.data.message;
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Deletes the job data object by id
 * @param userId the id of the job
 * @returns
 */
export async function deleteJob(id: string): Promise<string> {
  try {
    const response = await axios.post(
      "/api/delete_job",
      { job_id: id },
      { withCredentials: true }
    );

    if (response.status === 200) {
      return response.data.message;
    } else {
      return response.data.message;
    }
  } catch (error) {
    throw error;
  }
}
