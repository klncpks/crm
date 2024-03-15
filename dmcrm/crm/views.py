import csv
import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from collections import defaultdict
from operator import itemgetter
import pandas as pd

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
                "Ranking": item["Ranking"],
                "Product Name": item["Product Name"],
                "Units Sold": int(item["Quantity"]),
                "Revenue Generated": round(item["Total amount"], 2)
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
                "Product Name": item["Product Name"],
                "Units Sold": int(item["Quantity"]),
                "Product Price": item["Product Cost"],
                "Revenue Generated": round(item["Revenue Generated"], 2)
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
                "Product Name": item["Product Name"],
                "Units Sold": int(item["Quantity"]),
                "Product Price": item["Product Cost"],
                "Revenue Generated": round(item["Revenue Generated"], 2)
            })
        return JsonResponse({'status': 'success', 'data': json_result})
    except FileNotFoundError:
        return JsonResponse({'status': 'error', 'message': 'File not found'}, status=404)

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)