import pickle

# Load the feature columns
with open('feature_columns.pkl', 'rb') as f:
    feature_columns = pickle.load(f)

# Print the feature columns
print("Feature columns:")
print(feature_columns)