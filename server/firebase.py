import time

import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("./credentials.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
collection_ref = db.collection("submissions")


def on_snapshot(doc_snapshot, changes, read_time):
    for doc in doc_snapshot:
        print("Received document snapshot: {}".format(doc.id))


query = collection_ref.where("graded", "==", False)
collection_watch = query.on_snapshot(on_snapshot)
while True:
    time.sleep(1)
