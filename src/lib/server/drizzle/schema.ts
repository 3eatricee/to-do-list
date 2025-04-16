import { relations } from 'drizzle-orm';
import { pgTable, uuid, text } from 'drizzle-orm/pg-core';

export const list = pgTable('list', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title')
});

export const task = pgTable('task', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: text('title'),
	listId: uuid('list_id').references(() => list.id)
});

export const listRelations = relations(list, ({ many }) => ({
	tasks: many(task)
}));

export const tasksRelations = relations(task, ({ one }) => ({
	list: one(list)
}));
