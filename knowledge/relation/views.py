# -*- coding: utf-8 -*-

from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
import json
import csv
import os
import time
from datetime import date
from datetime import datetime
from utils import search_node_f, search_way


mod = Blueprint('relation', __name__, url_prefix='/relation')

@mod.route('/')
def relation_index():

    return render_template('relation/relation.html')

@mod.route('/search_node/')
def search_node():
    search_item1 = request.args.get('item1', '123')
    node_type1 = request.args.get('node_type1', 'User') #User  Event
    search_item2 = request.args.get('item2', '香港')
    node_type2 = request.args.get('node_type2', 'Event') #User  Event
    result = search_node_f(search_item1, node_type1, search_item2, node_type2)
    return json.dumps(result)

@mod.route('/find_min_way/')
def find_min_way():
    node1 = request.args.get('item1', '1035566190')
    node2 = request.args.get('item2', '1660862654')
    node_type1 = request.args.get('node_type1', 'User') #User  Event
    node_type2 = request.args.get('node_type2', 'User') #User  Event
    result = search_way(node1, node2, node_type1, node_type2)
    return json.dumps(result)



    
