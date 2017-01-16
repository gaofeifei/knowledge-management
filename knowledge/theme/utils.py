# -*-coding:utf-8-*-

import time
import json
from knowledge.global_config import portrait_name, portrait_type, event_name, event_analysis_name, \
        neo4j_name, event_type, event_special, special_event_index_name, group_index_name, group_rel, node_index_name
from knowledge.global_utils import es_user_portrait, es_event, graph,\
        user_name_search, event_name_search,event_detail_search, related_user_search
from knowledge.time_utils import ts2datetime, datetime2ts,ts2date
from py2neo import Node, Relationship,walk
from py2neo.ogm import GraphObject, Property
from py2neo.packages.httpstream import http
from py2neo.ext.batman import ManualIndexManager
from py2neo.ext.batman import ManualIndexWriteBatch
http.socket_timeout = 9999

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
    print event_list,'=========='
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
    s_string2 = 'START s0 = node:special_event_index(event="%s")\
                MATCH (s0)-[r]-(s) RETURN r' %theme_name
    event_result_r = graph.run(s_string2)
    relation_list_o = []
    for r in event_result_r:
        r1 = dict(r)['r']
        relation_list_o.append(r1)

    # print event_list
    # b = Node("Group", group=group_name)
    # print g.degree(b),'-=-=-=-=-=----------------'
    if node_type!='':
        node_type = ':' + node_type
    # if relation_type!='':
    #     relation_type = ':' + relation_type
    event_relation = []
    only_event_o = []
    # total_event = len(list(event_list))
    event_list = []
    e_nodes_list = {} #all event nodes
    u_nodes_list = {} #all user nodes
    for event in event_result:
        event_value = event['event']
        only_event_o.append(event_value)
        event_name = event_name_search(event_value)
        event_list.append([event_value,event_name])#取event
        e_nodes_list[event_value] = event_name
    all_event_id.extend(event_list)

    relation = get_graph_single(only_event_o, node_type, relation_type, layer)
    relation.extend(relation_list_o)
    relation = [i for i in set(relation)]
    result = draw_graph(relation)

    # try:
    #     result['node']['event'][theme_name] = theme_name
    # except:
    #     result['node']['event'] = {}
    #     result['node']['event'][theme_name] = theme_name

    for i in only_event_o:
        # e_name = event_name_search(i)
        # try:
        #     result['node']['event_id'][i] = e_name
        # except:
        #     result['node']['event_id'] ={}
        #     result['node']['event_id'][i] = e_name
        try:
            result['map_eid'].append(i)
        except:
            result['map_eid'] = []
            result['map_eid'].append(i)
    result['map_eid'] = [i for i in set(result['map_eid'])]
    # print len(result['node']['event_id']), len(result['map_eid'])
    return result
    # print nodes_list,'-=-=-=-===================='
    # if layer == '0':  #不扩展
    #     for event_value in event_list:
    #         c_string = 'START s0 = node:event_index(event="'+str(event_value[0])+'") '
    #         c_string += 'MATCH (s0)-[r]-(s1) WHERE s1.event_id in '+ json.dumps(event_value) +' return s0,r,s1 LIMIT 10'
    #         print c_string,'!!!!!'
    #         result = graph.run(c_string)
    #         for i in list(result):
    #             start_id = dict(i['s0'])['event_id']
    #             # print start_id,'============='
    #             relation = i['r'].type()
    #             end_id = dict(i['s1'])
    #             if end_id.has_key('uid'):
    #                 user_name = user_name_search(end_id['uid'])
    #                 u_nodes_list[end_id['uid']] = user_name
    #                 event_relation.append([start_id,relation,end_id['uid']])
    #             if end_id.has_key('envent_id'):
    #                 event_name = event_name_search(end_id['envent_id'])
    #                 e_nodes_list[end_id['envent_id']] = event_name
    #                 all_event_id.append([end_id['envent_id'], event_name])
    #                 event_relation.append([start_id,relation,end_id['envent_id']])
    # if layer == '1':  #扩展一层
    #     for event_value in event_list:
    #         c_string = 'START s0 = node:event_index(event="'+str(event_value[0])+'") '
    #         c_string += 'MATCH (s0)-[r]-(s1'+node_type+') WHERE type(r) in '+ json.dumps(relation_type) +' return s0,r,s1 LIMIT 10'
    #         # print c_string,'!!!!!'
    #         result = graph.run(c_string)
    #         for i in list(result):
    #             start_id = dict(i['s0'])['event_id']
    #             # print start_id,'============='
    #             relation = i['r'].type()
    #             end_id = dict(i['s1'])
    #             if end_id.has_key('uid'):
    #                 user_name = user_name_search(end_id['uid'])
    #                 u_nodes_list[end_id['uid']] = user_name
    #                 event_relation.append([start_id,relation,end_id['uid']])
    #             if end_id.has_key('envent_id'):
    #                 event_name = event_name_search(end_id['envent_id'])
    #                 e_nodes_list[end_id['envent_id']] = event_name
    #                 all_event_id.append([end_id['envent_id'], event_name])
    #                 event_relation.append([start_id,relation,end_id['envent_id']])
    # if layer == '2':  #扩展两层
    #     print layer,'layer'
    #     for event_value in event_list:
    #         c_string = 'START s0 = node:event_index(event="'+str(event_value[0])+'") '
    #         c_string += 'MATCH (s0)-[r1]-(s1'+node_type+') WHERE type(r1) in '+ json.dumps(relation_type) +' return s0,r1,s1 LIMIT 10'
    #         # print c_string,'==========='
            
    #         mid_eid_list = []  #存放第一层的数据，再以这些为起始点，扩展第二层
    #         mid_uid_list = []
    #         result = graph.run(c_string)

    #         # print list(result),'-----------------'
    #         for i in list(result):
    #             print i
    #             start_id = i['s0']['event_id']
    #             # start_id = s0['event']
    #             relation1 = i['r1'].type()
    #             m_id = dict(i['s1'])
    #             if m_id.has_key('uid'):
    #                 middle_id = m_id['uid']
    #                 mid_uid_list.append(middle_id)
    #                 user_name = user_name_search(middle_id)
    #                 u_nodes_list[middle_id] = user_name
    #                 event_relation.append([start_id,relation1,middle_id])
    #             if m_id.has_key('envent_id'):
    #                 middle_id = m_id['envent_id']
    #                 mid_eid_list.append(middle_id)
    #                 event_name = event_name_search(middle_id)
    #                 e_nodes_list[middle_id] = event_name
    #                 all_event_id.append([middle_id,event_name])
    #                 event_relation.append([start_id,relation1,middle_id])
    #     print mid_uid_list
    #     print mid_eid_list,'++++++++++++++++'
    #     for mid_uid in mid_uid_list:
    #         c_string = 'START s1 = node:node_index(uid="'+str(mid_uid)+'") '
    #         c_string += 'MATCH (s1)-[r2]->(s2'+node_type+') WHERE type(r2) in '+ json.dumps(relation_type) +' return s1,r2,s2 LIMIT 5'
    #         uid_result = graph.run(c_string)

    #         for i in uid_result:
    #             relation2 = i['r2'].type()
    #             end_id = dict(i['s2'])
    #             if end_id.has_key('uid'):
    #                 user_name = user_name_search(end_id['uid'])
    #                 u_nodes_list[end_id['uid']] = user_name
    #                 event_relation.append([mid_uid,relation2,end_id['uid']])
    #             if end_id.has_key('envent_id'):
    #                 event_name = event_name_search(end_id['envent_id'])
    #                 e_nodes_list[end_id['envent_id']] = event_name
    #                 all_event_id.append([end_id['envent_id'], event_name])
    #                 event_relation.append([mid_uid, relation2,end_id['envent_id']])
    #     for mid_eid in mid_eid_list:
    #         c_string = 'START s1 = node:event_index(event="'+str(mid_eid)+'") '
    #         c_string += 'MATCH (s1)-[r2]->(s2'+node_type+')  WHERE type(r2) in '+ json.dumps(relation_type) +' return s1,r2,s2 LIMIT 5'
    #         eid_result = graph.run(c_string)
    #         for i in eid_result:
    #             relation2 = i['r2'].type()
    #             end_id = dict(i['s2'])
    #             if end_id.has_key('uid'):
    #                 user_name = user_name_search(end_id['uid'])
    #                 u_nodes_list[end_id['uid']] = user_name
    #                 event_relation.append([mid_eid,relation2,end_id['uid']])
    #             if end_id.has_key('envent_id'):
    #                 event_name = event_name_search(end_id['envent_id'])
    #                 e_nodes_list[end_id['envent_id']] = event_name
    #                 all_event_id.append([end_id['envent_id'], event_name])
    #                 event_relation.append([mid_eid, relation2,end_id['envent_id']])

    # return {'total_event':len(event_list),'user_nodes':u_nodes_list,'event_nodes':e_nodes_list,\
    #         'map_eid':all_event_id, 'relation':event_relation}   

