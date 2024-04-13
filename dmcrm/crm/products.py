import collections
import pandas as pd
import csv
import os

products_path = r'C:\Users\Akash Reddy\OneDrive\Documents\GitHub\crm\dmcrm\datasets\products.csv'
purchase_history_path = r'C:\Users\Akash Reddy\OneDrive\Documents\GitHub\crm\dmcrm\datasets\purchase_history.csv'

def generate_product_id():
    try:
        # Open the CSV file in read mode to find the maximum product ID
        with open(products_path, 'r', newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            # Extract all existing product IDs
            existing_ids = [int(row['ProductID']) for row in reader]
            # Find the maximum product ID
            max_id = max(existing_ids)
            # Generate the next product ID by incrementing the maximum ID
            next_id = max_id + 1
            return str(next_id).zfill(3)  # Format the ID to have leading zeros if necessary
    except FileNotFoundError:
        # Handle file not found error
        print("File not found:", products_path)
    except Exception as e:
        # Handle any other exceptions
        print("Error:", e)

def products_json():
    # Read the CSV file and specify column names
    column_names = ["product_id", "product_name", "product_cost", "product_category"]
    df = pd.read_csv(products_path, names=column_names, header=0)
    
    # Convert DataFrame to JSON
    json_data = df.to_dict(orient='records')

    return json_data

def products_Top5():
    # Read purchase history CSV file
    purchase_data = collections.defaultdict(lambda: {'total_quantity': 0, 'total_revenue': 0})
    with open(purchase_history_path, 'r', encoding='utf-8') as purchase_file:
        purchase_reader = csv.DictReader(purchase_file)
        for row in purchase_reader:
            product_id = row['ProductID']
            quantity = int(row['Quantity']) if row['Quantity'] else 0
            total_amount = float(row['TotalAmount']) if row['TotalAmount'] else 0.0  # Check if TotalAmount is empty
            purchase_data[product_id]['total_quantity'] += quantity
            purchase_data[product_id]['total_revenue'] += total_amount

    # Read products CSV file
    products = {}
    with open(products_path, 'r', encoding='utf-8') as products_file:
        products_reader = csv.DictReader(products_file)
        for row in products_reader:
            product_id = row['ProductID']
            product_name = row['ProductName']
            products[product_id] = product_name

    # Sort products by total quantity sold
    top5_products = sorted(purchase_data.items(), key=lambda x: x[1]['total_quantity'], reverse=True)[:5]

    # Format data for JSON response with rounded total revenue
    top5_data = [{'product_name': products[product_id], 'total_sold_units': data['total_quantity'], 'total_revenue': round(data['total_revenue'], 2)} for product_id, data in top5_products]
    return top5_data

def least_Purchased():
        products_df = pd.read_csv(products_path)
        purchase_history_df = pd.read_csv(purchase_history_path)

        # Merge datasets on Product ID
        merged_df = pd.merge(purchase_history_df, products_df, on="ProductID", how="left")

        # Aggregate sales data to calculate units sold and revenue generated for each product
        product_sales = merged_df.groupby(['ProductID', 'ProductName', 'ProductCost'])[['Quantity', 'TotalAmount']].sum().reset_index()

        # Sort products based on units sold
        sorted_products = product_sales.sort_values(by='Quantity', ascending=True).head(5)

        # Convert to JSON
        json_data = sorted_products.to_dict(orient='records')

        # Add ranking
        for idx, item in enumerate(json_data):
            item['Ranking'] = idx + 1

        # Convert to JSON with required attributes
        lsp_result = []
        for item in json_data:
            lsp_result.append({
                "product_name": item["ProductName"],
                "total_sold_units": int(item["Quantity"]),
                "total_revenue": round(item["TotalAmount"], 2)
            })
        return lsp_result

def top_Revenue():
    # Load datasets
        products_df = pd.read_csv(products_path)
        purchase_history_df = pd.read_csv(purchase_history_path)

        # Merge datasets on Product ID
        merged_df = pd.merge(purchase_history_df, products_df, on="ProductID", how="left")

        # Aggregate sales data to calculate revenue generated for each product
        product_revenue = merged_df.groupby(['ProductID', 'ProductName', 'ProductCost']).agg({'Quantity': 'sum', 'TotalAmount': 'sum'}).reset_index()

        # Calculate revenue generated per product
        product_revenue['Revenue Generated'] = product_revenue['Quantity'] * product_revenue['ProductCost']

        # Sort products based on revenue generated
        top_product = product_revenue.sort_values(by='Revenue Generated', ascending=False).head(1)

        # Convert to JSON
        json_data = top_product.to_dict(orient='records')

        # Prepare JSON response with required attributes
        tpr_result = []
        for item in json_data:
            tpr_result.append({
                "product_name": item["ProductName"],
                "total_sold_units": int(item["Quantity"]),
                "total_revenue": round(item["Revenue Generated"], 2)
            })
        return tpr_result

def least_Revenue():
    products_df = pd.read_csv(products_path)
    purchase_history_df = pd.read_csv(purchase_history_path)

        # Merge datasets on Product ID
    merged_df = pd.merge(purchase_history_df, products_df, on="ProductID", how="left")

    # Aggregate sales data to calculate revenue generated for each product
    product_revenue = merged_df.groupby(['ProductID', 'ProductName', 'ProductCost']).agg({'Quantity': 'sum', 'TotalAmount': 'sum'}).reset_index()

    # Calculate revenue generated per product
    product_revenue['Revenue Generated'] = product_revenue['Quantity'] * product_revenue['ProductCost']

    # Sort products based on revenue generated
    least_product = product_revenue.sort_values(by='Revenue Generated', ascending=True).head(1)

    # Convert to JSON
    json_data = least_product.to_dict(orient='records')

    # Prepare JSON response with required attributes
    ls_result = []
    for item in json_data:
        ls_result.append({
            "product_name": item["ProductName"],
            "total_sold_units": int(item["Quantity"]),
            "total_revenue": round(item["Revenue Generated"], 2)
        })
    return ls_result

def add_new_product(data):
    print(data)
    try:
        with open(products_path, 'a', newline='', encoding='utf-8') as file:
            writer = csv.DictWriter(file, fieldnames=["ProductID", "ProductName", "ProductCost", "ProductCategory"])
            product_id = generate_product_id()  # This function generates or retrieves the ProductID
            writer.writerow({
                "ProductID": product_id, 
                "ProductName": data.get("ProductName", ""), 
                "ProductCost": data.get("ProductCost", ""),
                "ProductCategory": data.get("ProductCategory", "")
            })
            return product_id
    except Exception as e:
        raise e