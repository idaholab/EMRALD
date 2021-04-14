DEMO, CCS =
CCS                      OR   CCS-SUPPLY CCS-TRAINS
CCS-SUPPLY               OR   C-MOV-1-FAILS TANK
C-MOV-1-FAILS            OR   C-MOV-1 DG-B
CCS-TRAINS               AND  CCS-TRAIN-A CCS-TRAIN-B
CCS-TRAIN-A              OR   C-CV-A C-MOV-A C-PUMP-A DG-A
CCS-TRAIN-B              OR   C-CV-B C-MOV-B C-PUMP-B DG-B
^EOS
