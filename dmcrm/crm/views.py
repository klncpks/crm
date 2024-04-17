import csv
import json
from django.http import JsonResponse
from .products import products_json, products_Top5, least_Purchased, top_Revenue, add_new_product
from .customers import top5Cust, customer_information, cust_count_yearly, customers_table, add_new_customer
from .customer import customerDetails, get_customer_interactions, get_customer_transactions, get_customer_feedback
from .product import productDetails, allPurchases, feedback
from .transaction import add_new_transaction
from .interactions import add_new_interaction
from .homepage import employee_information, get_employee_data, get_employee_transactions, get_employee_interactions
from .homepage import sales_count_yearly, sales_count_yearly_by_employee
from .crm import get_leads_count, get_interest_data, get_leads_data, get_leads_source_data
import os

# Define file paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
products_file_path = os.path.join(BASE_DIR, 'datasets', 'products.csv')
purchase_history_file_path = os.path.join(BASE_DIR, 'datasets', 'purchase_history.csv')
customer_info_file_path = os.path.join(BASE_DIR, 'datasets', 'customer_information.csv')


def generate_transaction_id():
    try:
        # Open the CSV file in read mode to find the maximum transaction ID
        with open(purchase_history_file_path, 'r', newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            # Extract all existing transaction IDs
            existing_ids = [int(row['TransactionID']) for row in reader]
            # Find the maximum transaction ID
            max_id = max(existing_ids)
            # Generate the next transaction ID by incrementing the maximum ID
            next_id = max_id + 1
            return str(next_id).zfill(6)  # Format the ID to have leading zeros if necessary
    except FileNotFoundError:
        # Handle file not found error
        print("File not found:", purchase_history_file_path)
    except Exception as e:
        # Handle any other exceptions
        print("Error:", e)

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

def customer_table(request):
    result = customers_table()
    try:
        json_data = json.dumps({'status':'success', 'data': result})
        return JsonResponse(json.loads(json_data))
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

def add_customer(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))  # Parse JSON data from request body
            customer_id = add_new_customer(data)
            json_data = json.dumps({'status': 'success', 'data': {'CustomerID': customer_id}})
            print(json_data)
            return JsonResponse(json.loads(json_data))
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

def add_product(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))  # Parse JSON data from request body
            product_id = add_new_product(data)
            json_data = json.dumps({'status': 'success', 'data': {'ProductID': product_id}})
            return JsonResponse(json.loads(json_data))
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)
            
def add_transaction(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))  # Parse JSON data from request body
            transaction_id = add_new_transaction(data)
            json_data = json.dumps({'status': 'success', 'data': {'TransactionID': transaction_id}})
            return JsonResponse(json.loads(json_data))
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)
def add_interaction(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))  # Parse JSON data from request body
            interaction_id = add_new_interaction(data)
            json_data = json.dumps({'status': 'success', 'data': {'InteractionID': interaction_id}})
            return JsonResponse(json.loads(json_data))
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)
def extract_branch_regions(request):
    # Define the path to the purchase history CSV file
    purchase_history_path = r'C:\Users\Akash Reddy\OneDrive\Documents\GitHub\crm\dmcrm\datasets\purchase_history.csv'

    # Dictionary to store unique regions and their branches
    region_branches = {}

    # Read the CSV file and collect region-branch information
    with open(purchase_history_path, 'r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            region = row['Region']
            branch = row['Branch']
            if region not in region_branches:
                region_branches[region] = set()  # Create a new set for branches under the region
            region_branches[region].add(branch)  # Add the branch to the set of branches under the region

    return JsonResponse({'status':'success'})
def customer_details(request, customer_id):
    result = customerDetails(customer_id)
    if result['status'] == 'success':
        return JsonResponse(result)
    else:
        return JsonResponse(result, status=404)
    
def customer_transactions(request, customer_id):
    result = get_customer_transactions(customer_id)
    if result.status_code == 200:  # Check the status code of the response
        return result
    else:
        return result  # Return the response with the appropriate status code

def customer_feedback(request, customer_id):
    result = get_customer_feedback(customer_id)
    if result.status_code == 200:  # Check the status code of the response
        return result
    else:
        return result  # Return the response with the appropriate status code

def customer_interactions(request, customer_id):
    result = get_customer_interactions(customer_id)
    if result.status_code == 200:  # Check the status code of the response
        return result
    else:
        return result 

def emp_details(request):
    return handle_request(request, employee_information)

def emp_info(request, emp_id):
    result = get_employee_data(emp_id)
    if result.status_code == 200:
        return result
    else:
        return result

def employee_transactions(request, emp_id):
    result = get_employee_transactions(emp_id)
    if result.status_code == 200:  # Check the status code of the response
        return result
    else:
        return result
    
def employee_interactions(request, emp_id):
    result = get_employee_interactions(emp_id)
    if result.status_code == 200:  # Check the status code of the response
        return result
    else:
        return result 
    
def emp_sales(request):
    return handle_request(request, sales_count_yearly)

def employee_sales(request, emp_id):
    result = sales_count_yearly_by_employee(emp_id)
    if result.status_code == 200:
        return result
    else:
        return result
    
def leads_count(request):
    return handle_request(request, get_leads_count)

def leads_interest(request):
    return handle_request(request, get_interest_data)

def leads_data(request):
    return handle_request(request, get_leads_data)

def leads_source(request):
    return handle_request(request, get_leads_source_data)