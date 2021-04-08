#!/usr/bin/python3

import cgi
import cgitb
import requests
import json


def fetchData(batch, startdate, cookies):
    headers = {
        'Host': 'intranet.hbtn.io',
        'User-Agent': 'MPG v01',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'close',
        'Upgrade-Insecure-Requests': '1',
    }

    params = (
        ('batch_id', batch),
        ('calendar_view', '1'),
        ('curriculum_id', '1'),
        ('start_date', startdate),
    )

    response = requests.get('https://intranet.hbtn.io//dashboards/master_planning_data.json', headers=headers, params=params, cookies=cookies, verify=False)

    return  response.text




cgitb.enable(display=1)

print("Content-Type: application/json\n")


formobj = cgi.FieldStorage()
cookie = {"_holberton_intranet_session": formobj["intranet_session"].value}
calendar_data = fetchData(formobj["batch_id"].value, None, cookie)

print(calendar_data)

