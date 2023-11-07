# from .train_model import vectorizer
import dill
import requests
import string
import numpy as np
from flask import Blueprint, jsonify, request
from sklearn.metrics.pairwise import cosine_similarity

with open("model/vectorizer.pkl", "rb") as file:
    vectorizer = dill.load(file)

def check_conditions(job, candidate):
    location = job['location_city'] in candidate['city'] + candidate['possible_work_locations']
    return location


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


def match_candidates_route(domain_name):
    match_candidates_bp = Blueprint("match_candidates", __name__)

    @match_candidates_bp.route("/api/match_candidates", methods=["POST"])
    def match_candidates():
        """ """
        try:
            if request.method == "POST":
                data = request.get_json()
                id = data.get("job_id")

                cand_match = []
                match_ids = []
                job_json = {"job_id": id}

                job = requests.post(f"{domain_name}/api/get_job_by_id", json=job_json)
                job_skills = [
                    skill["skill_name"] for skill in job.json()["jobs"]["skills"]
                ]
                job_levels = [
                    skill["skill_level"] for skill in job.json()["jobs"]["skills"]
                ]
                job_values = job.json()["jobs"]["values"]
                job_soft_skills = (
                    job.json()["jobs"]["soft_skills"]
                    if job.json()["jobs"]["soft_skills"]
                    else []
                )
                existing_match = (
                    [cand["id"] for cand in job.json()["jobs"]["matching_candidates"]] 
                    if job.json()["jobs"]["matching_candidates"] 
                    else []
                    )
                candidates_response = requests.get(
                    f"{domain_name}/api/get_all_candidates"
                )
                candidates = candidates_response.json()["candidates"]

                for candidate in candidates:
                    # Check if candidate has skills
                    if candidate["skills"] is not None:
                        cand_skills = [
                            skill["skill_name"] for skill in candidate["skills"]
                        ]
                        cand_levels = [
                            skill["skill_level"] for skill in candidate["skills"]
                        ]

                        cand_id = candidate["user_id"]

                        count = 7
                        total_score = 0

                        if cand_skills:
                            cand_tech_score = score(
                                job_skills, cand_skills, (job_levels,cand_levels)
                            )
                            total_score += 7 * cand_tech_score

                            if job_values:
                                count += 1
                                if candidate["values"]:
                                    cand_val_score = score(
                                        job_values, candidate["values"]
                                    )
                                    total_score += cand_val_score

                            if job_soft_skills:
                                count += 2
                                if candidate["soft_skills"]:
                                    cand_soft_score = score(
                                        job_soft_skills, candidate["soft_skills"]
                                    )
                                    total_score += 2 * cand_soft_score

                            cand_score = round(total_score / count, 1)

                            if cand_score >= 30:
                                cand_match.append({"id": cand_id, "score": cand_score})
                                match_ids.append(cand_id)
                                if candidate["matching_jobs"]:
                                    duplicate = [
                                        ix
                                        for ix, job in enumerate(
                                            candidate["matching_jobs"]
                                        )
                                        if job["id"] == id
                                    ]
                                    if duplicate:
                                        candidate["matching_jobs"][duplicate[0]][
                                            "score"
                                        ] = cand_score
                                    else:
                                        candidate["matching_jobs"].append(
                                            {"id": id, "score": cand_score}
                                        )
                                else:
                                    candidate["matching_jobs"] = []
                                    candidate["matching_jobs"].append(
                                        {"id": id, "score": cand_score}
                                    )
                                update_cand_json = {
                                    "user_id": cand_id,
                                    "matching_jobs": candidate["matching_jobs"],
                                }
                                update_cand_response = requests.put(
                                    f"{domain_name}/api/update_candidate",
                                    json=update_cand_json,
                                )
                    else:
                        continue

                changes = set(existing_match) - set(match_ids)
                for cand in changes:
                    cand_json = { "user_id": cand }
                    cand_response = requests.post(f"{domain_name}/api/get_candidate_by_id", json=cand_json)
                    match = cand_response.json()["candidates"]["matching_jobs"]
                    job_ix = [
                                    ix
                                    for ix, job in enumerate(match)
                                    if job["id"] == id
                                ]
                    match.pop(job_ix[0])
                    update_cand_json = {
                                "user_id": cand,
                                "matching_jobs": match,
                            }
                    update_cand_response = requests.put(
                                f"{domain_name}/api/update_candidate",
                                json=update_cand_json,
                            )
                    
                update_json = {"job_id": id, "matching_candidates": cand_match}
                update_job = requests.put(
                    f"{domain_name}/api/update_job", json=update_json
                )

                if update_job.status_code == 200:
                    return (
                        jsonify(
                            {
                                "message": "Update job successfully",
                                "matching_candidates": cand_match,
                            }
                        ),
                        200,
                    )

                else:
                    return jsonify({"message": f"Error matching candidates"}), 500

        except Exception as e:
            return jsonify({"message": f"Error matching candidates: {e}"}), 500

        return jsonify({"message": "Invalid request"}), 400

    return match_candidates_bp