# 地图
def theme_tab_map(theme_name, node_type, relation_type, layer):
    black_country = [u'美国',u'其他',u'法国',u'英国']
    tab_theme_result = theme_tab_graph(theme_name, node_type, relation_type, layer)
    uid_list_origin = tab_theme_result['map_eid']
    uid_list = [i for i in uid_list_origin]
    print uid_list, len(uid_list),'--------++++++++++------------'
    results = es_event.mget(index=event_analysis_name, doc_type=event_type, \
                body={'ids': uid_list},_source=False, fields=['geo_weibo_count'])['docs']
    
    geo_list = []
    for i in results:
        geo_list.extend(json.loads(i['fields']['geo_weibo_count'][0]))
    print len(geo_list)
    location_dict = dict()
    for geo in geo_list:
        for k,v in geo[1].iteritems():
            if k == 'total' or k == 'unknown':
                continue
            try:
                location_dict[geo[0]+' '+k] += v
            except:
                location_dict[geo[0]+' '+k] = v
    print location_dict
    filter_location = dict()
    for k,v in location_dict.iteritems():
        tmp = k.split(' ')
        if tmp[1] in black_country or u'国' in tmp[1]:
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
                filter_location[tmp[1]] += v
            except:
                filter_location[tmp[1]] = v
 
    return_results = sorted(filter_location.iteritems(), key=lambda x:x[1], reverse=True)
    return return_results


