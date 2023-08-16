from flask_cors import CORS, cross_origin
from flask import Flask, request
from model import TF_IDF
from model import BM25
from elasticsearch import Elasticsearch
from PreProcessing import PreProcessor
import json


es = Elasticsearch([{'host': 'localhost', 'port': 9200, "scheme": "http"}])


def InsertData(data, index_name):
    for i in data:
        es.index(index=index_name, id=i['id'], document=i)


# f = open('dataset.json')
# data = json.load(f)

# InsertData(data=data, index_name="originaldata")

# data = PreProcessor(data).final_data

# InsertData(data, "dataset")
modelbm25 = BM25(es, "dataset", "originaldata")

modeltfidf = TF_IDF(es, "dataset", 10, "originaldata")

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/submit', methods=['POST', 'GET'])
def submit():
    res = list()
    # print(request)
    # data = request.get_json(silent=True)
    # item = {'one': data.get('label'), 'two': data.get(
    #     'text'), 'three': data.get('three')}
    # print(item)

    query = request.json['one']
    modelname = request.json['two']
    queries = request.json['three']
    x = int(queries)
    if (modelname == "BM25"):
        res = modelbm25.MakeQuery(query, x)
    else:
        res = modeltfidf.MakeQuery(query, x)
    return res


if __name__ == '__main__':
    app.run(debug=True)
