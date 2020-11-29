from sql_connection import get_sql_connection
from datetime import datetime


def insert_order (connection, order):
    cursor = connection.cursor()

    order_query = ("INSERT INTO grocery_store.orders (customer_name, total, date) VALUES (%s,%s,%s)")
    order_data = (order['customer_name'], order['grand_total'], datetime.now())
    cursor.execute(order_query, order_data)

    order_id = cursor.lastrowid

    # for detail in orders['orderdetails']:
    #     query = ("INSERT INTO grocery_store.order_details (idorder, idproducts, quantity, total_price) VALUES (%s,%s,%s,%s)")
    #     data = (order_id, detail['idproducts'], detail['quantity'], detail['total_price'])
    #     cursor.execute(query, data)
    #
    # connection.commit()

    details_query = query = ("INSERT INTO grocery_store.order_details (idorder, idproducts, quantity, total_price) VALUES (%s,%s,%s,%s)")
    details = []

    for detail in order['order_details']:
        details.append([
            order_id,
            int(detail['idproducts']),
            float(detail['quantity']),
            float(detail['total_price'])
        ])

    cursor.executemany(details_query, details)
    connection.commit()

    return order_id


def get_all_orders(connection):
    cursor = connection.cursor()
    query = ("SELECT * FROM grocery_store.orders")
    cursor.execute(query)

    response = []
    for (idorders, customer_name, total, date) in cursor:
        response.append({
            'idorders': idorders,
            'customer_name': customer_name,
            'total': total,
            'date': date
        })

    return response


def get_order_details(connection, orderid):
    cursor = connection.cursor()
    query = ('''SELECT d.idproducts, p.name, p.price_per_unit, d.quantity, d.total_price 
            FROM grocery_store.order_details d, grocery_store.products p
            WHERE d.idproducts = p.idproducts AND
            idorder=''' + str(orderid))
    cursor.execute(query)

    response = []

    for (idproducts, name, price_per_unit, quantity, total_price) in cursor:
        response.append({
            'idproducts': idproducts,
            'name': name,
            'price_per_unit': price_per_unit,
            'quantity': quantity,
            'total_price': total_price
        })

    return response


if __name__ == '__main__':
    connection = get_sql_connection()
    print(get_order_details(connection, 3))

    # insert_order(connection, {
    #     'customer_name': 'Adri',
    #     'grand_total': '500',
    #     'order_details': [
    #         {
    #             'idproducts': 1,
    #             'quantity': 2,
    #             'total_price': 50
    #         },
    #         {
    #             'idproducts': 2,
    #             'quantity': 1,
    #             'total_price': 80
    #         }
    #     ]
    # })