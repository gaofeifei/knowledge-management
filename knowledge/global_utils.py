# -*-coding:utf-8-*-

import redis
from py2neo import Graph
from elasticsearch import Elasticsearch
from global_config import *

# user profile info
es_user_profile = Elasticsearch(user_profile_host, timeout=600)
profile_index_name = "weibo_user"
profile_index_type = "user"

# user portrait system
es_user_portrait = Elasticsearch(user_portrait_host, timeout=600)

# km user portrait
es_km_user_portrait = Elasticsearch(km_user_portrait_host,timeout=600)

# km event 
es_event = Elasticsearch(event_host, timeout=600)

graph = Graph(neo4j_data_path, user=neo4j_name, password=neo4j_password)

r = redis.StrictRedis(host=redis_host, port=redis_port, db=0)

# user portrait interface: push user into redis list
r_user = redis.StrictRedis(host=redis_host, port=redis_port, db=10)

