# -*-coding:utf-8-*-
from flask import Blueprint, request,make_response,render_template
from  landing_module import select_user, update_itme, insert_item, delete_item, login_administrator
from user_interface import login,select_topic
import json

# from knowledge.global_utils import event_name_search

mod = Blueprint('mymap', __name__, url_prefix='/mymap')


#################################################################################
#管理员用户操作

# 查询有多少个用户
@mod.route('/mysql_user_select/')
def select_users():
    result = select_user()
    return json.dumps(result)


# 修改一个用户的密码
@mod.route('/mysql_user_update/')
def update_users():
    user = request.args.get('user', '')
    password = request.args.get('password', '')
    if user == '' or password == '':
        print "user or password is null"
        return '0'
    else:
        return update_itme(user, password)


# 添加一个用户
@mod.route('/mysql_user_insert/')
def insert_users():
    user = request.args.get('user', '')
    password = request.args.get('password', '')
    if user == '' or password == '':
        print "user or password is null"
        return '0'
    else:
        return insert_item(user, password)


# 删除一个用户
@mod.route('/mysql_user_delete/')
def delete_users():
    user = request.args.get('user', '')
    if user == '':
        print "user  is null"
        return '0'
    else:
        return delete_item(user)

#管理员用户进行登录
@mod.route('/mysql_user_admin_login/')
def login_admin():
    user = request.args.get('user', '')
    password = request.args.get('password', '')
    if user == '' or password == '':
        print "user or password is null"
        return '0'
    else:
        return login_administrator(user, password)


######################################################################


#用户登录界面
@mod.route('/mysql_user_login/')
def login_user():
    user = request.args.get('user', 'zhaishujie')
    password = request.args.get('password', '123456')
    if user == '' or password == '':
        print "user or password is null"
        return '0'
    else:
        result = login(user, password)
        if result !=0:
            response = make_response("username_login")
            response.set_cookie("user",user)
            result = "success"
##############################################需要进行修改
#            return render_template('home.html', result = result)
            return response
        else :
#            return render_template('login.html', result = result)
            return "login"

@mod.route('/get_session/')
def get_session():
    user = request.cookies.get("user")
    if user != None:
        result = select_topic(user)
        list = []
        for item in result:
            sdb = (item[1], item[2], item[3], item[4], str(item[5]), str(item[6]))
            list.append(sdb)
        return json.dumps(list)
    else:
        return str(1)



