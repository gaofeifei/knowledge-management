# -*-coding:utf-8-*-
from knowledge.global_utils import r_user as r
from knowledge.global_utils import es_calculate_status as es
import json


def user_push_redis(uid_list, task_name, upload_time, ):
    result = [task_name, upload_time, uid_list]
    r.lpush("user_portrait_task", json.dumps(result))
    uid = "user" + len(uid_list) + upload_time
    es.index(index="user_status", doc_type="text", id=uid,
             body={"upload_time": upload_time, "status": 1, "uid": uid_list,
                   "user_count": len(uid_list), "founder": "zsj", "complete_time": 0})
    print "user redis success !"


def event_push_redis(event_name, start_time, end_time, upload_time):
    result = [event_name, start_time, end_time, upload_time]
    r.lpush("event_portrait_task", json.dumps(result))
    event_id = "event" + start_time + end_time + str(upload_time)
    es.index(index="event_status", doc_type="text", id=event_id,
             body={"upload_time": upload_time, "complete_time": 0, "status": 1, "founder": "zsj", "event": event_name,
                   "start_time": start_time, "end_time": end_time})
    print "user redis success !"


def get_status(uid, es_index_name):
    es_results = es.get(index=es_index_name, doc_type="text", id=uid)
    return es_results["_source"]["status"]


def get_user_mapping():
    index_info = {
        'settings': {
            "number_of_replicas": 0,
            "number_of_shards": 5,
        },
        'mappings': {
            'text': {
                'properties': {
                    'founder': {
                        'type': 'string',
                        'index': 'no'
                    },
                    'upload_time': {
                        'type': 'long',
                        'index': 'no'
                    },
                    'complete_time': {
                        'type': 'long',
                        'index': 'no'
                    },

                    'status': {
                        'type': 'integer',
                        'index': 'no'
                    },
                    'uid': {
                        'type': 'string',
                        'index': 'no'
                    },
                    'user_count': {
                        'type': 'integer',
                        'index': 'no'
                    }
                }
            }
        }
    }
    return index_info


def get_event_mapping():
    index_info = {
        'settings': {
            "number_of_replicas": 0,
            "number_of_shards": 5,
        },
        'mappings': {
            'text': {
                'properties': {
                    'founder': {
                        'type': 'string',
                        'index': 'no'
                    },
                    'upload_time': {
                        'type': 'long',
                        'index': 'no'
                    },
                    'complete_time': {
                        'type': 'long',
                        'index': 'no'
                    },

                    'status': {
                        'type': 'integer',
                        'index': 'no'
                    },
                    'event': {
                        'type': 'string',
                        'index': 'no'
                    },
                    'start_time': {
                        'type': 'date',
                        'index': 'no'
                    },
                    'end_time': {
                        'type': 'date',
                        'index': 'no'
                    }
                }
            }
        }
    }
    return index_info

#
# if __name__ == '__main__':
#     # print "ss"
#     # uid_list=(1,2,3,4,5)
#     # es.index(index="user_status", doc_type="text",id="task1",
#     #          body={"file_name": "file20170103", "upload_time": 12344, "status": 1,"user_count":len(uid_list),"success_count":0,"error_count":0})
#     # print "es redis success !"
#     # print get_status("task1")
#     # list1=("2844","244")
#     # Itime = time.time()
#     # Itime = int(Itime)
#     # uid="user"+str(len(list1))+str(Itime)
#     # es.index(index="user_status", doc_type="text",id=uid,
#     #          body={"founder": "zsj","complete_time":0, "upload_time": Itime, "status": "1","user_count":len(list1)})
#     # print ("wancheng")
#     # index_info = get_event_mapping()
#     # print index_info
#     # es.indices.create(index="event_status", body=index_info, ignore=400)
#     # es.indices.create(index="ss",ignore=400)
#     # es.indices.delete(index="event_status")
#     # Itime = time.time()
#     # task_name="task1"
#     # list =["111","222","333","444"]
#     # result =[task_name,int(Itime),list]
#     # print json.dumps(result)
#     Itime = int(time.time())
#     event_id = "event" + "20151026" + "20160309" + str(Itime)
#     es.index(index="event_status", doc_type="text", id=event_id,
#              body={"upload_time": Itime, "complete_time": 0, "status": 1, "founder": "zsj", "event": "国产漫画兴起",
#                    "start_time": 20151026, "end_time": 20160309})
#
#     # mapping = get_event_mapping()
#     # es.indices.create(index="event_status",body=mapping,ignore=400)
#
#     print 1
