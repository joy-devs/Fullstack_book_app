
import { year } from 'drizzle-orm/mysql-core';
import {pgTable, serial, varchar, text, integer} from 'drizzle-orm/pg-core';


export const books =pgTable( 'book', {
id:serial('id').primaryKey(),
title:varchar('title', {length: 255}).notNull(),
author:text('author').notNull(),
year:integer('publication year').notNull()
});

export type TIbooks = typeof books.$inferInsert;
export type TSbooks = typeof books.$inferSelect;



