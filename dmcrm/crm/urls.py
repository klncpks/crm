from django.urls import path   
from .import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('home/',views.home),
    path('products/',views.products),
    path('products/top5/',views.productsTop5),
    path('products/leastPurchased/',views.leastPurchased),
    path('products/topRevenue/',views.topRevenue), 
    path('products/leastRevenue/',views.leastRevenue),
    path('products/<str:filter_type>/', views.extractList),
]

