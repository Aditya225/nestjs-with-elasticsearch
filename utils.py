from elasticsearch import Elasticsearch
import os
from dotenv import load_dotenv

load_dotenv()

def get_elastic_client():
    cloud_id = os.getenv("ELASTIC_CLOUD_ID")
    api_key = os.getenv("ELASTIC_API_KEY")
    if not cloud_id or not api_key:
        raise ValueError("Missing Elastic credentials in .env file!")
    
    client = Elasticsearch(
        cloud_id=cloud_id,
        api_key=api_key
    )
    try:
        if client.ping:
            print("✅ Elastic Cloud Connected!")
            return client
        else:
            print("elastiserver is failed to connect")
            return None
    except Exception as e:
        print(f"❌ Connection Error: {e}")
        return None
   
es_client = get_elastic_client()