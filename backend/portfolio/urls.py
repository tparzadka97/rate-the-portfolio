from django.urls import path, include
from .views import SyncRobinhoodView

urlpatterns = [
    path("sync-robinhood/", SyncRobinhoodView.as_view(), name="sync_robinhood"),
]
