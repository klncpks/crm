import csv
import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

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