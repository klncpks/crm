import csv
import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from collections import defaultdict
from operator import itemgetter
import pandas as pd
from .products import productsTop5, leastPurchased, topRevenue

# Load products data
products_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/products.csv'
with open(products_file_path, 'r', encoding='utf-8') as products_file:
    products_data = list(csv.DictReader(products_file))

# Load purchase history data
purchase_history_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/purchase_history.csv'
with open(purchase_history_file_path, 'r', encoding='utf-8') as purchase_history_file:
    purchase_history_data = list(csv.DictReader(purchase_history_file))

# Load customer information data
customer_info_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/customer_information.csv'
with open(customer_info_file_path, 'r', encoding='utf-8') as customer_info_file:
    customer_info_data = list(csv.DictReader(customer_info_file))

def home(request):
    try:
        json_data = json.dumps({'status': 'success', 'data': customer_info_data})
        return JsonResponse(json.loads(json_data))
    except FileNotFoundError:
        return JsonResponse({'status': 'error', 'message': 'File not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

def products(request):
    result = products_json()
    try:
        json_data = json.dumps({'status':'success', 'data': result})
        return JsonResponse(json.loads(json_data))
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
def productsTop5(request):
    result = productsTop5()
    try:
        json_data = json.dumps({'status':'success', 'data': result})
        return JsonResponse(json.loads(json_data))
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

def leastPurchased(request):
    result = leastPurchased()
    try:
        json_data = json.dumps({'status':'success', 'data': result})
        return JsonResponse(json.loads(json_data))
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

def topRevenue(request):
    result = topRevenue()
    try:
        json_data = json.dumps({'status':'success', 'data': result})
        return JsonResponse(json.loads(json_data))
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
def leastRevenue(request):
    result = leastPurchased()
    try:
        json_data = json.dumps({'status':'success', 'data': result})
        return JsonResponse(json.loads(json_data))
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
def extractList(request, filter_type):
    try:
        # Check if the requested attribute is valid
        valid_attributes = products_data[0].keys()
        if filter_type not in valid_attributes:
            return JsonResponse({'status': 'error', 'message': 'Invalid attribute'}, status=400)

        # Extract unique values for the requested attribute
        unique_values = set(product[filter_type] for product in products_data)

        # Convert the set of unique values to a list
        unique_values_list = list(unique_values)

        return JsonResponse({'status': 'success', 'data': unique_values_list})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)