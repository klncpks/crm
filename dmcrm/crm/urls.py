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
    path('products/add/',views.add_product),
    path('purchases/add/',views.add_transaction),
    path('interactions/add/',views.add_interaction),
    path('region/branch',views.extract_branch_regions),
    path('customer/<str:customer_id>/',views.customer_details),
    path('customer/transactions/<str:customer_id>/',views.customer_transactions),
    path('customer/feedback/<str:customer_id>/',views.customer_feedback),
    path('customer/interactions/<str:customer_id>/',views.customer_interactions),
    path('employees/',views.emp_details),
    path('employees/<str:emp_id>/',views.emp_info),
    path('employees/transactions/<str:emp_id>/', views.employee_transactions),
    path('employees/interactions/<str:emp_id>/', views.employee_interactions),
    path('employees/sales/count/', views.emp_sales),
    path('employees/sales/<str:emp_id>/', views.employee_sales),
    path('leads/', views.leads_data),
    path('leads/count/',views.leads_count),
    path('leads/interest/',views.leads_interest),
    path('leads/source/',views.leads_source),
]

