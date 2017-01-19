# -*-coding:utf-8-*-

import time
import json
from knowledge.global_config import portrait_name, flow_text_name, portrait_type, flow_text_type, event_name, event_analysis_name, \
        neo4j_name, event_type, event_special, special_event_index_name, group_index_name, \
        group_rel, node_index_name,user_tag,relation_list
from knowledge.global_utils import es_user_portrait, es_flow_text, es_event, graph,\
        user_name_search,event_name_search, related_user_search,event_detail_search
from knowledge.time_utils import ts2datetime, datetime2ts
from py2neo import Node, Relationship,walk
from py2neo.ogm import GraphObject, Property
from py2neo.packages.httpstream import http
from py2neo.ext.batman import ManualIndexManager
from py2neo.ext.batman import ManualIndexWriteBatch
http.socket_timeout = 9999

def user_weibo_search(uid_list,sort_flag):
    # es.update(index="flow_text", doc_type="text", id=1,  body={“doc”:{“text”:“更新”, “user_fansnum”: 100}})

    query_body = {
        'query':{
            'terms':{'uid':uid_list}
            },
        "sort": [{sort_flag:'desc'}],
        'size':200
    }
    fields_list = ['text', 'uid','sensitive','comment','retweeted', 'timestamp','sensitive_words_string']
    event_detail = es_flow_text.search(index=flow_text_name, doc_type=flow_text_type, \
                body=query_body, _source=False, fields=fields_list)['hits']['hits']  
    result = []
    for event in event_detail:
        event_dict ={}
        uid = event['fields']['uid'][0]
        uname = user_name_search(uid)
        event_dict['uname'] = uname
        for k,v in event['fields'].iteritems():
            event_dict[k] = v[0]
        result.append(event_dict)

    return result

def group_tab_graph(group_name, node_type, relation_type, layer):
    s_string = 'START s0 = node:group_index(group="' + group_name + '")  \
                MATCH (s0)-[r]-(s) RETURN s.uid as uid'
    all_uid_list = []  #for map
    user_list = graph.run(s_string)
    origin_relation = []
    s_string2 = 'START s0 = node:group_index(group="' + group_name + '")  \
                MATCH (s0)-[r]-(s) RETURN r'
    user_list_o = graph.run(s_string2)
    for r in user_list_o:
        r1 = dict(r)['r']
        origin_relation.append(r1)

    # b = Node("Group", group=group_name)
    # print g.degree(b),'-=-=-=-=-=----------------'
    if node_type!='':
        node_type = ':' + node_type
    # if relation_type!='':
    #     relation_type = ':' + relation_type
    user_relation = []
    # total_user = len(list(uid_list))
    uid_list = []
    u_nodes_list = {} #all user nodes
    e_nodes_list = {} #all event nodes
    only_uid_no = []
    for uid in user_list:
        uid_value = str(uid['uid'])
        only_uid_no.append(uid_value)
        user_name = user_name_search(uid_value)
        # print uid_value,'000000000000'
        all_uid_list.append([str(uid_value),user_name])
        uid_list.append([str(uid_value),user_name])# = user_name  #取uid
        u_nodes_list[str(uid_value)] = user_name  #取uid
    # u_nodes_list.extend(uid_list)
    # all_uid_list.extend(uid_list)
    relation = get_graph_single(only_uid_no, node_type, relation_type, layer)
    # print relation,'len(relation)'
    relation.extend(origin_relation)
    relation = [i for i in set(relation)]
    result = draw_graph(relation)
    for i in only_uid_no:
        try:
            result['map_uid'].append(i)
        except:
            result['map_uid'] = []
            result['map_uid'].append(i)
    result['map_uid'] = [i for i in set(result['map_uid'])]
    # print len(result['node']['uid']), len(result['map_uid'])
    return result