def event_list_theme(event):
    s_string = 'START s0 = node:special_event_index(event="%s")\
                MATCH (s0)-[r]-(s:Event) RETURN s' %(event)
    # print s_string
    e_list = graph.run(s_string)
    e_list_l = []
    for i in e_list:
        print i
        e_this = dict(i)['s']['event_id']
        e_name = event_name_search(e_this)
        e_list_l.append([e_this, e_name])
    return e_list_l

def del_e_theme_rel(theme_name, event_id):
    s_string = 'START s0 = node:special_event_index(event="%s"),s3 = node:event_index(event="%s")\
                MATCH (s0)-[r]-(s) DELETE r' %(theme_name, event_id)

    print s_string
    graph.run(s_string)
    return 'true'

def search_related_event_f(item):
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

    for event_value in event_id_list:
        c_string = 'START s0 = node:event_index(event="'+str(event_value[0])+'") '
        c_string += 'MATCH (s0)-[r1]-(s1) return s0,r1,s1 LIMIT 10'
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
                event_name2 = event_name_search(middle_id)
                e_nodes_list[middle_id] = event_name2
                event_relation.append([start_id,relation1,middle_id])
    print mid_uid_list
    print mid_eid_list,'++++++++++++++++'
    for mid_uid in mid_uid_list:
        c_string = 'START s1 = node:node_index(uid="'+str(mid_uid)+'") '
        c_string += 'MATCH (s1)-[r2]->(s2:Event) return s1,r2,s2 LIMIT 5'
        uid_result = graph.run(c_string)

        for i in uid_result:
            relation2 = i['r2'].type()
            end_id = dict(i['s2'])
            if end_id.has_key('uid'):
                user_name = user_name_search(end_id['uid'])
                u_nodes_list[end_id['uid']] = user_name
                event_relation.append([mid_uid,relation2,end_id['uid']])
            if end_id.has_key('envent_id'):
                event_name2 = event_name_search(end_id['envent_id'])
                e_nodes_list[end_id['envent_id']] = event_name2
                event_relation.append([mid_uid, relation2,end_id['envent_id']])
    for mid_eid in mid_eid_list:
        c_string = 'START s1 = node:event_index(event="'+str(mid_eid)+'") '
        c_string += 'MATCH (s1)-[r2]->(s2:Event) return s1,r2,s2 LIMIT 5'
        eid_result = graph.run(c_string)
        for i in eid_result:
            relation2 = i['r2'].type()
            end_id = dict(i['s2'])
            if end_id.has_key('uid'):
                user_name = user_name_search(end_id['uid'])
                u_nodes_list[end_id['uid']] = user_name
                event_relation.append([mid_eid,relation2,end_id['uid']])
            if end_id.has_key('envent_id'):
                event_name2 = event_name_search(end_id['envent_id'])
                e_nodes_list[end_id['envent_id']] = event_name2
                event_relation.append([mid_eid, relation2,end_id['envent_id']])

    return {'total_event':len(event_id_list),'user_nodes':u_nodes_list,'event_nodes':e_nodes_list,\
            'relation':event_relation}   

