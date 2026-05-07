const db = require('./database');

const Message = {
    create: async (messageData) => {
        const {
            title, 
            text,
            user_id
        } = messageData;
        const result = await db.query(
            `
                INSERT INTO messages
                (title, text, user_id)
                VALUES ($1, $2, $3)
                RETURNING *
            `,
            [title, text, user_id]
        );
        return result.rows[0];
    },
/*
    getAll: async () => {
        const result = await db.query(
            `
            SELECT
                messages.id,
                messages.title,
                messages.text,
                users.gmail
            FROM messages
            JOIN users ON messages.user_id = users.id
            ORDER BY messages.id DESC
            `
        );
        return result.rows;
    },
*/

    getAll: async (limit = 8, offset = 0) => {
        const result = await db.query(
            `
            SELECT
                messages.id,
                messages.title,
                messages.text,
                users.gmail
            FROM messages
            JOIN users ON messages.user_id = users.id
            ORDER BY messages.id DESC
            LIMIT $1 OFFSET $2
            `,
            [limit, offset]
        );
        return result.rows;
    },

    getTotalCount: async () => {
        const result = await db.query(
            `
            SELECT COUNT(*) as total
            FROM messages
            `
        );
        return parseInt(result.rows[0].total);
    },

    getAllFromIdUser: async (userId) => {
        const result = await db.query(
            `
            SELECT
                messages.id,
                messages.title,
                messages.text,
                users.gmail
            FROM messages
            JOIN users ON messages.user_id = users.id
            WHERE messages.user_id = $1
            ORDER BY messages.id DESC
            `,
            [userId]
        );
        return result.rows;
    },

    findById: async (id) => {
        const result = await db.query(
            `
            SELECT 
            messages.id,
            messages.title,
            messages.text,
            users.gmail,
            users.id AS author_id
            FROM messages
            JOIN users ON messages.user_id = users.id
            WHERE messages.id = $1
            `,
            [id]
        );

        return result.rows[0];
    },

    deleteById: async (messageId) => {
        await db.query(
        `DELETE FROM messages WHERE id = $1`,
        [messageId]
        );
    }


};

module.exports = Message;