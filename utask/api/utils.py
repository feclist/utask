def flatten_query_set(set, key='id'):
    return set.values_list(key, flat=True)