from flask import Flask, request, jsonify
import products_dao
import unit_dao
import order_dao
import json
from sql_connection import get_sql_connection

app = Flask(__name__)
connection = get_sql_connection()


@app.route('/getProducts', methods=['GET'])
def get_products():
    products = products_dao.get_all_products(connection)
    response = jsonify(products)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/deleteProduct', methods=['POST'])
def del_product():
    return_id = products_dao.delete_product(connection, request.form['idproducts'])
    response = jsonify({
        'idproducts': return_id
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/getUnits', methods=['GET'])
def get_units():
    units = unit_dao.get_units(connection)
    response = jsonify(units)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/insertProduct', methods=['POST'])
def insert_product():
    request_payload = json.loads(request.form['data'])
    idproducts = products_dao.insert_new_product(connection, request_payload)
    response = jsonify({
        'idproducts': idproducts
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/getProduct', methods=['GET'])
def get_product():
    id = request.args.get('idproducts')
    products = products_dao.get_product(connection, id)
    response = jsonify(products)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/editProduct', methods=['POST'])
def edit_product():
    request_payload = json.loads(request.form['data'])
    idproducts = products_dao.edit_product(connection, request_payload)
    print(idproducts)
    response = jsonify({
        'idproducts': idproducts
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# ORDERS
@app.route('/insertOrder', methods=['POST'])
def insert_order():
    request_payload = json.loads(request.form['data'])
    idorders = order_dao.insert_order(connection, request_payload)
    response = jsonify({
        'idorders': idorders
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/getOrders', methods=['GET'])
def get_orders():
    orders = order_dao.get_all_orders(connection)
    response = jsonify(orders)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/getDetails', methods=['GET'])
def get_details():
    id = request.args.get('oid')
    details = order_dao.get_order_details(connection, id)
    response = jsonify(details)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    print("Starting Python Falsk Server for Grocery Store Mgmt System")
    app.run(port=5000)