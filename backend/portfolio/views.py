import json
import robin_stocks.robinhood as r
from django.http import JsonResponse
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Portfolio, Holding
from .serializers import PortfolioSerializer

class PortfolioListView(APIView):
    def get(self, request):
        # Order portfolios by creation date (newest first)
        portfolios = Portfolio.objects.all().order_by('-created_at')
        serializer = PortfolioSerializer(portfolios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SubmitPortfolioView(APIView):
    def post(self, request):
        user = request.user if request.user.is_authenticated else None
        portfolio_data = request.data.get("portfolio")
        name = portfolio_data.get("name", "My Portfolio")
        holdings_data = portfolio_data.get("holdings", [])
        
        # Create portfolio
        portfolio = Portfolio.objects.create(user=user, name=name)
        
        # Create holdings
        for holding in holdings_data:
            Holding.objects.create(
                portfolio=portfolio,
                type=holding["type"],
                name=holding["name"],
                amount=holding["amount"],
            )

        return Response({"message": "Portfolio submitted successfully!", "id": portfolio.id}, status=status.HTTP_201_CREATED)


class PortfolioDetailView(APIView):
    def get(self, request, pk):
        try:
            portfolio = Portfolio.objects.get(pk=pk)
            serializer = PortfolioSerializer(portfolio)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Portfolio.DoesNotExist:
            return Response({"error": "Portfolio not found."}, status=status.HTTP_404_NOT_FOUND)

class SyncRobinhoodView(View):
    def post(self, request, *args, **kwargs):
        user_data = json.loads(request.body)

        username = user_data.get("username")
        password = user_data.get("password")

        try:
            login = r.login(username, password, mfa_code="")

            my_stocks = r.build_holdings()
            my_crypto = r.crypto.get_crypto_positions()

            holdings_data = []

            for ticker, details in my_stocks.items():
                holding = {
                    "type": details["type"],
                    "name": ticker,
                    "amount": float(details["quantity"]),
                }
                holdings_data.append(holding)

            for crypto in my_crypto:
                quantity = float(crypto["quantity"])
                if quantity > 0.00000000:
                    holding = {
                        "type": "crypto",
                        "name": crypto["currency"]["code"],
                        "amount": quantity,
                    }
                    holdings_data.append(holding)

            return JsonResponse({"holdings": holdings_data})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
