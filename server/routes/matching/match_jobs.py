# from .train_model import vectorizer
import dill
import requests
import numpy as np
from flask import Blueprint, jsonify, request
from sklearn.metrics.pairwise import cosine_similarity

with open("model/vectorizer.pkl", "rb") as file:
    vectorizer = dill.load(file)


def score(job_skills, candidate_skills, levels=False):
    job_skills = ["_".join(skill.lower().split(" ")) for skill in job_skills]
    job_skills_vector = vectorizer.transform(job_skills)

    candidate_skills = [
        "_".join(skill.lower().split(" ")) for skill in candidate_skills
    ]
    candidate_skills_vector = vectorizer.transform(candidate_skills)
    similarity_matrix = cosine_similarity(candidate_skills_vector, job_skills_vector)
    similarity_matrix_resolved = (similarity_matrix > 0.7).astype("int32")

    if levels:
        skills_dict = {"beginner": 1, "intermediate": 2, "advanced": 3, "pro": 4}
        job_levels = [skills_dict[level] for level in levels[0]]
        candidate_levels = [skills_dict[level] for level in levels[1]]
        match = np.where(similarity_matrix_resolved == 1)
        for cand_ix, job_ix in zip(*match):
            if candidate_levels[cand_ix] > job_levels[job_ix]:
                candidate_levels[cand_ix] = job_levels[job_ix]
        candidate_levels_resolved = [[level] for level in candidate_levels]
        total_score = sum(job_levels)
        candidate_score = np.multiply(
            similarity_matrix_resolved, candidate_levels_resolved
        ).sum()
        percent_score = (candidate_score / total_score) * 100
    else:
        percent_score = similarity_matrix_resolved.sum() / len(job_skills) * 100
    return round(percent_score, 1)


def match_jobs_route(domain_name):
    """
    This script defines a Flask Blueprint for matching job candidates to job postings based on their skills and qualifications. It uses a pre-trained TfidfVectorizer to transform skills into numerical representations for comparison. The matching algorithm calculates a percentage score for each job based on the similarity between the candidate's skills and the job's requirements.

    The Blueprint includes an API route ('/api/match_jobs') that accepts POST requests with user data and returns a list of matching job postings along with their matching scores.

    This script assumes the availability of a pre-trained TfidfVectorizer loaded from 'model/vectorizer.pkl' for skill vectorization connected to the database.
    When updated a new skill/value in the database, the vectorizer should be retrained and saved to 'model/vectorizer.pkl'.
    """
    match_jobs_bp = Blueprint("match_jobs", __name__)

    @match_jobs_bp.route("/api/match_jobs", methods=["POST"])
    def match_jobs():
        try:
            if request.method == "POST":
                data = request.get_json()
                id = data.get("user_id")

                job_match = []
                match_ids = []
                cand_json = {"user_id": id}

                candidate = requests.post(
                    f"{domain_name}/api/get_candidate_by_id", json=cand_json
                )

                if candidate.status_code == 200:
                    if candidate.json()["candidates"]["skills"]:
                        cand_skills = [
                            skill["skill_name"]
                            for skill in candidate.json()["candidates"]["skills"]
                        ]
                        cand_levels = [
                            skill["skill_level"]
                            for skill in candidate.json()["candidates"]["skills"]
                        ]
                    cand_values = candidate.json()["candidates"]["values"]
                    cand_soft_skills = candidate.json()["candidates"]["soft_skills"]
                    existing_match = (
                        [job["id"] for job in candidate.json()["candidates"]["matching_jobs"]]
                        if candidate.json()["candidates"]["matching_jobs"]
                        else []
                    )
            
                    if candidate.json()["candidates"]["skills"]:
                        jobs_response = requests.get(f"{domain_name}/api/get_all_jobs")
                        # print("JOBS", jobs_response.json())
                        if jobs_response.status_code == 200:
                            jobs = jobs_response.json()["jobs"]

                            for job in jobs:
                                job_id = job["id"]

                                count = 7
                                total_score = 0

                                if  job["skills"]:
                                    job_skills = [skill["skill_name"] for skill in job["skills"]]
                                    job_levels = [skill["skill_level"] for skill in job["skills"]]
                                    job_tech_score = score(job_skills, cand_skills, (job_levels, cand_levels))
                                    total_score += 7 * job_tech_score

                                    if job["values"]:
                                        count += 1
                                        if cand_values:
                                            job_val_score = score(job["values"], cand_values)
                                            total_score += job_val_score

                                    if job["soft_skills"]:
                                        count += 2
                                        if cand_soft_skills:
                                            job_soft_score = score(
                                                job["soft_skills"], cand_soft_skills
                                            )
                                            total_score += 2 * job_soft_score

                                    job_score = round(total_score / count, 1)

                                    if job_score >= 30:
                                        job_match.append({"id": job_id, "score": job_score})
                                        match_ids.append(job_id)
                                        if job["matching_candidates"]:
                                            duplicate = [
                                                ix
                                                for ix, cand in enumerate(
                                                    job["matching_candidates"]
                                                )
                                                if cand["id"] == id
                                            ]
                                            if duplicate:
                                                job["matching_candidates"][duplicate[0]][
                                                    "score"
                                                ] = job_score
                                            else:
                                                job["matching_candidates"].append(
                                                    {"id": id, "score": job_score}
                                                )
                                        else:
                                            job["matching_candidates"] = []
                                            job["matching_candidates"].append(
                                                {"id": id, "score": job_score}
                                            )
                                        update_job_json = {
                                            "job_id": job_id,
                                            "matching_candidates": job["matching_candidates"],
                                        }
                                        update_job_response = requests.put(
                                            f"{domain_name}/api/update_job",
                                            json=update_job_json,
                                        )
                    
                    changes = set(existing_match) - set(match_ids)
                    for job in changes:
                        job_json = { "job_id": job }
                        jobs_response = requests.post(f"{domain_name}/api/get_job_by_id", json=job_json)
                        match = jobs_response.json()["jobs"]["matching_candidates"]
                        cand_ix = [
                                        ix
                                        for ix, cand in enumerate(match)
                                        if cand["id"] == id
                                    ]
                        match.pop(cand_ix[0])
                        update_job_json = {
                                    "job_id": job,
                                    "matching_candidates": match,
                                }
                        update_job_response = requests.put(
                                    f"{domain_name}/api/update_job",
                                    json=update_job_json,
                                )                    

                    update_json = {"user_id": id, "matching_jobs": job_match}
                    update_cand = requests.put(
                        f"{domain_name}/api/update_candidate", json=update_json
                    )

                    if update_cand.status_code == 200:
                        return (
                            jsonify(
                                {
                                    "message": "Update Candidate successfully",
                                    "matching_jobs": job_match,
                                }
                            ),
                            200,
                        )

                    else:
                        return jsonify({"message": f"Error matching jobs"}), 417

        except Exception as e:
            return jsonify({"message": f"Error matching jobs: {e}"}), 500

        return jsonify({"message": "Invalid request"}), 400

    return match_jobs_bp
