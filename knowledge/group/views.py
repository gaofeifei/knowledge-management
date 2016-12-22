# -*- coding: utf-8 -*-

from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
import json
import csv
import os
import time
from datetime import date
from datetime import datetime
import csv
from py2neo import Node, Relationship, Graph, NodeSelector
from py2neo.packages.httpstream import http
graph = Graph('http://219.224.134.213:7474/db/data', user='neo4j', password='database')
g= graph.begin()
http.socket_timeout = 9999

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

@mod.route('/node_filter/')
def group_node_filter():
    group_name = request.args.get('group_name', u'媒体')
    node_type = request.args.get('node_type', 'User')#User,Event
    relation_type = request.args.get('relation_type','')
    layer = request.args.get('layer','1')#2
    s_string = 'START s0 = node:group_index(group="' + group_name + '")  \
                MATCH (s0)-[r]-(s) RETURN s.uid as uid'
    user_list = graph.run(s_string)

    # b = Node("Group", group=group_name)
    # print g.degree(b),'-=-=-=-=-=----------------'
    if node_type!='':
        node_type = ':' + node_type
    if relation_type!='':
        relation_type = ':' + relation_type
    user_relation = []
    # total_user = len(list(uid_list))
    uid_list = []
    for uid in user_list:
        uid_value = uid['uid']
        uid_list.append(uid_value)#取uid
        
    for uid_value in uid_list:
        c_string = 'START s0 = node:node_index(uid="'+str(uid_value)+'") '
        # print c_string,'---------------'
        c_string += 'MATCH (s0)-[r'+relation_type+']-(s1'+node_type+') return s0,r,s1 LIMIT 10'
        # print c_string
        # c_string += 'MATCH (s0)-[r]->(s1:Domain) RETURN s0.uid ,r,s1.uid' #只包含某一类的节点
        # # c_string += 'MATCH (s0)-[r:topic]->(s1) RETURN s0.uid ,r,s1.uid' #只包含某一类的关系
        # c_string += 'MATCH (s0)-[r1]-(s1)-[r2]-(s2) RETURN s0,r1,s1,r2,s2 LIMIT 30' #两层无向关系
        # # c_string += 'MATCH (s0)-[r]->(s1) RETURN s0,r,s1' #一层有向关系
        # # c_string += 'MATCH (s0)-[r]-(s1) RETURN s0,r,s1' #一层无向关系
        # print c_string

        result = graph.run(c_string)
        # print list(result),'-----------------'
        for i in list(result):
            start_id = i['s0']['uid']
            # start_id = s0['uid']
            relation = i['r'].type()
            end_id = dict(i['s1'])
            if end_id.has_key('uid'):
                user_relation.append([start_id,relation,end_id['uid']])
            if end_id.has_key('envent_id'):
                user_relation.append([start_id,relation,end_id['envent_id']])
            # print i['s1'].labels()
            # print i['r'].type()#输出关系类型
            # print dict(i['s1'])#输出节点的属性

    return json.dumps({'total_user':len(uid_list),'relation':user_relation,'total':len(user_relation)})




    # return render_template('group/node_filter.html')

    
