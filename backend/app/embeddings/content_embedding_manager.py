import os
import re
import json
import requests

import openai
from uuid import UUID
from bs4 import BeautifulSoup
from readability import Document
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.data_models.content import Content
from app.data_models.content_ai import ContentAI


class ContentEmbeddingManager:
    '''
    Manages:
        - Generating vector embeddings for content summaries
        - Inserting and retrieving content and their embeddings from the db
        - Enriching raw HTML content for a summarization model
        - Performing similarity queries on content embeddings
        - Handling database interactions for both `Content` and `ContentAI` models
    '''

    def __init__(self, db, embedding_model_name='text-embedding-3-small', summary_model_name='gpt-3.5-turbo'):
        self.db = db
        self.embedding_model = embedding_model_name
        self.embedding_model_name = embedding_model_name
        self.summary_model = summary_model_name
        
        # openai client for embeddings
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self._embedding_client = openai

        # OpenRouter client for summarizations
        self._summary_client = openai.OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPENROUTER_API_KEY")
        )


    ###############################################################################
    # METHODS
    ###############################################################################


    def process_content(self, content: Content) -> ContentAI | None:
        '''
        Inserts content into the database if it doesn't exist, summarizes it, and embeds the summary
        If any exceptions occur, the transaction will be rolled back
        '''
        try:
            if self._content_ai_exists(content.content_id):
                print(f"Embedding already exists for content ID: {content.content_id}")
                return None

            # Enrich the content by parsing the raw_html. If getting the html fails, default the summary_input to title
            summary_input = self._enrich_content(content.url, content.content_id, self.db)
            if not summary_input:
                summary_input = content.title or "No title avaliable"

            # Use LLM to summarize the content
            summary = self._summarize_content(summary_input) 

            self._store_article_summary_pair(
                article_text= summary_input,
                summary= summary,
                url= content.url,
                title= content.title
            )

            print(f"Generated summary: {summary}")
            
            if not summary: 
                raise Exception("Failed to summarize content and/or there is no title")

            # Embed the summary associated with the content ORM
            embedding = self._generate_embedding(summary)
            if not embedding: 
                raise Exception("Failed to generate embedding") 

            # Insert the summary/embedding data into the ContentAI table
            content_ai = ContentAI(
                content_id=content.content_id,
                ai_summary=summary,
                embedding=embedding
            )

            self.db.add(content_ai)
            self.db.commit()
            print(f"ContentAI created for content_id={content.content_id}")
            return content_ai
        
        
        except Exception as e:
            self.db.rollback()
            print(f"[ContentEmbeddingManager] failed to process content: {e}")
            return None
        

    def query_similar_content(self, query, user_id:UUID, start_date=None,end_date=None, limit=5):
        ''' Generates a query embedding and vector search the db for related content '''
        
        query_embedding = self.openai_client.embeddings.create(
            model=self.embedding_model,
            input=query["semantic_query"]
        ).data[0].embedding

        results = (
            self.db.query(ContentAI, Content)
            .join(Content, ContentAI.content_id == Content.content_id)
            .filter(Content.user_id == user_id)
        )

        if start_date and end_date:
            results = results.filter(Content.first_saved_at.between(start_date, end_date))

        results = (
            results.order_by(ContentAI.embedding.l2_distance(query_embedding))
            .limit(limit)
            .all()
        )

        return results


    ###############################################################################
    # HELPER METHODS
    ###############################################################################

    def _store_article_summary_pair(self, article_text, summary, url, title):
        record = {
            "url": url,
            "title": title,
            "article": article_text,
            "summary": summary
        }

        try:
            with open("../data/summaries.json", "r") as f:
                data = json.load(f)
                data.append(record)
                f.seek(0)
                json.dump(data, f)
        except Exception as e:
            print(f"Failed to write with error: {e}")
    

    def _enrich_content(self, url: str, content_id: UUID, db: Session):
        try:
            response = requests.get(url, timeout=5)
            if response.status_code != 200:
                print(f"Error: {response.status_code}: failed get request for {url}, defaulting to title for summarization input")
                return None
            
            raw_html = response.text
            metadata = self._extract_metadata_and_body(raw_html)
            metadata["body_text"] = self._clean_text(metadata["body_text"])

            summary_input = self._build_summary_input(metadata)
            return summary_input    

        except Exception as e:
            print(f"Error enriching content from {url}: {e}")
            return None


    def _generate_embedding(self, text):
        try:
            response = self._embedding_client.embeddings.create(
                model=self.embedding_model,
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"OpenAI embedding failed: {e}")
            return None
        

    def _content_ai_exists(self, content_id: UUID) -> bool:
        return self.db.query(ContentAI).filter_by(content_id=content_id).first() is not None


    def _clean_text(self, text:str, max_chars=1000) -> str:    
        lines = text.split("\n")
        cleaned = []

        for line in lines:
            line = line.strip()
            if not line or re.search(r"(©|\ball rights\b|cookie|advertisement)", line, re.I):
                continue
            cleaned.append(line)

        joined = " ".join(cleaned)
        return joined[:max_chars]
            

    def _extract_metadata_and_body(self, html: str) -> dict:
        soup = BeautifulSoup(html, "html.parser")
        
        title = soup.title.string.strip() if soup.title else ""
        description = ""
        tags = []

        for meta in soup.find_all("meta"):
            if meta.get("name") == "description":
                description = meta.get("content", "")
            if meta.get("property") == "og:description":
                description = meta.get("content", "") or description
            if meta.get("name") == "keywords":
                tags = [tag.strip() for tag in meta.get("content", "").split(",")]

        doc = Document(html)
        # html snippet of main content body with boilerplate (nav bars, ads, footers) removed
        body = BeautifulSoup(doc.summary(), "html.parser").get_text()

        print(f"The title from soup is: {title}")

        return {
            "title": title,
            "description": description,
            "tags": tags,   
            "body_text": body.strip()
        }


    def _build_summary_input(self, metadata: dict) -> str:
        input_parts = []

        if metadata["title"]:
            input_parts.append(f"Title: {metadata['title']}")
        if metadata["description"]:
            input_parts.append(f"Description: {metadata['description']}")
        if metadata["tags"]:
            input_parts.append(f"Tags: {', '.join(metadata['tags'])}")
        if metadata["body_text"]:
            input_parts.append(f"Content:\n\n{metadata['body_text']}")
        
        # snippet = metadata["body_text"][:500]
        # input_parts.append(f"Content Snippet: {snippet}")
        print("\n".join(input_parts))
        return "\n".join(input_parts)


    def _insert_db(self, Data_Model, data):
        '''
        Takes a data model ORM and inserts data into that table
        Returns that db object data
        '''
        try:
            db_data = Data_Model(**data)
            self.db.add(db_data)
            self.db.flush()     # Flush for content_ai insertion
            return db_data
        except SQLAlchemyError as e:
            self.db.rollback()
            print(f"Error Inserting into {Data_Model.__tablename__}: {e}")
            return None


    def _url_exists(self, url):
        ''' Checks if a URL already exists in the database '''
        if url:
            existing_content = self.db.scalar(select(Content).where(Content.url == url))
            if existing_content:
                print(f"Content with URL '{url}' already exists. Skipping insertion.")
                return existing_content  
        return False
    
    
    def _summarize_content(self, summary_input):
        try:
            response = self._summary_client.chat.completions.create(
                model=self.summary_model,
                messages=[
                    {
                        "role": "system", 
                        "content": (
                            "You are a concise technical summarizer. "
                            "Summarize the article in exactly **2 short sentences**. "
                            "Focus only on the main point. Ignore ads, disclaimers, and unrelated text."
                        )
                    },
                    {"role": "user", "content": summary_input},
                ],
                temperature=0.7,
                max_tokens=150,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"OpenRouter summarization failed: {e}")
            return None
