# -*- coding: utf-8 -*-

from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
import json
import csv
import os
import time
from datetime import date
from datetime import datetime
from knowledge.global_config  import event_relation_list,user_event_relation
from py2neo import Node, Relationship, Graph, NodeSelector
from py2neo.packages.httpstream import http
from utils import theme_tab_map, theme_tab_graph,query_special_event,event_list_theme,\
                  query_detail_theme,query_theme_user, query_event_river,del_e_theme_rel,\
                  search_related_event_f,search_related_e_card, compare_user_theme, compare_event_theme

http.socket_timeout = 9999

mod = Blueprint('theme', __name__, url_prefix='/theme')

@mod.route('/')
def theme_analysis():

    return render_template('theme/analyze.html')

@mod.route('/different/')
def theme_different():

    return render_template('theme/analyzediff.html')

@mod.route('/detail/')
def show_detail():

    return render_template('theme/proults.html')

@mod.route('/overview/')
def overview_theme():  #专题概览
    special_event = query_special_event()

    return json.dumps(special_event)

@mod.route('/theme_detail/')
def detail_theme():  #专题包含事件滚动卡片,专题编辑上方卡片
    theme_name = request.args.get('theme_name', '电信诈骗')
    sort_flag = request.args.get('sort_flag', 'start_ts')#weibo_counts #uid_counts
    detail_t = query_detail_theme(theme_name, sort_flag)
    return json.dumps(detail_t)

@mod.route('/theme_river/')
def detail_river_theme():  #专题包含事件河,数量走势图信息
    theme_name = request.args.get('theme_name', '电信诈骗')
    detail_t = query_event_river(theme_name)
    return json.dumps(detail_t)

@mod.route('/user_in_theme/')
def user_in_theme():  #专题包含人物滚动
    theme_name = request.args.get('theme_name', '电信诈骗')
    sort_flag = request.args.get('sort_flag', 'activeness')
    detail_t = query_theme_user(theme_name, sort_flag)
    return json.dumps(detail_t)
    
@mod.route('/theme_node_filter/')
def theme_node_filter():
    theme_name = request.args.get('theme_name', '电信诈骗')
    node_type = request.args.get('node_type', '')#User,Event
    event_relation_list.extend(user_event_relation)
    relation_str = ','.join(event_relation_list)
    relation_type = request.args.get('relation_type',relation_str)
    relation_type_list = relation_type.split(',')
    layer = request.args.get('layer','0') # '0' '1' or '2'
    filter_result = theme_tab_graph(theme_name, node_type, relation_type_list, layer)
    return json.dumps(filter_result)

@mod.route('/theme_map_filter/')
def theme_map_filter():
    theme_name = request.args.get('theme_name', '电信诈骗')
    node_type = request.args.get('node_type', '')#User,Event
    event_relation_list.extend(user_event_relation)
    relation_str = ','.join(event_relation_list)
    relation_type = request.args.get('relation_type',relation_str)
    relation_type_list = relation_type.split(',')
    layer = request.args.get('layer','1') #'0' or '1' or '2'
    filter_map_result = theme_tab_map(theme_name, node_type, relation_type_list, layer)
    return json.dumps(filter_map_result)

@mod.route('/event_in_theme/')#专题编辑的上半部分-表格
def event_in_theme():  
    theme_name = request.args.get('theme_name', '电信诈骗')
    # uid = request.args.get('uid', '2682428145')
    event_list = event_list_theme(theme_name)
    return json.dumps(event_list)

@mod.route('/del_event_in_theme/')
def del_event_in_theme():  #专题编辑-删除事件
    theme_name = request.args.get('theme_name', '电信诈骗')
    event_id = request.args.get('event_id', 'gong-an-bu-gua-pai-du-ban-shi-da-dian-xin-qi-zha-an-jian-1482127322')
    flag = del_e_theme_rel(theme_name, event_id)
    return json.dumps(flag)

@mod.route('/search_related_event/')
def search_related_event():  #专题编辑-编辑前先搜索人物,图谱
    search_item = request.args.get('item', '马来')
    user_graph = search_related_event_f(search_item)
    return json.dumps(user_graph)

@mod.route('/search_related_event_card/')
def search_related_event_card():  #专题编辑-增加前先搜索人物,卡片部分
    search_item = request.args.get('item', '马来')
    layer = request.args.get('layer', '2')#'2'  'all'
    event_card = search_related_e_card(search_item, layer)
    return json.dumps(event_card)


@mod.route('/e_compare_user/')   
def e_compare_user():  #专题对比，人物表格对比
    theme_name1 = request.args.get('theme_name1', '电信诈骗')
    theme_name2 = request.args.get('theme_name2', '港澳台')
    sort_flag = request.args.get('sort_flag', 'activeness')#influence, sensitive
    diff = request.args.get('diff', '2')# '1', '2'  0:全部 1相同  2不同
    result = compare_user_theme(theme_name1, theme_name2, sort_flag, diff)
    return json.dumps(result)

@mod.route('/e_compare_event/')   
def e_compare_event():  #专题对比，事件卡片对比
    theme_name1 = request.args.get('theme_name1', '电信诈骗')
    theme_name2 = request.args.get('theme_name2', '港澳台')
    sort_flag = request.args.get('sort_flag', 'start_ts')#uid_counts, weibo_counts
    diff = request.args.get('diff', '0')# '1', '2'  0:全部 1相同  2不同
    result = compare_event_theme(theme_name1, theme_name2, sort_flag, diff)
    return json.dumps(result)
