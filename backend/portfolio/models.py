from django.db import models
from django.contrib.auth.models import User

class Portfolio(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

class Holding(models.Model):
    portfolio = models.ForeignKey(Portfolio, related_name="holdings", on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=[("stock", "Stock"), ("crypto", "Crypto"), ("cash", "Cash"), ("other", "Other")])
    name = models.CharField(max_length=50)
    amount = models.FloatField()