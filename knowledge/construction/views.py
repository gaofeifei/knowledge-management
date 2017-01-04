# -*- coding: utf-8 -*-

from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
from neo4j_event import select_rels_all, select_rels, create_person, create_rel_from_uid2group, create_node_or_node_rel, \
    update_node, update_node_or_node_rel, delete_rel, delete_node
import json
import csv
import os
import time
from datetime import date
from datetime import datetime
# from knowledge.global_utils import event_name_search

mod = Blueprint('construction', __name__, url_prefix='/construction')


@mod.route('/node/')
def add_node():
    return render_template('construction/addmap.html')


@mod.route('/relation/')
def add_relation():
    return render_template('construction/compile.html')

@mod.route('/read_file/', methods=['GET','POST'])
def new_in():#读取文件的内容
    f_name = request.form['new_words']
    flag = request.form['flag']

    uid_list = []
    line = f_name.split('\n')
    if len(line) == 0:
        return json.dumps('No Content!')
    
    for li in line:
        uid_list.append(li)

    return json.dumps(uid_list)


@mod.route('/select_relation/')
def select_relation():
    result_dict = {}
    list = []
    list1 = []
    result = select_rels_all("MATCH (n:Person)-[r]->(m) return n.uid,r,m.uid")
    for item in result:
        id = item[0]
        friend = item[1].type()
        print friend
        id2 = item[2]
        a = (id, friend, id2)
        list.append(a)
        list1.append(id)
        list1.append(id2)
    list1_set = [i for i in set(list1)]
    result_dict["relation"] = list
    result_dict["node"] = list1_set
    return json.dumps(result_dict)

#select node
@mod.route('/select_node/')
def select_node():
    list = []
    list_set = [] 
    result = select_rels_all("MATCH (n:Person)-[r]-() return n")
    for item in result:
        list.append(item)
    list_set=[i for i in set(list)]
    return json.dumps(list_set)


@mod.route('/select_event/')
def select_event_relation():
    result_dict = {}
    list = []
    list1 = []
    result = select_rels_all("MATCH (n:Person)-[r:admin]->(m) return n.uid,r,m.event_id")
    for item in result:
        id = item[0]
        friend = item[1].type()
        print friend
        id2 = item[2]
        a = (id, friend, id2)
        list.append(a)
        list1.append(id)
        list1.append(id2)
    list1_set = [i for i in set(list1)]
    result_dict["relation"] = list
    result_dict["node"] = list1_set
    return json.dumps(result_dict)


@mod.route('/select_event_node/')
def select_event_node():
    list = []
    list_set = []
    result = select_rels_all("MATCH (n:Person)-[r:admin]-(m) return n,m")
    for item in result:
        list.append(item[1])
        # list.append(item[2])
    list_set = [i for i in set(list)]
    return json.dumps(list_set)


@mod.route('/create_relation/')
def create_relation():
    node_key1 = request.args.get('node_key1', 'uid')#uid,event
    node1_id = request.args.get('node1_id', '1581366400')
    node1_index_name = request.args.get('node1_index_name', 'node_index')#node_index event_index
    rel = request.args.get('rel', 'join')
    node_key2 = request.args.get('node_key2', 'event')#event,uid
    node2_id = request.args.get('node2_id', 'min-jin-dang-yi-yuan-cheng-yao-qing-da-lai-dui-kang-da-lu-1482126431')
    node2_index_name = request.args.get('node2_index_name', 'event_index')
    flag = create_node_or_node_rel(node_key1, node1_id, node1_index_name, rel,\
           node_key2, node2_id, node2_index_name)
    return json.dumps(flag)
