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

# flow text system
es_flow_text = Elasticsearch(flow_text_host, timeout=600)

# km user portrait
es_km_user_portrait = Elasticsearch(km_user_portrait_host,timeout=600)

# km event 
es_event = Elasticsearch(event_host, timeout=600)

# The process state is stored
es_calculate_status = Elasticsearch(calculate_status_host, timeout=600)

graph = Graph(neo4j_data_path, user=neo4j_name, password=neo4j_password)

r = redis.StrictRedis(host=redis_host, port=redis_port, db=0)

# user portrait interface: push user into redis list
r_user = redis.StrictRedis(host=redis_host, port=redis_port, db=10)

# event2id
def event_name_to_id(en_name):
    query_body = {
        "query":{
            "match":{
                'name':en_name
            }
        }
    }
    name_results = es_event.search(index=event_name, doc_type=event_type, \
                body=query_body,fields=['en_name'])['hits']['hits'][0]['fields']
    for k,v in name_results.iteritems():
        ch_name = v[0]
    return ch_name

# event_search_sth
def es_search_sth(en_name,fields_list):
    print fields_list
    query_body = {
        "query":{
            "match":{
                'en_name':en_name
            }
        }
    }
    sth_results = es_event.search(index=event_analysis_name, doc_type=event_type, \
                body=query_body,fields=fields_list)['hits']['hits'][0]['fields']
    for k,v in sth_results.iteritems():
        sth_name = v[0]
    return sth_name

#es：事件id查找事件名
def event_name_search(en_name):
    query_body = {
        "query":{
            "match":{
                '_id':en_name
            }
        }
    }
    name_results = es_event.search(index=event_name, doc_type=event_type, \
                body=query_body,fields=['name'])['hits']['hits'][0]['fields']
    for k,v in name_results.iteritems():
        ch_name = v[0]
    return ch_name

#查找uid对应的字段
def user_search_sth(en_name,fields_list):
    query_body = {
        "query":{
            "match":{
                '_id':en_name
            }
        }
    }
    try:
        name_results = es_user_portrait.search(index=portrait_name, doc_type=portrait_type, \
                body=query_body, fields=fields_list)['hits']['hits'][0]['fields']
    except:
        name_dict = {}
        for i in fields_list:
            name_dict[i] =''
        return name_dict
    name_dict = {}
    for k,v in name_results.iteritems():
        name_dict[k] = v[0]
    # print ch_name.encode('utf-8')
    return name_dict

#查找uid对应的名字
def user_name_search(en_name):
    query_body = {
        "query":{
            "match":{
                '_id':en_name
            }
        }
    }
    try:
        name_results = es_user_portrait.search(index=portrait_name, doc_type=portrait_type, \
                body=query_body, fields=['uname'])['hits']['hits'][0]['fields']
    except:
        return ''
    for k,v in name_results.iteritems():
        ch_name = v[0]
    # print ch_name.encode('utf-8')
    return ch_name

#查找该专题下事件关联的用户信息,用户卡片
def related_user_search(uid_list,sort_flag):
    query_body = {
        'query':{
            'terms':{'uid':uid_list}
            },
        "sort": [{sort_flag:'desc'}]
    }
    fields_list = ['activeness', 'importnace','sensitive','uname','fansnum',\
                   'domain','topic_string','user_tag','uid']

    event_detail = es_user_portrait.search(index=portrait_name, doc_type=portrait_type, \
                body=query_body, _source=False, fields=fields_list)['hits']['hits']
    detail_result = []
    for i in event_detail:
        fields = i['fields']
        detail = dict()
        for i in fields_list:
            try:
                detail[i] = fields[i][0]
            except:
                detail[i] = 'null'
        detail_result.append(detail)
    return detail_result


# 查找该专题下的包含事件卡片信息，事件卡片
def event_detail_search(eid_list,sort_flag):
    query_body = {
        'query':{
            'terms':{'en_name':eid_list}
            },
        "sort": [{sort_flag:'desc'}]
    }
    fields_list = ['name', 'en_name', 'weibo_counts','start_ts','location','uid_counts','user_tag','description']

    event_detail = es_event.search(index=event_analysis_name, doc_type=event_type, \
                body=query_body, _source=False, fields=fields_list)['hits']['hits']
    detail_result = []
    for i in event_detail:
        fields = i['fields']
        detail = dict()
        for i in fields_list:
            try:
                detail[i] = fields[i][0]
            except:
                detail[i] = 'null'
        detail_result.append(detail)
    return detail_result
