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


def get_remark(parameter, score):
    if parameter == "Grammar Check":
        if score >= 90:
            return "Your grammar is impeccable!"
        elif score >= 70:
            return "Your grammar is good, but there is room for improvement."
        elif score >= 50:
            return "Your grammar needs some attention."
        else:
            return "Your grammar is atrocious!"
    elif parameter == "Semantic Relation":
        if score >= 90:
            return "Your semantic relations are very clear and well-established."
        elif score >= 70:
            return (
                "Your semantic relations are understandable, but could be more precise."
            )
        elif score >= 50:
            return "Your semantic relations need improvement."
        else:
            return "Your semantic relations are unclear or inconsistent."
    elif parameter == "Lit. Review":
        if score >= 90:
            return "Your literature review is comprehensive and insightful."
        elif score >= 70:
            return "Your literature review is adequate, but missing some key points."
        elif score >= 50:
            return "Your literature review needs significant improvement."
        else:
            return "Your literature review is severely lacking."
    elif parameter == "Methodology":
        if score >= 90:
            return "Your methodology is robust and well-designed."
        elif score >= 70:
            return (
                "Your methodology is acceptable, but could be more detailed or precise."
            )
        elif score >= 50:
            return "Your methodology needs improvement or clarification."
        else:
            return "Your methodology is fundamentally flawed or inadequate."
    elif parameter == "Misc.":
        if score >= 90:
            return "Your miscellaneous section is exceptional!"
        elif score >= 70:
            return "Your miscellaneous section is good, but could use some refinement."
        elif score >= 50:
            return "Your miscellaneous section needs attention and improvement."
        else:
            return "Your miscellaneous section is lacking coherence or relevance."
    else:
        return "Invalid parameter."


def process_pdf(fileName):
    grammar, semantic, lit, table_score = evaluate_pdf(fileName)
    parameters = [
        "Grammar Check",
        "Semantic Relation",
        "Lit. Review",
        "Methodology",
        "Misc.",
    ]
    scores = [grammar, semantic, lit, table_score, 100]
    remarks = []
    for i in range(5):
        remarks.append(get_remark(parameters[i], scores[i]))
    return [parameters, scores, remarks]


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
