# -*-coding:utf-8-*-

import time
import json
from knowledge.global_config import portrait_name, portrait_type, event_name, event_analysis_name, \
        neo4j_name, event_type, event_special, special_event_index_name, group_index_name, group_rel, node_index_name
from knowledge.global_utils import es_user_portrait, es_event, graph,\
        user_name_search, event_name_search
from knowledge.time_utils import ts2datetime, datetime2ts,ts2date
from py2neo import Node, Relationship
from py2neo.ogm import GraphObject, Property
from py2neo.packages.httpstream import http
from py2neo.ext.batman import ManualIndexManager
from py2neo.ext.batman import ManualIndexWriteBatch
http.socket_timeout = 9999

#查找该专题下事件关联的用户信息
def related_user_search(uid_list,sort_flag):

    query_body = {
        'query':{
            'terms':{'uid':uid_list}
            },
        "sort": [{sort_flag:'desc'}]
    }
    fields_list = ['activeness', 'importnace','sensitive','uname','fansnum',\
                   'domain','topic_string','user_tag']

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

#查找该专题下的事件主题河流数据
def event_river_search(eid_list):
    query_body = {
        'query':{
            'terms':{'en_name':eid_list}
            }
        # "sort": [{sort_flag:'desc'}]
    }
    
    fields_list = ['time_type_weibo','name']
    print eid_list
    event_detail = es_event.search(index=event_analysis_name, doc_type=event_type, \
                body=query_body, _source=False, fields=fields_list)['hits']['hits']
    detail_result = {}
    for i in event_detail:
        name_i = i['fields']['name'][0]
        single_river = []
        river = json.loads(i['fields']['time_type_weibo'][0])
        print name_i.encode('utf-8')
        for r in river:
            time_r = []
            river_value = 0
            for ki, vi in r[1].iteritems():
                river_value += vi
            time_r.append(ts2date(r[0]))
            time_r.append(river_value)
            single_river.append(time_r)
        detail_result[name_i]=single_river
    return detail_result

# 查找该专题下的包含事件卡片信息
def event_detail_search(eid_list,sort_flag):

    query_body = {
        'query':{
            'terms':{'en_name':eid_list}
            },
        "sort": [{sort_flag:'desc'}]
    }
    fields_list = ['name', 'counts','start_ts','location','renshu','user_tag','description']

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



def query_event_river(theme_name):  #专题概览，所有专题及其事件数量
    s_string = 'START s0 = node:special_event_index(event="%s")\
                MATCH (s0)-[r]-(s) RETURN s.event_id as event' %theme_name
    event_result = graph.run(s_string)
    event_list = []
    for event in event_result:
        event_value = event['event']
        event_list.append(event_value)
    detail_result = event_river_search(event_list)
    # return len(event_list)
    return {'event_num':len(event_list),'river_data':detail_result}

def query_detail_theme(theme_name, sort_flag):
    s_string = 'START s0 = node:special_event_index(event="%s")\
                MATCH (s0)-[r]-(s) RETURN s.event_id as event' %theme_name
    event_result = graph.run(s_string)
    event_list = []
    for event in event_result:
        event_value = event['event']
        event_list.append(event_value)
    detail_result = event_detail_search(event_list, sort_flag)
    return detail_result

