const { query } = require('express');
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('database.db');

db.run(`
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    price INTEGER NOT NULL
)`
)

exports.getAllData = function(callback){
    const query = "SELECT * FROM products"
    db.all(query,function(error, products){
        callback(error,products)
    })
}

exports.uploadProduct = function(name, description, Filename, price, callback){
    const query = "INSERT INTO products('name', 'description', 'image', 'price') VALUES (?,?,?,?)"
    const values =  [name, description, Filename, price]
    db.run(query,values, function(error){
        callback(error, this.lastID)
    })
}

exports.getDataById = function(id, callback){

	const query = "SELECT * FROM products WHERE id = ? LIMIT 1"
    const values = [id]
	db.get(query, values, function(error, products){
		callback(error, products)
	})
}

exports.deleteDataById = function(id, callback){
    const query = "DELETE FROM products WHERE id = ?"
    const values = [id]
    db.get(query,values,function(error){
        callback(error)
    })
}

exports.updateProduct = function(name, description, price, id, callback){
    const query = 'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?'
    const updatedValues = [name, description, price, id]
    db.run(query, updatedValues, (error)=> {
        callback(error)
    })
}
