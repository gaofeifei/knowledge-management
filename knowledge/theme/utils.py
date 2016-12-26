# -*-coding:utf-8-*-

import time
import json
from knowledge.global_config import portrait_name, portrait_type, event_name, event_analysis_name, \
        neo4j_name, event_type, event_special, special_event_index_name, group_index_name, group_rel, node_index_name
from knowledge.global_utils import es_user_portrait, es_event, graph
from knowledge.time_utils import ts2datetime, datetime2ts
from py2neo import Node, Relationship
from py2neo.ogm import GraphObject, Property
from py2neo.packages.httpstream import http
from py2neo.ext.batman import ManualIndexManager
from py2neo.ext.batman import ManualIndexWriteBatch
http.socket_timeout = 9999

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
        # print v
    return ch_name


def theme_tab_graph(theme_name, node_type, relation_type, layer):
    s_string = 'START s0 = node:special_event_index(event="%s")\
                MATCH (s0)-[r]-(s) RETURN s.event_id as event' %theme_name
    # print s_string
    all_event_id = []#for map,event_id
    event_result = graph.run(s_string)
    # print event_list
    # b = Node("Group", group=group_name)
    # print g.degree(b),'-=-=-=-=-=----------------'
    if node_type!='':
        node_type = ':' + node_type
    # if relation_type!='':
    #     relation_type = ':' + relation_type
    event_relation = []
    # total_event = len(list(event_list))
    event_list = []
    e_nodes_list = [] #all event nodes
    u_nodes_list = [] #all user nodes
    for event in event_result:
        event_value = event['event']
        event_name = event_name_search(event_value)
        event_list.append([event_value,event_name])#取event
    e_nodes_list.extend(event_list)
    all_event_id.extend(event_list)
    # print nodes_list,'-=-=-=-===================='
    if layer == '1':  #扩展一层
        for event_value in event_list:
            c_string = 'START s0 = node:event_index(event="'+str(event_value[0])+'") '
            c_string += 'MATCH (s0)-[r]-(s1'+node_type+') WHERE type(r) in '+ json.dumps(relation_type) +' return s0,r,s1 LIMIT 3'
            print c_string
            result = graph.run(c_string)
            for i in list(result):
                start_id = i['s0']['event_id']
                relation = i['r'].type()
                end_id = dict(i['s1'])
                if end_id.has_key('uid'):
                    u_nodes_list.append(end_id['uid'])
                    event_relation.append([start_id,relation,end_id['uid']])
                if end_id.has_key('envent_id'):
                    event_name = event_name_search(end_id['envent_id'])
                    e_nodes_list.append([end_id['envent_id'],event_name])
                    all_event_id.append([end_id['envent_id'], event_name])
                    event_relation.append([start_id,relation,end_id['envent_id']])
    if layer == '2':  #扩展两层
        print layer,'layer'
        for event_value in event_list:
            c_string = 'START s0 = node:event_index(event="'+str(event_value[0])+'") '
            c_string += 'MATCH (s0)-[r1]-(s1'+node_type+') WHERE type(r1) in '+ json.dumps(relation_type) +' return s0,r1,s1 LIMIT 10'
            print c_string,'==========='
            
            mid_eid_list = []  #存放第一层的数据，再以这些为起始点，扩展第二层
            mid_uid_list = []
            result = graph.run(c_string)

            # print list(result),'-----------------'
            for i in list(result):
                print i
                start_id = i['s0']['event']
                # start_id = s0['event']
                relation1 = i['r1'].type()
                m_id = dict(i['s1'])
                if m_id.has_key('uid'):
                    middle_id = m_id['uid']
                    mid_uid_list.append(middle_id)
                    user_name = user_name_search(middle_id)
                    u_nodes_list.append([middle_id,user_name])
                    event_relation.append([start_id,relation1,middle_id])
                if m_id.has_key('envent_id'):
                    middle_id = m_id['envent_id']
                    mid_eid_list.append(middle_id)
                    event_name = event_name_search(middle_id)
                    e_nodes_list.append([middle_id,event_name])
                    all_event_id.append([middle_id,event_name])
                    event_relation.append([start_id,relation1,middle_id])
        print mid_uid_list
        print mid_eid_list,'++++++++++++++++'
        for mid_uid in mid_uid_list:
            c_string = 'START s1 = node:node_index(uid="'+str(mid_uid)+'") '
            c_string += 'MATCH (s1)-[r2]->(s2'+node_type+') WHERE type(r2) in '+ json.dumps(relation_type) +' return s1,r2,s2 LIMIT 5'
            uid_result = graph.run(c_string)

            for i in uid_result:
                relation2 = i['r2'].type()
                end_id = dict(i['s2'])
                if end_id.has_key('uid'):
                    user_name = user_name_search(end_id['uid'])
                    u_nodes_list.append([end_id['uid'],user_name])
                    event_relation.append([mid_uid,relation2,end_id['uid']])
                if end_id.has_key('envent_id'):
                    event_name = event_name_search(end_id['envent_id'])
                    e_nodes_list.append([end_id['envent_id'], event_name])
                    all_event_id.append([end_id['envent_id'], event_name])
                    event_relation.append([mid_uid, relation2,end_id['envent_id']])
        for mid_eid in mid_eid_list:
            c_string = 'START s1 = node:event_index(event="'+str(mid_eid)+'") '
            c_string += 'MATCH (s1)-[r2]->(s2'+node_type+')  WHERE type(r2) in '+ json.dumps(relation_type) +' return s1,r2,s2 LIMIT 5'
            eid_result = graph.run(c_string)
            for i in eid_result:
                relation2 = i['r2'].type()
                end_id = dict(i['s2'])
                if end_id.has_key('uid'):
                    user_name = user_name_search(end_id['uid'])
                    u_nodes_list.append([end_id['uid'],user_name])
                    event_relation.append([mid_eid,relation2,end_id['uid']])
                if end_id.has_key('envent_id'):
                    event_name = event_name_search(end_id['envent_id'])
                    e_nodes_list.append([end_id['envent_id'], event_name])
                    all_event_id.append([end_id['envent_id'], event_name])
                    event_relation.append([mid_eid, relation2,end_id['envent_id']])

    return {'total_event':len(event_list),'user_nodes':u_nodes_list,'event_nodes':e_nodes_list,\
            'map_event_id':all_event_id, 'relation':event_relation}   

