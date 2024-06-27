import "dotenv/config";
import {drizzle} from "drizzle-orm/node-postgres";
import {Client} from "pg";
import * as schema from "./schema"

export const client = new Client({
    connectionString:process.env.DATABASE_URL as string,
})

const main = async () =>{
    await client.connect();
}
main();

const db = drizzle(client, { schema, logger: true})

export default db;