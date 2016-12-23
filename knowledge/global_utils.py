# -*-coding:utf-8-*-

import redis
from py2neo import Graph
from elasticsearch import Elasticsearch
from global_config import *

es_user_portrait = Elasticsearch(user_portrait_host, tmeout=600)
es_event = Elasticsearch(event_host, timeout=600)

graph = Graph(neo4j_data_path, user=neo4j_name, password=neo4j_password)

r = redis.StrictRedis(host=redis_host, port=redis_port, db=0)
