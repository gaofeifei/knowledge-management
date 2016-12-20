# -*-coding:utf-8-*-

import time
import json
import sys
import random
from py2neo import Graph
from py2neo import Node, Relationship
from py2neo.ogm import GraphObject, Property
from py2neo.packages.httpstream import http
from py2neo.ext.batman import ManualIndexManager
from py2neo.ext.batman import ManualIndexWriteBatch
http.socket_timeout = 9999

reload(sys)
sys.path.append('../../')
from global_config import node_index_name, friend, interaction, relative, colleague, leader_member, user_tag
from global_utils import graph

class User(GraphObject):
    __primarykey__ = "uid"
    uid = Property()

def create_user2user_rel(rel_type):
    Index = ManualIndexManager(graph)
    node_index = Index.get_index(Node, node_index_name)
    tx = graph.begin()
    count = 0

    f = open("user_portrait.txt", "rb")
    uid_list = []
    for line in f:
        user_dict = json.loads(line)
        uid = user_dict["uid"]
        uid_list.append(uid)

    for i in range(len(uid_list)-1):
        for j in range(i+1,len(uid_list)):
            user1 = uid_list[i]
            user2 = uid_list[j]
            user_node1 = node_index.get("uid", user1)[0]
            user_node2 = node_index.get("uid", user2)[0]
            prob = random.random()
            if prob <= 0.03:
                rel = Relationship(user_node1, rel_type, user_node2)
                tx.create(rel)
                count += 1
                if count % 100 == 0:
                    tx.commit()
                    print count
                    tx = graph.begin()
    tx.commit()
    print "finish"




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
    for each in [interaction, relative, colleague, leader_member]:
        create_user2user_rel(each)



