# -*-coding:utf-8-*-

import time
import json
from knowledge.global_config import portrait_name, portrait_type, event_name, event_analysis_name, \
        neo4j_name, event_type, event_special, special_event_index_name, group_index_name, group_rel, node_index_name
from knowledge.global_utils import es_user_portrait, es_event, graph
from knowledge.parameter import rel_node_mapping, rel_node_type_mapping, index_threshold
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

    total_node_count = es_user_portrait.count(index=portrait_name, doc_type=portrait_type,body={"query":{"match_all":{}}})["count"]

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
    total_event_count = es_event.count(index=event_name, doc_type=event_type, body={"query":{"match_all":{}}})["count"]

    results = []
    results.append(total_node_count)
    results.append(total_event_count)
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


def query_new_relationship():
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
        },
        "size":1000,
        "sort":{"fansnum":{"order":"desc"}}
    }

    node_results = es_user_portrait.search(index=portrait_name, doc_type=portrait_type, body=query_node)["hits"]["hits"]
    uid_list = []
    c_string = "START "
    for item in node_results:
        uid_list.append(item['_id'])

    total_set = set()
    results = []
    for uid in uid_list:
        c_string = "START n=node:node_index(uid='%s') MATCH (n)-[r]->(m) RETURN r,m LIMIT 50" %uid
        each_result = graph.run(c_string)
        for each in each_result:
            tmp_rel = each[0]
            tmp_node = each[1]
            rel_type = tmp_rel.type()
            node_attri = dict(tmp_node)
            primary_key = node_attri[rel_node_mapping[rel_type]] # primary key value
            node_type = rel_node_type_mapping[rel_type] # end node type
            results.append([uid, rel_type, primary_key, node_type])
            total_set.add(uid)
            total_set.add(primary_key)
        if len(total_set) >= index_threshold:
            break

    return results
