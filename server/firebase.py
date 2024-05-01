import time

import firebase_admin
from firebase_admin import credentials, firestore, storage

from eval_pdf import evaluate_pdf
from send_mail import send_graded_mail

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
    grammar, semantic, lit = evaluate_pdf(fileName)
    return [
        [
            "Grammar Check",
            "Semantic Relation",
            "Lit. Review",
            "Methodology",
            "Misc.",
        ],
        [grammar, semantic, lit, 90, 100],
        ["Remark"] * 5,
    ]


def grade_assignment(doc):
    print(f"Grading assignment {doc.get('uid')}")
    fileName = download_blob(doc["file"])
    grade = process_pdf(fileName)
    print("Got a grade")
    content = {
        "remarks": grade[2],
        "grades": grade[1],
        "metrics": grade[0],
        "graded": True,
    }
    return content


def on_snapshot(doc_snapshot, _, __):
    for doc in doc_snapshot:
        curr = doc.to_dict()
        curr["uid"] = doc.id
        content = grade_assignment(curr)
        doc_ref = db.collection("submissions").document(doc.id)
        try:
            doc_ref.set(content, merge=True)
            send_graded_mail(curr["email"], curr["uid"])
            print("Updated!")
        except Exception as e:
            print(f"Error updating document {doc.id}: {e}")


query = collection_ref.where("graded", "==", False)
collection_watch = query.on_snapshot(on_snapshot)
while True:
    time.sleep(1)
