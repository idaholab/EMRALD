# Command Line Options

The following sections explain the different options available when running EMRALD through the command prompt. Options can be manually specified in the command line or input via a .json file. <br>


## Option Flags
  |<div style="width:115px">Flag</div>|<div style="width:300px">Description</div>|
  |---|---|
  | -h | Opens the "Help" menu |
  | -n | Specifies the number of runs |
  | -i | Specifies the input model file path |
  | -r | Specifies the basic/text results output file path |
  | -o | Specifies the JSON path-results output file path |
  | -t | Specifies the maximum time for each run |
  | -e | Runs the simulation |
  | -threads | Specifies the number of threads to use for parallel execution |
  | -m | Specifies the parameters to monitor. Use brackets for multiple variables. <br> Example: -m [x y z] |
  | -s | Specifies the initial random number seed |
  | -d | Specifies the debug level, either "basic" or "detailed", and an optional range <br> Example: -d basic [10 20]|
  | -rIntrv | Specifies how often to save the path results, every X number of runs. No value or <1 will result in saving only after all runs are complete. |
  | -mergeResults | Merges two JSON path result files into a single file and estimates the 5th and 95th percentiles. <br> Example: -mergeResults c:/temp/PathResultsBatch1.json c:/temp/PathResultsBatch2.json c:/temp/PathResultsCombined.json |
  | -json-help | Prints the JSON options file syntax to the console (CommandLineCP only). |

To run a coupled external simulation (XMPP or WebSocket), configure the connection in the `couplingInfo` section of the [Options JSON file](#options-json-file) rather than passing it on the command line.<br>

## Options JSON File
Alternatively, the user may create a dedicated .json file to specify options. This allows the user to prefill and run the simulation with only two arguments in the command line.
<div>> [path/to/EMRALD_Sim.exe] [path/to/options/file]</div>

### Fields
  |<div style="width:170px">Field</div>|<div style="width:110px">Type</div>|<div style="width:380px">Description</div>|
  |---|---|---|
  | opsVer | number | Version of the options file format (current: `1.02`). |
  | runct | integer | Total number of runs. |
  | inpfile | string | Path to the input model file. |
  | resout | string | Path to the basic/text results output file. |
  | jsonRes | string | Path to the JSON path-results output file. |
  | variables | string[] | Variable names to record in the results. |
  | initVars | object[] | Variables to (re)initialize on each run. Each item is `{ "varName": "<name>", "value": "<string value>" }`. For variables flagged "reset on every run", this value is applied every run; otherwise behavior matches a single initial assignment. |
  | runtime | string | Maximum simulation time in `Days.HH:MM:SS` format (e.g. `365.00:00:00`). |
  | seed | integer | Initial random number seed. |
  | debug | string | Debug level: `"basic"`, `"detailed"`, or `"off"`. |
  | debugStartIdx | integer\|null | Run index to start debug logging at. `null` means from the first run. |
  | debugEndIdx | integer\|null | Run index to stop debug logging at. `null` means through the last run. |
  | pathResultsInterval | integer | How often (in runs) to write the path results file. Use `-1` to write only at the end. |
  | threads | integer\|null | Number of threads to use for parallel execution. `null` (default) disables threading. Any value (even `1`) uses per-thread temp folders so multiple instances can share the same model. |
  | clearThreadTemps | boolean | If `true`, per-thread temp files are deleted after the run completes. |
  | couplingInfo | object | External coupling configuration. Omit if no coupling is needed. See below. |

### couplingInfo sub-object
  |<div style="width:170px">Field</div>|<div style="width:110px">Type</div>|<div style="width:380px">Description</div>|
  |---|---|---|
  | couplingType | string | `"XMPP"` or `"WebSocket"`. |
  | couplingPassword | string | **XMPP only.** Password for the XMPP connection. Not used for WebSocket. |
  | user | string | **XMPP only.** User name for the XMPP connection. Not used for WebSocket. |
  | couplingURL | string\|null | URL to connect to for WebSocket (required). May be `null` for XMPP. |
  | timeout | integer | Connection timeout in seconds. |
  | logCouplingMsgs | boolean | Log coupling messages to the console (debug builds only). Set `false` to suppress during testing. |

### Example
```json
{
  "opsVer": 1.02,
  "runct": 100,
  "inpfile": "c:/models/MyModel.json",
  "resout": "BasicResults.txt",
  "jsonRes": "c:/temp/PathResults.json",
  "variables": [ "var1", "var2" ],
  "initVars": [
    { "varName": "var1", "value": "5" }
  ],
  "runtime": "365.00:00:00",
  "seed": 0,
  "debug": "off",
  "debugStartIdx": null,
  "debugEndIdx": null,
  "pathResultsInterval": 1000,
  "threads": 4,
  "clearThreadTemps": false,
  "couplingInfo": {
    "couplingType": "WebSocket",
    "couplingPassword": "secret",
    "user": "user",
    "couplingURL": "ws://localhost:8080/emrald",
    "timeout": 30,
    "logCouplingMsgs": true
  }
}
```


<!--Copyright 2021 Battelle Energy Alliance-->
