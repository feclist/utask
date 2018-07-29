from decouple import config

from ost_kit_python import OSTKit


def flatten_query_set(set, key='id'):
    return set.values_list(key, flat=True)


def get_ost_kit():
    return OSTKit(api_url='https://sandboxapi.ost.com/v1.1',
                  api_key=config('API_KEY'),
                  api_secret=config('API_SECRET'))


def calc_effective_funds(available_balance, user):
    """
    Helper method to calculate how much funds a user actually has
    with all open tasks taken in consideration.
    """
    return float(available_balance) - sum(task.total_cost for task in user.task_set.all().filter(active=True))