# 地图
def group_tab_map(group_name, node_type, relation_type, layer):
    black_country = [u'美国',u'其他',u'法国',u'英国']
    tab_graph_result = group_tab_graph(group_name, node_type, relation_type, layer)
    uid_list = [i for i in tab_graph_result['map_uid'] if str(i) != 'null']
    print uid_list
    query_body = {
        'filter':{
                    'terms':{'uid':uid_list}
                   
        },
        "aggs":{
            "all_location":{
                "terms":{"field": "location", "size":400}
            }
        }
    }
    results = es_user_portrait.search(index=portrait_name, doc_type=portrait_type, \
                body=query_body)["aggregations"]["all_location"]["buckets"]
    

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
            if tmp[1] in black_country or u'国' in tmp[1]:
                continue
            try:
                filter_location[tmp[1]] += v
            except:
                filter_location[tmp[1]] = v

    return_results = sorted(filter_location.iteritems(), key=lambda x:x[1], reverse=True)
    return return_results[:500]



def query_group():  #群体概览
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

#群体关联人物卡片
def query_group_user(group_name, sort_flag):
    s_string = 'START s0 = node:group_index(group="%s")\
                MATCH (s0)-[r]-(s) RETURN s.uid as user_id' %group_name
    group_result = graph.run(s_string)
    uid_list = []
    for i in group_result:
        user_dict = dict(i)
        usd = user_dict['user_id']
        uid_list.append(usd)
    print len(uid_list)
    detail_result = related_user_search(uid_list, sort_flag)
    # print len(detail_result),'!!!!!!'
    return detail_result

#群体人物数量
def query_user_num(group_name):
    s_string = 'START s0 = node:group_index(group="%s")\
                MATCH (s0)-[r]-(s) RETURN s.uid as user_id' %group_name
    group_result = graph.run(s_string)
    uid_list = []
    for i in group_result:
        user_dict = dict(i)
        usd = user_dict['user_id']
        uid_list.append(usd)
    return len(uid_list)

#群体关联事件卡片
def query_group_event(group_name, sort_flag):
    s_string = 'START s0 = node:group_index(group="%s")\
                MATCH (s0)-[r]-(s) RETURN s.uid as user_id' %group_name
    group_result = graph.run(s_string)
    event_list = []
    for event in group_result:
        user_dict = dict(event)
        # print 
        usd = user_dict['user_id']
        # event_list.append(event_value)
        c_string = 'START s0 = node:node_index(uid="'+str(usd)+'") '
        c_string += 'MATCH (s0)-[r]-(s1:Event) return s1 LIMIT 50'
        # print c_string
        result = graph.run(c_string)
        for i in list(result):
            print i
            end_id = dict(i['s1'])
            event_list.append(end_id['event_id'])
    print event_list
    print len(event_list)
    event_list = [i for i in set(event_list) if i != u'大学生失联']
    detail_result = event_detail_search(event_list, sort_flag)
    return detail_result

def query_group_weibo(group_name, sort_flag):
    s_string = 'START s0 = node:group_index(group="%s")\
                MATCH (s0)-[r]-(s) RETURN s.uid as user_id' %group_name
    group_result = graph.run(s_string)
    uid_list = []
    for i in group_result:
        user_dict = dict(i)
        usd = user_dict['user_id']
        uid_list.append(usd)
    weibo_result = user_weibo_search(uid_list,sort_flag)
    return weibo_result

def del_user_group_rel(group_name, uid):
    s_string = 'START s0 = node:group_index(group="%s"),s = node:node_index(uid="%s")\
                MATCH (s0)-[r]-(s) DELETE r' %(group_name, uid)

    print s_string
    graph.run(s_string)
    return 'true'

def add_user_group_rel(group_name, uid):
    s_string = 'START s0 = node:group_index(group="%s"),s = node:node_index(uid="%s")\
                MATCH (s0)-[r]-(s) RETURN r' %(group_name, uid)

    print s_string
    graph.run(s_string)
    return 'true'

def user_list_group(group_name):
    s_string = 'START s0 = node:group_index(group="%s")\
                MATCH (s0)-[r]-(s:User) RETURN s.uid as uid' %(group_name)

    # print s_string
    uid_list = graph.run(s_string)
    uid_list_l = []
    for i in uid_list:
        uid_this = dict(i)['uid']
        user_name = user_name_search(uid_this)
        uid_list_l.append([uid_this, user_name])
    return uid_list_l

