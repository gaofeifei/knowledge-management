#��װ libsvm-3.1.7
#225�����ļ��� /home/ubuntu2/jiangln/info_consume/user_portrait/user_portrait/cron/libsvm-3.17
#��װcommunity ��pip install community �� pip install python-louvain==0.2


network/cron_topic_identify.py��Ҳ��pagerank()




ʱ�䣺
���룺
�����

����
���룺
�����

���磺

���룺
�����
���ɵ����磨gexf��������es��
trend_maker��trend_pusher�Ƿ�����mysql�С�



event�����ά�ȵ�utils.py���Ǵ�mysql��ȡ�����ݡ�

ʱ�䣺

get_time_count����  mysql  -----  PropagateCount

get_weibo_by_time����es����weibo_es

����

province_weibo_count����  mysql  ----- CityTopicCount

get_weibo_content()       mysql  ----- ProvinceWeibos

���磺

get_gexf���� -----�� read_long_gexf����  es ---- weibo_es

gexf_process() �����Ϊget_gexf���� ȡ�������ݣ����漰��sql��es

get_trend_maker����     mysql  ----  TrendMaker

get_trend_pusher()       mysql  -----  TrendPusher

get_maker_weibos_byts()  mysql  ----- TrendMaker

get_pusher_weibos_byts()  mysql  ----  TrendPusher

get_maker_weibos_byhot()  mysql  ---- TrendMaker

get_pusher_weibos_byhot()  mysql ---  TrendPusher


��У�

get_sen_time_count����  mysql ---- SentimentCount

get_sen_province_count()  mysql ---- SentimentGeo

get_weibo_content()       mysql ----- SentimentWeibos


���壺

get_during_keywords����   es  ----  weibo_es

get_topics_river()  -----> cul_key_weibo_time_count()    ���߶���   es  ----- weibo_es   

get_symbol_weibo����     es   ----  weibo_es

get_subopinion()         es   ----  weibo_es

 




