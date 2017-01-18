# -*-coding:utf-8-*-

import time
import json
import operator 
from knowledge.global_config import portrait_name, flow_text_name, portrait_type, flow_text_type, event_name, event_analysis_name, \
        neo4j_name, event_type, event_special, special_event_index_name, group_index_name, \
        group_rel, node_index_name,user_event_relation
from knowledge.global_utils import es_user_portrait, es_flow_text, es_event, graph,user_search_sth,\
        user_name_search, event_name_search,event_name_to_id,es_search_sth,event_detail_search, related_user_search

from knowledge.parameter import rel_node_mapping, rel_node_type_mapping, index_threshold, WEEK
from knowledge.time_utils import ts2datetime, datetime2ts
from py2neo import Node, Relationship,walk
from py2neo.ogm import GraphObject, Property
from py2neo.packages.httpstream import http
from py2neo.ext.batman import ManualIndexManager
from py2neo.ext.batman import ManualIndexWriteBatch
http.socket_timeout = 9999

week = WEEK

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
            if not node_attri:
                continue
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
    analysis_fields_list = ['weibo_counts','location','uid_counts','user_tag','description','photo_url']
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
#人物-上方大卡片
def query_person_detail(uid):
    query_body = {
        'query':{
            'match':{'uid':uid}
            }
    }
    fields_list = ['uname','fansnum', 'influence','importnace','activeness','sensitive','location',\
                   'activity_geo', 'domain','topic_string','tag','photo_url','description','create_time',\
                   'create_user']
    
    event_detail = es_user_portrait.search(index=portrait_name, doc_type=portrait_type, \
                body=query_body, _source=False, fields=fields_list)['hits']['hits']

    # event_detail_a = es_event.search(index=event_analysis_name, doc_type=event_type, \
    #             body=query_body, _source=False, fields=analysis_fields_list)['hits']['hits']
    # event_detail.extend(event_detail_a)
    detail = dict()
    for i in event_detail:
        fields = i['fields']
        for i in fields_list:
            try:
                detail[i] = fields[i][0]
            except:
                detail[i] = 'null'
    # for i in event_detail_a:
    #     fields = i['fields']
    #     for i in analysis_fields_list:
    #         try:
    #             detail[i] = fields[i][0]
    #         except:
    #             detail[i] = 'null'
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
        name_photo = user_search_sth(user_id, ['uname', 'photo_url'])
        print name_photo,'===!!!=='
        user_name = name_photo['uname']
        photo = name_photo['photo_url']

        try:
            if len(related_people[relation])>5:
                break
            related_people[relation].append([user_id,user_name,photo])
        except:
            related_people[relation] = []
            related_people[relation].append([user_id,user_name,photo])
            
    return related_people

#事件相关事件
def query_event_event(event,layer):
    query_body = {
        'query':{
            'match':{'name':event}
            }
    }
    
    event_detail = es_event.search(index=event_name, doc_type=event_type, \
                body=query_body, _source=False, fields=['en_name'])['hits']['hits'][0]['fields']
    
    event_id = event_detail['en_name'][0]
    if layer == '1' or layer == 'all':
        c_string = 'START s0 = node:event_index(event="'+str(event_id)+'") '
        c_string += 'MATCH (s0)-[r]-(s1:Event) return r,s1 LIMIT 50'
    if layer == '2':
        c_string = 'START s0 = node:event_index(event="'+str(event_id)+'") '
        c_string += 'MATCH (s0)-[r]-(a)-[b]-(s1:Event) return r,s1 LIMIT 50'
    print c_string
    result = graph.run(c_string)
    event_list = []
    for i in result:
        print i
        relation = i['r'].type()
        e_id = str(i['s1']['event_id'])
        event_list.append(e_id)
    if layer == 'all':
        c_string = 'START s0 = node:event_index(event="'+str(event_id)+'") '
        c_string += 'MATCH (s0)-[r]-(a)-[b]-(s1:Event) return r,s1 LIMIT 50'
        print c_string
        result = graph.run(c_string)
        event_list = []
        for i in result:
            print i
            relation = i['r'].type()
            e_id = str(i['s1']['event_id'])
            event_list.append(e_id)

    related_event = event_detail_search(event_list, 'start_ts')
            
    return related_event


