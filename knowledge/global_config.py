# -*-coding:utf-8-*-

from elasticsearch import Elasticsearch

user_portrait_host = ["219.224.134.225:9200"]
user_portrait_port = "9200"
event_host = ["219.224.134.225:9200"]
event_port = "9200"
neo4j_host = "219.224.134.213"
neo4j_port = "7474"

portrait_name = "user_portrait"
portrait_type = "user"
event_name = "event"
event_type = "text"
neo4j_name = "neo4j"
neo4j_password = "database"
neo4j_data_path = 'http://219.224.134.213:7474/db/data'


# neo4j 索引(index)
node_index_name = "node_index" # primary_key: uid
topic_index_name = "topic_index" # primary_key: topic
domain_index_name = "domain_index" # primary_key: domain
location_index_name = "location_index" #primary_key: location
event_index_name = "event_index" # primary_key: event
tag_index_name = "tag_index" # primary_key: tag
special_event_index_name = "special_event_index" # primary_key: event
event_type_index_name = "event_type_index" # primary: type
group_index_name = "group_index" # primary: group


domain_list = [u'高校', u'境内机构', u'境外机构', u'媒体', u'境外媒体', u'民间组织', u'法律机构及人士', \
        u'政府机构及人士', u'媒体人士', u'活跃人士', u'草根', u'其他', u'商业人士']
topic_list = [u'文体类_娱乐', u'科技类', u'经济类', u'教育类', u'民生类_环保', \
        u'民生类_健康', u'军事类', u'政治类_外交', u'文体类_体育', u'民生类_交通', \
        u'其他类', u'政治类_反腐', u'民生类_就业', u'政治类_暴恐', u'民生类_住房', \
        u'民生类_法律', u'政治类_地区和平', u'政治类_宗教', u'民生类_社会保障']



# Relationship: User-Event
join = "join" # 参与
organise = "organise" #组织
discuss= "discuss" #讨论
first = "first" #首发
other_rel = "other_relationship" #其他关系


# Relationship: Event-Event
contain = "contain"
casual = "casual"
happen_together = "happen_together"


# Relatioship: User-User
friend = "friend" #好友
interaction = "interaction" #交互
relative = "relative" #亲属
colleague = "colleague" #同事
leader_member = "leader_member" #上下级
user_tag = "user_tag"