def search_related_user_card(item,layer):
    # print item,'-------------'
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
        # print name_results,'@@@@@@@@@@@@@@@@@'
    except:
        return 'node does not exist'
    if len(name_results) == 0:
        return 'node does not exist'
    for i in name_results:
        uid = i['fields']['uid'][0]
        uname = i['fields']['uname'][0]
        only_uid.append(uid)
        u_nodes_list[uid] = uname
        user_uid_list.append([uid, uname])
    print  len(user_uid_list),'========='
    if layer == '1':
        for uid_value in user_uid_list: 
            c_string = 'START s0 = node:node_index(uid="'+str(uid_value[0])+'") '
            c_string += 'MATCH (s0)-[r1]-(s1:User) return s0,r1,s1 LIMIT 100'
            result = graph.run(c_string)
            for i in list(result):
                m_id = dict(i['s1'])['uid']
                only_uid.append(m_id)
        result_card = related_user_search(only_uid, 'activeness')
    if layer == '2':
        for uid_value in user_uid_list: 
            c_string = 'START s0 = node:node_index(uid="'+str(uid_value[0])+'") '
            c_string += 'MATCH (s0)-[r1]-()-[r]-(s1:User) return s1 LIMIT 100'
            result = graph.run(c_string)
            for i in list(result):
                m_id = dict(i['s1'])['uid']
                only_uid.append(m_id)
        result_card = related_user_search(only_uid, 'activeness')

    if layer == 'all':
        uid_list_all =[]
        result = search_related_user(item)
        uid_dict = result['user_nodes']
        for k,v in uid_dict.iteritems():
            uid_list_all.append(k)
        result_card = related_user_search(uid_list_all,'activeness')

    return result_card

def search_related_user(item):
    query_body = {
        "query":{
            'bool':{
                'should':[
                    {"wildcard":{'uid':'*'+str(item.encode('utf-8'))+'*'}},            
                    {"wildcard":{'uname':'*'+str(item.encode('utf-8'))+'*'}}         
                ]
            }

        },
        'size':10
    }
    only_uid = []
    user_uid_list = []
    u_nodes_list = {}

    try:
        name_results = es_user_portrait.search(index=portrait_name, doc_type=portrait_type, \
                body=query_body, fields=['uid','uname'])['hits']['hits']
        # print name_results,'@@@@@@@@@@@@@@@@@'
    except:
        return 'node does not exist'
    if len(name_results) == 0:
        return 'node does not exist'
    for i in name_results:
        print i
        uid = i['fields']['uid'][0]
        uname = i['fields']['uname'][0]
        only_uid.append(uid)
        u_nodes_list[uid] = uname
        user_uid_list.append([uid, uname])
    print  len(user_uid_list)
    e_nodes_list = {}
    user_relation = []
    mid_uid_list = []  #存放第一层的数据，再以这些为起始点，扩展第二层
    mid_eid_list = []
    for uid_value in user_uid_list: 
        c_string = 'START s0 = node:node_index(uid="'+str(uid_value[0])+'") '
        c_string += 'MATCH (s0)-[r1]-(s1) return s0,r1,s1 LIMIT 1'

        result = graph.run(c_string)
        # print list(result),'-----------------'
        for i in list(result):
            start_id = i['s0']['uid']
            # # start_id = s0['uid']
            relation1 = i['r1'].type()
            m_id = dict(i['s1'])
            if m_id.has_key('uid'):
                middle_id = m_id['uid']
                mid_uid_list.append(middle_id)
                user_name = user_name_search(middle_id)
                # print middle_id,'2222222222222222222'
                u_nodes_list[str(middle_id)] = user_name
                user_relation.append([start_id,relation1,middle_id])
            if m_id.has_key('envent_id'):
                middle_id = m_id['envent_id']
                mid_eid_list.append(middle_id)
                event_name = event_name_search(middle_id)
                e_nodes_list[str(middle_id)] = event_name
                user_relation.append([start_id,relation1,middle_id])
    print len(mid_uid_list)
    print len(mid_eid_list),'++++++++++++++++'
    for mid_uid in mid_uid_list:
        c_string = 'START s1 = node:node_index(uid="'+str(mid_uid)+'") '
        c_string += 'MATCH (s1)-[r2]->(s2:User) return s1,r2,s2 LIMIT 5'
        # print c_string
        result = graph.run(c_string)
        for i in result:
            start_mid_id = i['s1']['uid']
            relation2 = i['r2'].type()
            end_id = dict(i['s2'])
            if end_id.has_key('uid'):
                user_name = user_name_search(end_id['uid'])
                # print end_id['uid'],'333333333333333333333333'
                u_nodes_list[end_id['uid']] = user_name
                user_relation.append([start_mid_id,relation2,end_id['uid']])
            if end_id.has_key('envent_id'):
                event_name = event_name_search(end_id['event_id'])
                e_nodes_list[end_id['event_id']] = event_name
                user_relation.append([start_mid_id,relation2,end_id['envent_id']])
    for mid_eid in mid_eid_list:
        c_string = 'START s1 = node:event_index(event="'+str(mid_eid)+'") '
        c_string += 'MATCH (s1)-[r2]->(s2:User) return s1,r2,s2 LIMIT 3'
        event_result = graph.run(c_string)
        for i in event_result:
            relation2 = i['r2'].type()
            end_id = dict(i['s2'])
            if end_id.has_key('uid'):
                # print end_id['uid'],'44444444444444444444444'
                user_name = user_name_search(end_id['uid'])
                u_nodes_list[end_id['uid']] = user_name
                user_relation.append([mid_eid,relation2,end_id['uid']])
            if end_id.has_key('envent_id'):
                event_name = event_name_search(end_id['event_id'])
                e_nodes_list[end_id['event_id']] = event_name
                user_relation.append([mid_eid,relation2,end_id['envent_id']])
    return {'total_user':len(user_uid_list),'user_nodes':u_nodes_list,'event_nodes':e_nodes_list,\
            'relation':user_relation,'draw_nodes_length':len(u_nodes_list)}

