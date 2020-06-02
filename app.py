import argparse
from flask import Flask, jsonify, request
from flask import render_template, send_from_directory
import os
import sys
import re
import joblib
import socket
import json
import numpy as np
import pandas as pd

sys.path.append(os.path.join(os.path.dirname(__file__), "src"))
## import model specific functions and variables
from model import model_train, model_load, model_predict
from model import MODEL_VERSION, MODEL_VERSION_NOTE

app = Flask(__name__)

@app.route("/")
def landing():
    return render_template('index.html')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/running', methods=['POST'])
def running():
    return render_template('running.html')


@app.route('/ping', methods=['GET', 'POST'])
def ping():
    return jsonify({'status': 1})

def convert_numpy_objects(res):
    result = {}
    ## convert numpy objects to ensure they are serializable
    for key,item in res.items():
        if isinstance(item,np.ndarray):
            result[key] = item.tolist()
        else:
            result[key] = item
    return result

@app.route('/predict', methods=['GET','POST'])
def predict():
    """
    basic predict function for the API
    """
    
    ## input checking
    if not request.json:
        print("ERROR: API (predict): did not receive request data")
        return jsonify([])

    if 'query' not in request.json:
        print("ERROR API (predict): received request, but no 'query' found within")
        return jsonify([])

    if 'type' not in request.json:
        print("WARNING API (predict): received request, but no 'type' was found assuming 'numpy'")
        query_type = 'numpy'

    ## set the test flag
    test = False
    if 'mode' in request.json and request.json['mode'] == 'test':
        test = True

    ## extract the query
    query = request.json['query']
        
    if request.json['type'] == 'dict':
        pass
    else:
        print("ERROR API (predict): only dict data types have been implemented")
        return jsonify([])
        
    ## load model
    #model = model_load()
    
    #if not model:
    #    print("ERROR: model is not available")
    #    return jsonify([])
    print(query)
    result = {}
    if query['country'] == 'all':
        countries = ['portugal', 'united_kingdom', 'hong_kong', 'eire',
                     'spain', 'france', 'singapore', 'norway', 'germany', 'netherlands']
    else:
        countries = query['country'].split(',')
        
    for country in countries:
        _result = model_predict(country,query['year'], query['month'], query['day'], test=test)
        print("Predicted revenue for {} is {}".format(country, _result['y_pred'][0]))
        result[country] = convert_numpy_objects(_result)
    
    return(jsonify(result))

@app.route('/train', methods=['GET','POST'])
def train():
    """
    basic predict function for the API

    the 'mode' flag provides the ability to toggle between a test version and a 
    production verion of training
    """
    
    ## check for request data
    if not request.json:
        print("ERROR: API (train): did not receive request data")
        return jsonify(False)

    ## set the test flag
    test = False
    if 'mode' in request.json and request.json['mode'] == 'test':
        test = True

    print("... training model")
    model = model_train(test=test)
    print("... training complete")

    return(jsonify(True))
        
@app.route('/logs/<filename>',methods=['GET'])
def logs(filename):
    """
    API endpoint to get logs
    """

    if not re.search(".log",filename):
        print("ERROR: API (log): file requested was not a log file: {}".format(filename))
        return jsonify([])

    log_dir = os.path.join(".","log")
    if not os.path.isdir(log_dir):
        print("ERROR: API (log): cannot find log dir")
        return jsonify([])

    file_path = os.path.join(log_dir,filename)
    if not os.path.exists(file_path):
        print("ERROR: API (log): file requested could not be found: {}".format(filename))
        return jsonify([])
    
    return send_from_directory(log_dir, filename, as_attachment=True)

if __name__ == '__main__':

    ## parse arguments for debug mode
    ap = argparse.ArgumentParser()
    ap.add_argument("-d", "--debug", action="store_true", help="debug flask")
    args = vars(ap.parse_args())

    if args["debug"]:
        app.run(debug=True, port=8080)
    else:
        app.run(host='0.0.0.0', threaded=True ,port=8080)

