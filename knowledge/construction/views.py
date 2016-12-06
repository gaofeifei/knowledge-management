# -*- coding: utf-8 -*-

from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
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
    




    
