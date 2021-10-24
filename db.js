const { query } = require('express');
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('database.db');
const loginDB = new sqlite3.Database('login.db');

db.run(`
CREATE TABLE IF NOT EXISTS blogPosts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL
)`
)

loginDB.run(`
CREATE TABLE IF NOT EXISTS login (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
)`
)

db.run(`
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    blogPostId INTEGER NOT NULL,
    name TEXT NOT NULL,
    comment TEXT NOT NULL
)`
)

exports.getCommentsByPostId = function(blogPostId, callback){
    const query = "SELECT * FROM comments WHERE blogPostId = ?"
    const values = [blogPostId]
	db.all(query, values, function(error, comments){
		callback(error, comments)
	})
}

exports.uploadComment = function(blogPostId, title, comment, callback){
    const query = "INSERT INTO comments('blogPostId', 'name', 'comment') VALUES (?,?,?)"
    const values =  [blogPostId, title, comment]
    db.run(query,values, function(error){
        callback(error, this.lastID)
    })
}

exports.deleteCommentById = function(id, callback){
    const query = "DELETE FROM comments WHERE id = ?"
    const deleteValues = [id]
    db.run(query, deleteValues, (error)=> {
        callback(error)
    })
}

exports.updateComment = function(name, comment, id, callback){
    console.log(name, comment);
    const query = 'UPDATE comments SET name = ?, comment = ? WHERE id = ?'
    const updatedValues = [name, comment, id]
    db.run(query, updatedValues, (error)=> {
        callback(error)
    })
}


exports.getCommentById = function(id, callback){
	const query = "SELECT * FROM comments WHERE id = ? LIMIT 1"
    const values = [id]
	db.get(query, values, function(error, comments){
		callback(error, comments)
	})
}

exports.getLoginData = function(callback){
    const query = "SELECT * FROM login WHERE id = 1"
    loginDB.get(query, function(error, values){
        callback(error, values)
    })
} 

exports.uploadPost = function(title, description, Filename, callback){
    const query = "INSERT INTO blogPosts('title', 'description', 'image') VALUES (?,?,?)"
    const values =  [title, description, Filename]
    db.run(query,values, function(error){
        callback(error, this.lastID)
    })
}

exports.getDataById = function(id, callback){

	const query = "SELECT * FROM blogPosts WHERE id = ? LIMIT 1"
    const values = [id]
	db.get(query, values, function(error, blogPosts){
		callback(error, blogPosts)
	})
}

exports.getAllData = function(callback){
    const query = "SELECT * FROM blogPosts"
    db.all(query,function(error, blogPosts){
        callback(error,blogPosts)
    })
}

exports.deleteDataById = function(id, callback){
    const query = "DELETE FROM blogPosts WHERE id = ?"
    const values = [id]
    db.get(query,values,function(error){
        callback(error)
    })
}

exports.updatePost = function(title, description, id, callback){
    const query = 'UPDATE blogPosts SET title = ?, description = ? WHERE id = ?'
    const updatedValues = [title, description, id]
    db.run(query, updatedValues, (error)=> {
        callback(error)
    })
}