# 比较两个群体的人物
def compare_user_group(group_name1,group_name2,sort_flag,diff):
    s_string1 = 'START s0 = node:group_index(group="%s")\
                MATCH (s0)-[r]-(s) RETURN s.uid as user_id' %group_name1
    group_result1 = graph.run(s_string1)
    uid_list1 = []
    for i in group_result1:
        user_dict = dict(i)
        usd = user_dict['user_id']
        uid_list1.append(usd)
    print len(uid_list1)

    s_string2 = 'START s0 = node:group_index(group="%s")\
                MATCH (s0)-[r]-(s) RETURN s.uid as user_id' %group_name2
    group_result2 = graph.run(s_string2)
    uid_list2 = []
    for i in group_result2:
        user_dict = dict(i)
        usd = user_dict['user_id']
        uid_list2.append(usd)
    print len(uid_list2)

    if diff == '0':
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

#比较两个群体的事件
def compare_event_group(group_name1,group_name2,sort_flag,diff):
    s_string1 = 'START s0 = node:group_index(group="%s")\
                MATCH (s0)-[r]-(s) RETURN s.uid as user_id' %group_name1
    group_result1 = graph.run(s_string1)
    event_list1 = []
    for event in group_result1:
        user_dict = dict(event)
        usd = user_dict['user_id']
        c_string = 'START s0 = node:node_index(uid="'+str(usd)+'") '
        c_string += 'MATCH (s0)-[r]-(s1:Event) return s1 LIMIT 50'
        # print c_string
        result = graph.run(c_string)
        for i in list(result):
            print i
            end_id = dict(i['s1'])
            event_list1.append(end_id['event_id'])
    print len(event_list1)

    s_string2 = 'START s0 = node:group_index(group="%s")\
                MATCH (s0)-[r]-(s) RETURN s.uid as user_id' %group_name2
    group_result2 = graph.run(s_string2)
    event_list2 = []
    for event in group_result2:
        user_dict = dict(event)
        usd = user_dict['user_id']
        c_string = 'START s0 = node:node_index(uid="'+str(usd)+'") '
        c_string += 'MATCH (s0)-[r]-(s2:Event) return s2 LIMIT 50'
        # print c_string
        result = graph.run(c_string)
        for i in list(result):
            print i
            end_id = dict(i['s2'])
            event_list2.append(end_id['event_id'])
    print len(event_list2)

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

