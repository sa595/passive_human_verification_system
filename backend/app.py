from flask import Flask,request,jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

model = joblib.load("model.pkl")


@app.route("/predict",methods=["POST"])
def predict():

    data = request.json

    features = np.array([[

        data["mouse_speed_mean"],
        data["mouse_direction_changes"],
        data["click_interval_mean"],
        data["typing_latency"],
        data["scroll_variance"],
        data["session_duration"],
        data["request_rate"],
        data["cpu_threads"],
        data["device_memory"]

    ]])

    prediction = model.predict(features)[0]

    if prediction == 1:
        return jsonify({"result":"human"})
    else:
        return jsonify({"result":"bot"})


if __name__=="__main__":
    app.run(debug=True)