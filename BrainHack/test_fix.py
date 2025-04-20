import pickle
import numpy as np
import json

# Simulate the prediction result (a NumPy float32)
prediction = np.float32(0.75)

# Without conversion (this would fail)
try:
    json_str = json.dumps({'risk_percentage': prediction})
    print("Without conversion (should fail but didn't):", json_str)
except TypeError as e:
    print("Without conversion error:", e)

# With conversion (this should work)
converted_prediction = float(prediction)
try:
    json_str = json.dumps({'risk_percentage': converted_prediction})
    print("With conversion (should work):", json_str)
except TypeError as e:
    print("With conversion error:", e)