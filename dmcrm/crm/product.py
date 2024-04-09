import csv
from django.http import JsonResponse

products_file_path = r'C:\Users\Akash Reddy\OneDrive\Documents\GitHub\crm\dmcrm\datasets\products.csv'
feedback_file_path = r'C:\Users\Akash Reddy\OneDrive\Documents\GitHub\crm\dmcrm\datasets\feedback.csv'
purchases_file_path = r'C:\Users\Akash Reddy\OneDrive\Documents\GitHub\crm\dmcrm\datasets\purchase_history.csv'


# Function to load data from a CSV file
def load_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return list(csv.DictReader(file))

# Load products data
products_data = load_data(products_file_path)
feedback_data = load_data(feedback_file_path)
purchases_data = load_data(purchases_file_path)

# Function to get product details by ID
def productDetails(product_id):
    try:
        # Find the product with the given ID
        product = next((p for p in products_data if p['ProductID'] == product_id), None)
        if product:
            return {'status': 'success', 'data': product}
        else:
            return {'status': 'error', 'message': 'Product not found'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

def allPurchases(product_id):
    try:
        # Filter purchases data to get purchases of the specified product ID
        product_purchases = [purchase for purchase in purchases_data if purchase['ProductID'] == product_id]

        if product_purchases:
            return {'status': 'success', 'data': product_purchases}
        else:
            return {'status': 'error', 'message': 'No purchases found for the product'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

def feedback(product_id):
    try:
        # Get all transaction IDs for the specified product
        product_transactions = [purchase['TransactionID'] for purchase in purchases_data if purchase['ProductID'] == product_id]

        # Filter feedback data based on the transaction IDs
        product_feedback = [feedback for feedback in feedback_data if feedback['TransactionID'] in product_transactions]

        if product_feedback:
            return {'status': 'success', 'data': product_feedback}
        else:
            return {'status': 'error', 'message': 'No feedback found for the product'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}
