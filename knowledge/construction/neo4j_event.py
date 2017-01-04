# -*-coding:utf-8-*-
import time
import json
import redis
import sys
from elasticsearch import Elasticsearch
from py2neo import Graph
from py2neo.ext.batman import ManualIndexManager
from py2neo import Node, Relationship
from py2neo.packages.httpstream import http
from py2neo.ogm import GraphObject
from knowledge.global_utils import graph
es = Elasticsearch("219.224.134.225:9037", timeout=600)
http.socket_timeout = 9999
class Person(GraphObject):
    __primarykey__ = "pname"
    pname = property()

# 对es进行读取数据
def get_es_node():
    query_search = {
        "query": {
            "bool": {
                "must": [
                    {
                        "match_all": {}
                    }
                ],
                "must_not": [],
                "should": []
            }
        },
        "from": 0,
        "size": 100,
        "sort": [],
        "facets": {}
    }
    print "ss"
    result = es.search(index="user_portrait", doc_type="user",
                       body=query_search)['hits']['hits']
    return result


# 返回需要的查询结果
def select_rels_all(c_string):
    list = []
    result = graph.run(c_string)
    for item in result:
        list.append(item)
    return list


# 查询一个节点的所有rel
def select_rels(node_key, node_id, node_name_index):
    list = []
    Index = ManualIndexManager(graph)
    node_name = Index.get_index(Node, node_name_index)
    if not node_name:
        print "node_index does not exist "
        return None
    node = node_name.get(node_key, node_id)[0]
    if not node:
        print "node does not exist"
        return None
    c_string = "START start_node=node:%s(%s='%s') MATCH (start_node)-[r]-() return r" % (
    node_name_index, node_key, node_id)
    print c_string
    result = graph.run(c_string)
    for item in result:
        list.append(item)
    return list


# 对数据进行存放
def create_person(node_type, node_key, node_id, node_name_index, attribute_dict=dict()):
    Index = ManualIndexManager(graph)
    node_name = Index.get_or_create_index(Node, node_name_index)
    print node_name
    if node_name:
        exist = node_name.get(node_key, node_id)
        print exist
        if exist:
            person_node = exist[0]
            for k, v in attribute_dict.iteritems():
                person_node[k] = v
            graph.push(person_node)
        else:
            person_node = Node(node_type, pname=node_id)
            for k, v in attribute_dict.iteritems():
                person_node[k] = v
            graph.create(person_node)
            node_name.add(node_key, node_id, person_node)
            print "create person success"
            return True


# 对多个节点和类建立关系
def create_rel_from_uid2group(node_key,uid_list, node_index_name, group_rel, group_key, group_id, group_index_name):
    count = 0
    Index = ManualIndexManager(graph)
    node_index = Index.get_index(Node, node_index_name)
    group_index = Index.get_index(Node, group_index_name)
    tx = graph.begin()
    if not (node_index and group_index):
        print "node or group does not exist"
        return None
    for uid in uid_list:
        node = node_index.get(node_key, uid)[0]
        group_node = group_index.get(group_key, group_id)[0]
        rel = Relationship(node, group_rel, group_node)
        tx.create(rel)
        count += 1
        if count % 100 == 0:
            tx.commit()
            print count
            tx = graph.begin()
    tx.commit()


# 对单节点和单节点建立关系
def create_node_or_node_rel(node_key1, node1_id, node1_index_name, rel, node_key2, node2_id, node2_index_name):
    Index = ManualIndexManager(graph)
    node_index = Index.get_index(Node, node1_index_name)
    group_index = Index.get_index(Node, node2_index_name)
    print node_index
    print group_index
    tx = graph.begin()
    if len(node_index.get(node_key1, node1_id)) == 0:
        print "node1 does not exist"
        return 'node1 does not exist'
    print node2_id,'======='
    print group_index.get(node_key2, node2_id)
    print 'node_key2',node_key2
    if len(group_index.get(node_key2, node2_id)) == 0:
        print "node2 does not exist"
        return "node2 does not exist"    
    node1 = node_index.get(node_key1, node1_id)[0]
    node2 = group_index.get(node_key2, node2_id)[0]
    if not (node1 and node2):
        print "node does not exist"
        return None
    c_string = "START start_node=node:%s(%s='%s'),end_node=node:%s(%s='%s') MATCH (start_node)-[r:%s]->(end_node) RETURN r" \
         % (node1_index_name, node_key1, node1_id, node2_index_name, node_key2, node2_id, rel)
    print c_string
    result = graph.run(c_string)
    # print result
    rel_list = []
    for item in result:
        rel_list.append(item)
    print rel_list
    if not rel_list:
        rel = Relationship(node1, rel, node2)
        graph.create(rel)
        print "create success"
    else:
        print "The current two nodes already have a relationship"
    return True


