import random
import string

from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"


@app.route("/generate-random")
@cross_origin()
def generate_random():
    return jsonify(
        {
            "uid": "".join(
                random.choices(
                    string.ascii_letters + string.digits,
                    k=6,
                )
            )
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=8080)
