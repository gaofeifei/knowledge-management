# -*-coding:utf-8-*-

import time
import json
from knowledge.global_config import portrait_name, portrait_type, event_name, event_analysis_name, \
        neo4j_name, event_type, event_special, special_event_index_name, group_index_name, \
        group_rel, node_index_name,user_event_relation
from knowledge.global_utils import es_user_portrait, es_event, graph,\
        user_name_search, event_name_search
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
    former_ts = datetime2ts(ts2datetime(current_ts-10*24*3600))
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
    return_results = dict()
    results = []
    draw_uid_list = set() # appeared uid in index
    event_list = set()
    for uid in uid_list:
        draw_uid_list.add(uid)
        c_string = "START n=node:node_index(uid='%s') MATCH (n)-[r]->(m) RETURN r,m LIMIT 50" %uid
        each_result = graph.run(c_string)
        for each in each_result:
            tmp_rel = each[0]
            tmp_node = each[1]
            rel_type = tmp_rel.type()
            if rel_type == "topic":
                continue
            node_attri = dict(tmp_node)
            print "rel_type:", rel_type
            print rel_node_mapping[rel_type]
            print node_attri[rel_node_mapping[rel_type]]
            primary_key = node_attri[rel_node_mapping[rel_type]] # primary key value
            node_type = rel_node_type_mapping[rel_type] # end node type
            if node_type == "User":
                draw_uid_list.add(primary_key)
            elif node_type == "Event":
                event_list.add(primary_key)
            else:
                try:
                    return_results[node_type][primary_key] = primary_key
                except:
                    return_results[node_type] = dict()
                    return_results[node_type][primary_key] = primary_key
            results.append([uid, rel_type, primary_key, node_type])
            total_set.add(uid)
            total_set.add(primary_key)
        if len(total_set) >= index_threshold:
            break

    return_results["relations"] = results
    user_node_dict = dict()
    draw_uid_list = list(draw_uid_list)
    if draw_uid_list:
        portrait_result = es_user_portrait.mget(index=portrait_name, doc_type=portrait_type, body={"ids":draw_uid_list})["docs"]
        for item in portrait_result:
            if item["found"]:
                uname = item["_source"]["uname"]
                if uname:
                    user_node_dict[item["_id"]] = uname
                else:
                    user_node_dict[item["_id"]] = item["_id"]
            else:
                user_node_dict[item["_id"]] = item["_id"]
    return_results["user_nodes"] = user_node_dict

    if event_list:
        event_node = dict()
        event_list = list(event_list)
        event_result = es_event.mget(index=event_name, doc_type=event_type, body={"ids":event_list})["docs"]
        for item in event_result:
            event_node[item["_id"]] = item["_source"]["name"]
        return_results["event_node"] = event_node
    print return_results.keys()

    return return_results

#事件信息面板
def query_event_detail(event):
    query_body = {
        'query':{
            'match':{'name':event}
            }
    }
    analysis_fields_list = ['counts','location','renshu','user_tag','description']
    fields_list = ['submit_ts', 'submit_user','start_ts','end_ts']
    
    event_detail = es_event.search(index=event_name, doc_type=event_type, \
                body=query_body, _source=False, fields=fields_list)['hits']['hits']
    event_detail_a = es_event.search(index=event_analysis_name, doc_type=event_type, \
                body=query_body, _source=False, fields=analysis_fields_list)['hits']['hits']
    # event_detail.extend(event_detail_a)
    detail = dict()
    for i in event_detail:
        fields = i['fields']
        for i in fields_list:
            try:
                detail[i] = fields[i][0]
            except:
                detail[i] = 'null'
    for i in event_detail_a:
        fields = i['fields']
        for i in analysis_fields_list:
            try:
                detail[i] = fields[i][0]
            except:
                detail[i] = 'null'
    return detail

#事件相关人物
def query_event_people(event):
    query_body = {
        'query':{
            'match':{'name':event}
            }
    }
    
    event_detail = es_event.search(index=event_name, doc_type=event_type, \
                body=query_body, _source=False, fields=['en_name'])['hits']['hits'][0]['fields']
    
    event_id = event_detail['en_name'][0]
    c_string = 'START s0 = node:event_index(event="'+str(event_id)+'") '
    c_string += 'MATCH (s0)-[r]-(s1:User) return r,s1.uid as uid LIMIT 50'
    print c_string
    result = graph.run(c_string)
    related_people = {}
    for i in result:
        relation = i['r'].type()
        user_id = str(i['uid'])
        user_name = user_name_search(user_id)
        try:
            related_people[relation].append([user_id,user_name])
        except:
            related_people[relation] = []
            related_people[relation].append([user_id,user_name])
            
    return related_people



#事件关联事件


#事件相关微博

# 地图
def query_hot_location():
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
        },
        "aggs":{
            "all_location":{
                "terms":{"field": "location", "size":400}
            }
        }
    }

    results = es_user_portrait.search(index=portrait_name, doc_type=portrait_type, body=query_node)["aggregations"]["all_location"]["buckets"]

    location_dict = dict()
    for item in results:
        if item["key"] == "" or item["key"] == "unknown" or item['key'] == u'其他':
            continue
        location_dict[item["key"]] = item["doc_count"]

    filter_location = dict()
    for k,v in location_dict.iteritems():
        if u'海外' in k or u'其他' in k or u'英国' in k or u'美国' in k or u'日本' in k:
            continue
        tmp = k.split(' ')
        if u'北京' in k or u'天津' in k or u'上海' in k or u'重庆' in k or u'香港' in k or u'澳门' in k:
            try:
                filter_location[tmp[0]] += v
            except:
                filter_location[tmp[0]] = v
        elif len(tmp) == 1:
            continue
        else:
            try:
                filter_location[tmp[1]] += v
            except:
                filter_location[tmp[1]] = v

    return_results = sorted(filter_location.iteritems(), key=lambda x:x[1], reverse=True)

    return return_results
