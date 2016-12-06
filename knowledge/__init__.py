# -*- coding: utf-8 -*-

from flask import Flask
from knowledge.index.views import mod as indexModule
from knowledge.theme.views import mod as themeModule
from knowledge.group.views import mod as groupModule
from knowledge.relation.views import mod as relationModule
from knowledge.construction.views import mod as constructionModule
from knowledge.sysadmin.views import mod as adminModule

def create_app():
    app = Flask(__name__)
    app.config.from_object('config')

    # Create modules
    app.register_blueprint(indexModule)
    app.register_blueprint(themeModule)
    app.register_blueprint(groupModule)
    app.register_blueprint(relationModule)
    app.register_blueprint(constructionModule)
    app.register_blueprint(adminModule)
    
    
    # Enable the toolbar?
    app.config['DEBUG_TB_ENABLED'] = app.debug
    # Should intercept redirects?
    app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = True
    # Enable the profiler on all requests, default to false
    app.config['DEBUG_TB_PROFILER_ENABLED'] = True
    # Enable the template editor, default to false
    app.config['DEBUG_TB_TEMPLATE_EDITOR_ENABLED'] = True
    # debug toolbar
    # toolbar = DebugToolbarExtension(app)


    return app
