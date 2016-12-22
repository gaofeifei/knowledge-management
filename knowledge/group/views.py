# -*- coding: utf-8 -*-

from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
import json
import csv
import os
import time
from datetime import date
from datetime import datetime
import csv
from utils import group_tab_graph, group_tab_map
from py2neo import Node, Relationship, Graph, NodeSelector
from py2neo.packages.httpstream import http

mod = Blueprint('group', __name__, url_prefix='/group')

@mod.route('/')
def group():

    return render_template('group/groupore.html')

@mod.route('/detail/')
def show_group_detail():

    return render_template('group/grouptrue.html')

@mod.route('/comparison/')
def group_comparison():

    return render_template('group/groupdiff.html')

@mod.route('/group_node_filter/')
def group_node_filter():
    group_name = request.args.get('group_name', u'媒体')
    node_type = request.args.get('node_type', '')#User,Event
    relation_type = request.args.get('relation_type','')
    layer = request.args.get('layer','1') #'1' or '2'
    tab_graph_result = group_tab_graph(group_name, node_type, relation_type, layer)   
    return json.dumps(tab_graph_result)

@mod.route('/group_map_filter/')
def group_map_filter():
    group_name = request.args.get('group_name', u'媒体')
    node_type = request.args.get('node_type', '')#User,Event
    relation_type = request.args.get('relation_type','')
    layer = request.args.get('layer','1') #'1' or '2'
    tab_map_result = group_tab_map(group_name, node_type, relation_type, layer)   
    return json.dumps(tab_map_result)
