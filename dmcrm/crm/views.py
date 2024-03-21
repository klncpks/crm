import csv
import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from collections import defaultdict
from operator import itemgetter
import pandas as pd

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
    try:
        json_data = json.dumps({'status': 'success', 'data': products_data})
        return JsonResponse(json.loads(json_data))
    except FileNotFoundError:
        return JsonResponse({'status': 'error', 'message': 'File not found'}, status=404)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    
def productsTop5(request):
    try:
        # Specify the path to the CSV files
        purchase_history_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/purchase_history.csv'
        products_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/products.csv'

        # Read purchase history CSV file
        purchase_data = defaultdict(lambda: {'total_quantity': 0, 'total_revenue': 0})
        with open(purchase_history_path, 'r', encoding='utf-8') as purchase_file:
            purchase_reader = csv.DictReader(purchase_file)
            for row in purchase_reader:
                product_id = row['Product ID']
                quantity = int(row['Quantity'])
                total_amount = float(row['Total amount'])
                purchase_data[product_id]['total_quantity'] += quantity
                purchase_data[product_id]['total_revenue'] += total_amount

        # Read products CSV file
        products = {}
        with open(products_path, 'r', encoding='utf-8') as products_file:
            products_reader = csv.DictReader(products_file)
            for row in products_reader:
                product_id = row['Product ID']
                product_name = row['Product Name']
                products[product_id] = product_name

        # Sort products by total quantity sold
        top5_products = sorted(purchase_data.items(), key=lambda x: x[1]['total_quantity'], reverse=True)[:5]

        # Format data for JSON response with rounded total revenue
        top5_data = [{'product_name': products[product_id], 'total_sold_units': data['total_quantity'], 'total_revenue': round(data['total_revenue'], 2)} for product_id, data in top5_products]

        return JsonResponse({'status': 'success', 'data': top5_data})

    except FileNotFoundError:
        return JsonResponse({'status': 'error', 'message': 'File not found'}, status=404)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    

def leastPurchased(request):
    try:
        products_df = pd.read_csv("C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/products.csv")
        purchase_history_df = pd.read_csv("C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/purchase_history.csv")

        # Merge datasets on Product ID
        merged_df = pd.merge(purchase_history_df, products_df, on="Product ID", how="left")

        # Aggregate sales data to calculate units sold and revenue generated for each product
        product_sales = merged_df.groupby(['Product ID', 'Product Name', 'Product Cost'])[['Quantity', 'Total amount']].sum().reset_index()

        # Sort products based on units sold
        sorted_products = product_sales.sort_values(by='Quantity', ascending=True).head(5)

        # Convert to JSON
        json_data = sorted_products.to_dict(orient='records')

        # Add ranking
        for idx, item in enumerate(json_data):
            item['Ranking'] = idx + 1

        # Convert to JSON with required attributes
        json_result = []
        for item in json_data:
            json_result.append({
                "product_name": item["Product Name"],
                "total_sold_units": int(item["Quantity"]),
                "total_revenue": round(item["Total amount"], 2)
            })
        return JsonResponse({'status': 'success', 'data': json_result})

    except FileNotFoundError:
        return JsonResponse({'status': 'error', 'message': 'File not found'}, status=404)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

def topRevenue(request):
    try:
    # Load datasets
        products_df = pd.read_csv("C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/products.csv")
        purchase_history_df = pd.read_csv("C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/purchase_history.csv")

        # Merge datasets on Product ID
        merged_df = pd.merge(purchase_history_df, products_df, on="Product ID", how="left")

        # Aggregate sales data to calculate revenue generated for each product
        product_revenue = merged_df.groupby(['Product ID', 'Product Name', 'Product Cost']).agg({'Quantity': 'sum', 'Total amount': 'sum'}).reset_index()

        # Calculate revenue generated per product
        product_revenue['Revenue Generated'] = product_revenue['Quantity'] * product_revenue['Product Cost']

        # Sort products based on revenue generated
        top_product = product_revenue.sort_values(by='Revenue Generated', ascending=False).head(1)

        # Convert to JSON
        json_data = top_product.to_dict(orient='records')

        # Prepare JSON response with required attributes
        json_result = []
        for item in json_data:
            json_result.append({
                "product_name": item["Product Name"],
                "total_sold_units": int(item["Quantity"]),
                "total_revenue": round(item["Revenue Generated"], 2)
            })
        return JsonResponse({'status': 'success', 'data': json_result})
    except FileNotFoundError:
        return JsonResponse({'status': 'error', 'message': 'File not found'}, status=404)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

def leastRevenue(request):
    try:
        products_df = pd.read_csv("C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/products.csv")
        purchase_history_df = pd.read_csv("C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/purchase_history.csv")

        # Merge datasets on Product ID
        merged_df = pd.merge(purchase_history_df, products_df, on="Product ID", how="left")

        # Aggregate sales data to calculate revenue generated for each product
        product_revenue = merged_df.groupby(['Product ID', 'Product Name', 'Product Cost']).agg({'Quantity': 'sum', 'Total amount': 'sum'}).reset_index()

        # Calculate revenue generated per product
        product_revenue['Revenue Generated'] = product_revenue['Quantity'] * product_revenue['Product Cost']

        # Sort products based on revenue generated
        least_product = product_revenue.sort_values(by='Revenue Generated', ascending=True).head(1)

        # Convert to JSON
        json_data = least_product.to_dict(orient='records')

        # Prepare JSON response with required attributes
        json_result = []
        for item in json_data:
            json_result.append({
                "product_name": item["Product Name"],
                "total_sold_units": int(item["Quantity"]),
                "total_revenue": round(item["Revenue Generated"], 2)
            })
        return JsonResponse({'status': 'success', 'data': json_result})
    except FileNotFoundError:
        return JsonResponse({'status': 'error', 'message': 'File not found'}, status=404)

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