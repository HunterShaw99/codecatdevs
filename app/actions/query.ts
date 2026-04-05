'use server'

import pool from '@/app/utils/db'

export default async function queryDb() {
    const result = await pool.query('SELECT $1::text as name', ['natec'])
    console.log(result.rows[0].name) 
} 