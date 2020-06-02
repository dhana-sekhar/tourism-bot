# Project Execution Instructions
## Run the model directly

```
python3 src/model.py -t <training> -m <model> -c <countries>`
```
* training - whether training is needed and mode - test or prod
* model - which model to use RandomForestRegressor or ExtraTreesRegressor
* countries - which countries to predict revenue

## Run the unittests
### Run all tests
```
python3 run-tests.py
```
### Model Tests
All tests - `python3 -m unittest unittests/ModelTests.py`

Specific test - `python3 -m unittest unittests.ModelTest.test_02_load`

### Logger Tests
All tests - `python3 -m unittest unittests/LoggerTests.py`

Specific test - `python3 -m unittest unittests.ModelTest.test_02_predict`

### API Tests
All tests - `python3 -m unittest unittests/ApiTests.py`

Specific test - `python3 -m unittest unittests.ApiTest.test_04_predict_all`

## IBM AI Enterprise Workflow Capstone
Files for the IBM AI Enterprise Workflow Capstone project. 

### Case study part 1
The notebook capstone-case-study.ipynb contains all the findings

### Case study part 2
The code provided in solution-guidance has been modified to take model as parameter and also work for specific set of countries. The notebook capstone-case-study.ipynb contains details for iterating on different models. Running with different preprocessors (StandardScaler, RobustScaler) and models (RandomForestRegressor and ExtraTreesRegressor) the revenue prediction has gone down for some countries while has increased for others.

### Case study part 3
The code for providing HTTP API using flask, logic to predict for all countries, added unit tests for API, added docker file for creating the container out of this which will provide the API for the model to predict the revenue.

## API Documentation

      Request type    | Key            | Description
     ==========================================================================
      /train          | mode           | Training mode - test or prod
     -----------------+----------------+---------------------------------------
                      | query          | query for model, need to have 
                      |                | 'country','year','month','day'
      /predict        | query_type     | query_type - only dict is supported
                      | mode           | model to be used - test or prod
     -----------------+----------------+---------------------------------------
      /logs           | filename       | log filename to be retrived
     -----------------+----------------+---------------------------------------
