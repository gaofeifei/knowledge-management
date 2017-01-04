# -*-coding:utf-8-*-

from elasticsearch import Elasticsearch

user_profile_host = ["219.224.134.216:9201"]
user_portrait_host = ["219.224.134.225:9037"]
flow_text_host = ["219.224.134.216:9201"]
km_user_portrait_host = ["219.224.134.225:9037"]
user_portrait_port = "9200"
event_host = ["219.224.134.225:9037"]
event_port = "9200"
calculate_status_host=["219.224.134.225:9037"]
neo4j_host = "219.224.134.213"
neo4j_port = "7474"
redis_host = "219.224.134.213"
redis_port = "7381"

profile_index_name = "weibo_user"
profile_index_type = "user"
remote_portrait_name = "user_portrait_1222" # user portrait system
portrait_name = "user_portrait"
flow_text_name = "flow_text_2016-11-26"
portrait_type = "user"
flow_text_type = "text"
event_name = "event" # 事件基本信息
event_analysis_name = "event_analysis" # 事件分析结果
event_type = "text"
neo4j_name = "neo4j"
neo4j_password = "database"
neo4j_data_path = 'http://219.224.134.213:7474/db/data'

# retweet&comment for test
retweet_comment_es_host = ['219.224.134.216:9201']
retweet_comment_port = "9201"
# week retweet/be_retweet relation es
retweet_index_name_pre = '1225_retweet_' # retweet: 'retweet_1' or 'retweet_2'
retweet_index_type = 'user'
be_retweet_index_name_pre = '1225_be_retweet_' #be_retweet: 'be_retweet_1'/'be_retweet_2'
be_retweet_index_type = 'user'
# week comment/be_comment relation es
comment_index_name_pre = '1225_comment_'
comment_index_type = 'user'
be_comment_index_name_pre = '1225_be_comment_'
be_comment_index_type = 'user'

# neo4j 索引(index)
node_index_name = "node_index" # primary_key: uid
topic_index_name = "topic_index" # primary_key: topic
domain_index_name = "domain_index" # primary_key: domain
location_index_name = "location_index" #primary_key: location
event_index_name = "event_index" # primary_key: event
tag_index_name = "tag_index" # primary_key: tag
special_event_index_name = "special_event_index" # primary_key: event
# 港澳台，电信诈骗
event_type_index_name = "event_type_index" # primary: type
group_index_name = "group_index" # primary: group, rel: group


domain_list = [u'高校', u'境内机构', u'境外机构', u'媒体', u'境外媒体', u'民间组织', u'法律机构及人士', \
        u'政府机构及人士', u'媒体人士', u'活跃人士', u'草根', u'其他', u'商业人士']
topic_list = [u'文体类_娱乐', u'科技类', u'经济类', u'教育类', u'民生类_环保', \
        u'民生类_健康', u'军事类', u'政治类_外交', u'文体类_体育', u'民生类_交通', \
        u'其他类', u'政治类_反腐', u'民生类_就业', u'政治类_暴恐', u'民生类_住房', \
        u'民生类_法律', u'政治类_地区和平', u'政治类_宗教', u'民生类_社会保障']



# Relationship: User-Event
join = "join" # 参与讨论
pusher = "pusher"#趋势推动
maker = "maker"#趋势制造
other_rel = "other_relationship" #其他关系

user_event_relation = ['join','pusher','maker','other_relationship']

# Relationship: Event-Event
contain = "contain"  #--主题关联
event_other = 'event_other'#其他关系

event_special = "special_event" # 专题

event_relation_list = ['contain','event_other']


# Relatioship: User、Organization--User
friend = "friend" #交互
relative = "relative" #亲属（人与人的关系）
colleague = "colleague" #业务关联
user_tag = "user_tag"#其他

relation_list = ['friend','relative','colleague','user_tag']

group_rel = "group"

#机构和机构没有关系，
