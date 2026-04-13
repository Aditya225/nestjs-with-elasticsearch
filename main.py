import os
from datetime import datetime
from typing import Optional, List
import strawberry
from utils import es_client

# GraphQL Data Model
@strawberry.type
class LogEntry:
    id: str
    service_name: str
    level: str
    message: str
    timestamp: str

@strawberry.type
class Query:
    @strawberry.field
    def check_health(self) -> str:
        if es_client and es_client.ping():
            return "✅ Elastic is Healthy!"
        return "❌ Elastic is Down!"

    @strawberry.field
    def get_logs(self, services: Optional[str] = None, level: Optional[str] = None) -> List[LogEntry]:
        # Agar connection hi nahi hai ya index nahi bana toh crash na ho
        if not es_client or not es_client.indices.exists(index="system-logs"):
            return []

        search_filters = []
        if services:
            search_filters.append({"match": {"service_name": services}})
        if level:
            search_filters.append({"match": {"level": level}}) # FIX: field name added

        # Elastic DSL Query
        query = {
            "query": {
                "bool": {"must": search_filters}
            } if search_filters else {"match_all": {}}
        }

        res = es_client.search(index="system-logs", body=query)

        return [
            LogEntry(
                id=hit["_id"],
                service_name=hit["_source"]["service_name"],
                level=hit["_source"]["level"],
                message=hit["_source"]["message"],
                timestamp=hit["_source"]["timestamp"]
            ) for hit in res["hits"]["hits"]
        ]

@strawberry.type
class Mutation:
    @strawberry.mutation
    def push_log(self, service_name: str, level: str, message: str) -> str:
        if not es_client:
            return "Error: No Elastic Connection"

        doc = {
            "service_name": service_name,
            "level": level,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        # FIX: Index name consistent with Query
        res = es_client.index(index="system-logs", document=doc)
        return f"Log indexed with id: {res['_id']}"

schema = strawberry.Schema(query=Query, mutation=Mutation)