#人物相关人物
def query_person_people(uid,node_type):
    # query_body = {
    #     'query':{
    #         'match':{'uid':uid}
    #         }
    # }
    
    # event_detail = es_event.search(index=event_name, doc_type=event_type, \
    #             body=query_body, _source=False, fields=['en_name'])['hits']['hits'][0]['fields']
    
    # event_id = event_detail['en_name'][0]
    c_string = 'START s0 = node:node_index(uid="'+str(uid)+'") '
    c_string += 'MATCH (s0)-[r]-(s1:'+node_type+') return r,s1.uid as uid LIMIT 5'
    print c_string
    result = graph.run(c_string)
    related_people = {}
    for i in result:
        relation = i['r'].type()
        user_id = str(i['uid'])
        name_photo = user_search_sth(user_id, ['uname', 'photo_url'])
        user_name = name_photo['uname']
        photo = name_photo['photo_url']

        try:
            if len(related_people[relation])>5:
                break
            related_people[relation].append([user_id,user_name,photo])
        except:
            related_people[relation] = []
            related_people[relation].append([user_id,user_name,photo])
            
    return related_people

#人物相关事件
def query_person_event(uid,layer):

    if layer == '1' or layer == 'all':
        c_string = 'START s0 = node:node_index(uid="'+str(uid)+'") '
        c_string += 'MATCH (s0)-[r]-(s1:Event) return r,s1 LIMIT 50'
    if layer == '2':
        c_string = 'START s0 = node:node_index(uid="'+str(uid)+'") '
        c_string += 'MATCH (s0)-[r]-(a)-[b]-(s1:Event) return s1 LIMIT 50'
    print c_string
    result = graph.run(c_string)
    event_list = []
    for i in result:
        # relation = i['r'].type()
        e_id = str(i['s1']['event_id'])
        event_list.append(e_id)
    if layer == 'all':
        c_string = 'START s0 = node:node_index(uid="'+str(uid)+'") '
        c_string += 'MATCH (s0)-[r]-(a)-[b]-(s1:Event) return s1 LIMIT 50'
        print c_string
        result = graph.run(c_string)
        event_list = []
        for i in result:
            # relation = i['r'].type()
            e_id = str(i['s1']['event_id'])
            event_list.append(e_id)
    event_list = [i for i in set(event_list)]
    related_event = event_detail_search(event_list, 'start_ts')
            
    return related_event



#事件-控制面板地图
def filter_event_map(event_name, node_type, relation_type, layer):
    black_country = [u'美国',u'其他',u'法国',u'英国']
    tab_theme_result = filter_event_nodes(event_name, node_type, relation_type, layer)
    uid_list_origin = tab_theme_result['map_eid']
    # print uid_list_origin,'000000000000000'
    uid_list = [i for i in uid_list_origin]
    # print uid_list
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

def get_graph_single_e(eid_list, node_type, relation_type, layer):
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
            print c_string,'_---___^&^&^&^^^^^^^^^********'
            result = graph.run(c_string)
            for r in result:
                print r['r']
                r1 = dict(r)['r']
                relation_list.append(r1)
                r2 = dict(r)['r2']
                relation_list.append(r2)

    return relation_list


