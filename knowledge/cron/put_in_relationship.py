# -*-coding:utf-8-*-

import time
import json
from py2neo import Graph
from py2neo import Node, Relationship
from py2neo.ogm import GraphObject, Property
from py2neo.packages.httpstream import http
from py2neo.ext.batman import ManualIndexManager
from py2neo.ext.batman import ManualIndexWriteBatch
http.socket_timeout = 9999

graph = Graph('http://219.224.134.211:7474/db/data', user="neo4j", password="database")
#graph = Graph()

class User(GraphObject):
    __primarykey__ = "uid"
    uid = Property()

def put_in():
    Index = ManualIndexManager(graph) # manage index
    csv_file = open("/home/ubuntu6/yuankun/retweet.csv", "rb")
    tx = graph.begin()
    count = 0
    index_list = [] # temporal put in
    filter_set = set() # filter
    ts = time.time()
    node_name = "node_index"
    node_index = Index.get_or_create_index(Node, node_name)
    Batch_index = ManualIndexWriteBatch(graph)

    for line in csv_file:
        uid_list = (line.strip()).split(",")
        start_node = str(uid_list[0])
        end_node = str(uid_list[1])
        re_times = str(uid_list[2])
        #st_node = Index.get_or_create_indexed_node(node_name, "uid", start_node, {"uid":start_node})
        #ed_node = Index.get_or_create_indexed_node(node_name, "uid", end_node, {"uid":end_node})
        st_node = node_index.get("uid", start_node)
        ed_node = node_index.get("uid", end_node)

        # use for node


        rel_string = start_node # 索引中的key-value: rel key
        rel = Relationship(st_node,"retweet", ed_node, times=re_times) # rel
        tx.create(rel)
        count += 1
        if count % 1000 == 0:
            print count
            te = time.time()
            print "cost time: %s" %(te-ts)
            ts = te
            tx.commit()
            tx = graph.begin()
    tx.commit()
    csv_file.close()

def query_db():
    Index = ManualIndexManager(graph) # manage index
    #node_1 = Index.get_indexed_node("uid_index", "uid", "3293303045")
    node_1 = Index.get_indexed_node("uid_index", "uid", "2139111593")
    c_string = "MATCH (node_1)-[:retweet]->(fof) RETURN fof.uid"
    result = graph.run(c_string)
    uid_set = []
    count = 0
    for item in graph.run(c_string):
        uid_set.append(item['fof.uid'])
        count += 1
    print count
    print len(uid_set)
    print sorted(uid_set)[:20]



if __name__ == "__main__":
    put_in()
    #query_db()