#比较两个群体的微博
def compare_weibo_group(group_name1, group_name2, sort_flag, diff):
    s_string1 = 'START s0 = node:group_index(group="%s")\
                MATCH (s0)-[r]-(s) RETURN s.uid as user_id' %group_name1
    group_result1 = graph.run(s_string1)
    uid_list1 = []
    for i in group_result1:
        user_dict = dict(i)
        usd = user_dict['user_id']
        uid_list1.append(usd)
    print len(uid_list1)

    s_string2 = 'START s0 = node:group_index(group="%s")\
                MATCH (s0)-[r]-(s) RETURN s.uid as user_id' %group_name2
    group_result2 = graph.run(s_string2)
    uid_list2 = []
    for i in group_result2:
        user_dict = dict(i)
        usd = user_dict['user_id']
        uid_list2.append(usd)
    print len(uid_list2)

    if diff == '0':
        detail_result1 = user_weibo_search(uid_list1,sort_flag)
        detail_result2 = user_weibo_search(uid_list2,sort_flag)

    if diff == '1':
        same_u = set(uid_list1)&set(uid_list2)
        same_u = [i for i in same_u]
        detail_result1 = user_weibo_search(same_u,sort_flag)
        detail_result2 = user_weibo_search(same_u,sort_flag)

    if diff == '2':
        diff_u1 = set(uid_list1) - (set(uid_list1)&set(uid_list2))
        diff_u1 = [i for i in diff_u1]
        diff_u2 = set(uid_list2) - (set(uid_list1)&set(uid_list2))
        diff_u2 = [i for i in diff_u2]
        detail_result1 = user_weibo_search(diff_u1,sort_flag)
        detail_result2 = user_weibo_search(diff_u2,sort_flag)

    return {'detail_result1':detail_result1,'detail_result2':detail_result2}

def get_graph_single(uid_list, node_type, relation_type, layer):
    # print uid_list
    relation_list = []
    for i in uid_list:
        if layer == '0':
            c_string = 'START s0=node:node_index(uid="'+str(i)+'") '
            c_string += 'MATCH (s0)-[r]-(s1:User) WHERE (s1.uid in '+ json.dumps(uid_list)\
            + 'and type(r) in '+ json.dumps(relation_type)  +') return r LIMIT 1000'
            result = graph.run(c_string)
            for r in result:
                r1 = dict(r)['r']
                relation_list.append(r1)
        if layer == '1':
            c_string = 'START s0=node:node_index(uid="'+str(i)+'") '
            c_string += 'MATCH (s0:User)-[r]-(s1'+node_type+') WHERE type(r) in '+ json.dumps(relation_type) +' return r LIMIT 5'
            # print c_string,'!!!!!!!!!!!!!!'
            result = graph.run(c_string)
            for r in result:
                r1 = dict(r)['r']
                relation_list.append(r1)
        if layer == '2':
            c_string = 'START s0=node:node_index(uid="'+str(i)+'") '
            c_string += 'MATCH (s0)-[r]-(s1)-[r2]-(s2) WHERE (type(r) in '+ json.dumps(relation_type)\
                     + 'and type(r2) in '+ json.dumps(relation_type)  +') return r,r2 LIMIT 10'
            result = graph.run(c_string)
            for r in result:
                # print r['r']
                r1 = dict(r)['r']
                relation_list.append(r1)
                r2 = dict(r)['r2']
                relation_list.append(r2)
    # result_list = list(result)
    print len(relation_list),'^^^^^^^^^^^'
    return relation_list


