import { z } from 'zod';
import {
	ListInsertSchema,
	ListUpdateSchema,
	createList,
	deleteList,
	getAllLists,
	updateList
} from '../drizzle/querries/list';
import { createTask, getAllTasks, deleteTask, TasksInsertSchema } from '../drizzle/querries/tasks';
import { trpc } from './context';

const listRouter = trpc.router({
	create: trpc.procedure.input(ListInsertSchema).mutation(async (req) => {
		return await createList(req.input);
	}),
	getAll: trpc.procedure.query(async (req) => {
		return await getAllLists();
	}),
	delete: trpc.procedure.input(z.object({ id: z.string() })).mutation(async (req) => {
		const { id } = req.input;
		return deleteList(id);
	}),
	update: trpc.procedure
		.input(
			z.object({
				id: z.string(),
				title: z.string()
			})
		)
		.mutation(async (req) => {
			const { id, title } = req.input;
			return updateList(id, title);
		})
});

const taskRouter = trpc.router({
	create: trpc.procedure.input(TasksInsertSchema).mutation(async (req) => {
		return await createTask(req.input);
	}),
	getAll: trpc.procedure.input(z.object({ listId: z.string() })).query(async (req) => {
		const { listId } = req.input;
		return await getAllTasks(listId);
	}),
	delete: trpc.procedure.input(z.object({ id: z.string() })).mutation(async (req) => {
		const { id } = req.input;
		await deleteTask(id);
	}),
	update: trpc.procedure
		.input(
			z.object({
				id: z.string(),
				title: z.string()
			})
		)
		.mutation(async (req) => {
			const { id, title } = req.input;
			return updateList(id, title);
		})
});

export const router = trpc.router({
	list: listRouter,
	task: taskRouter
});

export type AppRouter = typeof router;
