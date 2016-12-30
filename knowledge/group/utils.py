# -*-coding:utf-8-*-

import time
import json
from knowledge.global_config import portrait_name,flow_text_name, portrait_type,flow_text_type,event_name, event_analysis_name, \
        neo4j_name, event_type, event_special, special_event_index_name, group_index_name, \
        group_rel, node_index_name,user_tag,relation_list
from knowledge.global_utils import es_user_portrait, es_flow_text, es_event, graph,\
        user_name_search,event_name_search, related_user_search,event_detail_search
from knowledge.time_utils import ts2datetime, datetime2ts
from py2neo import Node, Relationship
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
                body=query_body, _source=False, fields=fields_list)['hits']['hits']  #有问题
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
    for uid in user_list:
        uid_value = str(uid['uid'])
        user_name = user_name_search(uid_value)
        # print uid_value,'000000000000'
        all_uid_list.append([str(uid_value),user_name])
        uid_list.append([str(uid_value),user_name])# = user_name  #取uid
        u_nodes_list[str(uid_value)] = user_name  #取uid
    # u_nodes_list.extend(uid_list)
    # all_uid_list.extend(uid_list)
    if layer == '0': #不扩展
        pass
    if layer == '1':  #扩展一层
        for uid_value in uid_list:
            c_string = 'START s0 = node:node_index(uid="'+str(uid_value[0])+'") '
            c_string += 'MATCH (s0)-[r]-(s1'+node_type+') WHERE type(r) in '+ json.dumps(relation_type) +' return s0,r,s1 LIMIT 1'
            # print c_string
            result = graph.run(c_string)
            for i in list(result):
                start_id = i['s0']['uid']
                relation = i['r'].type()
                # print relation,'!!!!!!!!!!!!!!!!!!'
                end_id = dict(i['s1'])
                if end_id.has_key('uid'):
                    user_name = user_name_search(end_id['uid'])
                    u_nodes_list[str(end_id['uid'])] = user_name
                    all_uid_list.append([str(end_id['uid']),user_name])
                    user_relation.append([start_id,relation,end_id['uid']])
                if end_id.has_key('envent_id'):
                    event_name = event_name_search(end_id['envent_id'])
                    e_nodes_list[end_id['envent_id']]=event_name
                    user_relation.append([start_id,relation,end_id['envent_id']])

    if layer == '2':  #扩展两层
        print layer,'layer'
        mid_eid_list = []  #存放第一层的数据，再以这些为起始点，扩展第二层
        mid_uid_list = []
        for uid_value in uid_list[:50]:  #现在只选择50个点
            c_string = 'START s0 = node:node_index(uid="'+str(uid_value[0])+'") '
            c_string += 'MATCH (s0)-[r1]-(s1'+node_type+') WHERE type(r1) in '+ json.dumps(relation_type) +'return s0,r1,s1 LIMIT 1'
            # print c_string
            # c_string += 'MATCH (s0)-[r]->(s1:Domain) RETURN s0.uid ,r,s1.uid' #只包含某一类的节点
            # # c_string += 'MATCH (s0)-[r:topic]->(s1) RETURN s0.uid ,r,s1.uid' #只包含某一类的关系
            # c_string += 'MATCH (s0)-[r1'+relation_type+']-(s1'+node_type+')-\
            #        [r2'+relation_type+']->(s2'+node_type+') RETURN s0,r1,s1,r2,s2 LIMIT 3' #两层无向关系
            # # c_string += 'MATCH (s0)-[r]->(s1) RETURN s0,r,s1' #一层有向关系
            # # c_string += 'MATCH (s0)-[r]-(s1) RETURN s0,r,s1' #一层无向关系
            # print c_string,'================'


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
                    all_uid_list.append([middle_id,user_name])
                    user_relation.append([start_id,relation1,middle_id])
                if m_id.has_key('envent_id'):
                    middle_id = m_id['envent_id']
                    mid_eid_list.append(middle_id)
                    event_name = event_name_search(middle_id)
                    e_nodes_list[str(middle_id)] = event_name
                    user_relation.append([start_id,relation1,middle_id])
        print mid_uid_list
        print mid_eid_list,'++++++++++++++++'
        for mid_uid in mid_uid_list:
            c_string = 'START s1 = node:node_index(uid="'+str(mid_uid)+'") '
            c_string += 'MATCH (s1)-[r2]->(s2'+node_type+') WHERE type(r2) in '+ json.dumps(relation_type) +' return s1,r2,s2 LIMIT 3'
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
                    all_uid_list.append([end_id['uid'],user_name])
                    user_relation.append([start_mid_id,relation2,end_id['uid']])
                if end_id.has_key('envent_id'):
                    event_name = event_name_search(end_id['event_id'])
                    e_nodes_list[end_id['event_id']] = event_name
                    user_relation.append([start_mid_id,relation2,end_id['envent_id']])
        for mid_eid in mid_eid_list:
            c_string = 'START s1 = node:event_index(event="'+str(mid_eid)+'") '
            c_string += 'MATCH (s1)-[r2]->(s2'+node_type+') WHERE type(r2) in '+ json.dumps(relation_type) +' return s1,r2,s2 LIMIT 3'
            event_result = graph.run(c_string)
            for i in event_result:
                relation2 = i['r2'].type()
                end_id = dict(i['s2'])
                if end_id.has_key('uid'):
                    # print end_id['uid'],'44444444444444444444444'
                    user_name = user_name_search(end_id['uid'])
                    u_nodes_list[end_id['uid']] = user_name
                    all_uid_list.append([end_id['uid'],user_name])
                    user_relation.append([mid_eid,relation2,end_id['uid']])
                if end_id.has_key('envent_id'):
                    event_name = event_name_search(end_id['event_id'])
                    e_nodes_list[end_id['event_id']] = event_name
                    user_relation.append([mid_eid,relation2,end_id['envent_id']])

                # user_relation.append([start_id,relation,end_id['envent_id']])
                # print i['s1'].labels()
                # print i['r'].type()#输出关系类型
                # print dict(i['s1'])#输出节点的属性
    # u_nodes_list = [i for i in set(u_nodes_list)]
    # e_nodes_list = [i for i in set(e_nodes_list)]
    # all_uid_list = [i for i in set(all_uid_list)]
    return {'total_user':len(uid_list),'user_nodes':u_nodes_list,'event_nodes':e_nodes_list,\
            'map_uid':all_uid_list,'relation':user_relation,'draw_nodes_length':len(u_nodes_list)}

# 地图
def group_tab_map(group_name, node_type, relation_type, layer):
    black_country = [u'美国',u'其他',u'法国',u'英国']
    tab_graph_result = group_tab_graph(group_name, node_type, relation_type, layer)
    uid_list = [i[0] for i in tab_graph_result['map_uid']]

    query_body = {
        'query':{
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
            if tmp[1] in black_country:
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

    
