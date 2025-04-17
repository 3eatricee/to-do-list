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
		updatedTask: { title?: string; checked?: boolean };
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

<div class="flex flex-1 flex-col overflow-y-auto p-6">
	<h1 class="mb-6 text-3xl font-bold tracking-tight">Deine Aufgaben</h1>

	{#if data.tasks.length > 0}
		<ul class="space-y-4">
			{#each data.tasks as task (task.id)}
				<li
					class="group flex items-center justify-between rounded-xl bg-white/60 p-4 shadow backdrop-blur transition hover:shadow-md"
				>
					<div class="flex items-center gap-3">
						<input
							type="checkbox"
							class="border-lavender text-lavender focus:ring-lavender h-5 w-5 rounded"
							bind:checked={task.checked}
							onchange={async (event) => {
								const checked = (event.target as HTMLInputElement).checked;
								await updateTask({
									id: task.id,
									updatedTask: {
										title: task.title ?? '',
										checked
									}
								});
							}}
						/>
						<span
							class={`text-base transition ${
								task.checked ? 'text-gray-400 line-through' : 'text-gray-800'
							}`}
						>
							{task.title}
						</span>
					</div>

					<button
						onclick={async () => await deleteTask(task.id)}
						class="text-red-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-red-600"
					>
						<Icon icon="mdi-light:delete" width="20" height="20" />
					</button>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="mt-10 text-center text-gray-500">Keine Aufgaben vorhanden.</p>
	{/if}
</div>

<div class="w-full max-w-sm px-4">
	<input
		class="border-lavender bg-magnolia focus:border-lavender focus:ring-soft-lavender w-full rounded-xl border px-4 py-3 text-sm text-gray-700 transition focus:bg-white focus:ring-2 focus:outline-none"
		placeholder="Neue Aufgabe hinzufügen..."
		bind:value={nextTaskTitle}
		onkeydown={async (event) => {
			if (event.key === 'Enter') {
				await createTask(data.listId);
			}
		}}
	/>
</div>
