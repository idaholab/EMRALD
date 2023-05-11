import re
import json
import ast
from glob import glob

import csv


fns = glob('DebugLog*.txt')

# Define a regex pattern to add double quotes around keys but skip time strings
pattern = r'HraEvalExitState:\s*(\{.*?\})'

# Define a dictionary to hold the extracted data
data = []

def extract_state(log_file, meta=None):
    state_list = []

    with open(log_file, 'r') as file:
        for line in file:
            if line.startswith('HraEvalExitState'):
                # Extract JSON-like string
                json_str = re.search('{.*}', line).group()
                
                # Replace single quotes to double quotes for JSON parsing
                json_str = json_str.replace("'", '"')
                         
                # Add quotes around keys and string values to make it valid JSONJSON
                json_str = re.sub(r'(\b[a-zA-Z_]+\b):', r'"\1":', json_str)
                json_str = re.sub(r': (\b[a-zA-Z_]+\b)', r': "\1"', json_str)

         
                # Add quotes around time values
                json_str = re.sub(r': ([0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]+)', r': "\1"', json_str)
                
              
                print(json_str)
                
                # Load string as JSON
                state_dict = json.loads(json_str)
                
                if meta is not None:
                    state_dict.update(meta)
                
                # Append to state list
                state_list.append(state_dict)
           
    return state_list


data = []

for fn in fns:
    x = fn.replace('DebugLog_', '').replace('.txt', '')
    meta = {}
    for kv in x.split(','):
        k, v = kv.split('=')
        meta[k] = v
    
    data.extend(extract_state(fn, meta=meta))

# Print the extracted data
for i, d in enumerate(data):
    d.update(d['psfMultipliers'])
    del d['psfMultipliers']
    d['Success'] = d['evalState'] == "Success"
    
    if i == 0:
        fieldnames = list(d.keys())
        fp = open('Debug_compiled.csv', 'w', newline='', encoding='utf-8') 
        wtr = csv.DictWriter(fp, fieldnames)
        wtr.writeheader()
        
    wtr.writerow(d)