#事件控制面板
def filter_event_nodes(event_name, node_type, relation_type, layer):
    event_name_id = event_name_to_id(event_name)
    all_event_id = []#for map,event_id

    relation_list_o = []

    if node_type!='':
        node_type = ':' + node_type
    event_relation = []
    only_event_o = []
    only_event_o.append(event_name_id)
    event_list = []
    e_nodes_list = {} #all event nodes
    u_nodes_list = {} #all user nodes

    relation = get_graph_single_e(only_event_o, node_type, relation_type, layer)
    relation.extend(relation_list_o)
    relation = [i for i in set(relation)]
    result = draw_graph_e(relation)
    for i in only_event_o:
        try:
            result['map_eid'].append(i)
        except:
            result['map_eid'] = []
            result['map_eid'].append(i)

    result['map_eid'] = [i for i in set(result['map_eid'])]
    try:
        result['node']['event_id'][event_name_id] = event_name
    except:
        result['node']['event_id']={}
        result['node']['event_id'][event_name_id] = event_name
    # print len(result['node']['event_id']), len(result['map_eid'])
    return result




    # event_name_id = event_name_to_id(event_name)
    # e_nodes_list[event_name] = event_name_id
    # all_event_id = []
    # all_event_id.append([event_name_id,event_name])
    # event_relation = []
    # if layer == '0':  #不扩展
    #     pass
    # if layer == '1':  #扩展一层
    #     c_string = 'START s0 = node:event_index(event="'+str(event_name_id)+'") '
    #     c_string += 'MATCH (s0)-[r]-(s1'+node_type+') WHERE type(r) in '+ json.dumps(relation_type) +' return s0,r,s1 LIMIT 10'
    #     print c_string,'!!!!!'
    #     result = graph.run(c_string)
    #     for i in list(result):
    #         start_id = dict(i['s0'])['event_id']
    #         # print start_id,'============='
    #         relation = i['r'].type()
    #         end_id = dict(i['s1'])
    #         if end_id.has_key('uid'):
    #             print end_id,'!!!!!!!!!!!!!!!!!!!1'
    #             user_name = user_name_search(end_id['uid'])
    #             # print user_name,'000000000000000000000'
    #             u_nodes_list[end_id['uid']] = user_name
    #             event_relation.append([start_id,relation,end_id['uid']])
    #         if end_id.has_key('envent_id'):
    #             event_name = event_name_search(end_id['envent_id'])
    #             e_nodes_list[end_id['envent_id']] = event_name
    #             all_event_id.append([end_id['envent_id'], event_name])
    #             event_relation.append([start_id,relation,end_id['envent_id']])
    # if layer == '2':  #扩展两层
    #     print layer,'layer'
    #     c_string = 'START s0 = node:event_index(event="'+str(event_name_id)+'") '
    #     c_string += 'MATCH (s0)-[r1]-(s1'+node_type+') WHERE type(r1) in '+ json.dumps(relation_type) +' return s0,r1,s1 LIMIT 10'
    #     # print c_string,'==========='
        
    #     mid_eid_list = []  #存放第一层的数据，再以这些为起始点，扩展第二层
    #     mid_uid_list = []
    #     result = graph.run(c_string)

    #     # print list(result),'-----------------'
    #     for i in list(result):
    #         print i
    #         start_id = i['s0']['event_id']
    #         # start_id = s0['event']
    #         relation1 = i['r1'].type()
    #         m_id = dict(i['s1'])
    #         if m_id.has_key('uid'):
    #             middle_id = m_id['uid']
    #             mid_uid_list.append(middle_id)
    #             user_name = user_name_search(middle_id)
    #             u_nodes_list[middle_id] = user_name
    #             event_relation.append([start_id,relation1,middle_id])
    #         if m_id.has_key('envent_id'):
    #             middle_id = m_id['envent_id']
    #             mid_eid_list.append(middle_id)
    #             event_name = event_name_search(middle_id)
    #             e_nodes_list[middle_id] = event_name
    #             all_event_id.append([middle_id,event_name])
    #             event_relation.append([start_id,relation1,middle_id])
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
    # # event_list = u_nodes_list.extend(e_nodes_list)
    # return {'total_event':0, 'user_nodes':u_nodes_list, 'event_nodes':e_nodes_list,\
    #         'map_event_id':all_event_id, 'relation':event_relation}  


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


#事件相关微博
def get_weibo(event_name, weibo_type):
    event_id = event_name_to_id(event_name)
    weibo_list = es_search_sth(event_id, ['retweet_order_weibo'])
    weibolist = json.loads(weibo_list)
    result_weibo = []
    for i in weibolist:
        weibo_dict = i[1]
        weibo_dict['mid'] = i[0]
        uid = i[1]['uid']
        uname = user_name_search(uid)
        # weibo_dict['uname'] = uname
        weibo_dict['date'] = ts2datetime(weibo_dict['timestamp'])
        result_weibo.append(weibo_dict)
    if weibo_type == 'sensitive':
        result_weibo = sorted(result_weibo, key=operator.itemgetter('sensitive'), reverse=True)
    return result_weibo[:200]

# def user_weibo_search(uid_list,sort_flag):
#     # es.update(index="flow_text", doc_type="text", id=1,  body={“doc”:{“text”:“更新”, “user_fansnum”: 100}})


#人物相关微博
def get_user_weibo(uid, weibo_type):
    # weibo_list = es_search_sth(uid, ['time_order_weibo'])

    query_body = {
        'query':{
            'term':{'uid':uid}
            }
        # "sort": [{weibo_type:'desc'}],
        # 'size':500
    }
    fields_list = ['text', 'uid','sensitive','comment','retweeted', 'timestamp','sensitive_words_string']
    event_detail = es_flow_text.search(index=flow_text_name, doc_type=flow_text_type, \
                body=query_body, _source=False, fields=fields_list)['hits']['hits']  
    print event_detail,'============='
    result = []
    for event in event_detail:
        event_dict ={}
        uid = event['fields']['uid'][0]
        uname = user_name_search(uid)
        event_dict['uname'] = uname
        for k,v in event['fields'].iteritems():
            event_dict[k] = v[0]
        result.append(event_dict)
    result_weibo = sorted(result, key=operator.itemgetter('sensitive'), reverse=True)

    return result_weibo



