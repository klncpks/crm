import pandas as pd
import collections
import csv
from django.http import JsonResponse
import json

crm_leads_file_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/dmcrm/datasets/crm_leads.csv'

def get_leads_data():
    try:
        # Read the CSV file
        df = pd.read_csv(crm_leads_file_path)

        # Convert DataFrame to JSON without escaping
        json_response = df.to_dict(orient="records")

        lead_result = []

        for lead in json_response:
            lead_result.append({
                "LeadID": lead["LeadID"],
                "CustomerName": lead["CustomerName"],
                "PhoneNumber": lead["PhoneNumber"],
                "Email": lead["Email"],
                "LeadSource": lead["LeadSource"],
                "Status": lead["Status"],
                "Outcome": lead["Outcome"]
            })

        return lead_result

    except Exception as e:
        return {'status': 'error', 'message': str(e)}

def get_leads_count():
    try:
        df = pd.read_csv(crm_leads_file_path)
        desired_status_values = ['New Lead', 'Contacted', 'Follow-up', 'Interested']
        filtered_df = df[df['Status'].isin(desired_status_values)]
        lead_source_counts = filtered_df['Status'].value_counts().to_dict()
        json_response = [{"status": key, "no_of_leads": value} for key, value in lead_source_counts.items()]
        return json_response

    except Exception as e:
        return {'status': 'error', 'message': str(e)}
    
def get_interest_data():
    try:
        df = pd.read_csv(crm_leads_file_path)
        interested_statement = "The customer is interested in becoming one."
        not_interested_statement = "The customer is not interested."
        interested_count = df[df['Outcome'] == interested_statement].shape[0]
        not_interested_count = df[df['Outcome'] == not_interested_statement].shape[0]
        ongoing_count = len(df) - interested_count - not_interested_count
        json_response = [
            {"lead_outcome": "Interested", "no_of_leads": interested_count},
            {"lead_outcome": "Not Interested", "no_of_leads": not_interested_count},
            {"lead_outcome": "Ongoing", "no_of_leads": ongoing_count}
        ]
        return json_response

    except Exception as e:
        return {'status': 'error', 'message': str(e)}

def get_leads_source_data():
    try:
        df = pd.read_csv(crm_leads_file_path)
        lead_source_counts = df['LeadSource'].value_counts().reset_index()
        lead_source_counts.columns = ['lead_source', 'no_of_leads']
        json_response = lead_source_counts.to_dict(orient='records')
        return json_response

    except Exception as e:
        return {'status': 'error', 'message': str(e)}