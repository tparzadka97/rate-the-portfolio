import json
import robin_stocks.robinhood as r
from django.http import JsonResponse
from django.views import View


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
