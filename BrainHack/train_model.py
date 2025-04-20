import pandas as pd
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_auc_score
import xgboost as xgb
import matplotlib.pyplot as plt

# Load the prepared data splits
print("Loading prepared data splits...")
with open('data_splits.pkl', 'rb') as f:
    data_splits = pickle.load(f)

X_train = data_splits['X_train']
y_train = data_splits['y_train']
X_val = data_splits['X_val']
y_val = data_splits['y_val']
X_test = data_splits['X_test']
y_test = data_splits['y_test']
numeric_features = data_splits['numeric_features']
categorical_features = data_splits['categorical_features']

print(f"Training set: {X_train.shape[0]} samples")
print(f"Validation set: {X_val.shape[0]} samples")
print(f"Test set: {X_test.shape[0]} samples")

# Create preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# Apply preprocessing to validation data for later use with early stopping
preprocessor_fit = preprocessor.fit(X_train)
X_val_transformed = preprocessor_fit.transform(X_val)

# Create XGBoost classifier with early stopping parameters
xgb_classifier = xgb.XGBClassifier(
    use_label_encoder=False,
    eval_metric='logloss',
    early_stopping_rounds=10,
    verbose=True
)

# Create and train model pipeline
print("\nTraining the model...")
model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', xgb_classifier)
])

# Fit the model
X_train_preprocessed = preprocessor_fit.transform(X_train)
eval_set = [(X_train_preprocessed, y_train), (X_val_transformed, y_val)]
xgb_classifier.fit(X_train_preprocessed, y_train, eval_set=eval_set)

# Create the final pipeline with the trained components
final_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor_fit),
    ('classifier', xgb_classifier)
])

# Make predictions on validation set
print("\nEvaluating on validation set...")
y_val_pred = final_pipeline.predict(X_val)
y_val_pred_proba = final_pipeline.predict_proba(X_val)[:, 1]

print("Validation Accuracy:", accuracy_score(y_val, y_val_pred))
print("Validation AUC:", roc_auc_score(y_val, y_val_pred_proba))
print("\nValidation Classification Report:")
print(classification_report(y_val, y_val_pred))

# Final evaluation on test set
print("\nFinal evaluation on test set...")
y_test_pred = final_pipeline.predict(X_test)
y_test_pred_proba = final_pipeline.predict_proba(X_test)[:, 1]

print("Test Accuracy:", accuracy_score(y_test, y_test_pred))
print("Test AUC:", roc_auc_score(y_test, y_test_pred_proba))
print("\nTest Classification Report:")
print(classification_report(y_test, y_test_pred))
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_test_pred))

# Save the model
with open('distraction_model.pkl', 'wb') as f:
    pickle.dump(final_pipeline, f)

# Save feature columns for later use in the application
with open('feature_columns.pkl', 'wb') as f:
    pickle.dump({'numeric': numeric_features, 'categorical': categorical_features}, f)

print("\nModel training completed and saved!")

# Plot feature importance
try:
    # Get feature importances
    xgb_model = xgb_classifier
    importances = xgb_model.feature_importances_

    # Get feature names
    feature_names = []

    # Get numeric feature names
    if len(numeric_features) > 0:
        feature_names.extend(numeric_features)

    # Get one-hot encoded feature names
    if len(categorical_features) > 0:
        for i, category in enumerate(categorical_features):
            ohe = preprocessor.transformers_[1][1]
            for category_value in ohe.categories_[i]:
                feature_names.append(f"{category}_{category_value}")

    # Keep only the number of features that match the importances length
    feature_names = feature_names[:len(importances)]

    # Plot top 15 features (or fewer if less available)
    n_features = min(15, len(importances))
    indices = np.argsort(importances)[-n_features:]

    plt.figure(figsize=(10, 8))
    plt.title('Feature Importances')
    plt.barh(range(len(indices)), importances[indices], align='center')
    plt.yticks(range(len(indices)), [feature_names[i] for i in indices])
    plt.xlabel('Relative Importance')
    plt.tight_layout()
    plt.savefig('feature_importance.png')
    print("Feature importance plot saved as 'feature_importance.png'")
except Exception as e:
    print(f"Could not generate feature importance plot: {e}")