import csv
import os
import json

# Define the file path for the purchase history CSV file
purchase_history_path = r'C:\Users\Akash Reddy\OneDrive\Documents\GitHub\crm\dmcrm\datasets\purchase_history.csv'

# Function to generate the next transaction ID
def generate_transaction_id():
    try:
        # Open the CSV file in read mode to find the maximum transaction ID
        with open(purchase_history_path, 'r', newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            # Extract all existing transaction IDs
            existing_ids = [int(row['TransactionID']) for row in reader if row['TransactionID'].strip()]
            if existing_ids:
                # Find the maximum transaction ID
                max_id = max(existing_ids)
                # Generate the next transaction ID by incrementing the maximum ID
                next_id = max_id + 1
            else:
                next_id = 1  # If no existing IDs, start from 1
            return str(next_id)  # Return the next transaction ID
    except FileNotFoundError:
        # Handle file not found error
        print("File not found:", purchase_history_path)
    except Exception as e:
        # Handle any other exceptions
        print("Error:", e)


# Function to add a new transaction to the purchase history CSV file
def add_new_transaction(data):
    try:
        # Open the CSV file in append mode
        with open(purchase_history_path, 'a', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=["TransactionID", "EmployeeID", "CustomerID", "DateofPurchase", "ProductID", "Quantity", "Region", "Branch", "PaymentMode", "TotalAmount"])
            # Write the new transaction data to the CSV file
            transaction_id = generate_transaction_id()  # Generate the next transaction ID
            print(transaction_id)
            writer.writerow({
                "TransactionID": transaction_id, 
                "EmployeeID": data.get("EmployeeID", ""), 
                "CustomerID": data.get("CustomerID", ""), 
                "DateofPurchase": data.get("DateofPurchase", ""), 
                "ProductID": data.get("ProductID", ""), 
                "Quantity": data.get("Quantity", ""), 
                "Region": data.get("Region", ""), 
                "Branch": data.get("Branch", ""), 
                "PaymentMode": data.get("PaymentMode", ""), 
                "TotalAmount": data.get("TotalAmount", "")
            })
            return transaction_id  # Return the generated transaction ID
    except Exception as e:
        # Handle any exceptions that may occur during the file operation
        raise e