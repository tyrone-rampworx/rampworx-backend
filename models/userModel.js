// models/userModel.js
const client = require('../config/db');

const getAllUsers = async () => {
  const res = await client.query('SELECT * FROM businessdata.users');
  return res.rows;
};

const createUser = async (username, email, password, membershipId) => {
  const res = await client.query(
    'INSERT INTO businessdata.users (username, email, password, membership_id VALUES ($1, $2, $3, $4) RETURNING *',
    [username, email, password, membershipId ]
  );
  return res.rows[0];
};

module.exports = { getAllUsers, createUser };
