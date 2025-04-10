<script lang="ts">
	import { client } from '$lib/trpc/client';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	type List = {
		id: string;
		title: string | null;
	};

	type Task = {
		id: string;
		title: string | null;
		listId: string | null;
	};

	let selectedList: List | null = $state(null);
	let lists: List[] = $state([]);
	let nextTitle = $state('');

	let tasks: Task[] = $state([]);
	let nextTaskTitle = $state('');
	let description = $state('');

	onMount(async () => {
		await getAllLists();
	});

	const getAllLists = async () => {
		lists = await client.list.getAll.query();
	};

	const createList = async () => {
		try {
			const list = await client.list.create.mutate({
				title: nextTitle
			});
			nextTitle = '';
			return list;
		} catch (error) {
			console.error('Fehler beim Erstellen der Liste:', error);
		}
	};

	const deleteList = async (id: string) => {
		try {
			await client.list.delete.mutate({ id });
			await getAllLists();
		} catch (error) {
			console.error('Fehler beim Löschen der Liste:', error);
		}
	};

	// const updateList = async (id: string, title: string) => {
	// 	try {
	// 		await client.list.update.mutate({ id, title });
	// 		await getAllLists();
	// 	} catch (error) {
	// 		console.error('Fehler beim Bearbeiten der Liste:', error);
	// 	}
	// };

	const createTask = async (listId: string) => {
		try {
			const task = await client.task.create.mutate({
				title: nextTaskTitle,
				listId
			});

			return task;
		} catch (error) {
			console.error('Fehler beim Ersstellen der Task:', error);
		}
	};

	const getAllTasks = async (listId: string) => {
		tasks = await client.task.getAll.query({ listId });
	};
</script>

<div class="bg-soft-gray flex h-screen w-screen">
	<div
		class="m-5 flex w-80 flex-shrink-0 flex-col overflow-y-auto rounded-xl bg-white p-6 shadow-lg"
	>
		<h2 class="mb-6 text-center text-2xl font-semibold text-gray-800">ToDo Listen</h2>

		{#each lists as list}
			<button
				type="button"
				onclick={async () => {
					selectedList = list;
					await getAllTasks(selectedList.id);
				}}
				class="mb-4 flex w-full items-center justify-between rounded-lg p-3 transition-colors duration-300 hover:bg-gray-50"
			>
				<span class="text-lg text-gray-700">{list.title}</span>
				<span
					role="button"
					tabindex="0"
					onclick={(e) => {
						e.stopPropagation();
						deleteList(list.id);
					}}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.stopPropagation();
							deleteList(list.id);
						}
					}}
					class="transition-colors duration-300 hover:text-red-500"
				>
					<Icon icon="mdi-light:delete" width="20" height="20" />
				</span>
			</button>
		{/each}

		<div class="mt-6">
			<input
				class="w-full rounded-xl border bg-gray-100 px-4 py-2 text-gray-800 transition-all duration-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
				placeholder="Neue Liste"
				bind:value={nextTitle}
				onkeydown={async (e) => {
					if (e.key !== 'Enter') return;
					const newList = await createList();
					if (newList) {
						lists = [...lists, newList];
					}
				}}
			/>
		</div>
	</div>

	<div class="m-5 flex flex-1 flex-col overflow-y-auto p-6">
		{#if selectedList}
			<h3 class="mb-4 text-xl font-semibold text-gray-800">
				Aufgaben in: <span>{selectedList.title}</span>
			</h3>
			<div>
				<ul class="mt-6 space-y-2">
					{#each tasks as task}
						<li>{task.title}</li>
					{/each}
				</ul>
			</div>
		{:else}{/if}
		<div class="mt-auto">
			<input
				class="mb-2 w-full rounded-lg border bg-gray-100 px-3 py-2 text-sm"
				placeholder="Task-Titel"
				bind:value={nextTaskTitle}
				onkeydown={async (e) => {
					if (e.key !== 'Enter') return;
					if (selectedList) {
						const newTask = await createTask(selectedList.id);
						if (newTask) {
							tasks = [...tasks, newTask];
						}
						nextTaskTitle = '';
					}
				}}
			/>
		</div>
	</div>
</div>
