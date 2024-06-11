from bs4 import BeautifulSoup
from googlesearch import search
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from tqdm import tqdm
import time 

chrome_options = Options()
chrome_options.add_argument("--headless")  # Run in headless mode
chrome_driver_path = "./chromedriver"
browser = webdriver.Chrome(chrome_options)


def get_paper_abstract(query: str):
    try:

        num_results = 10  # Number of results you want

        results = search(query, stop=num_results)
        link = next(results)
        browser.get(link)
        html = browser.page_source
        soup = BeautifulSoup(html, "lxml")
        content = soup.text
        text = content.split("\n")
        text = list(filter(lambda x: len(x.strip()) > 0, text))
        return "\n".join(text)
    except Exception as e:
        print(e)
        return ""


def get_paper_texts(papers: list):
    browser = webdriver.Chrome(chrome_options)
    contents = []
    for i, query in tqdm(enumerate(papers)):
        content = get_paper_abstract(query)
        time.sleep(5)
        contents.append(content)
    browser.quit()
    
    return contents


def main():
    # list_of_queries = [
    #     """An anatomization of research paper recommender
    # system: Overview, approaches and challenges- Ritu Sharma, Dinesh Gopalani,
    # Yogesh Meena """,
    #     """A meta-analysis of semantic classification of
    # citations- Suchetha N. Kunnath, Drahomira Herrmannova, David Pride, Petr
    # Knoth; A meta-analysis of semantic classification of citations.
    # Quantitative Science Studies 2022; 2 (4): 1170–1215. """,
    #     """ “Multi-label
    # classification of research articles using Word2Vec and identification of
    # similarity threshold”- Mustafa, G., Usman, M., Yu, L. et al. Multi-label
    # classification of research articles using Word2Vec and identification of
    # similarity threshold. Sci Rep 11, 21900 """,
    #     """“Aspect-based Document
    # Similarity for Research Papers”- Malte Ostendorff, Terry Ruas, Till Blume,
    # Bela Gipp, Georg Rehm [Aspect-based Document Similarity for Research
    # Papers](https://aclanthology.org/2020.coling-main.545) (Ostendorff et al.,
    # COLING 2020)""",
    #     """“Short Text Similarity: A Survey” - Pouya Aghahoseini
    # https://www.researchgate.net/publication/337632914_Short_Text_Similarity_A_Survey""",
    #     """“Research paper classification systems based on
    #                    TF‑IDF and LDA schemes” - Kim, SW., Gil, JM. Research
    #                    paper classification systems based on TF-IDF and LDA
    #                    schemes. Hum. Cent. Comput. Inf. Sci. 9, 30 (2019).
    #                    https://doi.org/10.1186/s13673-019-0192-7""",
    #     """“NLP-driven citation analysis for scientometrics”
    #                    JHA, R., JBARA, A., QAZVINIAN, V., & RADEV, D. (2017).
    #                    NLP-driven citation analysis for scientometrics. Natural
    #                    Language Engineering, 23(1), 93-130.
    #                    doi:10.1017/S1351324915000443""",
    #     """Y. Xiong and K.
    #                    Pulli, "Fast panorama stitching for high-quality
    #                    panoramic images on mobile phones," in IEEE Transactions
    #                    on Consumer Electronics, vol. 56, no. 2, pp. 298-306,
    #                    May 2010, doi: 10.1109/TCE.2010.5505931.""",
    #     """K.
    #                    Hashimoto and U. Inoue, "Automatic Generation of
    #                    Structured Abstracts from Research Papers by using Deep
    #                    Learning," 2020 9th International Congress on Advanced
    #                    Applied Informatics (IIAI-AAI), Kitakyushu, Japan, 2020,
    #                    pp. 424-429, doi: 10.1109/IIAI-AAI50415.2020.00092.""",
    #     """D. PRATIBA, A. M.S., A. DUA, G. K. SHANBHAG, N.
    #                    BHANDARI and U. SINGH, "Web Scraping And Data
    #                    Acquisition Using Google Scholar," 2018 3rd
    #                    International Conference on Computational Systems and
    #                    Information Technology for Sustainable Solutions
    #                    (CSITSS), Bengaluru, India, 2018, pp. 277-281, doi:
    #                    10.1109/CSITSS.2018.8768777.""",
    #     """E. Gündoğan and M.
    #                    Kaya, "Research paper classification based on Word2vec
    #                    and community discovery," 2020 International Conference
    #                    on Decision Aid Sciences and Application (DASA),
    #                    Sakheer, Bahrain, 2020, pp. 1032-1036, doi:
    #                    10.1109/DASA51403.2020.9317101.""",
    #     """J. C.
    #                    Rendón-Miranda, J. Y. Arana-Llanes, J. G. González-Serna
    #                    and N. González-Franco, "Automatic Classification of
    #                    Scientific Papers in PDF for Populating Ontologies,"
    #                    2014 International Conference on Computational Science
    #                    and Computational Intelligence, Las Vegas, NV, USA,
    #                    2014, pp. 319-320, doi: 10.1109/CSCI.2014.153.""",
    # ]
    list_of_queries=['1.  Y. Jiawei, Y. Jiajun, Y. Rui, and C. Zhenyu, "Product Recommendation Based on ', '2. M. Ouhda, K. Elasnaoui, M. Ouanan, and B. Aksasse, "Content -Based Image Retrieval ']
    for i, query in tqdm(enumerate(list_of_queries)):
        content = get_paper_abstract(query)
        with open(f"./content-{i}.txt", "w") as f:
            f.write(content)


if __name__ == "__main__":
    main()
