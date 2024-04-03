import csv
import json
from django.http import JsonResponse
from .products import products_json, products_Top5, least_Purchased, top_Revenue
from .customers import top5Cust, customer_information, cust_count_yearly
from .product import productDetails,allPurchases,feedback

# Define file paths
products_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/products.csv'
purchase_history_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/purchase_history.csv'
customer_info_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/customer_information.csv'

# Function to load data from a CSV file
def load_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return list(csv.DictReader(file))

# Load data
products_data = load_data(products_file_path)
purchase_history_data = load_data(purchase_history_file_path)
customer_info_data = load_data(customer_info_file_path)

# Function to handle JsonResponse and error handling
def handle_request(request, data_func):
    try:
        result = data_func()
        json_data = json.dumps({'status': 'success', 'data': result})
        return JsonResponse(json.loads(json_data))
    except FileNotFoundError:
        return JsonResponse({'status': 'error', 'message': 'File not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

# Define views
def home(request):
    return handle_request(request, lambda: customer_info_data)

def products(request):
    return handle_request(request, products_json)

def productsTop5(request):
    return handle_request(request, products_Top5)

def leastPurchased(request):
    return handle_request(request, least_Purchased)

def topRevenue(request):
    return handle_request(request, top_Revenue)

def leastRevenue(request):
    return handle_request(request, least_Purchased)

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

def customers(request):
    return handle_request(request, customer_information)

def top5Customers(request):
    return handle_request(request, top5Cust)

def customer_count_yearly(request):
    return handle_request(request, cust_count_yearly)

def extractList_customers(request, filter_type):
    try:
        # Check if the requested attribute is valid
        valid_attributes = customer_info_data[0].keys()
        if filter_type not in valid_attributes:
            return JsonResponse({'status': 'error', 'message': 'Invalid attribute'}, status=400)

        # Extract unique values for the requested attribute
        unique_values = set(customer[filter_type] for customer in customer_info_data)

        # Convert the set of unique values to a list
        unique_values_list = list(unique_values)

        return JsonResponse({'status': 'success', 'data': unique_values_list})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
def product_details(request, product_id):
    result = productDetails(product_id)
    if result['status'] == 'success':
        return JsonResponse(result)
    else:
        return JsonResponse(result, status=404)
def product_purchases(request, product_id):
    result = allPurchases(product_id)
    if result['status'] == 'success':
            return  JsonResponse(result)
    else:
        return JsonResponse(result, status=404)
def product_feedback(request, product_id):
    result = feedback(product_id)
    if result['status'] == 'success':
            return  JsonResponse(result)
    else:
        return JsonResponse(result, status=404)
def extractProductIDsAndNames(request):
    try:
        # Extract unique product IDs and names
        unique_products = [{'product_id': product['ProductID'], 'product_name': product['ProductName']} for product in products_data]

        return JsonResponse({'status': 'success', 'data': unique_products})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


