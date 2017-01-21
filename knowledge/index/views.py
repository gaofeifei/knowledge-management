# -*- coding: utf-8 -*-

from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
import json
import csv
import os
import time
from datetime import date
from datetime import datetime
from knowledge.global_config import portrait_name, flow_text_name, portrait_type, flow_text_type, event_name, event_analysis_name, \
        neo4j_name, event_type, event_special, special_event_index_name, group_index_name, \
        group_rel, node_index_name,user_event_relation, event_relation_list, relation_list
from knowledge.global_utils import es_user_portrait, es_flow_text, es_event, graph,user_search_sth,\
        user_name_search, event_name_search,event_name_to_id,es_search_sth,event_detail_search, related_user_search

from utils import query_current_week_increase, query_special_event, query_group,filter_event_map,\
     query_new_relationship, query_hot_location, query_event_detail,query_event_people,filter_event_nodes,\
     get_weibo,query_person_detail,query_person_people,query_person_event,query_event_event,get_user_weibo,\
     group_tab_graph,group_tab_map, search_related_user_card, search_related_user, search_related_event_f,\
     search_related_e_card, advance_search_card


mod = Blueprint('index', __name__, url_prefix='/index')

@mod.route('/')
def index():

    return render_template('index/homepage.html')

@mod.route('/search_result/')
def show_searche_result():

    # return render_template('index/incident.html')
    t_uid = request.args.get('t_uid', u'电信诈骗')
    return render_template('index/incident.html', t_uid = t_uid)

#事件-详细页面上方卡片结果
@mod.route('/event_detail/') 
def show_search_event():
    event_name = request.args.get('event_name', u'马来西亚抓获电信欺诈案犯')
    detail_e = query_event_detail(event_name)
    return json.dumps(detail_e)

#人物-详细页面上方卡片结果
@mod.route('/person_detail/') 
def show_search_person():
    uid = request.args.get('uid', '1765891182')
    detail_e = query_person_detail(uid)
    return json.dumps(detail_e)

#事件-人物关联结果
@mod.route('/event_detail_people/') 
def show_event_user():
    event_name = request.args.get('event_name', u'马来西亚抓获电信欺诈案犯')
    detail_p = query_event_people(event_name)
    return json.dumps(detail_p)

#事件-事件关联结果
@mod.route('/event_detail_event/') 
def show_event_event():
    event_name = request.args.get('event_name', u'马来西亚抓获电信欺诈案犯')
    layer = request.args.get('layer', 'all') #'1'  '2' 'all'
    detail_p = query_event_event(event_name, layer)
    return json.dumps(detail_p)

#人物-人物关联结果
@mod.route('/person_detail_people/')
def show_person_user():
    uid = request.args.get('uid', '1765891182')
    detail_p = query_person_people(uid,'User')
    return json.dumps(detail_p)

#人物-事件关联结果
@mod.route('/person_detail_event/') 
def show_person_event():
    uid = request.args.get('uid', '5722859628')
    layer = request.args.get('layer', 'all') #'1'  '2' 'all'
    detail_p = query_person_event(uid,layer)
    return json.dumps(detail_p)

#事件-控制面板--图谱
@mod.route('/event_node_filter/')
def event_node_filter():
    event_name = request.args.get('event_name', u'马来西亚抓获电信欺诈案犯')
    node_type = request.args.get('node_type', '')#User,Event
    event_relation_list.extend(user_event_relation)
    relation_str = ','.join(event_relation_list)
    relation_type = request.args.get('relation_type',relation_str)
    relation_type_list = relation_type.split(',')
    print relation_type_list,'!!!!!!!!'
    layer = request.args.get('layer','1') #'1' or '2'
    detail_p = filter_event_nodes(event_name, node_type, relation_type_list,layer)
    return json.dumps(detail_p)

#事件-控制面板--地图
@mod.route('/event_map_filter/')
def event_map_filter():
    event_name = request.args.get('event_name', u'马来西亚抓获电信欺诈案犯')
    node_type = request.args.get('node_type', '')#User,Event
    event_relation_list.extend(user_event_relation)
    relation_str = ','.join(event_relation_list)
    relation_type = request.args.get('relation_type',relation_str)
    relation_type_list = relation_type.split(',')
    print relation_type_list,'!!!!!!!!'
    layer = request.args.get('layer','0') #'1' or '2'
    detail_p = filter_event_map(event_name, node_type, relation_type_list,layer)
    return json.dumps(detail_p)

#人物-控制面板-图谱
@mod.route('/group_node_filter/')
def group_node_filter():
    uid = request.args.get('uid', '1006385463')
    node_type = request.args.get('node_type', '')#User,Event
    relation_list.extend(user_event_relation)
    relation_str = ','.join(relation_list)
    relation_type = request.args.get('relation_type',relation_str)
    relation_type_list = relation_type.split(',')
    print relation_type_list,'!!!!!!!!'
    layer = request.args.get('layer','2') #'0' '1' or '2'
    tab_graph_result = group_tab_graph(uid, node_type, relation_type_list, layer)   
    return json.dumps(tab_graph_result)

