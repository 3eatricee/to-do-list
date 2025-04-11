import { db } from '$lib/server/drizzle/client';
import { task } from '$lib/server/drizzle/schema';
import { eq } from 'drizzle-orm';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const TasksInsertSchema = createInsertSchema(task);
export type CreateTask = z.infer<typeof TasksInsertSchema>;
export const TaskUpdateSchema = createUpdateSchema(task);
export type UpgradeTask = z.infer<typeof TaskUpdateSchema>;

export async function createTask(data: CreateTask) {
	const [newTask] = await db.insert(task).values(data).returning();

	return newTask;
}

export async function getAllTasks(listId: string) {
	const tasks = await db.query.task.findMany({
		where: (task, { eq }) => eq(task.listId, listId)
	});

	return tasks;
}

export async function deleteTask(id: string) {
	await db.delete(task).where(eq(task.id, id));
}
