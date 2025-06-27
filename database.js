import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE,
}).promise()

export const getNotes = async () =>{
	const [rows] = await pool.query("SELECT * FROM notes");
	return rows;
}

// dont allow untrusted data as input to SQL queries
export const getNote = async (id) => {
	const [rows] =  await pool.query(`
		SELECT *
		FROM notes
		WHERE id = ?
		`, [id]);
	return rows[0];
}

export const createNote = async (title, contents) => {
	const [result] = await pool.query(`
		INSERT INTO notes (title, contents)
		VALUES (?, ?)
	`, [title, contents]);
	const id = result.insertId;
	return await getNote(id);
}

// export const myNote = await createNote("My Note", "This is the content of my note.");
// console.log(myNote);