def get_graph(uid_list, layer):
    print uid_list
    relation_list = []
    for i in uid_list:
        if layer == '0':
            c_string = 'START s0=node:node_index(uid="'+str(i)+'") '
            c_string += 'MATCH (s0)-[r]-(s1:User) WHERE s1.uid in '+ json.dumps(uid_list)+ ' return r LIMIT 1000'
            result = graph.run(c_string)
            for r in result:
                r1 = dict(r)['r']
                relation_list.append(r1)
        if layer == '1':
            c_string = 'START s0=node:node_index(uid="'+str(i)+'") '
            c_string += 'MATCH (s0:User)-[r]-(s1)  return r LIMIT 1'
            result = graph.run(c_string)
            for r in result:
                r1 = dict(r)['r']
                relation_list.append(r1)
        if layer == '2':
            c_string = 'START s0=node:node_index(uid="'+str(i)+'") '
            c_string += 'MATCH (s0:User)-[r]-(s1)-[r2]-(s2) return r,r2 LIMIT 10'
            result = graph.run(c_string)
            for r in result:
                r1 = dict(r)['r']
                # print r1,'!!!!!!!!!!!!!!!!********'
                relation_list.append(r1)
                r2 = dict(r)['r2']
                relation_list.append(r2)
    # result_list = list(result)
    # print relation_list
    return relation_list

#画图谱
def draw_graph(relation_list):
    # print len(relation_list),'------------!!!!!-------'
    result = {}
    key_dict = {'User':'uid','Event':'event_id','Group':'group','SpecialEvent':'event'}
    map_uid = []
    result_relation = [] #[[node1,relation,node2],...]
    for i in relation_list:
        this_relation = ['','','']  #[node1,relation,node2]
        only_relation = []#[node1,node2]
        for m in walk(i):
            try:
                this_relation[1] = m.type()
                # print m.type(),'!!!!!!!!!'
            except:
                aa = m.labels()
                # print m,dict(m),'----------####'
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
                        map_uid.append(m['uid'])
                    elif aa[0] == 'Event':
                        # print m['event_id'].encode('utf-8'),'************'
                        if m['event_id'] in [u'徐玉玉事件',u'大学生失联'] :
                            continue
                        eu_name = event_name_search(m['event_id'])
                    else:
                        eu_name = m[primary_key]
                if len(aa) <1 or len(aa) >1:
                    primary_key = 'uid'
                    primary_value = m[primary_key]
                    if m['uid'] != None:
                        eu_name = user_name_search(m['uid'])
                        map_uid.append(m['uid'])
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
    return {'result_relation':result_relation, 'node':result, 'map_uid':map_uid}

#比较两个图谱
def compare_graph_group(group_name1, group_name2, layer, diff):
    s_string1 = 'START s0 = node:group_index(group="%s")\
                MATCH (s0)-[r]-(s) RETURN s.uid as user_id' %group_name1
    group_result1 = graph.run(s_string1)
    uid_list1 = []
    for i in group_result1:
        user_dict = dict(i)
        usd = user_dict['user_id']
        uid_list1.append(usd)
    print len(uid_list1)

    s_string2 = 'START s0 = node:group_index(group="%s")\
                MATCH (s0)-[r]-(s) RETURN s.uid as user_id' %group_name2
    group_result2 = graph.run(s_string2)
    uid_list2 = []
    for i in group_result2:
        user_dict = dict(i)
        usd = user_dict['user_id']
        uid_list2.append(usd)
    print len(uid_list2)
    relation_1 = get_graph(uid_list1, layer)
    relation_2 = get_graph(uid_list2, layer)
    if diff == '0':
        u1 = draw_graph(relation_1)
        u2 = draw_graph(relation_2)
    if diff == '1':
        same_relation = set(relation_1) & set(relation_2)
        same_relation = [i for i in same_relation]
        u1 = draw_graph(same_relation)
        u2 = u1
    if diff == '2':
        same_relation = set(relation_1) & set(relation_2)
        only1_relation = set(relation_1) - same_relation
        only2_relation = set(relation_2) - same_relation
        u1 = draw_graph(only1_relation)
        u2 = draw_graph(only2_relation)
    for i in uid_list1:
        u_name = user_name_search(i)
        try:
            u1['node']['uid'][i] = u_name

        except:
            u1['node']['uid'] ={}
            u1['node']['uid'][i] = u_name
        try:
            u1['map_uid'].append(i)
        except:
            u1['map_uid'] = []
            u1['map_uid'].append(i)
    for i in uid_list2:
        u_name = user_name_search(i)
        try:
            u2['node']['uid'][i] = u_name
            # e2[]
        except:
            u2['node']['uid'] ={}
            u2['node']['uid'][i] = u_name
        try:
            u2['map_uid'].append(i)
        except:
            u2['map_uid'] = []
            u2['map_uid'].append(i)
    return {'u1':u1, 'u2':u2}

