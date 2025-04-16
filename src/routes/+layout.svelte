<script lang="ts">
	import Icon from '@iconify/svelte';
	import { DropdownMenu } from 'bits-ui';
	import '../app.css';
	import { goto, invalidateAll } from '$app/navigation';
	import { client } from '$lib/trpc/client';

	let { data, children } = $props();

	let lists = $state(data.list);
	let nextTitle = $state('');
	let editedListTitle = $state('');
	let editingListId: string | null = $state(null);
	let selectedListId: string | null = $state(null);

	const createList = async () => {
		try {
			const list = await client.list.create.mutate({
				title: nextTitle
			});
			nextTitle = '';
			lists = [...lists, list];
			await invalidateAll();
			return list;
		} catch (error) {
			console.error('Fehler beim Erstellen der Liste:', error);
		}
	};

	const deleteList = async (id: string) => {
		try {
			await client.list.delete.mutate({ id });
			lists = lists.filter((list) => list.id !== id);
		} catch (error) {
			console.error('Fehler beim Löschen der Liste:', error);
		}
	};

	const updateList = async ({ id, title }: { id: string; title: string }) => {
		try {
			await client.list.update.mutate({ id, title });
		} catch (error) {
			console.error('Fehler beim Bearbeiten der Liste:', error);
		}
	};
</script>

<div class="bg-soft-gray flex h-screen w-screen">
	<div
		class="m-5 flex w-80 flex-shrink-0 flex-col overflow-y-auto rounded-xl bg-white p-6 shadow-lg"
	>
		<h2 class="mb-6 text-center text-2xl font-semibold text-gray-800">ToDo Listen</h2>
		{#each lists as list}
			{#if editingListId === list.id}
				<input
					class="w-full rounded px-2 py-1 text-sm"
					bind:value={editedListTitle}
					onkeydown={async (event) => {
						if (event.key === 'Enter') {
							await updateList({ id: list.id, title: editedListTitle });
							lists = lists.map((l) => (l.id === list.id ? { ...l, title: editedListTitle } : l));
							editingListId = null;
						}
						if (event.key === 'Escape') {
							editingListId = null;
						}
					}}
				/>
			{:else}
				<button
					onclick={async () => {
						goto(`/${list.id}`);
						selectedListId = list.id;
					}}
					class={`mb-4 flex w-full items-center justify-between rounded-lg p-3 transition-all duration-300 ease-in-out ${
						selectedListId === list.id
							? 'bg-indigo-100 text-indigo-700 shadow-inner ring-2 ring-indigo-400'
							: 'text-gray-700 hover:bg-gray-50'
					}`}
				>
					<span class="text-lg text-gray-700">{list.title}</span>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger
							class="ml-2 rounded text-gray-500 hover:text-gray-800 focus:outline-none"
						>
							<Icon icon="mdi:dots-vertical" width="20" height="20" />
						</DropdownMenu.Trigger>

						<DropdownMenu.Content
							class="ring-opacity-5 z-20 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black focus:outline-none"
						>
							<DropdownMenu.Item
								onclick={() => {
									editingListId = list.id;
									editedListTitle = list.title ?? '';
								}}
								class="flex cursor-pointer items-center rounded-t-lg px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
							>
								<Icon icon="mdi:pencil-outline" class="mr-2" width="18" /> Bearbeiten
							</DropdownMenu.Item>

							<DropdownMenu.Item
								onclick={() => deleteList(list.id)}
								class="flex cursor-pointer items-center rounded-b-lg px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
							>
								<Icon icon="mdi:delete-outline" class="mr-2" width="18" /> Löschen
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</button>
			{/if}
		{/each}

		<div class="mt-6">
			<input
				class="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-sm text-gray-700 shadow-sm transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-300 focus:outline-none"
				placeholder="Neue Liste"
				bind:value={nextTitle}
				onkeydown={async (event) => {
					if (event.key !== 'Enter') return;
					await createList();
				}}
			/>
		</div>
	</div>

	{@render children()}
</div>
