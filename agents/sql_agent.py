from langchain_community.utilities import SQLDatabase
import os
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

db = SQLDatabase.from_uri("postgresql://rockship:rockship@13.214.145.200:5432/n8n_copilot_dev")
print(db.dialect)
print(db.get_usable_table_names())

from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain_openai import ChatOpenAI

toolkit = SQLDatabaseToolkit(db=db, llm=ChatOpenAI(temperature=0))
context = toolkit.get_context()
tools = toolkit.get_tools()

from langchain_community.agent_toolkits.sql.prompt import SQL_FUNCTIONS_SUFFIX
from langchain_core.messages import AIMessage, SystemMessage
from langchain_core.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    MessagesPlaceholder,
)

messages = [
    HumanMessagePromptTemplate.from_template("{input}"),
    AIMessage(content=SQL_FUNCTIONS_SUFFIX),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
]

prompt = ChatPromptTemplate.from_messages(messages)
prompt = prompt.partial(**context)

from langchain.agents import create_openai_tools_agent
from langchain.agents.agent import AgentExecutor

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

agent = create_openai_tools_agent(llm, tools, prompt)

agent_executor = AgentExecutor(
    agent=agent,
    tools=toolkit.get_tools(),
    verbose=True,
)

# query_node = "set"
query_node = input("Please enter some input: ")
print("You entered: ", query_node)


input_prompt = f"""
Please execute the following SQL command and return only the JSON part of the n8n node information for {query_node}. Exclude any surrounding text or formatting, including markdown or code block syntax.
Sample SQL command format: SELECT * FROM n8n_node_table WHERE n8n_node ->> 'name' = 'n8n-nodes-base.googleSheets';
If the node does not exist within the database, return "I don't know"
Output: Only the raw JSON object representing the n8n node for {query_node}.
"""

result = agent_executor.invoke({"input": input_prompt})
print(type(result))
# print(result['output'])

output_text = str(result["output"])

# Specify the path to the text file where you want to save the output
file_path = 'output.txt'

# Open the file in write mode ('w') and write the output text to it
with open(file_path, 'w') as file:
    file.write(output_text)

print(f"Output successfully written to {file_path}")

# check tokens used
