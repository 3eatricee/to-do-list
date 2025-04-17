<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import '../app.css';
	import { goto, invalidateAll } from '$app/navigation';
	import { client } from '$lib/trpc/client';
	import Icon from '@iconify/svelte';

	let { data, children } = $props();

	let lists = $derived(data.list);
	let nextTitle = $state('');
	let editedListTitle = $state('');
	let editingListId: string | null = $state(null);

	const createList = async () => {
		try {
			const list = await client.list.create.mutate({ title: nextTitle });
			nextTitle = '';
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

<div class="bg-soft-gray flex h-screen w-screen text-gray-800">
	<div class="m-6 w-80 flex-shrink-0 rounded-2xl bg-white p-6 shadow-xl">
		<h2 class="mb-6 text-center text-2xl font-semibold">ToDo Listen</h2>

		{#each lists as list}
			{#if editingListId === list.id}
				<input
					class="border-lavender focus:border-lavender focus:ring-soft-lavender mb-4 w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
					bind:value={editedListTitle}
					onkeydown={async (event) => {
						if (event.key === 'Enter') {
							await updateList({ id: list.id, title: editedListTitle });
							await invalidateAll();
							editingListId = null;
						}
						if (event.key === 'Escape') {
							editingListId = null;
						}
					}}
				/>
			{:else}
				<div class="group relative mb-3">
					<button
						onclick={async () => {
							goto(`/${list.id}`);
						}}
						class={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
							data.listId === list.id
								? 'bg-magnolia text-dark-lavender ring-lavender ring-2'
								: 'hover:bg-magnolia hover:text-dark-lavender'
						}`}
					>
						<span class="truncate">{list.title}</span>

						<DropdownMenu.Root>
							<DropdownMenu.Trigger
								class="text-sm text-gray-400 hover:text-gray-600 focus:outline-none"
							>
								<Icon icon="mdi:dots-vertical" width="20" height="20" />
							</DropdownMenu.Trigger>

							<DropdownMenu.Content
								class="z-20 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black/10"
							>
								<DropdownMenu.Item
									onclick={() => {
										editingListId = list.id;
										editedListTitle = list.title ?? '';
									}}
									class="hover:text-dark-lavender hover:bg-magnolia px-4 py-2 text-sm text-gray-700"
								>
									Bearbeiten
								</DropdownMenu.Item>
								<DropdownMenu.Item
									onclick={() => deleteList(list.id)}
									class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
								>
									Löschen
								</DropdownMenu.Item>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</button>
				</div>
			{/if}
		{/each}

		<div class="mt-6">
			<input
				class="border-lavender bg-magnolia focus:border-lavender focus:ring-soft-lavender w-full rounded-xl border px-4 py-3 text-sm text-gray-700 shadow-sm transition focus:bg-white focus:ring-2 focus:outline-none"
				placeholder="Neue Liste erstellen..."
				bind:value={nextTitle}
				onkeydown={async (event) => {
					if (event.key === 'Enter') {
						await createList();
					}
				}}
			/>
		</div>
	</div>

	<div class="flex-1 overflow-y-auto p-6">
		{@render children()}
	</div>
</div>
