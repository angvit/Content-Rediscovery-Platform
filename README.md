<img src="https://github.com/angvit/Content-Rediscovery-Platform/blob/main/frontend/public/cspherelogo2.png?raw=true" alt="logo" width="350" height="200"/>

<h1>Rediscover what matters — faster.</h1>




A full-stack web app and browser extension that helps users **save**, **summarize**, and **search** web content using **embeddings** and **ai-generated summaries**. 

**Live App**: [https://csphere-nly9.vercel.app/]

---

## Local Setup

### 1. Backend (Python + FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate (for windows: source venv/scripts/Activate )
pip install -r requirements.txt
uvicorn app.api.main:app --reload
```

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

### 3. Chrome Extension

1. Load the `chrome_extension/` folder into Chrome via `chrome://extensions`

2. Enable Developer Mode -> "Load Unpacked" -> Select `chrome_extension/`


### Alembic Setup - Database Migrations 

1. Install alembic

```bash
pip install alembic
```

2. Initialize Alembic at the root of the backend folder 

```bash
alembic init
```

3. Configure your alembic INI file
set your sqlalchemy.url to your postgresql connector string


4. Set Target Metadata

In alembic/env.py, update the target_metadata to use your SQLAlchemy models' metadata.

For example, if you have a Base object defined in app/db/base.py:

```bash
from app.db.base import Base  # Adjust the path based on your project
target_metadata = Base.metadata
```

5. Create a Migration Script
```bash
alembic revision --autogenerate -m "create users table"
```
6. Apply  your migration to the database

```bash
alembic upgrade head
```

-To Downgrade a migration run this command

```bash
alembic downgrade -1
```