def draw_graph_e(relation_list):
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


#画图谱
def draw_graph_u(relation_list):
    print len(relation_list),'------------!!!!!-------'
    print relation_list
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


def get_graph_single_u(uid_list, node_type, relation_type, layer):
    # print uid_list
    relation_list = []
    for i in uid_list:
        if layer == '0':
            c_string = 'START s0=node:node_index(uid="'+str(i)+'") '
            c_string += 'MATCH (s0)-[r]-(s1:User) WHERE (s1.uid in '+ json.dumps(uid_list)\
            + 'and type(r) in '+ json.dumps(relation_type)  +') return r LIMIT 100'
            result = graph.run(c_string)
            for r in result:
                r1 = dict(r)['r']
                relation_list.append(r1)
        if layer == '1':
            c_string = 'START s0=node:node_index(uid="'+str(i)+'") '
            c_string += 'MATCH (s0:User)-[r]-(s1'+node_type+') WHERE type(r) in '+ json.dumps(relation_type) +' return r LIMIT 100'
            # print c_string,'!!!!!!!!!!!!!!'
            result = graph.run(c_string)
            for r in result:
                r1 = dict(r)['r']
                relation_list.append(r1)
        if layer == '2':
            c_string = 'START s0=node:node_index(uid="'+str(i)+'") '
            c_string += 'MATCH (s0)-[r]-(s1)-[r2]->(s2) WHERE (type(r) in '+ json.dumps(relation_type)\
                     + 'and type(r2) in '+ json.dumps(relation_type)  +') return r,r2 LIMIT 100'
            print c_string,'++++++'
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


