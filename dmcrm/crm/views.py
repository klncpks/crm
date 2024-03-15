import csv
import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from collections import defaultdict
from operator import itemgetter

def home(request):
    try:
    # Specify the path to the CSV file
        csv_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/customer_information.csv'

    # Read the CSV file
        with open(csv_file_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            data = [row for row in csv_reader]

    # Convert CSV data to JSON
        json_data = json.dumps({'status': 'success', 'data': data})

        return JsonResponse(json.loads(json_data))

    except FileNotFoundError:
        return JsonResponse({'status': 'error', 'message': 'File not found'}, status=404)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

def products(request):
    try:
    # Specify the path to the CSV file
        csv_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/products.csv'

    # Read the CSV file
        with open(csv_file_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file)
            data = [row for row in csv_reader]

    # Convert CSV data to JSON
        json_data = json.dumps({'status': 'success', 'data': data})

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
