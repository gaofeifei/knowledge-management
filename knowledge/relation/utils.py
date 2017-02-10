# -*-coding:utf-8-*-

import time
import json
from knowledge.global_config import portrait_name, portrait_type, event_name, event_analysis_name, \
        neo4j_name, event_type, event_special, special_event_index_name, group_index_name, group_rel, node_index_name
from knowledge.global_utils import es_user_portrait, es_event, graph,\
        user_name_search, event_name_search,event_detail_search, related_user_search
from knowledge.time_utils import ts2datetime, datetime2ts,ts2date
from py2neo import Node, Relationship,Path,walk
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
                    {"wildcard":{'keywords':'*'+str(item.encode('utf-8'))+'*'}},            
                    {"wildcard":{'en_name':'*'+str(item.encode('utf-8'))+'*'}},            
                    {"wildcard":{'name':'*'+str(item.encode('utf-8'))+'*'}}         
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
                    {"wildcard":{'uid':'*'+str(item.encode('utf-8'))+'*'}},            
                    {"wildcard":{'uname':'*'+str(item.encode('utf-8'))+'*'}}
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
    if node_type2 == 'User':
        item_list_2 = search_user(search_item2)

    return {'node1':item_list_1,'node2':item_list_2,'node_type1':node_type1,'node_type2':node_type2}

def search_way(node1,node2,node_type1,node_type2):
    relation_type = ['join','pusher','maker','other_relationship', 'friend','relative','colleague','user_tag']
    index_type_dict = {'User':'node_index', 'Event':'event_index'}
    primary_idct = {'User':'uid','Event':'event'}
    key_dict = {'User':'uid','Event':'event_id'}
    origin_idlist = [node1,node2]
    print origin_idlist
    if node_type1 == 'User':
        start_node_card = related_user_search([node1],'activeness')[0]
    else:
        start_node_card = event_detail_search([node1],'start_ts')[0]

    if node_type2 == 'User':
        end_node_card = related_user_search([node2],'activeness')[0]
    else:
        end_node_card = event_detail_search([node2],'start_ts')[0]

    c_string = 'START node1 = node:'+index_type_dict[node_type1]+'('+primary_idct[node_type1]+'="'+node1+'"),'
    c_string += 'node2 = node:'+index_type_dict[node_type2]+'('+primary_idct[node_type2]+'="'+node2+'") '
    c_string += 'MATCH p = allShortestPaths(node1-[r*..5]-node2) return r'
    print c_string
    result = graph.run(c_string)

    # uid_list = []#for card
    # eid_list = []#for card
    middle_card = []#for card, middle nodes
    uid_dict = {}#for graph
    eid_dict = {}#for graph
    relation_all = list(result)
    # print relation_all,'!!!!!!!!!!!!!!!1'
    relation_result = []
    relation_result2 = []
    # print [relation_all[0]['r'] , relation_all[1]['r']]
    # if relation_all[0]['r'] == relation_all[1]['r']:
    #     return 'haha'
    # else:
    #     return [relation_all[0]['r'] , relation_all[1]['r']]
    length_relation = [0,0]
    length_relation[0] = len(relation_all)
    for relation in relation_all:
        # print list(relation['r']),'99999999999999999'
        if len(list(relation['r'])) < 2:
            return 0  #返回0 说明这两个节点有直接关系
        print relation,'relation'
        length_relation[1] = len(list(relation['r']))
        line_rel = []
        for i in relation['r']:
            # print i
            a =  walk(i)
            # print a
            this_relation = []
            # aa = []
            for m in a: #a=[node1,r,node2]
                try:
                    m.type()
                except:
                    aa = m.labels()
                    aa = [i for i in aa]
                    mm = dict(m)
                    # print mm,'========'
                    if mm.has_key('uid'):
                        # print mm
                        if m['uid'] == '1765891182':
                            print a,m,'----000000000000000000'
                        eu_name = user_name_search(m['uid'])
                        if uid_dict.has_key(m['uid']) == False:
                            uid_dict[m['uid']] = eu_name
                            if m['uid'] not in origin_idlist :
                                # print m['uid'], origin_idlist,'inininini'
                                mid_card = related_user_search([m['uid']],'activeness')
                                if len(mid_card) == 0:
                                    middle_card.append({'uid':m['uid']})
                                else:
                                    # print len(mid_card), '!!!!!!!!!!!!!'
                                    middle_card.append(mid_card[0])
                        this_relation.append([m['uid'], eu_name])
                        if [m['uid'], eu_name] not in line_rel:
                            line_rel.append([m['uid'], eu_name])
                    elif mm.has_key('event_id'):
                        eu_name = event_name_search(m['event_id'])
                        if eid_dict.has_key(m['event_id']) == False:
                            eid_dict[m['event_id']] = eu_name
                            if m['event_id'] not  in origin_idlist:
                                mid_card = event_detail_search([m['event_id']],'start_ts')
                                if len(mid_card) == 0:
                                    middle_card.append({'event_id':m['event_id']})
                                else:
                                    middle_card.append(mid_card[0])
                        this_relation.append([m['event_id'], eu_name])
                        if [m['event_id'], eu_name] not in line_rel:
                            line_rel.append([m['event_id'], eu_name])
                    else:
                        break

                if len(this_relation)>1:
                    if this_relation not in relation_result:
                        relation_result.append(this_relation)
        # print len(line_rel), length_relation[1],'000000000'
        # if len(line_rel) == length_relation[1]:
        #     relation_result2.append(line_rel)
    return {'relation':relation_result, 'start_node_card':start_node_card, 'end_node_card':end_node_card,\
            'user_nodes':uid_dict, 'event_nodes': eid_dict, 'middle_card':middle_card,'length_relation':length_relation}

