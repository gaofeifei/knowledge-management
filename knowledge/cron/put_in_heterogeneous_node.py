# -*-coding:utf-8-*-

import time
import json
import redis
from py2neo import Graph
from py2neo import Node, Relationship
from py2neo.ogm import GraphObject, Property
from py2neo.packages.httpstream import http
from py2neo.ext.batman import ManualIndexManager
from py2neo.ext.batman import ManualIndexWriteBatch
http.socket_timeout = 9999

graph = Graph('http://219.224.134.213:7474/db/data', user="neo4j", password="database")
#graph = Graph()
#r = redis.StrictRedis(host="219.224.134.211", port="7381", db=15)

domain_list = [u'高校', u'境内机构', u'境外机构', u'媒体', u'境外媒体', u'民间组织', u'法律机构及人士', \
        u'政府机构及人士', u'媒体人士', u'活跃人士', u'草根', u'其他', u'商业人士']

topic_list = [u'文体类_娱乐', u'科技类', u'经济类', u'教育类', u'民生类_环保', \
        u'民生类_健康', u'军事类', u'政治类_外交', u'文体类_体育', u'民生类_交通', \
        u'其他类', u'政治类_反腐', u'民生类_就业', u'政治类_暴恐', u'民生类_住房', \
        u'民生类_法律', u'政治类_地区和平', u'政治类_宗教', u'民生类_社会保障']

class User(GraphObject):
    __primarykey__ = "uid"
    uid = Property()

class Domain(GraphObject):
    __primarykey__ = "domain"
    domain = Property()

class Topic(GraphObject):
    __primarykey__ = 'topic'
    topic = Property()

def put_in_node():
    Index = ManualIndexManager(graph) # manage index
    tx = graph.begin()
    count = 0
    index_list = [] # temporal put in
    filter_set = set()
    ts = time.time()
    #domain_name = "domain_index"
    domain_name = "topic_index"
    domain_index = Index.get_or_create_index(Node, domain_name)
    Batch_index = ManualIndexWriteBatch(graph)

    #for item in domain_list:
    for item in topic_list:
        #st_node = Index.get_or_create_indexed_node(node_name, "uid", start_node, {"uid":start_node})
        #ed_node = Index.get_or_create_indexed_node(node_name, "uid", end_node, {"uid":end_node})
        #exist = Index.get_indexed_node(domain_name, "domain", item)
        exist = Index.get_indexed_node(domain_name, "topic", item)
        if not exist:
            #node = Node("Domain", domain=item)
            node = Node("Topic", topic=item)
            tx.create(node)
            index_list.append([item, node])
    tx.commit()
    for item in index_list:
        #domain_index.add('domain', item[0], item[1])
        domain_index.add('topic', item[0], item[1])
    print domain_index
    print domain_index.get("topic", '科技类')



def put_in_user_portrait():
    Index = ManualIndexManager(graph) # manage index
    node_name = "node_index"
    node_index = Index.get_index(Node, node_name)

    f = open("user_portrait.txt", "rb")
    count = 0
    update_node = []
    for item in f:
        user_dict = json.loads(item)
        uid = user_dict["uid"]
        exist = node_index.get("uid", uid)
        if not exist:
            Index.get_or_create_indexed_node(node_name, "uid", uid, user_dict)
        else:
            user_node = exist[0]
            for k,v in user_dict.iteritems():
                user_node[k] = v
            graph.push(user_node)
        count += 1
        print count


    f.close()


def create_rel_from_uid2_domain():
    Index = ManualIndexManager(graph) # manage index
    domain_name = "domain_index"
    node_index = Index.get_index(Node, "node_index")
    domain_index = Index.get_index(Node, domain_name)
    domain_node = domain_index.get("domain", "媒体")

    tx = graph.begin()
    count = 0
    ts = time.time()
    f = open("user_portrait.txt", "rb")
    for line in f:
        user_dict = json.loads(line)
        uid = user_dict["uid"]
        print uid
        print count
        domain = user_dict["domain"]
        user_node = node_index.get("uid", uid)[0]
        domain_node = domain_index.get("domain", domain)[0]
        rel = Relationship(user_node, "domain", domain_node)
        tx.create(rel)
        count += 1
        if count % 1000 == 0:
            tx.commit()
            print count
            te = time.time()
            print te - ts
            ts = te
            tx = graph.begin()
    tx.commit()




def create_rel_from_uid2_topic():
    Index = ManualIndexManager(graph) # manage index
    topic_name = "topic_index"
    node_index = Index.get_index(Node, "node_index")
    topic_index = Index.get_index(Node, topic_name)

    tx = graph.begin()
    count = 0
    ts = time.time()
    f = open("user_portrait.txt", "rb")
    for line in f:
        user_dict = json.loads(line)
        uid = user_dict["uid"]
        topic_string = user_dict["topic_string"]
        user_node = node_index.get("uid", uid)[0]
        topic_list = topic_string.split("&")
        for iter_topic in topic_list:
            topic_node = topic_index.get("topic", iter_topic)[0]
            rel = Relationship(user_node, "topic", topic_node)
            tx.create(rel)
            count += 1
            if count % 1000 == 0:
                tx.commit()
                print count
                te = time.time()
                print te - ts
                ts = te
                tx = graph.begin()
    tx.commit()



if __name__ == "__main__":
    #put_in_node()
    create_rel_from_uid2_domain()
    create_rel_from_uid2_topic()
    #put_in_user_portrait()

