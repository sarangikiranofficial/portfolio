import requests
import json

USERNAME = "sarangikiranofficial"

url = f"https://api.github.com/users/{USERNAME}/repos"

response = requests.get(url)

repos = response.json()

projects = []

for repo in repos:

    if repo.get("fork"):
        continue

    projects.append({
        "name": repo["name"],
        "description": repo["description"],
        "url": repo["html_url"],
        "language": repo["language"],
        "stars": repo["stargazers_count"]
    })

projects.sort(
    key=lambda x: x["stars"],
    reverse=True
)

with open("projects.json", "w") as f:
    json.dump(projects, f, indent=2)

print(f"Generated {len(projects)} projects")