# 地图
def theme_tab_map(theme_name, node_type, relation_type, layer):
    
    tab_theme_result = theme_tab_graph(theme_name, node_type, relation_type, layer)
    uid_list_origin = tab_theme_result['map_event_id']
    uid_list = [i[0] for i in uid_list_origin]
    print uid_list
    results = es_event.mget(index=event_analysis_name, doc_type=event_type, \
                body={'ids': uid_list},_source=False, fields=['geo_weibo_count'])['docs']
    
    # print results
    geo_list = []
    for i in results:
        # print type(i['fields']['geo_weibo_count'][0]),'==========='
        geo_list.extend(json.loads(i['fields']['geo_weibo_count'][0]))
    # print geo_list,'!!!!!!!!!!!!!!!!!!'
    location_dict = dict()
    for geo in geo_list:
        # geo = json.loads(geo_o)
        # print geo,'=====/========'
        # del geo[1]['total']
        # del geo[1]['unknown']
        for k,v in geo[1].iteritems():
            if k == 'total' or k == 'unknown':
                continue
            location_dict[geo[0]+' '+k] = v
    # print location_dict
    # for item in results:
    #     if item["key"] == "" or item["key"] == "unknown" or item['key'] == u'其他':
    #         continue
    #     location_dict[item["key"]] = item["doc_count"]

    filter_location = dict()
    for k,v in location_dict.iteritems():
        tmp = k.split(' ')
        if u'北京' in k or u'天津' in k or u'上海' in k or u'重庆' in k or u'香港' in k or u'澳门' in k:
            try:
                filter_location[tmp[1]] += v
            except:
                filter_location[tmp[1]] = v
        elif len(tmp) == 1:
            continue
        else:
            try:
                # filter_location[k] += v
                filter_location[tmp[1]] += v
            except:
                # filter_location[k] = v
                filter_location[tmp[1]] = v
 
    #检查一下群体和话题的两层关系，然后再看这个地理位置对不对修改了189/192行
    return_results = sorted(filter_location.iteritems(), key=lambda x:x[1], reverse=True)
    return return_results