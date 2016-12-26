# -*- coding: utf-8 -*-

from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
import json
import csv
import os
import time
from datetime import date
from datetime import datetime
from knowledge.global_config  import event_relation_list
from py2neo import Node, Relationship, Graph, NodeSelector
from py2neo.packages.httpstream import http
from utils import theme_tab_map, theme_tab_graph
graph = Graph('http://219.224.134.213:7474/db/data', user='neo4j', password='database')
g= graph.begin()
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
    
@mod.route('/theme_node_filter/')
def theme_node_filter():
    theme_name = request.args.get('theme_name', '电信诈骗')
    node_type = request.args.get('node_type', '')#User,Event
    relation_str = ','.join(event_relation_list)
    relation_type = request.args.get('relation_type',relation_str)
    relation_type_list = relation_type.split(',')
    layer = request.args.get('layer','2') #'1' or '2'
    filter_result = theme_tab_graph(theme_name, node_type, relation_type_list, layer)
    return json.dumps(filter_result)

@mod.route('/theme_map_filter/')
def theme_map_filter():
    theme_name = request.args.get('theme_name', '电信诈骗')
    node_type = request.args.get('node_type', '')#User,Event
    relation_str = ','.join(event_relation_list)
    relation_type = request.args.get('relation_type','')
    relation_type_list = relation_type.split(',')
    layer = request.args.get('layer','1') #'1' or '2'
    filter_map_result = theme_tab_map(theme_name, node_type, relation_type_list, layer)
    return json.dumps(filter_map_result)