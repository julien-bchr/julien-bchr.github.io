#web scraping 
import pandas as pd 
from bs4 import BeautifulSoup 
from selenium import webdriver 
from sys import executable

driver = webdriver.Chrome(executable_path="C:/Users/Julie/AppData/Roaming/Microsoft/Windows/chromedriver_win32/chromedriver.exe") 
driver.get("https://www.imarcgroup.com/top-lithium-ion-battery-manufacturers")
results = []
content = driver.page_source
soup = BeautifulSoup(content)
driver.quit()

for element in soup.find_all(['h2']):
    for title in element:
        results.append(title.text)

df = pd.DataFrame({'title':results})
df.to_csv('title.csv', index=False, encoding='utf-8')
