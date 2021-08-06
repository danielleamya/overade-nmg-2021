import time
import datetime
import pandas as pd

ticker = 'GME'
period1 = int(time.mktime(datetime.datetime(2020, 7, 5, 23, 59).timetuple()))
period2 = int(time.mktime(datetime.datetime(2021, 7, 5, 23, 59).timetuple()))
interval = '1d' 


query_string = f'https://query1.finance.yahoo.com/v7/finance/download/{ticker}?period1={period1}&period2={period2}&interval={interval}&events=history&includeAdjustedClose=true'

df = pd.read_csv(query_string)
df.to_csv(r'/Users/dany/Desktop/gme_stock-1yr.csv')
