# -*- coding: utf-8 -*-

from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
from neo4j_event import select_rels_all,select_rels,create_person,create_rel_from_uid2group,create_node_or_node_rel,update_node,update_node_or_node_rel,delete_rel,delete_node
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
@mod.route('/select_all')
def select_all():
    result = select_all("MATCH (n:Person) RETURN n")
    return json.dumps(result)








    
