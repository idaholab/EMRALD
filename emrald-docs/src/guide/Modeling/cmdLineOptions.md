# Command Line Options

This page is still under construction. Thank you for your patience. <br>

## Running EMRALD from Command Line
To run the EMRALD Simulation Engine, run the terminal/cmd in the following directory: `\EMRALD\EMRALD_Sim\bin\Debug\net5.0-windows` and run the following command: <br>

`Emrald_Sim.exe <options>` <br>

## Command Line Options: <br>
 - **-i :** string: input model path. Example: `-i "C:\Users\UserA\input_file.json"`
 - **-r :** string: results output file. Example: `-r "C:\temp\NewSimResults.txt"`
 - **-o :** string: path results file. Example: `-o "C:\temp\PathResults.json"`
 - **-jsonStats :** string: results output file. Example: `-jsonStats "C:\temp\NewSimResults.txt"`
 - **-n :** integer: number of runs. Example: `-n 1000`
 - **-t :** string: Max simulation time in days.hh:mm:ss.ms. Example: `-t "365.00:00:00"`
 - **-s :** integer: Initial random seed number. Example: `-s 10`
 - **-d :** (optiona): "basic" or "detailed", range [start end]. Example: `-d basic [10 20]`
 - **-m :** array: Variables to monitor. Use [] for multiple. Example: `-m [x y]`
 - **-c :** coupled external simulation using XMPP, specify the password and the external sim name, XMPP connection resource, XMPP user name and timeout in seconds. If there is more than one put each in brackets. Example: `-d xmppServerPassword [LinkedProgram MyApp User1 60] [LinkedProgram2 MyApp2 User2 60]`

<!--Copyright 2021 Battelle Energy Alliance-->