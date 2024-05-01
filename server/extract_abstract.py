import dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

dotenv.load_dotenv()

llm = ChatOpenAI()


def extract_abstract(content: str):

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "You have a long string of data: {data_string}"),
            ("system", "Answer the following question based on the data:"),
            ("user", "{question}"),
        ]
    )

    output_parser = StrOutputParser()
    chain = prompt | llm | output_parser
    return chain.invoke(
        {
            "data_string": content,
            "question": "extract the abstract without chaing anything",
        }
    )
