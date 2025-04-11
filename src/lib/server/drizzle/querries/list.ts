import { db } from '$lib/server/drizzle/client';
import { list, task } from '$lib/server/drizzle/schema';
import { eq } from 'drizzle-orm';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const ListInsertSchema = createInsertSchema(list);
export type CreateList = z.infer<typeof ListInsertSchema>;
export const ListUpdateSchema = createUpdateSchema(list);
export type UpdateList = Omit<z.infer<typeof ListUpdateSchema>, 'id'>;

export async function createList(data: CreateList) {
	const [newList] = await db.insert(list).values(data).returning();
	return newList;
}

export async function getAllLists() {
	const lists = await db.query.list.findMany();
	return lists;
}

export async function deleteList(id: string) {
	await db.delete(task).where(eq(task.listId, id));
	await db.delete(list).where(eq(list.id, id));
}

export async function updateList(id: string, title: string) {
	await db.update(list).set({ title: title }).where(eq(list.id, id));
}
