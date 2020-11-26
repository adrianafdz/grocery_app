from sql_connection import get_sql_connection


def get_all_products(connection):
    cursor = connection.cursor()
    query = '''SELECT p.idproducts, p.name, p.idunit, u.unit_name, p.price_per_unit FROM grocery_store.products p
    JOIN grocery_store.unit u
    ON u.idunit = p.idunit'''
    cursor.execute(query)

    response = []

    for (idproducts, name, idunit, unit_name, price_per_unit) in cursor:
        response.append({
            "idproducts": idproducts,
            "name": name,
            "idunit": idunit,
            "unit_name": unit_name,
            "price_per_unit": price_per_unit
        })

    return response


def get_product(connection, idproduct):
    cursor = connection.cursor()
    query = ("SELECT * FROM grocery_store.products WHERE idproducts=" + str(idproduct))
    cursor.execute(query)
    result = cursor.fetchone()
    response = [{
        "idproducts": result[0],
        "name": result[1],
        "idunit": result[2],
        "price_per_unit": result[3]
    }]

    return response


def insert_new_product(connection, product):
    cursor = connection.cursor()
    query = ("INSERT INTO products "
             "(name, idunit, price_per_unit)"
             "VALUES (%s, %s, %s)")
    data = (product['name'], product['idunit'], product['price_per_unit'])

    cursor.execute(query, data)
    connection.commit()

    return cursor.lastrowid


def delete_product(connection, idproduct):
    cursor = connection.cursor()
    query = ("DELETE FROM grocery_store.products WHERE idproducts=" + str(idproduct))
    cursor.execute(query)
    connection.commit()
    return cursor.lastrowid


def edit_product(connection, product):
    cursor = connection.cursor()
    query = ("UPDATE grocery_store.products SET name = %s, idunit = %s, price_per_unit = %s WHERE idproducts = %s")
    data = (product['name'], product['idunit'], product['price_per_unit'], product['idproduct'])
    cursor.execute(query, data)
    connection.commit()
    return cursor.lastrowid


if __name__ == '__main__':
    connection = get_sql_connection()
    # print(get_all_products(connection))
    # delete_product(connection, 12)

    get_product(connection, 1)
