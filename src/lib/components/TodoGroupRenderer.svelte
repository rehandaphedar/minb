<script lang="ts">
	import TodoRenderer from '$lib/components/TodoRenderer.svelte';
	import { hillChartColors } from '$lib/utils/const';
	import { htmlToText } from '$lib/utils/misc';
	import { supabase } from '$lib/utils/supabase';
	import type { TodoGroup } from '$lib/utils/types';
	import { notifier } from '@beyonk/svelte-notifications';
	import HillChart from 'hill-chart';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	export let todo_group: TodoGroup;
	$: completed =
		todo_group.todos.filter((todo) => !todo.completed).length == 0 && todo_group.todos.length > 0;

	let saveLoading = false;
	let deleteLoading = false;
	let createLoading = false;

	let todoSaveFunctions: (() => Promise<void>)[] = [];

	let isEdited = false;
	const setIsEdited = () => {
		isEdited = true;
	};

	const handleSave = async () => {
		saveLoading = true;

		await Promise.all(
			todoSaveFunctions.map((todoSaveFunction: () => Promise<void>) => todoSaveFunction())
		);

		const { error } = await supabase
			.from('todo_groups')
			.update({
				title: todo_group.title,
				description: todo_group.description,
				progress: todo_group.progress
			})
			.match({ id: todo_group.id });

		if (error) {
			notifier.danger(error.message, 2000);
		} else {
			dispatch('update');
		}

		isEdited = false;
		saveLoading = false;
	};

	const handleDelete = async () => {
		deleteLoading = true;
		const { error } = await supabase.from('todo_groups').delete().match({ id: todo_group.id });

		if (error) {
			notifier.danger(error.message, 2000);
		} else {
			dispatch('update');
		}

		deleteLoading = false;
	};

	const createTodo = async () => {
		createLoading = true;
		const { error } = await supabase
			.from('todos')
			.insert([{ todo_group_id: todo_group.id, title: 'Todo', description: 'Todo description' }]);

		if (error) {
			notifier.danger(error.message, 2000);
		} else {
			updateTodos();
		}

		createLoading = false;
	};

	const updateTodos = async () => {
		const { data, error } = await supabase
			.from('todos')
			.select(`id, title, description, completed`)
			.eq('todo_group_id', todo_group.id)
			.order('weight');

		if (error) {
			notifier.danger(error.message, 2000);
		} else {
			todo_group.todos = data;
		}
	};

	onMount(() => {
		const hillChartData = [
			{
				id: todo_group.id,
				description: htmlToText(todo_group.title),
				x: todo_group.progress,
				color: hillChartColors[0],
				link: `#todo-group-${todo_group.id}`
			}
		];
		const hill = new HillChart(hillChartData, {
			target: `#hill-chart-${todo_group.id}`
		});
		hill.render();

		hill.on('move', () => {
			setIsEdited();
		});
		hill.on('moved', (data: any) => {
			todo_group.progress = parseFloat(data.x);
		});
	});
</script>

<section id="todo-group-{todo_group.id}">
	<h3
		class="title is-3"
		class:strikethrough={completed}
		bind:innerHTML={todo_group.title}
		on:input={setIsEdited}
		contenteditable
		spellcheck="false"
	/>
	<h3
		class="subtitle is-5 mb-1"
		class:strikethrough={completed}
		bind:innerHTML={todo_group.description}
		on:input={setIsEdited}
		contenteditable
		spellcheck="false"
	/>
	<svg id="hill-chart-{todo_group.id}" />
	<div class="buttons are-small">
		<button
			class="button is-success"
			disabled={!isEdited}
			on:click={handleSave}
			class:is-loading={saveLoading}
		>
			<span class="icon"><i class="fas fa-save" /></span>
		</button>
		<button class="button is-danger mb-2" class:is-loading={deleteLoading} on:click={handleDelete}>
			<span class="icon"><i class="fas fa-trash-alt" /></span>
		</button>
	</div>
	<section class="my-6">
		{#each todo_group.todos as todo, i}
			<TodoRenderer {todo} on:update={updateTodos} bind:runSaveRequest={todoSaveFunctions[i]} />
		{/each}
		<div>
			<button
				class="button is-info is-small"
				class:is-loading={createLoading}
				on:click={createTodo}
			>
				<span class="icon"><i class="fas fa-plus" /></span>
			</button>
		</div>
	</section>
</section>
