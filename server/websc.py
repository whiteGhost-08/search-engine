from collections import deque
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import sys
import urllib.request
import requests
import pandas as pd

# Read URL from command line
url = "https://en.wikipedia.org/wiki/Science_fiction_film"

# Create queue
queue = deque([])

# Maintains list of visited pages
visited_list = []

# Crawl the page and populate the queue with newly found URLs


def crawl(url):
    visited_list.append(url)
    urlf = urllib.request.urlopen(url)
    soup = BeautifulSoup(urlf.read())
    urls = soup.findAll("a", href=True)

    for i in urls:
        flag = 0
        complete_url = urljoin(url, i["href"]).rstrip('/')
        if '#' in complete_url:
            continue
        if '?' in complete_url:
            continue
        for j in queue:
            if j == complete_url:
                flag = 1
                break

        if flag == 0:
            if len(queue) > 1000:
                return
            if (visited_list.count(complete_url)) == 0:
                queue.append(complete_url)

    current = queue.popleft()
    crawl(current)


crawl(url)

# Print queue
title = []
urls = []
summary = []
texts = []

for i in queue:
    try:
        wiki = requests.get(i)
        soup = BeautifulSoup(wiki.text, 'html')
        object = soup.find(id="bodyContent")
        t = soup.find('title').text
        s = object.find_all('p')[1].get_text()
        if (not s):
            continue
        urls.append(i)
        title.append(t)
        summary.append(s)
        texts.append(s)
    except:
        pass

df = pd.DataFrame({'Title': title, 'Text': texts,
                  'Summary': summary, 'URL': urls})
df.to_csv('./scifi.csv')
