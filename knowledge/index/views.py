# -*- coding: utf-8 -*-

from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
import json
import csv
import os
import time
from datetime import date
from datetime import datetime
from utils import query_current_week_increase, query_special_event, query_group


mod = Blueprint('index', __name__, url_prefix='/index')

@mod.route('/')
def index():

    return render_template('index/homepage.html')

@mod.route('/search_result/')
def show_searche_result():

    return render_template('index/incident.html')
    
@mod.route('/person/')
def show_person():

    return render_template('index/person.html')

@mod.route('/event/')
def show_event():

    return render_template('index/serp.html')


# 近7天新增人数和事件数
@mod.route('/current_week_increase/')
def ajax_current_week_increase():
    result = query_current_week_increase()

    return json.dumps(result)

# 专题数和群体数
@mod.route('/count_special_event/')
def ajax_count_event_group():
    special_event = query_special_event()

    return json.dumps(special_event)


@mod.route('/count_group/')
def ajax_count_group():
    results = query_group()

    return json.dumps(results)

