import psycopg2
import matplotlib.pyplot as plt
from dotenv import load_dotenv
import os
load_dotenv()
dbhost = os.getenv("DB_HOST")
dbport = os.getenv("DB_PORT")
dbuser = os.getenv("DB_USER")
dbpassword = os.getenv("DB_PASSWORD")
name = os.getenv("DB_NAME")
conn = psycopg2.connect(
    dbname = name,
    user = dbuser,
    host = dbhost,
    password =dbpassword,
    port = dbport
      )
cur = conn.cursor()
cur.execute("SELECT numbers , COUNT(*) FROM score_num group by numbers order by numbers;")
rows = cur.fetchall()
scores = [row[0] for row in rows]
counts = [row[1] for row in rows]
plt.pie(counts, labels=scores, autopct='%1.1f%%', startangle=90)
plt.title("Proporcja graczy z danymi wynikami")
plt.show()
cur.close()
conn.close()