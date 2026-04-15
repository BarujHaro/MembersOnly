const {Pool} = require('pg');
require('dotenv').config();
const bcrypt = require("bcrypt");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

const seedData = async () => {
    const client = await pool.connect();

    try{

        await client.query('BEGIN');
        await client.query('DELETE FROM users');
        await client.query('DELETE FROM messages');
        await client.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
        await client.query('ALTER SEQUENCE messages_id_seq RESTART WITH 1');

        const pass1 = await bcrypt.hash(process.env.USER1_PASS, 10);
        const pass2 = await bcrypt.hash(process.env.USER2_PASS, 10);
        const pass3 = await bcrypt.hash(process.env.USER3_PASS, 10);

        const users = [
            ['Fer','Har','bar@gmail.com', pass2, true, true],
            ['Judi','Rod','judi@gmail.com', pass1, true, true],
            ['Ang', 'Gal', 'Ang@gmail.com', pass3, true, false]
        ];


        for(const user of users){
            await client.query(
                `
                INSERT INTO users(
                    first_name, last_name, gmail, pass, member, admin
                ) VALUES ($1, $2, $3, $4, $5, $6)
                `, user
            );
        }



        const messages = [
            ['Welcome to the Club!', "I'm so excited to be part of this community. Looking forward to meeting everyone!", 1],
            ['Thinking of You', "Every moment we spend together becomes my favorite memory. I'm so lucky to have you.", 2],
            ['A Quiet Goodbye', "It's hard to let go when your heart isn't ready to say goodbye. The silence feels heavy today.", 2],
            ['Best Day Ever!', "I just got the news and I couldn't be happier! Hard work finally paid off and I'm celebrating!", 3]


        ];

        for (const message of messages){
            await client.query(
                `
                INSERT INTO messages(
                    title, text, user_id
                ) VALUES ($1, $2, $3)
                `, message
            );
        }

        await client.query('COMMIT');
        console.log('Dummy Data inserted')
    }catch(error){
        await client.query('ROLLBACK');
        console.error('Error insertando datos:', error);
    }finally{
        client.release();
        await pool.end();
    }

};

if (require.main === module){
    seedData();
}

module.exports = {seedData};