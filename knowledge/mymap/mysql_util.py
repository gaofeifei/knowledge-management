# coding=utf-8
import MySQLdb
import hashlib


def getconn():
    conn = MySQLdb.connect(
        host='219.224.134.225',
        port=3306,
        user='root',
        passwd='',
        db='knowledge_management',
        charset='utf8'
    )
    return conn


def md5(str):
    m = hashlib.md5()
    m.update(str)
    return m.hexdigest()


def closeAll(conn, cur):
    cur.close()
    conn.commit()
    conn.close()



