const pool = require('../config/db');

const create = async (req, res, next) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({
            error: "Name and email are required"
        })
    }

    try {
        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err); // chuyển lỗi sang errorHandler
    }
};

const getAll = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

const getOne = async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

const update = async (req, res, next) => {
    const { name, email } = req.body;
    if (!name && !email) {
        return res.status(400).json({
            error: "Name or email is required"
        })
    }
    try {
        const result = await pool.query(
            `UPDATE users 
             SET name = COALESCE($1, name), 
                 email = COALESCE($2, email) 
             WHERE id = $3 
             RETURNING *`,
            [name || null, email || null, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

const remove = async (req, res, next) => {
    try {
        const result = await pool.query(
            'DELETE FROM users WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: 'User deleted successfully', user: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAll, getOne, create, update, remove };