#人物-控制面板-地图
@mod.route('/group_map_filter/')
def group_map_filter():
    uid = request.args.get('uid', '1006385463')
    node_type = request.args.get('node_type', '')#User,Event
    relation_list.extend(user_event_relation)
    relation_str = ','.join(relation_list)
    relation_type = request.args.get('relation_type',relation_str)
    relation_type_list = relation_type.split(',')
    layer = request.args.get('layer','1')  # '0' '1' or '2'
    tab_map_result = group_tab_map(uid, node_type, relation_type_list, layer)
    return json.dumps(tab_map_result)

#事件-相关微博
@mod.route('/event_weibo/')
def event_weibo():
    event_name = request.args.get('event_name', u'马来西亚抓获电信欺诈案犯')
    weibo_type = request.args.get('weibo_type', 'retweeted') #sensitive
    weibo_list = get_weibo(event_name, weibo_type)
    return json.dumps(weibo_list)

#人物-相关微博
@mod.route('/user_weibo/')
def user_weibo():
    uid = request.args.get('uid', '6011293891')
    weibo_type = request.args.get('weibo_type', 'retweeted') #sensitive
    weibo_list = get_user_weibo(uid, weibo_type)
    return json.dumps(weibo_list)

@mod.route('/person/')
def show_person():

    p_uid = request.args.get('p_uid', '1006385463')

    return render_template('index/person.html', p_uid = p_uid)

@mod.route('/event/')
def show_event():

    t_uid = request.args.get('t_uid', u'马来西亚抓获电信欺诈案犯')

    return render_template('index/serp.html', t_uid = t_uid)


# 近7天新增人数和事件数，总数
@mod.route('/current_week_increase/')
def ajax_current_week_increase():
    result = query_current_week_increase()

    return json.dumps(result)

# 专题数和群体数
@mod.route('/count_special_event/')
def ajax_count_event_group():
    special_event = query_special_event()

    return json.dumps(special_event)


@mod.route('/count_group/')
def ajax_count_group():
    results = query_group()

    return json.dumps(results)


@mod.route('/new_relationship/')
def ajax_new_relationship():
    results = query_new_relationship()

    return json.dumps(results)


@mod.route('/new_map/')
def ajax_new_map():
    results = query_hot_location()

    return json.dumps(results)


@mod.route('/search_basic_graph/')
def search_basic():  #基本搜索
    search_item = request.args.get('item', 'xiang')
    user_graph = search_related_user(search_item)
    event_graph = search_related_event_f(search_item)
    return json.dumps({'user':user_graph,'event':event_graph})

@mod.route('/search_basic_card/')
def search_basic_card():  #基本搜索，卡片
    search_item = request.args.get('item', 'ai')
    layer = request.args.get('layer', 'all')#'2'  'all'
    user_card = search_related_user_card(search_item,layer)
    event_card = search_related_e_card(search_item, layer)
    return json.dumps({'user':user_card,'event':event_card})

@mod.route('/search_advance_graph/')
def search_advance_graph():  #高级搜索
    node_type = request.args.get('node_type', 'User') #User event
    search_item = request.args.get('item', 'xiang')
    user_graph = search_related_user(search_item)
    event_graph = advance_graph(search_item)
    return json.dumps({'user':user_graph,'event':event_graph})

@mod.route('/search_advance_card_user/')  #搜uid或name，领域 话题 活跃地 用户标签
def search_advance_card_user():  #高级搜索，卡片
    result = {}
    query_data = {}
    query = []
    query_list = []
    condition_num = 0
    query_list = []
    fuzz_item = ['activity_geo']
    multi_item = ['domain','topic_string']
    simple_fuzz_item = ['uid', 'uname']
    item_data = request.args.get('term', '23')
    #print 'item_data:', item_data
    for item in simple_fuzz_item:
        if item_data:
            query_list.append({'wildcard':{item: '*'+item_data+'*'}})
            condition_num += 1
    if query_list:
        query.append({'bool': {'should': query_list}}) 
    for item in fuzz_item:
        item_data = request.args.get(item, '')
        if item_data:
            query.append({'wildcard':{item:'*'+item_data+'*'}})
            condition_num += 1
    # custom_attribute
    tag_items = request.args.get('tag', '')
    if tag_items != '':
        tag_item_list = tag_items.split(',')
        for tag_item in tag_item_list:
            attribute_name_value = tag_item.split(':')
            attribute_name = attribute_name_value[0]
            attribute_value = attribute_name_value[1]
            field_key = submit_user + '-tag'
            if attribute_name and attribute_value:
                query.append({'wildcard':{field_key: '*'+attribute_name + '-' + attribute_value+'*'}})
                condition_num += 1

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
    print query,'---------'
        
    size = 10
    sort = '_score'
    #print 'query condition:', query
    if condition_num >0:
        result = es_user_portrait.search(index=portrait_name, doc_type=portrait_type, \
                    body={'query':{'bool':{'must':query}}, 'sort':[{sort:{'order':'desc'}}], 'size':size},fields= ['uid'])['hits']['hits']
    else:
        result = es_user_portrait.search(index=portrait_name, doc_type=portrait_type, \
                body={'query':{'match_all':{}}, 'sort':[{sort:{"order":"desc"}}], 'size':size}, fields= ['uid'])['hits']['hits']
    id_list = []
    for i in result:
        id_list.append(i['fields']['uid'][0])

    layer = request.args.get('layer', '1')  #1,2,all
    result = advance_search_card(id_list,layer)   
    return json.dumps(result)
