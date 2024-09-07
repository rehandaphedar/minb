<script lang="ts">
	import { supabase } from '$lib/utils/supabase';
	import type { Todo } from '$lib/utils/types';
	import { createEventDispatcher } from 'svelte';
	import { notifier } from '@beyonk/svelte-notifications';
	const dispatch = createEventDispatcher();

	export let todo: Todo;

	let saveLoading = false;
	let deleteLoading = false;
	let isEdited = false;
	const setIsEdited = () => {
		isEdited = true;
	};
	export const runSaveRequest = async () => {
		saveLoading = true;

		const { error } = await supabase
			.from('todos')
			.update({
				title: todo.title,
				description: todo.description,
				completed: todo.completed
			})
			.match({ id: todo.id });

		if (error) {
			notifier.danger(error.message, 2000);
		}

		isEdited = false;
		saveLoading = false;
	};
	const handleSave = async () => {
		await runSaveRequest();
		dispatch('update');
	};

	const handleDelete = async () => {
		deleteLoading = true;
		const { error } = await supabase.from('todos').delete().match({ id: todo.id });

		if (error) {
			notifier.danger(error.message, 2000);
		} else {
			dispatch('update');
		}

		deleteLoading = false;
	};
</script>

<div class="my-4">
	<h5 class="title is-5 is-flex is-justify-content-space-between">
		<div class="is-flex-grow-1">
			<label class="checkbox">
				<input type="checkbox" bind:checked={todo.completed} on:input={setIsEdited} />
			</label>
			<span
				contenteditable
				spellcheck="false"
				bind:innerHTML={todo.title}
				on:input={setIsEdited}
				class:strikethrough={todo.completed}
			/>
		</div>
		<div>
			<button
				class="button is-success is-inverted is-rounded"
				class:is-loading={saveLoading}
				disabled={!isEdited}
				on:click={handleSave}
			>
				<span class="icon"><i class="fas fa-save" /></span>
			</button>
			<button
				class="button is-danger is-inverted is-rounded"
				class:is-loading={deleteLoading}
				on:click={handleDelete}
			>
				<span class="icon"><i class="fas fa-trash-alt" /></span>
			</button>
		</div>
	</h5>
	<h5
		class="subtitle is-6"
		contenteditable
		spellcheck="false"
		bind:innerHTML={todo.description}
		on:input={setIsEdited}
		class:strikethrough={todo.completed}
	/>
</div>
