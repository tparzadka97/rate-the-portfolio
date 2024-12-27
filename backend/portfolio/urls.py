from django.urls import path, include
from .views import SyncRobinhoodView, SubmitPortfolioView, PortfolioDetailView, PortfolioListView

urlpatterns = [
    path("sync-robinhood/", SyncRobinhoodView.as_view(), name="sync_robinhood"),
    path("submit/", SubmitPortfolioView.as_view(), name="submit_portfolio"),
    path("<int:pk>/", PortfolioDetailView.as_view(), name="portfolio_detail"),
    path('list/', PortfolioListView.as_view(), name='portfolio_list'),
]
