import os
import requests
from sklearn.feature_extraction.text import TfidfVectorizer
import dill


def tokens(skill):
    init_list = skill.lower().split(" ")

    if len(init_list) > 1:
        init_list.append("_".join(init_list))

    final_list = [
        token
        for token in init_list
        if not all(c in "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~" for c in token)
        and not token.isnumeric()
    ]

    return final_list


if __name__ == "__main__":
    domain_name = "http://localhost:5001"

    skills = requests.get(f"{domain_name}/api/get_all_skills")
    values = requests.get(f"{domain_name}/api/get_all_values")

    skills = [skill["name"] for skill in skills.json()["skills"]]
    values = [value["name"] for value in values.json()["values"]]

    total = skills + values

    vectorizer = TfidfVectorizer(tokenizer=tokens, token_pattern=None)

    tfidf = vectorizer.fit_transform(total)
    file_path = os.path.dirname(__file__)

    with open(f"{file_path}/vectorizer.pkl", "wb") as file:
        dill.dump(vectorizer, file)
