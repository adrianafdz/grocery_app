from sql_connection import get_sql_connection

def get_units(connection):
    cursor = connection.cursor()
    query = ("SELECT * FROM grocery_store.unit")
    cursor.execute(query)

    response = []

    for (idunit, unit_name) in cursor:
        response.append({
            'idunit': idunit,
            'unit_name': unit_name
        })

    return response


if __name__ == '__main__':
    connection = get_sql_connection()