def search_related_e_card(item,layer):
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
        # print name_results,'@@@@@@@@@@@@@@@@@'
    except:
        return 'does not ex2ist'
    for i in name_results:
        print i
        name = i['fields']['name'][0]
        en_name = i['fields']['en_name'][0]
        only_eid.append(en_name)
        e_nodes_list[en_name] = name
        event_id_list.append([en_name, name])

    print  len(event_id_list),'========='
    if layer == '1':
        for eid_value in event_id_list: 
            c_string = 'START s0 = node:event_index(event="'+str(eid_value[0])+'") '
            c_string += 'MATCH (s0)-[r1]-(s1:Event) return s0,r1,s1 LIMIT 100'
            result = graph.run(c_string)
            for i in list(result):
                m_id = dict(i['s1'])['event_id']
                if m_id not in only_eid:
                    only_eid.append(m_id)
        result_card = event_detail_search(only_eid, 'start_ts')

    if layer == '2':
        for eid_value in event_id_list: 
            c_string = 'START s0 = node:event_index(event="'+str(eid_value[0])+'") '
            c_string += 'MATCH (s0)-[r1]-(ss)-[r]-(s1:Event) return ss, s1 LIMIT 100'
            result = graph.run(c_string)
            for i in list(result):
                ss_id = dict(i['ss'])
                # print ss_id,'???????????/'
                if ss_id.has_key('uid') or ss_id.has_key('event_id'):
                    m_id = dict(i['s1'])['event_id']
                    if m_id not in only_eid:
                        only_eid.append(m_id)
                else:
                    print '00000'
        print only_eid,'000000000000'
        result_card = event_detail_search(only_eid, 'start_ts')

    if layer == 'all':
        eid_list_all =[]
        result = search_related_event_f(item)
        eid_dict = result['event_nodes']
        for k,v in eid_dict.iteritems():
            eid_list_all.append(k)
        result_card = event_detail_search(eid_list_all,'start_ts')

    return result_card


