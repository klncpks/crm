import csv
import os
import random
import string

interactions_path = r'C:\Users\Akash Reddy\OneDrive\Documents\GitHub\crm\dmcrm\datasets\interactions.csv'

def generate_interaction_id():
    try:
        if not os.path.exists(interactions_path):
            # If the file doesn't exist, return the initial ID
            return "000001"

        # Open the CSV file in read mode to find the maximum interaction ID
        with open(interactions_path, 'r', newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            # Extract all existing interaction IDs
            existing_ids = [int(row['InteractionID']) for row in reader if row.get('InteractionID') and row['InteractionID'].isdigit()]
            if existing_ids:
                # Find the maximum interaction ID
                max_id = max(existing_ids)
            else:
                # If no valid IDs found, start from 1
                max_id = 0
            # Generate the next interaction ID by incrementing the maximum ID
            next_id = max_id + 1
            return str(next_id).zfill(6)  # Format the ID to have leading zeros if necessary
    except FileNotFoundError:
        # Handle file not found error
        print("File not found:", interactions_path)
    except Exception as e:
        # Handle any other exceptions
        print("Error:", e)


def add_new_interaction(data):
    try:
        with open(interactions_path, 'a', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=["InteractionID", "CustomerID", "DateofInteraction", "InteractionType", "PurposeofInteraction", "OutcomeofInteraction", "EmployeeID"])
            interaction_id = generate_interaction_id()  # This function generates or retrieves the InteractionID
            print(interaction_id)
            writer.writerow({
                "InteractionID": interaction_id, 
                "CustomerID": data.get("CustomerID", ""), 
                "DateofInteraction": data.get("DateofInteraction", ""),
                "InteractionType": data.get("InteractionType", ""),
                "PurposeofInteraction": data.get("PurposeofInteraction", ""),
                "OutcomeofInteraction": data.get("OutcomeofInteraction", ""),
                "EmployeeID": data.get("EmployeeID", ""),
            })
            return interaction_id
    except Exception as e:
        raise e
