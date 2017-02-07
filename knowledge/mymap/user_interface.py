# coding=utf-8
from mysql_util import getconn, closeAll, md5

"""
本文件主要针对我的图谱对图谱的群体，专题，关注进行数据库的添加修改操作
其中包括进行登录界面。
"""


# 登录界面
def login(name, password):
    password = md5(password)
    conn = getconn()
    cur = conn.cursor()
    sql = "select * from user where name=%s and password=%s"
    result = cur.execute(sql, (name, password))
    return result


################################################################################
# 专题

# 查询我的专题
def select_topic(name):
    conn = getconn()
    cur = conn.cursor()
    sql = "select * from topic where name=%s"
    count = cur.execute(sql,(name,))
    print "sql1"
    result = cur.fetchmany(count)
    closeAll(conn, cur)
    return result


# 删除我的专题
def delete_topic(name, topicName):
    conn = getconn()
    cur = conn.cursor()
    sql = "delete from topic where name=%s and topicName=%s"
    result = cur.execute(sql, (name, topicName))
    closeAll(conn, cur)
    return result


# 添加一个专题
def inster_topic(list):
    conn = getconn()
    cur = conn.cursor()
    sql = "inster into topic (name,topicName,event,eventCount,createTime,modifyTime) values(%s,%s,%s,%d,%s,%s)"
    result = cur.execute(sql, (list))
    closeAll(conn, cur)
    return result


# 更新一个专题
def update_topic():
    conn = getconn()
    cur = conn.messages
    sql = ""
    result = cur.extend(sql, ())
    closeAll(conn, cur)
    return result


########################################################
# 群体

# 查询我的群体
def select_group(name):
    conn = getconn()
    cur = conn.cursor()
    sql = "select * from group where name=%s"
    count = cur.execute(sql, (name))
    result = cur.fetchmany(count)
    closeAll(conn, cur)
    return result


# 删除我的群体
def delete_group(name, groupName):
    conn = getconn()
    cur = conn.cursor()
    sql = "delete from group where name=%s and groupName=%s"
    result = cur.execute(sql, (name, groupName))
    closeAll(conn, cur)
    return result


# 添加一个群体
def inster_group(list):
    conn = getconn()
    cur = conn.cursor()
    sql = "inster into group (name,groupName,people,peopleCount,createTime,modifyTime) values(%s,%s,%s,%d,%s,%s)"
    result = cur.execute(sql, (list))
    closeAll(conn, cur)
    return result


# 更新一个群体
def update_group():
    conn = getconn()
    cur = conn.messages
    sql = ""
    result = cur.extend(sql, ())
    closeAll(conn, cur)
    return result

###################################################################
# 我关注的人

# 查询我关注的人
def select_people(name):
    conn = getconn()
    cur = conn.cursor()
    sql = "select * from people_attention where name=%s"
    count = cur.execute(sql, (name))
    result = cur.fetchmany(count)
    closeAll(conn, cur)
    return result


# 删除我关注的人
def delete_people(name, peopleID):
    conn = getconn()
    cur = conn.cursor()
    sql = "delete from people_attention where name=%s and peopleID=%s"
    result = cur.execute(sql, (name, peopleID))
    closeAll(conn, cur)
    return result

# 添加我关注的人
def inster_people(list):
    conn = getconn()
    cur = conn.cursor()
    sql = "inster into people_attention (name,peopleID,label,attentionTime) values(%s,%s,%s,%s)"
    result = cur.execute(sql, (list))
    closeAll(conn, cur)
    return result


##############################################################################################
#我关注的事件
# 查询我关注的事件
def select_event(name):
    conn = getconn()
    cur = conn.cursor()
    sql = "select * from event_attention where name=%s"
    count = cur.execute(sql, (name))
    result = cur.fetchmany(count)
    closeAll(conn, cur)
    return result


# 删除我关注的事件
def delete_event(name, eventID):
    conn = getconn()
    cur = conn.cursor()
    sql = "delete from event_attention where name=%s and eventID=%s"
    result = cur.execute(sql, (name, eventID))
    closeAll(conn, cur)
    return result

# 添加我关注的事件
def inster_event(list):
    conn = getconn()
    cur = conn.cursor()
    sql = "inster into event_attention (name,eventID,label,attentionTime) values(%s,%s,%s,%s)"
    result = cur.execute(sql, (list))
    closeAll(conn, cur)
    return result


##########################################################################
#添加人物记录


# 添加事件修改记录
def inster_event_history(list):
    conn = getconn()
    cur = conn.cursor()
    sql = "inster into event_history (name,eventID,modifyRecord,modifyTime) values(%s,%s,%s,%s)"
    result = cur.execute(sql, (list))
    closeAll(conn, cur)
    return result

#查询事件记录
def select_event_history():
    conn = getconn()
    cur = conn.cursor()
    sql = "select * from event_history"
    count = cur.execute(sql)
    result = cur.fetchmany(count)
    closeAll(conn, cur)
    return result


############################################################
#添加人物记录


# 添加事件修改记录
def inster_people_history(list):
    conn = getconn()
    cur = conn.cursor()
    sql = "inster into people_history (name,peopleID,modifyRecord,modifyTime) values(%s,%s,%s,%s)"
    result = cur.execute(sql, (list))
    closeAll(conn, cur)
    return result

#查询事件记录
def select_people_history():
    conn = getconn()
    cur = conn.cursor()
    sql = "select * from people_history"
    count = cur.execute(sql)
    result = cur.fetchmany(count)
    closeAll(conn, cur)
    return result