def compare_user_theme(theme_name1, theme_name2, sort_flag,diff):
    s_string1 = 'START s0 = node:special_event_index(event="%s")\
                MATCH (s0)-[r]-(s) RETURN s.event_id as event' %theme_name1
    event_result1 = graph.run(s_string1)
    uid_list1 = []
    for event in event_result1:
        # print 
        event_value = event['event']
        # event_list.append(event_value)
        c_string = 'START s0 = node:event_index(event="'+str(event_value)+'") '
        c_string += 'MATCH (s0)-[r]-(s1:User) return s1 LIMIT 50'
        print c_string
        result = graph.run(c_string)
        for i in list(result):
            end_id = dict(i['s1'])
            uid_list1.append(end_id['uid'])

    s_string2 = 'START s0 = node:special_event_index(event="%s")\
                MATCH (s0)-[r]-(s) RETURN s.event_id as event' %theme_name2
    event_result2 = graph.run(s_string2)
    uid_list2 = []
    for event in event_result2:
        # print 
        event_value = event['event']
        # event_list.append(event_value)
        c_string = 'START s0 = node:event_index(event="'+str(event_value)+'") '
        c_string += 'MATCH (s0)-[r]-(s1:User) return s1 LIMIT 100'
        result = graph.run(c_string)
        for i in list(result):
            end_id = dict(i['s1'])
            uid_list2.append(end_id['uid'])

    if diff == '0':
        uid_list1 = [i for i in set(uid_list1)]
        uid_list2 = [i for i in set(uid_list2)]
        detail_result1 = related_user_search(uid_list1,sort_flag)
        detail_result2 = related_user_search(uid_list2,sort_flag)

    if diff == '1':
        same_u = set(uid_list1)&set(uid_list2)
        same_u = [i for i in same_u]
        detail_result1 = related_user_search(same_u,sort_flag)
        detail_result2 = related_user_search(same_u,sort_flag)

    if diff == '2':
        diff_u1 = set(uid_list1) - (set(uid_list1)&set(uid_list2))
        diff_u1 = [i for i in diff_u1]
        diff_u2 = set(uid_list2) - (set(uid_list1)&set(uid_list2))
        diff_u2 = [i for i in diff_u2]
        detail_result1 = related_user_search(diff_u1,sort_flag)
        detail_result2 = related_user_search(diff_u2,sort_flag)
    return {'detail_result1':detail_result1,'detail_result2':detail_result2}

def compare_event_theme(theme_name1, theme_name2, sort_flag, diff):

    s_string1 = 'START s0 = node:special_event_index(event="%s")\
                MATCH (s0)-[r]-(s) RETURN s.event_id as event' %theme_name1
    event_result1 = graph.run(s_string1)
    event_list1 = []
    for event in event_result1:
        event_value = event['event']
        event_list1.append(event_value)

    s_string2 = 'START s0 = node:special_event_index(event="%s")\
                MATCH (s0)-[r]-(s) RETURN s.event_id as event' %theme_name2
    event_result2 = graph.run(s_string2)
    event_list2 = []
    for event in event_result2:
        event_value = event['event']
        event_list2.append(event_value)

    if diff == '0':
        detail_result1 = event_detail_search(event_list1,sort_flag)
        detail_result2 = event_detail_search(event_list2,sort_flag)

    if diff == '1':
        same_e = set(event_list1)&set(event_list2)
        same_e = [i for i in same_e]
        detail_result1 = event_detail_search(same_e,sort_flag)
        detail_result2 = event_detail_search(same_e,sort_flag)

    if diff == '2':
        diff_e1 = set(event_list1) - (set(event_list1)&set(event_list2))
        diff_e1 = [i for i in diff_e1]
        diff_e2 = set(event_list2) - (set(event_list1)&set(event_list2))
        diff_e2 = [i for i in diff_e2]
        detail_result1 = event_detail_search(diff_e1,sort_flag)
        detail_result2 = event_detail_search(diff_e2,sort_flag)
    return {'detail_result1':detail_result1,'detail_result2':detail_result2}

