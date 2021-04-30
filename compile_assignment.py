from git import Repo
import os
import re
import datetime

repo = Repo(os.path.dirname(__file__))
ignored_paths = [
    "task2-music.md",
    ".vscode/",
    ".yarn/",
    "yarn.lock",
]


assignment_3_proposal_text = open("task2-music.md", "r").read()
task_1_text = ""
for item in repo.tree().traverse():
    if (
        item.type == "blob"
        and len(
            list(filter(lambda path: item.path.startswith(path), ignored_paths))
        )
        == 0
    ):
        print(f"Reading {item.path}")
        try:
            item_content = open(item.path, "r").read()
        except Exception as e:
            item_content = str(e)
 
        task_1_text += f"""
        


```{item.path}
{item_content}
```

        """
output_file = open("s3429288.txt", "w")
output_file.write(
    f"""
---
Name: Daniel Manning
Student ID: s3429288
Date: {datetime.date.today()}
Repo: https://github.com/dmisdm/cloud-computing-assignment-2
Tagged Submission: https://github.com/dmisdm/cloud-computing-assignment-2/tree/submit
Deployed Site: http://ec2-13-211-130-110.ap-southeast-2.compute.amazonaws.com
---


# Task 1
{task_1_text}



# Task 2

{assignment_3_proposal_text}
        

                  """
)
