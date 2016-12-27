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

mod = Blueprint('construction', __name__, url_prefix='/construction')


@mod.route('/node/')
def add_node():
    return render_template('construction/addmap.html')


@mod.route('/relation/')
def add_relation():
    return render_template('construction/compile.html')


@mod.route('/select_relation')
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


@mod.route('/select_node')
def select_node():
    list = []
    result = select_rels_all("MATCH (n:Person) return n")
    for item in result:
        list.append(item)
    return json.dumps(list)
