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

def theme_tab_graph(theme_name, node_type, relation_type, layer):
    s_string = 'START s0 = node:special_event_index(event="%s")\
                MATCH (s0)-[r]-(s) RETURN s.event_id as event' %theme_name
    print s_string
    event_result = graph.run(s_string)
    # print event_list
    # b = Node("Group", group=group_name)
    # print g.degree(b),'-=-=-=-=-=----------------'
    if node_type!='':
        node_type = ':' + node_type
    if relation_type!='':
        relation_type = ':' + relation_type
    event_relation = []
    # total_event = len(list(event_list))
    event_list = []
    nodes_list = [] #all nodes
    for event in event_result:
        event_value = event['event']
        event_list.append(event_value)#取event
    nodes_list.extend(event_list)
    print nodes_list,'-=-=-=-===================='
    if layer == '1':  #扩展一层
        for event_value in event_list:
            c_string = 'START s0 = node:event_index(event="'+str(event_value)+'") '
            c_string += 'MATCH (s0)-[r'+relation_type+']-(s1'+node_type+') return s0,r,s1 LIMIT 3'
            print c_string
            result = graph.run(c_string)
            for i in list(result):
                start_id = i['s0']['event_id']
                relation = i['r'].type()
                end_id = dict(i['s1'])
                if end_id.has_key('event'):
                    nodes_list.append(end_id['event'])
                    event_relation.append([start_id,relation,end_id['event']])
                if end_id.has_key('envent_id'):
                    nodes_list.append(end_id['envent_id'])
                    event_relation.append([start_id,relation,end_id['envent_id']])

    if layer == '2':  #扩展两层
        print layer,'layer'
        for event_value in event_list:
            c_string = 'START s0 = node:event_index(event="'+str(event_value)+'") '
            # c_string += 'MATCH (s0)-[r'+relation_type+']-(s1'+node_type+') return s0,r,s1 LIMIT 10'
            # print c_string
            # c_string += 'MATCH (s0)-[r]->(s1:Domain) RETURN s0.uid ,r,s1.uid' #只包含某一类的节点
            # # c_string += 'MATCH (s0)-[r:topic]->(s1) RETURN s0.uid ,r,s1.uid' #只包含某一类的关系
            c_string += 'MATCH (s0)-[r1'+relation_type+']-(s1'+node_type+')-\
                   [r2'+relation_type+']->(s2'+node_type+') RETURN s0,r1,s1,r2,s2 LIMIT 3' #两层无向关系
            # # c_string += 'MATCH (s0)-[r]->(s1) RETURN s0,r,s1' #一层有向关系
            # # c_string += 'MATCH (s0)-[r]-(s1) RETURN s0,r,s1' #一层无向关系
            print c_string

            result = graph.run(c_string)
            # print list(result),'-----------------'
            for i in list(result):
                start_id = i['s0']['event']
                # start_id = s0['event']
                relation1 = i['r1'].type()
                m_id = dict(i['s1'])
                if m_id.has_key('uid'):
                    middle_id = m_id['uid']
                    nodes_list.append(middle_id)
                    # event_relation.append([start_id,relation,end_id['uid']])
                if m_id.has_key('envent_id'):
                    middle_id = m_id['envent_id']
                    nodes_list.append(middle_id)
                relation2 = i['r2'].type()
                end_id = dict(i['s2'])
                if end_id.has_key('uid'):
                    nodes_list.append(end_id['uid'])
                    event_relation.append([start_id,relation1,middle_id,relation2,end_id['uid']])
                if end_id.has_key('envent_id'):
                    nodes_list.append(end_id['envent_id'])
                    event_relation.append([start_id,relation1,middle_id,relation2,end_id['envent_id']])
                    # event_relation.append([start_id,relation,end_id['envent_id']])
                # print i['s1'].labels()
                # print i['r'].type()#输出关系类型
                # print dict(i['s1'])#输出节点的属性
    return {'total_event':len(event_list),'nodes':nodes_list,\
                       'relation':event_relation}   

# 地图
def theme_tab_map(theme_name, node_type, relation_type, layer):
    
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