def get_graph_single(eid_list, node_type, relation_type, layer):
    print eid_list
    relation_list = []
    for i in eid_list:
        if layer == '0':
            c_string = 'START s0=node:event_index(event="'+str(i)+'") '
            c_string += 'MATCH (s0)-[r]-(s1:Event) WHERE (s1.event_id in '+ json.dumps(eid_list)\
                     + 'and type(r) in '+ json.dumps(relation_type)  +') return r LIMIT 500'
            result = graph.run(c_string)
            for r in result:
                r1 = dict(r)['r']
                relation_list.append(r1)
        if layer == '1':
            c_string = 'START s0=node:event_index(event="'+str(i)+'") '
            c_string += 'MATCH (s0)-[r]-(s1'+node_type+') WHERE type(r) in '+ json.dumps(relation_type) +' return r LIMIT 10'
            # c_string += 'MATCH (s0)-[r]-(s1)  return r LIMIT 1'
            result = graph.run(c_string)
            for r in result:
                r1 = dict(r)['r']
                relation_list.append(r1)
        if layer == '2':
            c_string = 'START s0=node:event_index(event="'+str(i)+'") '
            c_string += 'MATCH (s0)-[r]-(s1)-[r2]-(s2) WHERE (type(r) in '+ json.dumps(relation_type)\
                     + 'and type(r2) in '+ json.dumps(relation_type)  +') return r,r2 LIMIT 10'
            result = graph.run(c_string)
            for r in result:
                print r['r']
                r1 = dict(r)['r']
                relation_list.append(r1)
                r2 = dict(r)['r2']
                relation_list.append(r2)

    return relation_list


def get_graph(eid_list, layer):
    # print eid_list
    relation_list = []
    for i in eid_list:
        if layer == '0':
            c_string = 'START s0=node:event_index(event="'+str(i)+'") '
            c_string += 'MATCH (s0)-[r]-(s1:Event) WHERE s1.event_id in '+ json.dumps(eid_list)+ ' return r LIMIT 1000'
            result = graph.run(c_string)
            for r in result:
                r1 = dict(r)['r']
                relation_list.append(r1)
        if layer == '1':
            c_string = 'START s0=node:event_index(event="'+str(i)+'") '
            c_string += 'MATCH (s0)-[r]-(s1)  return r LIMIT 1'
            result = graph.run(c_string)
            for r in result:
                r1 = dict(r)['r']
                relation_list.append(r1)
        if layer == '2':
            c_string = 'START s0=node:event_index(event="'+str(i)+'") '
            c_string += 'MATCH (s0)-[r]-(s1)-[r2]-(s2) return r,r2 LIMIT 10'
            result = graph.run(c_string)
            for r in result:
                r1 = dict(r)['r']
                relation_list.append(r1)
                r2 = dict(r)['r2']
                relation_list.append(r2)
    # result_list = list(result)
    # print relation_list
    return relation_list

def draw_graph(relation_list):
    result = {}
    key_dict = {'User':'uid','Event':'event_id','Group':'group','SpecialEvent':'event'}
    map_eid = []
    result_relation = [] #[[node1,relation,node2],...]
    for i in relation_list:
        # print i,'**********************'
        this_relation = ['','','']  #[node1,relation,node2]
        only_relation = []#[node1,node2]
        for m in walk(i):
            try:
                this_relation[1] = m.type()
                # print m.type(),'!!!!!!!!!'
            except:
                aa = m.labels()
                aa = [i for i in aa]
                if len(aa) == 1:
                    try:
                        primary_key = key_dict[aa[0]]
                    except:
                        continue
                    primary_value = m[primary_key]
                    only_relation.append(primary_value)
                    if aa[0] == 'User':
                        eu_name = user_name_search(m['uid'])
                    elif aa[0] == 'Event':
                        # print m['event_id'].encode('utf-8'),'************'
                        if m['event_id'] in [u'徐玉玉事件',u'大学生失联'] :
                            continue
                        eu_name = event_name_search(m['event_id'])
                        map_eid.append(m['event_id'])
                    else:
                        eu_name = m[primary_key]
                if len(aa) >1 or len(aa) <1:
                    primary_key = 'User'
                    primary_value = m[primary_key]
                    eu_name = user_name_search(m['uid'])
                    only_relation.append(m['uid'])
                try:
                    result[primary_key][primary_value] = eu_name
                except:
                    result[primary_key] = {}
                    result[primary_key][primary_value] = eu_name
        if len(only_relation)<2:
            continue
        this_relation[0] = only_relation[0]
        this_relation[2] = only_relation[1]
        result_relation.append(this_relation)
    return {'result_relation':result_relation, 'node':result, 'map_eid':map_eid}