def query_theme_user(theme_name, sort_flag):
    s_string = 'START s0 = node:special_event_index(event="%s")\
                MATCH (s0)-[r]-(s) RETURN s.event_id as event' %theme_name
    event_result = graph.run(s_string)
    uid_list = []
    for event in event_result:
        # print 
        event_value = event['event']
        # event_list.append(event_value)
        c_string = 'START s0 = node:event_index(event="'+str(event_value)+'") '
        c_string += 'MATCH (s0)-[r]-(s1:User) return s1 LIMIT 50'
        print c_string
        result = graph.run(c_string)
        for i in list(result):
            end_id = dict(i['s1'])
            uid_list.append(end_id['uid'])
    print len(uid_list)
    detail_result = related_user_search(uid_list, sort_flag)
    return detail_result

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
    e_nodes_list = {} #all event nodes
    u_nodes_list = {} #all user nodes
    for event in event_result:
        event_value = event['event']
        event_name = event_name_search(event_value)
        event_list.append([event_value,event_name])#取event
        e_nodes_list[event_value] = event_name
    all_event_id.extend(event_list)
    # print nodes_list,'-=-=-=-===================='
    if layer == '0':  #不扩展
        pass
    if layer == '1':  #扩展一层
        for event_value in event_list:
            c_string = 'START s0 = node:event_index(event="'+str(event_value[0])+'") '
            c_string += 'MATCH (s0)-[r]-(s1'+node_type+') WHERE type(r) in '+ json.dumps(relation_type) +' return s0,r,s1 LIMIT 10'
            # print c_string,'!!!!!'
            result = graph.run(c_string)
            for i in list(result):
                start_id = dict(i['s0'])['event_id']
                # print start_id,'============='
                relation = i['r'].type()
                end_id = dict(i['s1'])
                if end_id.has_key('uid'):
                    user_name = user_name_search(end_id['uid'])
                    u_nodes_list[end_id['uid']] = user_name
                    event_relation.append([start_id,relation,end_id['uid']])
                if end_id.has_key('envent_id'):
                    event_name = event_name_search(end_id['envent_id'])
                    e_nodes_list[end_id['envent_id']] = event_name
                    all_event_id.append([end_id['envent_id'], event_name])
                    event_relation.append([start_id,relation,end_id['envent_id']])
    if layer == '2':  #扩展两层
        print layer,'layer'
        for event_value in event_list:
            c_string = 'START s0 = node:event_index(event="'+str(event_value[0])+'") '
            c_string += 'MATCH (s0)-[r1]-(s1'+node_type+') WHERE type(r1) in '+ json.dumps(relation_type) +' return s0,r1,s1 LIMIT 10'
            # print c_string,'==========='
            
            mid_eid_list = []  #存放第一层的数据，再以这些为起始点，扩展第二层
            mid_uid_list = []
            result = graph.run(c_string)

            # print list(result),'-----------------'
            for i in list(result):
                print i
                start_id = i['s0']['event_id']
                # start_id = s0['event']
                relation1 = i['r1'].type()
                m_id = dict(i['s1'])
                if m_id.has_key('uid'):
                    middle_id = m_id['uid']
                    mid_uid_list.append(middle_id)
                    user_name = user_name_search(middle_id)
                    u_nodes_list[middle_id] = user_name
                    event_relation.append([start_id,relation1,middle_id])
                if m_id.has_key('envent_id'):
                    middle_id = m_id['envent_id']
                    mid_eid_list.append(middle_id)
                    event_name = event_name_search(middle_id)
                    e_nodes_list[middle_id] = event_name
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
                    u_nodes_list[end_id['uid']] = user_name
                    event_relation.append([mid_uid,relation2,end_id['uid']])
                if end_id.has_key('envent_id'):
                    event_name = event_name_search(end_id['envent_id'])
                    e_nodes_list[end_id['envent_id']] = event_name
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
                    u_nodes_list[end_id['uid']] = user_name
                    event_relation.append([mid_eid,relation2,end_id['uid']])
                if end_id.has_key('envent_id'):
                    event_name = event_name_search(end_id['envent_id'])
                    e_nodes_list[end_id['envent_id']] = event_name
                    all_event_id.append([end_id['envent_id'], event_name])
                    event_relation.append([mid_eid, relation2,end_id['envent_id']])

    return {'total_event':len(event_list),'user_nodes':u_nodes_list,'event_nodes':e_nodes_list,\
            'map_event_id':all_event_id, 'relation':event_relation}   

# 地图
def theme_tab_map(theme_name, node_type, relation_type, layer):
    black_country = [u'美国',u'其他',u'法国',u'英国']
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
        if tmp[1] in black_country:
            continue
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