def group_tab_graph(root_uid, node_type, relation_type, layer):
    user_list = []
    user_list.append({'uid':root_uid})
    all_uid_list = []  #for map
    origin_relation = []
    if node_type!='':
        node_type = ':' + node_type
    user_relation = []
    uid_list = []
    u_nodes_list = {} #all user nodes
    e_nodes_list = {} #all event nodes
    only_uid_no = []
    for uid in user_list:
        print uid
        uid_value = uid['uid']
        only_uid_no.append(uid_value)
        user_name = user_name_search(uid_value)
        # print uid_value,'000000000000'
        all_uid_list.append([str(uid_value),user_name])
        uid_list.append([str(uid_value),user_name])# = user_name  #取uid
        u_nodes_list[str(uid_value)] = user_name  #取uid
    # u_nodes_list.extend(uid_list)
    # all_uid_list.extend(uid_list)
    relation = get_graph_single_u(only_uid_no, node_type, relation_type, layer)
    # print relation,'len(relation)'
    relation.extend(origin_relation)
    relation = [i for i in set(relation)]
    result = draw_graph_u(relation)
    for i in only_uid_no:
        try:
            result['map_uid'].append(i)
        except:
            result['map_uid'] = []
            result['map_uid'].append(i)
    result['map_uid'] = [i for i in set(result['map_uid'])]
    try:
        result['node']['uid'][root_uid] = user_name_search(root_uid)
    except:
        result['node']['uid']={}
        result['node']['uid'][root_uid] = user_name_search(root_uid)

    # print len(result['node']['uid']), len(result['map_uid'])
    return result






    # all_uid_list = []  #for map
    # if node_type!='':
    #     node_type = ':' + node_type
    # user_relation = []
    # uid_list = []
    # u_nodes_list = {} #all user nodes
    # e_nodes_list = {} #all event nodes

    # user_name = user_name_search(uid)
    # all_uid_list.append([str(uid),user_name])
    # uid_list.append([str(uid),user_name])  #取uid
    # u_nodes_list[str(uid)] = user_name  #取uid

    # if layer == '0': #不扩展
    #     pass
    # if layer == '1':  #扩展一层
    #     c_string = 'START s0 = node:node_index(uid="'+str(uid)+'") '
    #     c_string += 'MATCH (s0)-[r]-(s1'+node_type+') WHERE type(r) in '+ json.dumps(relation_type) +' return s0,r,s1 LIMIT 10'
    #     print c_string
    #     result = graph.run(c_string)
    #     for i in list(result):
    #         start_id = i['s0']['uid']
    #         relation = i['r'].type()
    #         # print relation,'!!!!!!!!!!!!!!!!!!'
    #         end_id = dict(i['s1'])
    #         if end_id.has_key('uid'):
    #             user_name = user_name_search(end_id['uid'])
    #             u_nodes_list[str(end_id['uid'])] = user_name
    #             all_uid_list.append([str(end_id['uid']),user_name])
    #             user_relation.append([start_id,relation,end_id['uid']])
    #         if end_id.has_key('envent_id'):
    #             event_name = event_name_search(end_id['envent_id'])
    #             e_nodes_list[end_id['envent_id']]=event_name
    #             user_relation.append([start_id,relation,end_id['envent_id']])

    # if layer == '2':  #扩展两层
    #     print layer,'layer'
    #     mid_eid_list = []  #存放第一层的数据，再以这些为起始点，扩展第二层
    #     mid_uid_list = []
    #     c_string = 'START s0 = node:node_index(uid="'+str(uid)+'") '
    #     c_string += 'MATCH (s0)-[r1]-(s1'+node_type+') WHERE type(r1) in '+ json.dumps(relation_type) +'return s0,r1,s1 LIMIT 10'
    #     result = graph.run(c_string)
    #     # print list(result),'-----------------'
    #     for i in list(result):
    #         start_id = i['s0']['uid']
    #         # # start_id = s0['uid']
    #         relation1 = i['r1'].type()
    #         m_id = dict(i['s1'])
    #         if m_id.has_key('uid'):
    #             middle_id = m_id['uid']
    #             mid_uid_list.append(middle_id)
    #             user_name = user_name_search(middle_id)
    #             u_nodes_list[str(middle_id)] = user_name
    #             all_uid_list.append([middle_id,user_name])
    #             user_relation.append([start_id,relation1,middle_id])
    #         if m_id.has_key('envent_id'):
    #             middle_id = m_id['envent_id']
    #             mid_eid_list.append(middle_id)
    #             event_name = event_name_search(middle_id)
    #             e_nodes_list[str(middle_id)] = event_name
    #             user_relation.append([start_id,relation1,middle_id])
    #     print mid_uid_list
    #     print mid_eid_list,'++++++++++++++++'
    #     for mid_uid in mid_uid_list:
    #         c_string = 'START s1 = node:node_index(uid="'+str(mid_uid)+'") '
    #         c_string += 'MATCH (s1)-[r2]->(s2'+node_type+') WHERE type(r2) in '+ json.dumps(relation_type) +' return s1,r2,s2 LIMIT 3'
    #         # print c_string
    #         result = graph.run(c_string)
    #         for i in result:
    #             start_mid_id = i['s1']['uid']
    #             relation2 = i['r2'].type()
    #             end_id = dict(i['s2'])
    #             if end_id.has_key('uid'):
    #                 user_name = user_name_search(end_id['uid'])
    #                 u_nodes_list[end_id['uid']] = user_name
    #                 all_uid_list.append([end_id['uid'],user_name])
    #                 user_relation.append([start_mid_id,relation2,end_id['uid']])
    #             if end_id.has_key('envent_id'):
    #                 event_name = event_name_search(end_id['event_id'])
    #                 e_nodes_list[end_id['event_id']] = event_name
    #                 user_relation.append([start_mid_id,relation2,end_id['envent_id']])
    #     for mid_eid in mid_eid_list:
    #         c_string = 'START s1 = node:event_index(event="'+str(mid_eid)+'") '
    #         c_string += 'MATCH (s1)-[r2]->(s2'+node_type+') WHERE type(r2) in '+ json.dumps(relation_type) +' return s1,r2,s2 LIMIT 3'
    #         event_result = graph.run(c_string)
    #         for i in event_result:
    #             relation2 = i['r2'].type()
    #             end_id = dict(i['s2'])
    #             if end_id.has_key('uid'):
    #                 # print end_id['uid'],'44444444444444444444444'
    #                 user_name = user_name_search(end_id['uid'])
    #                 u_nodes_list[end_id['uid']] = user_name
    #                 all_uid_list.append([end_id['uid'],user_name])
    #                 user_relation.append([mid_eid,relation2,end_id['uid']])
    #             if end_id.has_key('envent_id'):
    #                 event_name = event_name_search(end_id['event_id'])
    #                 e_nodes_list[end_id['event_id']] = event_name
    #                 user_relation.append([mid_eid,relation2,end_id['envent_id']])

    #             # user_relation.append([start_id,relation,end_id['envent_id']])
    #             # print i['s1'].labels()
    #             # print i['r'].type()#输出关系类型
    #             # print dict(i['s1'])#输出节点的属性
    # # u_nodes_list = [i for i in set(u_nodes_list)]
    # # e_nodes_list = [i for i in set(e_nodes_list)]
    # # all_uid_list = [i for i in set(all_uid_list)]
    # return {'total_user':len(uid_list),'user_nodes':u_nodes_list,'event_nodes':e_nodes_list,\
    #         'map_uid':all_uid_list,'relation':user_relation,'draw_nodes_length':len(u_nodes_list)}

