from django.test import RequestFactory
from core.views import admin_news, admin_news_detail
import json
import core.views

# Bypass the token check for testing
core.views._validate_admin_token = lambda r: True

factory = RequestFactory()

# 1. Test POST with valid data
print("--- TEST POST VALID ---")
valid_data = {
    "title": "Testing Title",
    "excerpt": "This is a test excerpt",
    "content": "This is a test content.",
    "category": "annonce",
    "author": "Admin",
    "is_published": True,
    "is_featured": False
}
req1 = factory.post('/admin/news/', data=json.dumps(valid_data), content_type='application/json')
res1 = admin_news(req1)
print(res1.status_code)
if hasattr(res1, 'data'): print(res1.data)

# 2. Test POST with missing/invalid fields (to mimic the UI not saving when validations fail)
print("\n--- TEST POST INVALID (Missing content, short title) ---")
invalid_data = {
    "title": "Te", # < 3 chars
    "excerpt": "This is a test excerpt",
    "content": "", # empty
    "category": "annonce",
    "author": "Admin",
    "is_published": True,
    "is_featured": False
}
req2 = factory.post('/admin/news/', data=json.dumps(invalid_data), content_type='application/json')
res2 = admin_news(req2)
print(res2.status_code)
if hasattr(res2, 'data'): print(res2.data)