# 对节点进行更新
def update_node(key_id, uid, node_index_name, attribute_dict):
    Index = ManualIndexManager(graph)
    node_index = Index.get_index(Node, node_index_name)
    node = node_index.get(key_id, uid)[0]
    print node
    if not node:
        print "no such node"
        sys.exit(0)

    for k, v in attribute_dict.iteritems():
        node[k] = v

    graph.push(node)
    print "update success"
    return True


# 对节点间的rel进行更新
def update_node_or_node_rel(node_key1, node1_id, node1_index_name, old_rel, new_rel, node_key2, node2_id,
                            node2_index_name):
    # 需要对节点的关系进行删除以后在进行添加。
    delete_rel(node_key1, node1_id, node1_index_name, old_rel, node_key2, node2_id, node2_index_name)
    create_node_or_node_rel(node_key1, node1_id, node1_index_name, old_rel, node_key2, node2_id, node2_index_name)
    print "update rel success"
    return True


# 删除一个rel
def delete_rel(node_key1, node1_id, node1_index_name, rel, node_key2, node2_id, node2_index_name):
    list = []
    Index = ManualIndexManager(graph)
    node1_index = Index.get_index(Node, node1_index_name)
    node2_index = Index.get_index(Node, node2_index_name)
    if not (node1_index or node2_index):
        print "node_index does not exist"
        return None
    node1 = node1_index.get(node_key1, node1_id)[0]
    node2 = node2_index.get(node_key2, node2_id)[0]
    if not (node1 or node2):
        print ("node does not exist")
    c_string = "START start_node=node:%s(%s='%s'),end_node=node:%s(%s='%s') MATCH (start_node)-[r:%s]-(end_node) RETURN r" % (
    node1_index_name, node_key1, node1_id, node2_index_name, node_key2, node2_id, rel)
    result = graph.run(c_string)
    for item in result:
        list.append(item)
    if not list:
        print "Deleted rel does not exist"
        return None
    c_string = "START start_node=node:%s(%s='%s'),end_node=node:%s(%s='%s') MATCH (start_node)-[r:%s]-(end_node) DELETE r" % (
    node1_index_name, node_key1, node1_id, node2_index_name, node_key2, node2_id, rel)
    print c_string
    graph.run(c_string)
    print "delete success"
    return True


def delete_node(node_key, node_id, node_index_name):
    Index = ManualIndexManager(graph)
    node_index = Index.get_index(Node, node_index_name)
    if not node_index:
        print "node_index does not exist"
        return None
    node = node_index.get(node_key, node_id)[0]
    if not node:
        print "The node does not exist"
        return None
    c_string = "START start_node=node:%s(%s='%s') MATCH (start_node)-[r]-()  DELETE r" % (
    node_index_name, node_key, node_id)
    graph.run(c_string)
    print "delete rel success"
    c_string = "START start_node=node:%s(%s='%s') delete start_node" % (node_index_name, node_key, node_id)
    graph.run(c_string)
    print "delete node success"
    return True




if __name__ == '__main__':
    result = get_es_node()
    for item in result:
        print item
        id = item["_id"]
        source = item["_source"]
        create_person("Person","pname",id,"zsj",source)
    # create_rel_from_uid2uid("20120672101", "zsj", "friend", "20130672140", "zsj")
    # update_node("pname","20120672101","zsj",{"username":"xiaozhu"})
    # create_person("pname","20120672012","zsj")
    # create_node_or_node_rel("20120672012","zsj","friend","20120672101","zsj")
    # delete_node("pname","20120672012","zsj")
    # create_node_or_node_rel("1050896727", "zsj", "friend", "1133792272", "zsj")
    # delete_node("pname","1050896727","zsj")
    # create_node_or_node_rel("pname","1219964394","zsj","friend","pname","1162178432","zsj")
    # delete_rel("pname","1219964394","zsj","friend","pname","1133792272","zsj")
    # list = select_rels("pname", "1219964394", "zsj")
    # print list
    result =select_rels_all("match (n:Person) return n")
    result=json.dumps(result)
    print result
    # 创建节点与节点关系的问题（节点和节点之间的查询语句有点问题 然后如果用match比较慢！）
    # 删除节点的问题 如果我把该节点删除，是直接进行删除，还是把该节点的所有关系进行删除 然后在删除该节点。
    # 更新节点间的关系的时候是先把该节点的当前关系删除后，在进行节点的创建，还是直接可以更新节点的数据。
