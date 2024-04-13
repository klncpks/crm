import csv
import pandas as pd
from django.http import JsonResponse

# Define file path for products data
products_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/dmcrm/datasets/products.csv'
customers_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/dmcrm/datasets/customer_information.csv'
feedback_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/dmcrm/datasets/feedback.csv'
purchases_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/dmcrm/datasets/purchase_history.csv'
interactions_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/dmcrm/datasets/interactions.csv'

# Function to load data from a CSV file
def load_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return list(csv.DictReader(file))

# Function to reload data from CSV files
def reload_data():
    global products_data, customers_data, feedback_data, purchases_data, interactions_data
    products_data = load_data(products_file_path)
    customers_data = load_data(customers_file_path)
    feedback_data = load_data(feedback_file_path)
    purchases_data = load_data(purchases_file_path)
    interactions_data = load_data(interactions_file_path)

# Load data initially
reload_data()

def customerDetails(customer_id):
    print(customer_id)
    try:
        # Reload customer information from the CSV file
        reload_data()
        
        # Read customer information from the CSV file
        customer_info_df = pd.read_csv(customers_file_path)
        
        # Convert customer_id to the same data type as CustomerID column in the DataFrame
        customer_id = int(customer_id)
        
        # Filter customer information based on the customer ID provided in the URL parameter
        customer_info = customer_info_df[customer_info_df['CustomerID'] == customer_id]
        
        if len(customer_info) > 0:
            # Return the first record of the filtered
            return {'status':'success', 'data': customer_info.iloc[0].to_dict()}
        else:
            return {'status': 'error','message': 'Customer not found'}
    
    except Exception as e:
        return {'status': 'error','message': str(e)}

def get_customer_transactions(customer_id):
    print(customer_id)
    try:
        # Reload data from CSV files
        reload_data()
        
        customer_transactions = []
        for purchase in purchases_data:
            if purchase['CustomerID'] == str(customer_id):
                product_name = next((product['ProductName'] for product in products_data if product['ProductID'] == purchase['ProductID']), None)
                if product_name:
                    transaction = {
                        'product_name': product_name,
                        'date_of_purchase': purchase['DateofPurchase'],
                        'quantity': purchase['Quantity'],
                        'region': purchase['Region'],
                        'payment_mode': purchase['PaymentMode'],
                        'total_amount': purchase['TotalAmount']
                    }
                    customer_transactions.append(transaction)
        if customer_transactions:
            return JsonResponse({'status': 'success', 'data': customer_transactions})
        else:
            return JsonResponse({'status': 'success', 'data': [], 'message': 'No transactions found for the customer'})
    
    except Exception as e:
        return {'status': 'error','message': str(e)}

def get_customer_feedback(customer_id):
    print(customer_id)
    try:
        # Reload data from CSV files
        reload_data()
        
        customer_feedback = []
        for feedback in feedback_data:
            if feedback['CustomerID'] == str(customer_id):
                feedback_entry = {
                    'rating': feedback['Rating'],
                    'comments': feedback['Comments']
                }
                customer_feedback.append(feedback_entry)
        if customer_feedback:
            return JsonResponse({'status': 'success', 'data': customer_feedback})
        else:
            return JsonResponse({'status': 'success', 'data': [], 'message': 'No feedback found for the customer'})
    
    except Exception as e:
        return {'status': 'error','message': str(e)}
    
def get_customer_interactions(customer_id):
    print(customer_id)
    try:
        # Reload data from CSV files
        reload_data()
        
        customer_interactions = []
        for interaction in interactions_data:
            if interaction['CustomerID'] == str(customer_id):
                interaction_entry = {
                    'date_of_interaction': interaction['DateofInteraction'],
                    'interaction_type': interaction['InteractionType'],
                    'purpose': interaction['PurposeofInteraction'],
                    'outcome': interaction['OutcomeofInteraction']
                }
                customer_interactions.append(interaction_entry)
        if customer_interactions:
            return JsonResponse({'status': 'success', 'data': customer_interactions})
        else:
            return JsonResponse({'status': 'success', 'data': [], 'message': 'No interactions found for the customer'})
    
    except Exception as e:
        return {'status': 'error','message': str(e)}
