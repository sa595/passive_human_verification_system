import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier

# create dummy dataset
data = []

for i in range(2000):

    if i < 1000:  # human
        row = [
            np.random.uniform(0.3,1.5),
            np.random.randint(10,60),
            np.random.uniform(300,2000),
            np.random.uniform(50,300),
            np.random.uniform(100,500),
            np.random.uniform(20,120),
            np.random.uniform(1,10),
            np.random.randint(4,16),
            np.random.choice([4,8,16]),
            1
        ]

    else:  # bot
        row = [
            np.random.uniform(2,5),
            np.random.randint(0,5),
            np.random.uniform(0,50),
            np.random.uniform(0,5),
            np.random.uniform(0,20),
            np.random.uniform(1,5),
            np.random.uniform(50,300),
            np.random.randint(2,8),
            np.random.choice([2,4]),
            0
        ]

    data.append(row)


columns=[
"mouse_speed_mean",
"mouse_direction_changes",
"click_interval_mean",
"typing_latency",
"scroll_variance",
"session_duration",
"request_rate",
"cpu_threads",
"device_memory",
"label"
]

df = pd.DataFrame(data,columns=columns)

X = df.drop("label",axis=1)
y = df["label"]

model = RandomForestClassifier(n_estimators=200)

model.fit(X,y)

joblib.dump(model,"model.pkl")

print("model.pkl generated successfully")