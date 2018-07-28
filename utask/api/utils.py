from decouple import config

from ost_kit_python import OSTKit


def flatten_query_set(set, key='id'):
    return set.values_list(key, flat=True)


def get_ost_kit():
    return OSTKit(api_url='https://sandboxapi.ost.com/v1.1',
                  api_key=config('API_KEY'),
                  api_secret=config('API_SECRET'))
