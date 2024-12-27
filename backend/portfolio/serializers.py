from rest_framework import serializers
from .models import Portfolio, Holding

class HoldingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Holding
        fields = ["type", "name", "amount"]

class PortfolioSerializer(serializers.ModelSerializer):
    holdings = HoldingSerializer(many=True)

    class Meta:
        model = Portfolio
        fields = ["id", "name", "created_at", "holdings"]