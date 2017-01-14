# -*-coding:utf-8-*-

import time
import json
from knowledge.global_config import portrait_name, portrait_type, event_name, event_analysis_name, \
        neo4j_name, event_type, event_special, special_event_index_name, group_index_name, group_rel, node_index_name
from knowledge.global_utils import es_user_portrait, es_event, graph,\
        user_name_search, event_name_search,event_detail_search, related_user_search
from knowledge.time_utils import ts2datetime, datetime2ts,ts2date
from py2neo import Node, Relationship
from py2neo.ogm import GraphObject, Property
from py2neo.packages.httpstream import http
from py2neo.ext.batman import ManualIndexManager
from py2neo.ext.batman import ManualIndexWriteBatch
http.socket_timeout = 9999

def search_event(item):
    query_body = {
        "query":{
            'bool':{
                'should':[
                    {"wildcard":{'keywords':'*'+str(item)+'*'}},            
                    {"wildcard":{'en_name':'*'+str(item)+'*'}},            
                    {"wildcard":{'name':'*'+str(item)+'*'}}         
                ]
            }

        },
        'size':10
    }
    only_eid = []
    event_id_list = []
    u_nodes_list = {}
    e_nodes_list = {}
    event_relation =[]
    try:
        name_results = es_event.search(index=event_name, doc_type=event_type, \
                body=query_body, fields=['name','en_name'])['hits']['hits']
    except:
        return 'does not exist'
    for i in name_results:
        print i
        name = i['fields']['name'][0]
        en_name = i['fields']['en_name'][0]
        only_eid.append(en_name)
        e_nodes_list[en_name] = name
        event_id_list.append([en_name, name])
    return event_id_list

def search_user(item):
    query_body = {
        "query":{
            'bool':{
                'should':[
                    {"wildcard":{'uid':'*'+str(item)+'*'}},            
                    {"wildcard":{'uname':'*'+str(item)+'*'}}
                ]
            }

        },
        'size':100
    }
    only_uid = []
    user_uid_list = []
    u_nodes_list = {}

    try:
        name_results = es_user_portrait.search(index=portrait_name, doc_type=portrait_type, \
                body=query_body, fields=['uid','uname'])['hits']['hits']
    except:
        return 'does not exist'
    for i in name_results:
        uid = i['fields']['uid'][0]
        uname = i['fields']['uname'][0]
        only_uid.append(uid)
        u_nodes_list[uid] = uname
        user_uid_list.append([uid, uname])
    return user_uid_list

def search_node_f(search_item1, node_type1, search_item2, node_type2):
    if node_type1 == 'Event':
        item_list_1 = search_event(search_item1)
    if node_type1 == 'User':
        item_list_1 = search_user(search_item1)

    if node_type2 == 'Event':
        item_list_2 = search_event(search_item2)
    if node_type1 == 'User':
        item_list_2 = search_user(search_item2)

    return {'node1':item_list_1,'node2':item_list_2,'node_type1':node_type1,'node_type2':node_type2}

def search_way(node1,node2,node_type1,node_type2):
    index_type_dict = {'User':'node_index', 'Event':'event_index'}
    primary_idct = {'User':'uid','Event':'event'}

    c_string = 'START node1 = node:'+index_type_dict[node_type1]+'('+primary_idct[node_type1]+'="'+node1+'"),'
    c_string += 'node2 = node:'+index_type_dict[node_type2]+'('+primary_idct[node_type2]+'="'+node2+'") '
    c_string += 'MATCH p = allShortestPaths(node1-[r*..10]-node2) RETURN r'
    # return c_string
    result = graph.run(c_string)
    print result,'***************'
    result_l = []
    for i in list(result):
        print i

        # print i['p']

        print i['r'],')))))))))))))))))))'
        for ii in i['r']:
            print type(ii),'^^^^^^^^^^^^^'
        result_l.append(i)
    return c_string

