# -*- coding: utf-8 -*-

from flask import Blueprint, url_for, render_template, request, abort, flash, session, redirect
import json
import csv
import os
import time
from datetime import date
from datetime import datetime


mod = Blueprint('theme', __name__, url_prefix='/theme')

@mod.route('/')
def theme_analysis():

    return render_template('theme/analyze.html')

@mod.route('/different/')
def theme_different():

    return render_template('theme/analyzediff.html')

@mod.route('/detail/')
def show_detail():

    return render_template('theme/proults.html')
    




    
