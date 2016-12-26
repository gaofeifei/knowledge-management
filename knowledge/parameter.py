# -*-coding:utf-8-*-

from global_config import *

RUN_TYPE = 0

# 关系类型与后续节点primary key的关系
rel_node_mapping = {join: "event", organise: "event", discuss: "event", first: "event", other_rel: "event", \
        group_rel: "group", contain: "event", casual: "event", happen_together:"event", event_special:"event", \
        friend: "uid", interaction: "uid", relative: "uid", colleague: "uid", leader_member: "uid", user_tag: "uid", \
        "domain": "domain", "topic": "topic", "location": "location", "event":"event_id"}


rel_node_type_mapping = {join: "Event", organise: "Event", discuss: "Event", first: "Event", other_rel: "Event", \
        group_rel: "Group", contain: "Event", casual: "Event", happen_together:"Event", event_special:"SpecialEvent", \
        friend: "User", interaction: "User", relative: "User", colleague: "User", leader_member: "User", user_tag: "Tag", \
        "domain": "Domain", "topic": "Topic", "location": "Location", "event": "Event"}


# 首页显示最多节点数
index_threshold = 500


CHARACTER_TIME_GAP = 7

WEIBO_API_INPUT_TYPE = 1 # 1 mark: need compute sentiment

DAY = 24*3600
RUN_TEST_TIME  = '2016-03-13'
Fifteen = 60 * 15
HALF_HOUR = 1800
FOUR_HOUR = 3600*4
MAX_VALUE = 99999999
WEEK = 7
WEEK_TIME = 7*24*3600
MONTH = 30
MONTH_TIME = 30*24*3600
EXPIRE_TIME = 8*24*3600

# 敏感词等级评分, string类型
sensitive_score_dict = {
            "1": 1,
            "2": 5,
            "3": 10
}

