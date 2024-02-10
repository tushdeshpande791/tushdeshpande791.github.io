# Copyright 2015 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_flex_quickstart]
from flask import Flask
import json
import finnhub
app = Flask(__name__)
from flask import request
from datetime import date,timedelta
# from polygon import RESTClient
from dateutil.relativedelta import relativedelta
import requests
@app.route("/")
def Landing():
    return app.send_static_file('Frontend/index.html')
@app.route("/apicalls")
def api_calls():
    finnhub_client = finnhub.Client(api_key="cmu2hnpr01qsv99lvjdgcmu2hnpr01qsv99lvje0")
    symbol=request.args.get('symbol')
    current_date = date.today().isoformat()   
    days_before = (date.today()-relativedelta(months=1)).isoformat()
    date_6months = (date.today()-relativedelta(months=6, days=1)).isoformat()
    company_info=finnhub_client.company_profile2(symbol=symbol)
    if len(company_info)==0:
        return company_info
    else:
        url=f'https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/{date_6months}/{current_date}?adjusted=true&sort=asc&apiKey=QKZJbijv8KNP9sO5F0vNgBdVII5FyHpR'.format(symbol,date_6months,current_date)
        r=requests.get(url)
        return [company_info,[finnhub_client.quote(symbol),finnhub_client.recommendation_trends(symbol)], finnhub_client.company_news(symbol, _from=days_before, to=current_date), r.json()]
    
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
