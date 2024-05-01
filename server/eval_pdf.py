import re

import nltk
import PyPDF2
import spacy
import textstat
from language_tool_python import LanguageTool
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer

nlp = spacy.load("en_core_web_md")
nltk.download("punkt")
nltk.download("stopwords")
nltk.download("wordnet")


class Scoremaster:
    def __init__(self, file_path):
        self.file_path = file_path
        self.toc_pairs = []
        self.text = ""
        self.intro_text = ""
        self.lit_text = ""
        self.ps_text = ""
        self.abs_text = ""
        self.lit_paras = []
        self.all_contents = []
        self.con_text = ""

    def extract_table_of_contents(self):
        with open(self.file_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(min(6, len(reader.pages))):
                toc_page = reader.pages[page_num]
                toc_text = toc_page.extract_text()
                toc_lines = toc_text.split("\n")
                for line in toc_lines:
                    parts = line.split("........")
                    if len(parts) >= 2:
                        heading = parts[0].strip()
                        page_num = parts[-1].split()[-1].strip()
                        if page_num.isdigit():
                            self.toc_pairs.append([heading, int(page_num)])
                        else:
                            print(f"Skipping invalid page number: {page_num}")

    def Checking_Chronology(self, list2):
        All_elements_present = False
        missing_elements = [
            element.lower()
            for element in list2
            if element.lower().replace(" ", "")
            not in [item[0].lower().replace(" ", "") for item in self.toc_pairs]
        ]
        if missing_elements:
            print("These are the elements that are missing in the table of contents:")
            for element in missing_elements:
                print(element)
        else:
            All_elements_present = True
            print("All elements are present in the table of contents.")
        if All_elements_present:
            pointer = 0
            for x, y in self.toc_pairs:
                if x.lower().replace(" ", "") == list2[pointer].lower().replace(
                    " ", ""
                ):
                    pointer += 1
                else:
                    print("Table of contents is not in proper order.")
                    print(
                        x.lower().replace(" ", ""),
                        list2[pointer].lower().replace(" ", ""),
                    )
                    break

    def extract_text_from_page(self, page_number):
        with open(self.file_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            if page_number < len(reader.pages):
                page = reader.pages[page_number - 1]
                text = page.extract_text()
                text = re.sub(r"\n\s*\n\s*\n+", "\n\n", text)
                return text

    def extract_intro_text(self):
        intro_start_page = None
        intro_end_page = None
        for index, pair in enumerate(self.toc_pairs):
            if pair[0].lower() == "introduction":
                intro_start_page = pair[1]
                if index + 1 < len(self.toc_pairs):
                    next_pair = self.toc_pairs[index + 1]
                    intro_end_page = next_pair[1]
                    break
        if intro_start_page is not None:
            self.intro_text = ""
            for page_num in range(intro_start_page, intro_end_page):
                self.intro_text += self.extract_text_from_page(page_num)
            self.all_contents.append(self.intro_text)
            return self.intro_text
        else:
            print("Introduction section not found in table of contents.")

    def extract_ps_text(self):
        ps_start_page = None
        ps_end_page = None
        for index, pair in enumerate(self.toc_pairs):
            if pair[0].lower() == "problem statement":
                ps_start_page = pair[1]
                if index + 1 < len(self.toc_pairs):
                    next_pair = self.toc_pairs[index + 1]
                    ps_end_page = next_pair[1]
                    break
        if ps_start_page is not None:
            self.ps_text = ""
            for page_num in range(ps_start_page, ps_end_page):
                self.ps_text += self.extract_text_from_page(page_num)
        else:
            print("Problem Statement section not found in table of contents.")

    def extract_conclusion_text(self):
        con_start_page = None
        con_end_page = None
        for index, pair in enumerate(self.toc_pairs):
            if pair[0].lower() == "conclusion":
                con_start_page = pair[1]
                if index + 1 < len(self.toc_pairs):
                    next_pair = self.toc_pairs[index + 1]
                    con_end_page = next_pair[1]
                    break
        if con_start_page is not None:
            self.con_text = ""
            for page_num in range(con_start_page, con_end_page):
                self.con_text += self.extract_text_from_page(page_num)
            return self.con_text
        else:
            print("Conclusion  section not found in table of contents.")

    def extract_lit_text(self):
        lit_start_page = None
        lit_end_page = None
        for index, pair in enumerate(self.toc_pairs):
            if pair[0].lower() == "literature review":
                lit_start_page = pair[1]
                if index + 1 < len(self.toc_pairs):
                    next_pair = self.toc_pairs[index + 1]
                    lit_end_page = next_pair[1]
                    break
        if lit_start_page is not None:
            self.lit_text = ""
            for page_num in range(lit_start_page, lit_end_page):
                self.lit_text += self.extract_text_from_page(page_num)
            self.lit_paras = self.lit_text.split("\n\n")
            for index, paragraph in enumerate(self.lit_paras):
                self.lit_paras[index] = paragraph.replace("\n", "")
            self.lit_paras = [p for p in self.lit_paras if p.strip()]
        else:
            print("Literature Review section not found in table of contents.")

    def extract_abs_text(self):
        abs_start_page = None
        abs_end_page = None
        for index, pair in enumerate(self.toc_pairs):
            if pair[0].lower() == "abstract":
                abs_start_page = pair[1]
                if index + 1 < len(self.toc_pairs):
                    next_pair = self.toc_pairs[index + 1]
                    abs_end_page = next_pair[1]
                    break
        if abs_start_page is not None:
            self.abs_text = ""
            for page_num in range(abs_start_page, abs_end_page):
                self.abs_text += self.extract_text_from_page(page_num)
            return self.abs_text
        else:
            print(" Abstract section not found in table of contents.")

    def analyze_text(self):
        def calculate_flesch_reading_ease(text):
            return textstat.flesch_reading_ease(text)

        def evaluate_readability(score):
            if score is None:
                return "Unknown", 0
            elif score >= 90:
                return "Very Easy", 100
            elif score >= 80:
                return "Easy", 90
            elif score >= 70:
                return "Fairly Easy", 80
            elif score >= 60:
                return "Standard", 70
            elif score >= 50:
                return "Fairly Difficult", 60
            elif score >= 30:
                return "Difficult", 50
            else:
                return "Very Confusing", 40

        def check_grammar(text):
            tool = LanguageTool("en-US")
            matches = tool.check(text)
            # Filter out matches with rule ids CONSECUTIVE_SPACES and MORFOLOGIK_RULE_EN_US
            excluded_rule_ids = [
                "CONSECUTIVE_SPACES",
                "MORFOLOGIK_RULE_EN_US",
                "WHITESPACE_RULE",
            ]
            matches = [
                match for match in matches if match.ruleId not in excluded_rule_ids
            ]
            return matches

        def evaluate_grammar_quality(matches):
            num_issues = len(matches)
            if num_issues == 0:
                return "Good", 100
            elif num_issues < 5:
                return "Acceptable", 80
            elif num_issues < 10:
                return "Poor", 60
            else:
                return "Very Poor", 40

        average = 0
        for section_text in self.all_contents:
            section_text = section_text.replace("\n", "")
            if section_text:
                flesch_score = calculate_flesch_reading_ease(section_text)
                readability, readability_score = evaluate_readability(flesch_score)
                grammar_matches = check_grammar(section_text)
                grammar_quality, grammar_score = evaluate_grammar_quality(
                    grammar_matches
                )
                average = (
                    average + (flesch_score + readability_score + grammar_score) / 3
                )
                print("Section Analysis:")
                print(f"Flesch Reading Ease score: {flesch_score}")
                print(f"Readability: {readability} ({readability_score})")
                print(f"Grammar quality: {grammar_quality} ({grammar_score})")
                print()
        return average

    def extract_keywords(self, text, num_keywords=5):
        def preprocess_text(text):
            tokens = word_tokenize(text.lower())
            stop_words = set(stopwords.words("english"))
            filtered_tokens = [word for word in tokens if word not in stop_words]
            lemmatizer = WordNetLemmatizer()
            lemmatized_tokens = [lemmatizer.lemmatize(word) for word in filtered_tokens]
            return " ".join(lemmatized_tokens)

        preprocessed_text = preprocess_text(text)
        tfidf_vectorizer = TfidfVectorizer()
        tfidf_matrix = tfidf_vectorizer.fit_transform([preprocessed_text])
        feature_names = tfidf_vectorizer.get_feature_names_out()
        tfidf_scores = tfidf_matrix.toarray().flatten()
        top_indices = tfidf_scores.argsort()[-num_keywords:][::-1]
        top_keywords = [feature_names[i] for i in top_indices]
        return top_keywords

    def calculate_semantic_similarity(self, text1, text2):
        doc1 = nlp(text1)
        doc2 = nlp(text2)
        similarity = doc1.similarity(doc2)
        return similarity * 100


def evaluate_pdf(fileName: str):
    list2 = [
        "Introduction",
        "Abstract",
        "Problem Statement",
        "List of Figures",
        "Literature Review",
        "Methodology",
        "Conclusion",
        "References",
    ]
    lit_keywords = []
    scoremaster = Scoremaster(fileName)
    scoremaster.extract_table_of_contents()
    scoremaster.Checking_Chronology(list2)
    intro_text = scoremaster.extract_intro_text()
    scoremaster.extract_ps_text()
    abstract_text = scoremaster.extract_abs_text()
    conclusion = scoremaster.extract_conclusion_text()
    scoremaster.extract_lit_text()
    grammer_score = scoremaster.analyze_text()

    print(f"Grammar Score: {grammer_score}")

    for x in range(len(scoremaster.lit_paras)):
        lit_keywords.append(scoremaster.extract_keywords(scoremaster.lit_paras[x]))

    abs_intro_similarity = scoremaster.calculate_semantic_similarity(
        abstract_text, intro_text
    )
    abs_con_sim = scoremaster.calculate_semantic_similarity(abstract_text, conclusion)
    intro_con = scoremaster.calculate_semantic_similarity(intro_text, conclusion)

    semantic_relation = abs_intro_similarity + abs_con_sim + intro_con
    semantic_relation /= 3

    print(f"semantic_relation: {semantic_relation}")


if __name__ == "__main__":
    evaluate_pdf("./downloaded/Introduction1.pdf")