# 地图
def group_tab_map(uid, node_type, relation_type, layer):
    black_country = [u'美国',u'其他',u'法国',u'英国']
    tab_graph_result = group_tab_graph(uid, node_type, relation_type, layer)
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
            if tmp[1] in black_country or u'国' in tmp[1]:
                continue
            try:
                filter_location[tmp[1]] += v
            except:
                filter_location[tmp[1]] = v

    return_results = sorted(filter_location.iteritems(), key=lambda x:x[1], reverse=True)
    return return_results[:500]

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
        return 'node does not exist'
    if len(name_results) == 0:
        return 'node does not exist'
    print name_results,'*********************'
    for i in name_results:
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

    # print mid_uid_list
    # print mid_eid_list,'++++++++++++++++'
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
        'size':20
    }
    only_eid = []
    event_id_list = []
    u_nodes_list = {}
    e_nodes_list = {}
    event_relation =[]
    try:
        name_results = es_event.search(index=event_name, doc_type=event_type, \
                body=query_body, fields=['name','en_name'])['hits']['hits']
        print name_results,'@@@@@@@@@@@@@@@@@'
    except:
        return 'node does not exist'
    print name_results,'@@@@@@@@@@@@@@@@@------------#######################'
    if len(name_results) == 0:
        return 'node does not exist'
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
        if result == 'node does not exist':
            return 'node does not exist'
        eid_dict = result['event_nodes']
        for k,v in eid_dict.iteritems():
            eid_list_all.append(k)
        result_card = event_detail_search(eid_list_all,'start_ts')

    return result_card


def advance_search_card(node_type,term,activity_geo,tag):
    result = {}
    query_data = {}
    query = []
    query_list = []
    condition_num = 0
    query_list = []
    fuzz_item = ['activity_geo']
    multi_item = ['domain','topic_string']
    simple_fuzz_item = ['uid', 'uname']
    item_data = request.args.get('term', '')
    #print 'item_data:', item_data
    for item in simple_fuzz_item:
        if item_data:
            query_list.append({'wildcard':{item: '*'+item_data+'*'}})
            condition_num += 1
    if query_list:
        query.append({'bool': {'should': query_list}}) 
    for item in fuzz_item:
        item_data = activity_geo
        if item_data:
            query.append({'wildcard':{item:'*'+item_data+'*'}})
            condition_num += 1
    # # custom_attribute
    # tag_items = request.args.get('tag', '')
    # if tag_items != '':
    #     tag_item_list = tag_items.split(',')
    #     for tag_item in tag_item_list:
    #         attribute_name_value = tag_item.split(':')
    #         attribute_name = attribute_name_value[0]
    #         attribute_value = attribute_name_value[1]
    #         field_key = submit_user + '-tag'
    #         if attribute_name and attribute_value:
    #             query.append({'wildcard':{field_key: '*'+attribute_name + '-' + attribute_value+'*'}})
    #             condition_num += 1

    for item in multi_item:
        nest_body = {}
        nest_body_list = []
        item_data = request.args.get(item, '')
        if item_data:
            term_list = item_data.split(',')
            for term in term_list:
                nest_body_list.append({'wildcard':{item:'*'+term+'*'}})
            condition_num += 1
            query.append({'bool':{'should':nest_body_list}})
        
        
    size = 1000
    sort = '_score'
    #print 'query condition:', query
    result = search_portrait(condition_num, query, sort, size)
    return json.dumps(result)

    result = es_user_portrait.search(index=index_name, doc_type=index_type, \
                    body={'query':{'bool':{'must':query}}, 'sort':[{sort:{'order':'desc'}}], 'size':size})['hits']['hits']
    return node_results
