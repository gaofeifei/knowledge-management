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
from utils import group_tab_graph, group_tab_map,query_group,query_group_user,query_group_event,search_related_user,\
                  query_group_weibo, query_user_num,del_user_group_rel, user_list_group,add_user_group_rel,\
                  search_related_user_card, compare_user_group, compare_event_group,compare_weibo_group, compare_graph_group,\
                  compare_map_group
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
    relation_type_list.extend(user_event_relation)
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
    relation_type_list.extend(user_event_relation)
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
def user_in_group():  #群体包含人物滚动,群体编辑上部分，卡片
    group_name = request.args.get('group_name', '法律人士')
    sort_flag = request.args.get('sort_flag', 'activeness')
    detail_u = query_group_user(group_name, sort_flag)
    return json.dumps(detail_u)

@mod.route('/group_detail/')
def detail_theme():  #群体包含事件滚动
    group_name = request.args.get('group_name', '法律人士')
    sort_flag = request.args.get('sort_flag', 'weibo_counts')
    detail_t = query_group_event(group_name, sort_flag)
    return json.dumps(detail_t)

@mod.route('/group_weibo/')
def detail_weibo():  #群体包含微博
    group_name = request.args.get('group_name', '法律人士')
    # weibo_type = request.args.get('weibo_type', 'influ') #sensi
    sort_flag = request.args.get('sort_flag', 'retweeted')#sensitive
    detail_w = query_group_weibo(group_name, sort_flag)
    return json.dumps(detail_w)

@mod.route('/uid_in_group/')#群体编辑的上半部分-表格
def uid_in_group():  #群体包含人物滚动
    group_name = request.args.get('group_name', '法律人士')
    # uid = request.args.get('uid', '2682428145')
    uid_list = user_list_group(group_name)
    return json.dumps(uid_list)

@mod.route('/del_user_in_group/')
def del_user_in_group():  #群体编辑-删除人物
    group_name = request.args.get('group_name', '法律人士')
    uid = request.args.get('uid', '2682428145')
    flag = del_user_group_rel(group_name, uid)
    return json.dumps(flag)

@mod.route('/search_related_people/')
def search_related_people():  #群体编辑-增加前先搜索人物
    # group_name = request.args.get('group_name', '法律人士')
    search_item = request.args.get('item', '358')
    user_graph = search_related_user(search_item)
    return json.dumps(user_graph)

@mod.route('/search_related_people_card/')
def search_related_people_card():  #群体编辑-增加前先搜索人物,卡片部分
    # group_name = request.args.get('group_name', '法律人士')
    search_item = request.args.get('item', '3548')
    layer = request.args.get('layer', 'all')#'2'  'all'
    user_card = search_related_user_card(search_item,layer)
    return json.dumps(user_card)

@mod.route('/add_user_in_group/')   #--------没写完！！！！！！！！！！！！！！！！！！！
def add_user_in_group():  #群体编辑-增加人物
    group_name = request.args.get('group_name', '法律人士')
    uid = request.args.get('uid', '2682428145')
    flag = add_user_group_rel(group_name, uid)
    return json.dumps(flag)

@mod.route('/g_compare_user/')   
def g_compare_user():  #群体对比，人物对比
    group_name1 = request.args.get('group_name1', '法律人士')
    group_name2 = request.args.get('group_name2', '法律人士')
    sort_flag = request.args.get('sort_flag', 'activeness')#influence, sensitive
    diff = request.args.get('diff', '0')# '1', '2'  0:全部 1相同  2不同
    result = compare_user_group(group_name1,group_name2,sort_flag,diff)
    return json.dumps(result)

@mod.route('/g_compare_event/')   
def g_compare_event():  #群体对比，事件对比
    group_name1 = request.args.get('group_name1', '法律人士')
    group_name2 = request.args.get('group_name2', '媒体')
    sort_flag = request.args.get('sort_flag', 'start_ts')#uid_counts, weibo_counts
    diff = request.args.get('diff', '0')# '1', '2'  0:全部 1相同  2不同
    result = compare_event_group(group_name1,group_name2,sort_flag,diff)
    return json.dumps(result)

@mod.route('/g_compare_weibo/')   
def g_compare_weibo():  #群体对比，微博对比
    group_name1 = request.args.get('group_name1', '法律人士')
    group_name2 = request.args.get('group_name2', '媒体')
    sort_flag = request.args.get('sort_flag', 'retweeted')#sensitive
    diff = request.args.get('diff', '0')# '1', '2'  0:全部 1相同  2不同
    result = compare_weibo_group(group_name1,group_name2,sort_flag,diff)
    return json.dumps(result)

@mod.route('/g_compare_graph/')   
def g_compare_graph():  #群体对比，图谱对比
    group_name1 = request.args.get('group_name1', '法律人士')
    group_name2 = request.args.get('group_name2', '媒体')
    layer = request.args.get('layer','1') #'0' '1' or '2'
    diff = request.args.get('diff', '0')# '1', '2'  0:全部 1相同  2不同
    result = compare_graph_group(group_name1,group_name2,layer,diff)
    return json.dumps(result)

@mod.route('/g_compare_map/')   
def g_compare_map():  #群体对比，地图对比
    group_name1 = request.args.get('group_name1', '法律人士')
    group_name2 = request.args.get('group_name2', '媒体')
    layer = request.args.get('layer','1') #'0' '1' or '2'
    diff = request.args.get('diff', '0')# '1', '2'  0:全部 1相同  2不同
    result = compare_map_group(group_name1,group_name2,layer,diff)
    return json.dumps(result)