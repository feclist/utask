from api.models import Task, LiveTask, TaskReward
from django.contrib.auth.models import User

from api.utils import flatten_query_set, get_ost_kit, calc_effective_funds

from decouple import config

import random

users = User.objects.all()

print("")
print("")
print("")
print("Start execution 800 User to User transactions")

print("")
print("")
print("")
# User to user transactions
for i in range(1, 800):
    print("Starting request {}".format(i))
    rand_one = random.randint(0,len(users) - 1)
    rand_two = random.randint(0,len(users) - 1)
    rand_two = (rand_two + 1) % len(users) if rand_one == rand_two else rand_two
    user_one = users[rand_one]
    user_two = users[rand_two]
    print("Picked user {}".format(user_one.username))
    print("And picked user {}".format(user_two.username))

    transaction_amount = round(random.uniform(1, 9), random.randint(1,6))
    print("Executing transfer of {} FROM {} TO {}".format(transaction_amount, user_one, user_two))
    response = get_ost_kit().transactions.execute(from_user_id=user_one.profile.ost_id,
                                                      to_user_id=user_two.profile.ost_id,
                                                      action_id=39046,
                                                      amount=transaction_amount)
    print("Response is in:")
    if not response["success"]:
        break
    else:
        print(response)
    print("")
    print("")
    print("")

print("")
print("")
print("")
print("Start execution 100 Company to User transactions")

print("")
print("")
print("")

# Company to user transactions
for i in range(1, 101):
    print("Starting request {}".format(i))
    rand_one = random.randint(0,len(users) - 1)
    user_one = users[rand_one]
    print("Picked user {}".format(user_one.username))

    transaction_amount = round(random.uniform(1, 9), random.randint(1,6))
    print("Executing transfer of {} FROM company TO {}".format(transaction_amount, user_one))
    response = get_ost_kit().transactions.execute(from_user_id=config('COMPANY_UUID'),
                                                      to_user_id=user_one.profile.ost_id,
                                                      action_id=39580,
                                                      amount=transaction_amount)
    print("Response is in:")
    print(response)
    if not response["success"]:
        break
    else:
        print(response)
    print("")
    print("")
    print("")


print("")
print("")
print("")
print("Start execution 100 User to Company transactions")

print("")
print("")
print("")

# User to company transactions
for i in range(1, 101):
    print("Starting request {}".format(i))
    rand_one = random.randint(0,len(users) - 1)
    user_one = users[rand_one]
    print("Picked user {}".format(user_one.username))

    transaction_amount = round(random.uniform(1, 9), random.randint(1,6))
    print("Executing transfer of {} FROM {} TO company".format(transaction_amount, user_one))
    response = get_ost_kit().transactions.execute(from_user_id=user_one.profile.ost_id,
                                                      to_user_id=config(
                                                          'COMPANY_UUID'),
                                                      action_id=39581,
                                                      amount=transaction_amount)
    print("Response is in:")
    if not response["success"]:
        break
    else:
        print(response)
    print("")
    print("")
    print("")

