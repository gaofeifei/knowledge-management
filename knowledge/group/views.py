# -*- coding: utf-8 -*-

from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
import json
import csv
import os
import time
from datetime import date
from datetime import datetime
import csv
from  knowledge.global_config  import relation_list,user_event_relation
from utils import group_tab_graph, group_tab_map,query_group,query_group_user,query_group_event,\
                  query_group_weibo, query_user_num
from py2neo import Node, Relationship, Graph, NodeSelector
from py2neo.packages.httpstream import http

mod = Blueprint('group', __name__, url_prefix='/group')

@mod.route('/')
def group():

    return render_template('group/groupore.html')

@mod.route('/detail/')
def show_group_detail():
    group_name = request.args.get('group_name', u'媒体')

    return render_template('group/grouptrue.html')

@mod.route('/comparison/')
def group_comparison():

    return render_template('group/groupdiff.html')

@mod.route('/group_node_filter/')
def group_node_filter():
    group_name = request.args.get('group_name', u'媒体')
    node_type = request.args.get('node_type', '')#User,Event
    relation_list.extend(user_event_relation)
    relation_str = ','.join(relation_list)
    relation_type = request.args.get('relation_type',relation_str)
    relation_type_list = relation_type.split(',')
    print relation_type_list,'!!!!!!!!'
    layer = request.args.get('layer','0') #'0' '1' or '2'
    tab_graph_result = group_tab_graph(group_name, node_type, relation_type_list, layer)   
    return json.dumps(tab_graph_result)

@mod.route('/group_map_filter/')
def group_map_filter():
    group_name = request.args.get('group_name', u'媒体')
    node_type = request.args.get('node_type', '')#User,Event
    relation_list.extend(user_event_relation)
    relation_str = ','.join(relation_list)
    relation_type = request.args.get('relation_type',relation_str)
    relation_type_list = relation_type.split(',')
    layer = request.args.get('layer','0') # '0' '1' or '2'
    tab_map_result = group_tab_map(group_name, node_type, relation_type_list, layer)   
    return json.dumps(tab_map_result)

@mod.route('/overview/') #群体概览
def overview_group():
    special_group = query_group()

    return json.dumps(special_group)

@mod.route('/user_num_group/')
def user_num_group():  #群体包含人物数量
    group_name = request.args.get('group_name', '法律人士')
    detail_l = query_user_num(group_name)
    return json.dumps(detail_l)

@mod.route('/user_in_group/')
def user_in_group():  #群体包含人物滚动
    group_name = request.args.get('group_name', '法律人士')
    sort_flag = request.args.get('sort_flag', 'activeness')
    detail_u = query_group_user(group_name, sort_flag)
    return json.dumps(detail_u)

@mod.route('/group_detail/')
def detail_theme():  #群体包含事件滚动
    group_name = request.args.get('group_name', '法律人士')
    sort_flag = request.args.get('sort_flag', 'counts')
    detail_t = query_group_event(group_name, sort_flag)
    return json.dumps(detail_t)

@mod.route('/group_weibo/')
def detail_weibo():  #群体包含微博
    group_name = request.args.get('group_name', '法律人士')
    # weibo_type = request.args.get('weibo_type', 'influ') #sensi
    sort_flag = request.args.get('sort_flag', 'retweeted')#sensitive
    detail_w = query_group_weibo(group_name, sort_flag)
    return json.dumps(detail_w)
