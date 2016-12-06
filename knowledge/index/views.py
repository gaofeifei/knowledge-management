# -*- coding: utf-8 -*-

from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
import json
import csv
import os
import time
from datetime import date
from datetime import datetime


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

    
