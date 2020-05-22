import random
import string
import json

HASH_LENGTH = 256
USER_SIZE = 50


CHAR_SET = string.ascii_lowercase \
           + string.ascii_uppercase \
           + string.digits \
           + string.punctuation



tokens = {"Lunch (Day 1)": True, "Lunch (Day 2)": True, "Breakfast (Day 2)": True, "Dinner (Day 2)": True, "Bar Night (Day 1)": True}

config = {"size": USER_SIZE,
          "tokens": {
              "Lunch (Day 1)": {"Active": True, "Day": 1},
              "Lunch (Day 2)": {"Active": True, "Day": 2},
              "Breakfast (Day 2)": {"Active": True, "Day": 2},
              "Dinner (Day 2)": {"Active": True, "Day": 2},
              "Bar Night (Day 1)": {"Active": True, "Day": 1}
          }
          }

database_structure = {
    "config": config,
    "users": []
}


def guesses_required():
    guesses_base = (len(CHAR_SET) ** HASH_LENGTH // USER_SIZE)
    length_limit = (len(CHAR_SET) ** (HASH_LENGTH - 1) // USER_SIZE)
    return guesses_base - length_limit


def randomString(stringLength=HASH_LENGTH):
    return ''.join(random.choice(CHAR_SET) for i in range(stringLength))


hashes = []

while len(hashes) < config["size"]:
    new_hash = randomString()
    if new_hash not in hashes:
        hashes.append(new_hash)

for i in range(0, config["size"]):
    curr_user = {"name": "my_name_is_"+str(i), "hash": hashes[i], "tokens": tokens.copy()}
    database_structure["users"].append(curr_user)

print("Guesses required", guesses_required())

with open('database.json', 'w') as db_file:
    json.dump(database_structure, db_file)

print("JSON File created")
