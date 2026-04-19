const db = require('./database');
const bcrypt = require("bcryptjs");

const User = {
    create: async (userData) => {
        const {
        first_name,
        last_name,
        gmail,
        pass,
        member, 
        admin
        } = userData;
        const hashedPassword = await bcrypt.hash(pass,10);

        const result = await db.query(
            //first_name, last_name, gmail, pass, member, admin
            `
            INSERT INTO users
            (first_name, last_name, gmail, pass, member, admin)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [first_name, last_name, gmail, hashedPassword , member, admin]
        );
        return result.rows[0];

    },

    setMembership: async (userId) => {
        await db.query(
            `UPDATE users SET member = true WHERE id = $1`,
            [userId]
        );
    },

    setAdmin: async (userId) => {
        await db.query(
            `UPDATE users SET admin = true WHERE id = $1`,
            [userId]
        );
    },

    findById: async (id) => {

        const result = await db.query(
            `
            SELECT 
            id,
            first_name,
            last_name,
            gmail,
            member,
            admin
            FROM users
            WHERE id = $1
            `,
            [id]
        );
        return result.rows[0];
    },

    update: async (id, userData) =>{
        const {
            first_name,
            last_name,
            gmail,
            pass,
            member, 
            admin
        } = userData;

        let finalPassword;

        if(pass && pass.trim !== ""){
            finalPassword = await bcrypt.hash(pass, 10);
        }else{
            finalPassword = currentUser.rows[0].pass;
        }
      

        const result = await db.query(
            `
            UPDATE users SET
            first_name = $1, last_name = $2, gmail = $3, pass = $4, member = $5, admin = $6
            WHERE id = $7
            RETURNING *
            `,
            [first_name, last_name, gmail, finalPassword , member, admin, id]
        );

    },

    delete: async (id) => {
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    },

    findByGmail: async (gmail) => {
        const result = await db.query(
            `SELECT * FROM users WHERE gmail = $1`,
            [gmail]
        );
        return result.rows[0]
    },


};
module.exports = User;