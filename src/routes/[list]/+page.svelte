<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	import { client } from '$lib/trpc/client';
	import Icon from '@iconify/svelte';

	let { data } = $props();

	let nextTaskTitle = $state('');

	const createTask = async (listId: string) => {
		try {
			const task = await client.task.create.mutate({
				title: nextTaskTitle,
				listId
			});
			await invalidateAll();
			nextTaskTitle = '';
			return task;
		} catch (error) {
			console.error('Fehler beim Erstellen der Task:', error);
		}
	};

	const deleteTask = async (id: string) => {
		try {
			await client.task.delete.mutate({ id });
			await invalidateAll();
		} catch (error) {
			console.error('Fehler beim Löschen der Task:', error);
		}
	};

	const updateTask = async (task: {
		id: string;
		updatedTask: { title?: string; checked?: boolean; dueDate?: string | null };
	}) => {
		try {
			await client.task.update.mutate({
				id: task.id,
				updatedTask: task.updatedTask
			});
			await invalidateAll();
		} catch (error) {
			console.error('Fehler beim Bearbeiten der Task', error);
		}
	};
</script>

<div class="m-5 flex flex-1 flex-col overflow-y-auto p-6">
	<h1 class="animate-fade-in mb-6 text-3xl font-bold tracking-tight text-gray-800">
		Deine Aufgaben
	</h1>

	<div>
		<ul class="space-y-3">
			{#each data.tasks as task (task.id)}
				<li
					class="group animate-fade-in-up flex items-center justify-between rounded-lg bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
				>
					<span class={`text-gray-800 ${task.checked ? 'text-gray-400 line-through' : ''}`}>
						{task.title}
					</span>
					<label class="inline-flex cursor-pointer items-center">
						<input
							type="checkbox"
							bind:checked={task.checked}
							onchange={async (event) => {
								const updatedChecked = (event.target as HTMLInputElement).checked;
								await updateTask({
									id: task.id,
									updatedTask: {
										title: task.title ?? '',
										checked: updatedChecked
									}
								});
							}}
							class="form-checkbox h-5 w-5 rounded-lg border-gray-300 text-indigo-500 focus:ring-indigo-400"
						/>
					</label>

					<button
						onclick={async () => await deleteTask(task.id)}
						class="text-red-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-red-700"
					>
						<Icon icon="mdi-light:delete" width="20" height="20" />
					</button>
				</li>
			{/each}
		</ul>
	</div>

	<div class="mt-8">
		<input
			class="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-700 shadow-sm transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-300 focus:outline-none"
			placeholder="Neue Aufgabe hinzufügen..."
			bind:value={nextTaskTitle}
			onkeydown={async (event) => {
				if (event.key !== 'Enter') return;
				await createTask(data.listId);
			}}
		/>
	</div>
</div>
