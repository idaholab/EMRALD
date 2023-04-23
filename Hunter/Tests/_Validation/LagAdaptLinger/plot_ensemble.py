import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Read in the CSV file and transpose the DataFrame
df = pd.read_csv('output.csv', header=None)

# Define the plot settings
alpha = 0.1
color = 'blue'
linewidth = 0.5

n = len(df.iloc[0])
x = np.arange(0, n * 10, 10) / 3600

# Create the ensemble plot
fig, ax = plt.subplots()
for i in range(len(df)):
    ax.plot(x, df.iloc[i], alpha=alpha, color=color, linewidth=linewidth)

# Add the median line
median_line = df.median(axis=0)
ax.plot(x, median_line, color='red', linewidth=1)

# Set the x-axis label
ax.set_xlabel('Time (h)')

# Set the y-axis label
ax.set_ylabel('Value')

# Save the plot as "LagAdjustLinger_Ensemble.png"
plt.savefig('LagAdjustLinger_Ensemble.png', dpi = 300)


def tokenize(input_string):
    for c in "+-*":
        input_string = input_string.replace(c, f' {c} ')
    input_string = input_string.replace('_', f' _')
    
    tokens = input_string.split()
    
        