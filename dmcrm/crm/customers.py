import collections
import csv
import pandas as pd

purchase_history_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/purchase_history.csv'
customer_information_path = r'C:/Users/Akash Reddy/OneDrive/Documents/GitHub/crm/datasets/customer_information.csv'

def top5Cust():
    # Read the purchase history and customer information datasets
    purchase_history_df = pd.read_csv(purchase_history_path)
    customer_info_df = pd.read_csv(customer_information_path)
    
    # Merge datasets to get Customer Name
    customer_id_to_name = dict(zip(customer_info_df['Customer ID'], customer_info_df['Name']))
    purchase_history_df = pd.merge(purchase_history_df, customer_info_df, left_on='CustomerID', right_on='Customer ID')
    
    # Group by Customer ID and count occurrences
    customer_purchases = purchase_history_df['CustomerID'].value_counts().reset_index()
    customer_purchases.columns = ['CustomerID', 'no_of_purchases']
    
    # Get top 5 customers by number of purchases
    top_5_customers = customer_purchases.head(5)
    
    # Calculate total revenue for each customer
    total_revenue = purchase_history_df.groupby('CustomerID')['TotalAmount'].sum().reset_index()
    total_revenue.columns = ['CustomerID', 'total_revenue']

    # Round the total revenue
    total_revenue['total_revenue'] = total_revenue['total_revenue'].apply(lambda x: round(x, 2))
    
    # Merge total revenue with top 5 customers
    top_5_customers = pd.merge(top_5_customers, total_revenue, on='CustomerID')
    
    # Replace Customer IDs with Customer Names using the dictionary
    top_5_customers['customer_name'] = top_5_customers['CustomerID'].map(customer_id_to_name)
    
    # Select only required columns
    top_5_customers = top_5_customers[['customer_name', 'no_of_purchases', 'total_revenue']]
    
    result = top_5_customers.to_dict(orient='records')
    
    result_json = []
    
    for item in result:
        result_json.append({
            "customer_name": item["customer_name"],
            "no_of_purchases": item["no_of_purchases"],
            "total_revenue": item["total_revenue"]
        })
    return result_json

def customer_information():
    customer_info_df = pd.read_csv(customer_information_path)
    customer_info_df.columns = ["customer_id", "customer_name", "email", "phone_number", "address", "age", "gender"]
    
    result_json = customer_info_df.to_dict(orient='records')
    
    cust_result = []
    
    for item in result_json:
        cust_result.append({
            "customer_id": item["customer_id"],
            "customer_name": item["customer_name"],
            "email": item["email"],
            "phone_number": item["phone_number"],
            "address": item["address"],
            "age": item["age"],
            "gender": item["gender"]
        })
    return cust_result

def cust_count_yearly():
    customers_by_year = collections.defaultdict(set)

    with open(purchase_history_path, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            year = row['DateofPurchase'].split('-')[2]
            customer_id = row['CustomerID']
            customers_by_year[year].add(customer_id)

    customers_count_by_year = {year: len(customers) for year, customers in customers_by_year.items()}
    
    result_json = [{'year': year, 'no_of_customers': count} for year, count in customers_count_by_year.items()]
    
    return result_json

def customers_table():
    purchase_df = pd.read_csv(purchase_history_path)
    customer_df = pd.read_csv(customer_information_path)
    customer_stats = purchase_df.groupby('CustomerID').agg(
        no_of_visits=('TransactionID', 'count'),
        total_revenue=('TotalAmount', lambda x: round(x.sum(), 2))  
    ).reset_index()
    customer_stats['customer_name'] = customer_stats['CustomerID'].apply(lambda x: customer_df[customer_df['Customer ID'] == x]['Name'].values[0] if len(customer_df[customer_df['Customer ID'] == x]['Name'].values) > 0 else None)
    customer_stats.rename(columns={'CustomerID': 'customer_id'}, inplace=True)
    json_response = customer_stats[['customer_id', 'customer_name', 'no_of_visits', 'total_revenue']].to_dict(orient='records')
    return json_response