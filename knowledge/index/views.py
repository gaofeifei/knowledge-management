# -*- coding: utf-8 -*-

from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
import json
import csv
import os
import time
from datetime import date
from datetime import datetime
from knowledge.global_config  import event_relation_list,user_event_relation
from utils import query_current_week_increase, query_special_event, query_group,filter_event_map,\
     query_new_relationship, query_hot_location, query_event_detail,query_event_people,filter_event_nodes


mod = Blueprint('index', __name__, url_prefix='/index')

@mod.route('/')
def index():

    return render_template('index/homepage.html')

@mod.route('/search_result/')
def show_searche_result():

    return render_template('index/incident.html')

#事件详细页面上方卡片结果
@mod.route('/event_detail/') 
def show_search_event():
    event_name = request.args.get('event_name', u'马来西亚抓获电信欺诈案犯')
    detail_e = query_event_detail(event_name)
    return json.dumps(detail_e)

#事件人物详细结果
@mod.route('/event_detail_people/') 
def show_event_user():
    event_name = request.args.get('event_name', u'马来西亚抓获电信欺诈案犯')
    detail_p = query_event_people(event_name)
    return json.dumps(detail_p)

#事件控制面板--图谱
@mod.route('/event_node_filter/')
def event_node_filter():
    event_name = request.args.get('event_name', u'马来西亚抓获电信欺诈案犯')
    node_type = request.args.get('node_type', '')#User,Event
    event_relation_list.extend(user_event_relation)
    relation_str = ','.join(event_relation_list)
    relation_type = request.args.get('relation_type',relation_str)
    relation_type_list = relation_type.split(',')
    print relation_type_list,'!!!!!!!!'
    layer = request.args.get('layer','0') #'1' or '2'
    detail_p = filter_event_nodes(event_name, node_type, relation_type_list,layer)
    return json.dumps(detail_p)

#事件控制面板--地图
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


@mod.route('/person/')
def show_person():

    return render_template('index/person.html')

@mod.route('/event/')
def show_event():

    return render_template('index/serp.html')


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
