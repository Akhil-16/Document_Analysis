import time

import firebase_admin
from firebase_admin import credentials, firestore, storage

cred = credentials.Certificate("./credentials.json")
firebase_admin.initialize_app(
    cred,
    {
        "storageBucket": "score-master-93968.appspot.com",
    },
)

db = firestore.client()
collection_ref = db.collection("submissions")

storage_client = storage.bucket()


def download_blob(storage_ref):
    blob = storage_client.blob(storage_ref)
    fileName = storage_ref.split("/")[1]
    destination_file_name = f"./downloaded/{fileName}"
    blob.download_to_filename(destination_file_name)
    print("Blob {} downloaded to {}.".format(storage_ref, destination_file_name))
    return destination_file_name


def process_pdf(fileName):
    return [
        ("Grammar Check", 100, "Some Remarks"),
        ("Semantic Relation", 97, "Some Remarks"),
        ("Literature Review", 99, "Some Remarks"),
        ("Methodology", 98, "Some Remarks"),
        ("Misc.", 50, "Some Remarks"),
    ]


def grade_assignment(doc):
    print(f"Grading assignment {doc.get('uid')}")
    fileName = download_blob(doc["file"])
    grade = process_pdf(fileName)
    print("Got a grade")
    content = {
        "grade": grade,
        "graded": True,
    }
    collection_watch.unsubscribe()
    collection_ref = db.collection("graded")
    doc_ref = collection_ref.document(doc.get("uid"))
    doc_ref.set(content)
    print("Updated in db!")


def on_snapshot(doc_snapshot, _, __):
    for doc in doc_snapshot:
        curr = doc.to_dict()
        curr["uid"] = doc.id
        grade_assignment(curr)


query = collection_ref.where("graded", "==", False)
collection_watch = query.on_snapshot(on_snapshot)
