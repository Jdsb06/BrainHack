# BrainHack ML Models

This folder contains everything to train, evaluate, and deploy the Distraction Risk Prediction pipeline used by BrainHack.

---

## 📂 Folder Contents

- **distraction_data.csv**  
  ~50,000 user-session rows labeled with `distraction_risk` (0 = low, 1 = high).  
- **data_splits.pkl**  
  Pre-serialized train/validation/test splits (80%/10%/10%).  
- **distraction_model.pkl**  
  Trained scikit-learn `Pipeline` (preprocessor + `XGBClassifier`).  
- **feature_columns.pkl**  
  Ordered list of feature names for consistent inference.  
- **train.py**  
  End-to-end training script (Colab-compatible):  
  - Loads `distraction_data.csv`  
  - Builds a `ColumnTransformer` + `Pipeline` with `StandardScaler`, `OneHotEncoder`, and `XGBClassifier`  
  - Runs `GridSearchCV` on hyperparameters  
  - Saves the best model and features  
- **evaluate.py**  
  Loads artifacts, runs on validation & test splits, and prints metrics & classification reports.  
- **BrainHack.ipynb**  
  Interactive Colab notebook for EDA, pipeline development, CV, and plotting.  
- **requirements.txt**  
  Exact package versions (scikit-learn, xgboost, pandas, numpy, matplotlib, etc.).

---

## 🧠 Model & Preprocessing

- **Pipeline**  
  1. **Numeric features** (`session_duration`, `stress_level`, `fatigue_score`, `notifications_count`, `phone_usage_minutes`) → `StandardScaler`  
  2. **Categorical features** (`time_of_day`, `location_type`, plus last-app categories, noise levels, etc.) → `OneHotEncoder`  
  3. **Classifier** → `XGBClassifier` via `GridSearchCV`

---

## 🚀 Training Setup

- **Environment:** Google Colab (Python 3.9)  
- **Split:** 80% train (~40k rows), 10% validation (~5k), 10% test (~5k)  
- **CV:** 5-fold cross-validation within `GridSearchCV`  
- **Hyperparameters Tuned:**  
  - `n_estimators`  
  - `max_depth`  
  - `learning_rate`  
  - `subsample`

---

## 📊 Evaluation Metrics

### Validation Set (n = 4,992)

| Metric      | Value    |
|-------------|----------|
| Accuracy    | 0.9744   |
| ROC AUC     | 0.9980   |

**Classification Report**

| Class | Precision | Recall | F1-Score | Support |
|:-----:|:---------:|:------:|:--------:|:-------:|
|   0   |   0.98    |  0.97  |   0.98   |  2,641  |
|   1   |   0.97    |  0.98  |   0.97   |  2,351  |
|**Overall**| **0.97** |**0.97**| **0.97** |  4,992  |

### Test Set (n = 4,993)

| Metric      | Value    |
|-------------|----------|
| Accuracy    | 0.9730   |
| ROC AUC     | 0.9978   |

**Classification Report**

| Class | Precision | Recall | F1-Score | Support |
|:-----:|:---------:|:------:|:--------:|:-------:|
|   0   |   0.98    |  0.97  |   0.97   |  2,652  |
|   1   |   0.97    |  0.97  |   0.97   |  2,341  |
|**Overall**| **0.97** |**0.97**| **0.97** |  4,993  |

---

## 🔍 Top Feature Importances

| Rank | Feature                                 | Importance |
|:----:|-----------------------------------------|:----------:|
|  1   | `ambient_noise_level_quiet`             |   0.11     |
|  2   | `last_app_category_social_media`        |   0.105    |
|  3   | `last_app_category_games`               |   0.095    |
|  4   | `ambient_noise_level_loud`              |   0.090    |
|  5   | `fatigue_level`                         |   0.080    |
|  6   | `stress_level`                          |   0.080    |
|  7   | `notifications_last_30min`              |   0.065    |
|  8   | `phone_unlocks_last_hour`               |   0.055    |
|  9   | `recent_screen_time_today_minutes`      |   0.050    |
| 10   | `device_battery_level`                  |   0.048    |
| …    | _others (moderate noise, entertainment)_|   _<0.03_  |

*(See `BrainHack.ipynb` for the full plot.)*

---

### 🔍 Top Feature Importances

![Feature Importances](public/feature_importance.jpeg)

---

## 🛠️ How to Reproduce

1. **Install**  
   ```bash
   pip install -r requirements.txt
   ```
2. **Train**
   ```bash
   python train.py --data distraction_data.csv
   ```
3. **Evaluate**
   ```bash
   python evaluate.py \
    --model distraction_model.pkl \
    --features feature_columns.pkl
   ```
4. **Deploy**
   ```bash
   import pickle
    model = pickle.load(open('distraction_model.pkl','rb'))
    # then call model.predict(...) in your Flask/FastAPI service
   ```
---

| 🔮 Future Improvements                                                                 |
|-----------------------------------------------------------------------------------------|
| Add **Reinforcement-Learning simulation** (“what if you skip a break?”)                 |
| Experiment with **RNN/LSTM** on sequential session data                                  |
| Integrate **SHAP** for per-prediction explainability                                    |
| Build a **CI/CD pipeline** to automate retraining as new data arrives                   |