#画地图    
def draw_map(uid_list):
    uid_list = [i for i in set(uid_list)]
    black_country = [u'美国',u'其他',u'法国',u'英国']

    print len(uid_list),'!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1'
    query_body = {
        'filter':{
            'terms':{'uid':uid_list}
            },
        "aggs":{
            "all_location":{
                "terms":{"field": "location", "size":400}
            }
        }
    }
    results = es_user_portrait.search(index=portrait_name, doc_type=portrait_type, \
                body=query_body)["aggregations"]["all_location"]["buckets"]
    

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
            if tmp[1] in black_country or u'国' in tmp[1]:
                continue
            try:
                filter_location[tmp[1]] += v
            except:
                filter_location[tmp[1]] = v

    return_results = sorted(filter_location.iteritems(), key=lambda x:x[1], reverse=True)
    return return_results[:500]

#比较两个地图
def compare_map_group(group_name1,group_name2,layer,diff):
    graph_result = compare_graph_group(group_name1,group_name2,layer,diff)
    uid_list1 = graph_result['u1']['map_uid']
    map_result1 = draw_map(uid_list1)
    uid_list2 = graph_result['u2']['map_uid']
    map_result2 = draw_map(uid_list2)
    return {'u1':map_result1, 'u2':map_result2}

def g_create_rel(node_key1, node1_list, node1_index_name, rel, node_key2, node2_id, node2_index_name):
    Index = ManualIndexManager(graph)
    u_node_index = Index.get_index(Node, node1_index_name)
    group_index = Index.get_index(Node, node2_index_name)
    # print u_node_index,'------------------------===========-----------'
    print group_index
    tx = graph.begin()

    for node1_id in node1_list:
        node1 = u_node_index.get(node_key1, str(node1_id))[0]
        node2 = group_index.get(node_key2, node2_id)[0]
        if not (node1 and node2):
            print "node does not exist"
            return '1'
        c_string = "START start_node=node:%s(%s='%s'),end_node=node:%s(%s='%s') MATCH (start_node)-[r:%s]->(end_node) RETURN r" % (
        node1_index_name, node_key1, node1_id, node2_index_name, node_key2, node2_id, rel)
        # print c_string
        result = graph.run(c_string)
        rel_list = []
        for item in result:
            rel_list.append(item)
        print rel_list,'----------------'
        if not rel_list:
            rel_g = Relationship(node1, rel, node2)
            graph.create(rel_g)
            print "create success"
        else:
            print "The current two nodes already have a relationship"
            # return '0'
    return '2'

def g_create_node_and_rel(node_key1, node1_list, node1_index_name,rel, node_key2, node2_id, node2_index_name):
    print node1_list,'!!!!!!!!@@@@@@@@@@@'
    Index = ManualIndexManager(graph) # manage index
    group_index = Index.get_index(Node, node2_index_name)
    c_string = "START end_node=node:%s(%s='%s')  RETURN end_node"\
                 % (node2_index_name, node_key2, node2_id)
    # print c_string
    result = graph.run(c_string)
    node_l = []
    for i in result:
        # node1_l
        node_l.append(i[0])
    if len(node_l)>0:#判断对否有该节点存在
        return 'group already exist'
    else:
        new_group = Node('Group', group=node2_id)
        graph.create(new_group)
        group_index.add("group", node2_id, new_group)
        # return 'succeed'
    info = g_create_rel(node_key1, node1_list, node1_index_name, rel, node_key2, node2_id, node2_index_name)
    return info

