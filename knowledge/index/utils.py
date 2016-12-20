# -*-coding:utf-8-*-

import time
import json
from knowledge.global_config import portrait_name, portrait_type, event_name, event_analysis_name, \
        neo4j_name, event_type, event_special, special_event_index_name, group_index_name, group_rel
from knowledge.global_utils import es_user_portrait, es_event, graph
from knowledge.time_utils import ts2datetime, datetime2ts
from py2neo import Node, Relationship
from py2neo.ogm import GraphObject, Property
from py2neo.packages.httpstream import http
from py2neo.ext.batman import ManualIndexManager
from py2neo.ext.batman import ManualIndexWriteBatch
http.socket_timeout = 9999

week = 7

def query_current_week_increase():
    # query recent 7 days increase of node
    current_ts = time.time()
    former_ts = datetime2ts(ts2datetime(current_ts-week*24*3600))
    query_node = {
        "query":{
            "bool":{
                "must":[
                    {"range":{
                        "create_time":{
                            "gte": former_ts,
                            "lte": current_ts
                        }
                    }}
                ]
            }
        }
    }

    node_count = es_user_portrait.count(index=portrait_name, doc_type=portrait_type, body=query_node)["count"]

    query_event = {
        "query":{
            "bool":{
                "must":[
                    {"range":{
                        "submit_ts":{
                            "gte": former_ts,
                            "lte": current_ts
                        }
                    }}
                ]
            }
        }
    }

    event_count = es_event.count(index=event_name, doc_type=event_type, body=query_event)["count"]

    results = []
    results.append(node_count)
    results.append(event_count)

    return results


# query special event, return list

def query_special_event():
    # step 1: query all special event
    c_string = "MATCH (n:SpecialEvent) RETURN n"
    result = graph.run(c_string)
    special_event_list = []
    for item in result:
        special_event_list.append(dict(item[0]))
    tmp_list = []
    for item in special_event_list:
        tmp_list.extend(item.values())

    results = dict()
    for v in tmp_list:
        c_string = "START end_node=node:%s(event='%s') MATCH (m)-[r:%s]->(end_node) RETURN count(m)" %(special_event_index_name, v, event_special)
        node_result = graph.run(c_string)
        event_list = []
        for item in node_result:
            tmp = dict(item)
            node_number = tmp.values()[0]
        results[v] = node_number

    return_results = sorted(results.iteritems(), key=lambda x:x[1], reverse=True)
    return return_results


def query_group():
    # step 1: query all group
    c_string = "MATCH (n:Group) RETURN n"
    result = graph.run(c_string)
    group_list = []
    for item in result:
        group_list.append(dict(item[0]))
    tmp_list = []
    for item in group_list:
        tmp_list.extend(item.values())

    results = dict()
    for v in tmp_list:
        c_string = "START end_node=node:%s(group='%s') MATCH (m)-[r:%s]->(end_node) RETURN count(m)" %(group_index_name, v, group_rel)
        node_result = graph.run(c_string)
        event_list = []
        for item in node_result:
            tmp = dict(item)
            node_number = tmp.values()[0]
        results[v] = node_number

    return_results = sorted(results.iteritems(), key=lambda x:x[1], reverse=True)
    return return_results
