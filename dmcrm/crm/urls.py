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
    path('customers/',views.customers),
    path('customers/top5/',views.top5Customers),
    path('customers/count/',views.customer_count_yearly),
    path('product/<str:product_id>/', views.product_details),
    path('product/purchases/<str:product_id>/',views.product_purchases),
    path('product/feedback/<str:product_id>/',views.product_feedback),
    path('product/id/name/',views.extractProductIDsAndNames),
    path('customers/table/',views.customer_table),
    path('customers/add/', views.add_customer),
]