def compare_graph_theme(theme_name1, theme_name2, layer, diff):
    s_string1 = 'START s0 = node:special_event_index(event="%s")\
                MATCH (s0)-[r]-(s) RETURN s.event_id' %theme_name1
    theme_result1 = graph.run(s_string1)
    eid_list1 = []
    for i in theme_result1:
        e_dict = dict(i)
        print e_dict,'&&&&&&&&&&&&'
        esd = e_dict['s.event_id']
        eid_list1.append(esd)
    print len(eid_list1)

    s_string2 = 'START s0 = node:special_event_index(event="%s")\
                MATCH (s0)-[r]-(s) RETURN s.event_id' %theme_name2
    theme_result2 = graph.run(s_string2)
    eid_list2 = []
    for i in theme_result2:
        e_dict = dict(i)
        esd = e_dict['s.event_id']
        eid_list2.append(esd)
    print len(eid_list2)
    relation_1 = get_graph(eid_list1, layer)
    relation_2 = get_graph(eid_list2, layer)
    if diff == '0':
        e1 = draw_graph(relation_1)
        e2 = draw_graph(relation_2)
    if diff == '1':
        same_relation = set(relation_1) & set(relation_2)
        same_relation = [i for i in same_relation]
        e1 = draw_graph(same_relation)
        e2 = e1
    if diff == '2':
        same_relation = set(relation_1) & set(relation_2)
        only1_relation = set(relation_1) - same_relation
        only2_relation = set(relation_2) - same_relation
        e1 = draw_graph(only1_relation)
        e2 = draw_graph(only2_relation)
    
    for i in eid_list1:
        e_name = event_name_search(i)
        try:
            e1['node']['event_id'][i] = e_name

        except:
            e1['node']['event_id'] ={}
            e1['node']['event_id'][i] = e_name
        try:
            e1['map_eid'].append(i)
        except:
            e1['map_eid'] = []
            e1['map_eid'].append(i)
    for i in eid_list2:
        e_name = event_name_search(i)
        try:
            e2['node']['event_id'][i] = e_name
            # e2[]
        except:
            e2['node']['event_id'] ={}
            e2['node']['event_id'][i] = e_name
        try:
            e2['map_eid'].append(i)
        except:
            e2['map_eid'] = []
            e2['map_eid'].append(i)
    return {'e1':e1, 'e2':e2}
    
def draw_map(uid_list):
    uid_list = [i for i in set(uid_list)]
    black_country = [u'美国',u'其他',u'法国',u'英国']

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
            try:
                location_dict[geo[0]+' '+k] += v
            except:
                location_dict[geo[0]+' '+k] = v
    # print location_dict
    # for item in results:
    #     if item["key"] == "" or item["key"] == "unknown" or item['key'] == u'其他':
    #         continue
    #     location_dict[item["key"]] = item["doc_count"]

    filter_location = dict()
    for k,v in location_dict.iteritems():
        tmp = k.split(' ')
        if tmp[1] in black_country or u'国' in tmp[1]:
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


def compare_map_theme(theme_name1,theme_name2,layer,diff):
    graph_result = compare_graph_theme(theme_name1,theme_name2,layer,diff)
    eid_list1 = graph_result['e1']['map_eid']
    map_resulte1 = draw_map(eid_list1)
    eid_list2 = graph_result['e2']['map_eid']
    map_resulte2 = draw_map(eid_list2)
    return {'e1':map_resulte1, 'e2':map_resulte2}

