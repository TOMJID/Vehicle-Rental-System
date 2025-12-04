import {Pool} from "pg"

const pool= new Pool({
  connectionString: "",

});


export const initDB= async()=>{
  //? User Table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    
    
    
    
    
    
    )

    
    `)

}