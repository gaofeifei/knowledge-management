# -*- coding: utf-8 -*-

from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
import json
import csv
import os
import time
from datetime import date
from datetime import datetime


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



    
