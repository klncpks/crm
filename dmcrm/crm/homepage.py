import pandas as pd
import collections
import csv
from django.http import JsonResponse
import json

employee_data_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/dmcrm/datasets/employee_data.csv'
products_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/dmcrm/datasets/products.csv'
customers_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/dmcrm/datasets/customer_information.csv'
feedback_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/dmcrm/datasets/feedback.csv'
purchases_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/dmcrm/datasets/purchase_history.csv'
interactions_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/dmcrm/datasets/interactions.csv'

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

def employee_information():
    employee_info_df = pd.read_csv(employee_data_path)
    employee_info_df.columns = ["employee_id", "employee_name", "phone_number", "email", "password"]
    
    result_json = employee_info_df.to_dict(orient='records')
    
    emp_result = []
    
    for item in result_json:
        emp_result.append({
            "employee_id": item["employee_id"],
            "employee_name": item["employee_name"],
            "phone_number": item["phone_number"],
            "email": item["email"],
            "password": item["password"]
        })
    return emp_result

def get_employee_data(employee_id):
    try:
        df = pd.read_csv(employee_data_path)
        employee = df[df['EmployeeID'] == int(employee_id)]

        if not employee.empty:
            employee_data = {
                'employee_id': int(employee['EmployeeID']),
                'employee_name': employee['EmployeeName'].values[0],
                'phone_number': int(employee['PhoneNumber']),
                'email': employee['Email'].values[0],
                'password': employee['Password'].values[0]
            }
            return JsonResponse({'status': 'success', 'data': employee_data})
        else:
            return JsonResponse({'status': 'error', 'message': 'Employee not found'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})
    
def get_employee_transactions(employee_id):
    try:
        df = pd.read_csv(purchases_file_path)
        employee_transactions = df[df['EmployeeID'] == int(employee_id)]
        if not employee_transactions.empty:
            transactions_data = []
            for _, transaction in employee_transactions.iterrows():
                transaction_data = {
                    'customer_id': int(transaction['CustomerID']),
                    'product_name': transaction['ProductID'],
                    'date_of_purchase': transaction['DateofPurchase'],
                    'quantity': int(transaction['Quantity']),
                    'region': transaction['Region'],
                    'payment_mode': transaction['PaymentMode'],
                    'total_amount': float(transaction['TotalAmount'])
                }
                transactions_data.append(transaction_data)
            return JsonResponse({'status': 'success', 'data': transactions_data})
        else:
            return JsonResponse({'status': 'error', 'message': 'No transactions found for the employee'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})
    
def get_employee_interactions(employee_id):
    try:
        reload_data()
        # Read the CSV file into a pandas DataFrame
        df = pd.read_csv(interactions_file_path)

        # Filter interactions related to the given employee_id
        employee_interactions = df[df['EmployeeID'] == int(employee_id)]

        if not employee_interactions.empty:
            # Initialize a list to store interaction data
            interactions_data = []

            # Iterate over the filtered interactions
            for _, interaction in employee_interactions.iterrows():
                # Construct interaction data dictionary
                interaction_data = {
                    'customer_id': int(interaction['CustomerID']),
                    'date_of_interaction': interaction['DateofInteraction'],
                    'interaction_type': interaction['InteractionType'],
                    'purpose': interaction['PurposeofInteraction'],
                    'outcome': interaction['OutcomeofInteraction']
                }
                # Append interaction data to the list
                interactions_data.append(interaction_data)

            # Return JSON response with status code and data attribute
            return JsonResponse({'status': 'success', 'data': interactions_data})
        else:
            # If no interactions found for the employee_id, return JSON response with status code and error message
            return JsonResponse({'status': 'error', 'message': 'No interactions found for the employee'})
    except Exception as e:
        # If an error occurs, return JSON response with status code and error message
        return JsonResponse({'status': 'error', 'message': str(e)})
    
def sales_count_yearly():
    try:
        df = pd.read_csv(purchases_file_path)
        df['DateofPurchase'] = pd.to_datetime(df['DateofPurchase'], format='%d-%m-%Y', errors='coerce')
        
        # Filter out rows with NaT values (invalid dates)
        df = df.dropna(subset=['DateofPurchase'])
        
        # Extract year from the DateofPurchase column
        df['Year'] = df['DateofPurchase'].dt.year
        
        # Count the number of rows for each year
        sales_by_year = df['Year'].value_counts().reset_index()
        sales_by_year.columns = ['year', 'no_of_sales']
        
        # Sort the DataFrame by the "year" column in ascending order
        sales_by_year = sales_by_year.sort_values(by='year')
        
        return sales_by_year.to_dict(orient='records')
    except Exception as e:
        return {'status': 'error', 'message': str(e)}
    
def sales_count_yearly_by_employee(employee_id):
    try:
        df = pd.read_csv(purchases_file_path)
        employee_sales = df[df['EmployeeID'] == int(employee_id)]
        employee_sales['DateofPurchase'] = pd.to_datetime(employee_sales['DateofPurchase'], format='%d-%m-%Y', errors='coerce')
        employee_sales = employee_sales.dropna(subset=['DateofPurchase'])
        employee_sales['Year'] = employee_sales['DateofPurchase'].dt.year
        sales_by_year = employee_sales['Year'].value_counts().reset_index()
        sales_by_year.columns = ['year', 'no_of_sales']
        sales_by_year = sales_by_year.sort_values(by='year')
        result_json = sales_by_year.to_dict(orient='records')

        return JsonResponse({'status': 'success', 'data': result_json})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})