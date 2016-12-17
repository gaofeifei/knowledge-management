# -*-coding:utf-8-*-

import redis
from elasticsearch import Elasticsearch
from global_config import user_portrait_host

es_user_portrait = Elasticsearch(user_portrait_host, tmeout=600)
