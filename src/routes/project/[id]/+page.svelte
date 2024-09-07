<script lang="ts">
	import { goto } from '$app/navigation';
	import TodoGroupRenderer from '$lib/components/TodoGroupRenderer.svelte';
	import { hillChartColors } from '$lib/utils/const';
	import { htmlToText } from '$lib/utils/misc';
	import { supabase } from '$lib/utils/supabase';
	import type { Project } from '$lib/utils/types';
	import { notifier } from '@beyonk/svelte-notifications';
	import HillChart from 'hill-chart';
	import { onMount } from 'svelte';

	export let data: {
		project: Project;
		error: string | null;
	};

	if (data.error) {
		notifier.danger(data.error, 2000);
	}

	let saveLoading = false;
	let deleteLoading = false;
	let createLoading = false;

	let isEdited = false;
	const setIsEdited = () => {
		isEdited = true;
	};

	let hill: any = null;

	const handleSave = async () => {
		saveLoading = true;

		const { error } = await supabase
			.from('projects')
			.update({ title: data.project.title, description: data.project.description })
			.match({ id: data.project.id });

		if (error) {
			notifier.danger(error.message, 2000);
		}

		isEdited = false;
		saveLoading = false;
	};

	const handleDelete = async () => {
		deleteLoading = true;
		const { error } = await supabase.from('projects').delete().match({ id: data.project.id });

		if (error) {
			notifier.danger(error.message, 2000);
		} else {
			goto('/projects');
		}

		deleteLoading = false;
	};

	const createTodoGroup = async () => {
		createLoading = true;
		const { error } = await supabase
			.from('todo_groups')
			.insert([
				{ project_id: data.project.id, title: 'Todo Group', description: 'Todo Group description' }
			]);

		if (error) {
			notifier.danger(error.message, 2000);
		} else {
			updateTodoGroups();
		}
		createLoading = false;
	};

	const updateTodoGroups = async () => {
		const { data: res, error } = await supabase
			.from('todo_groups')
			.select(`id, title, description, progress, todos(id, title, description, completed)`)
			.eq('project_id', data.project.id)
			.order('weight')
			.order('weight', { foreignTable: 'todos' });

		if (error) {
			notifier.danger(error.message, 2000);
		} else {
			data.project.todo_groups = res;
			createOrUpdateHillChart();
		}
	};

	const createOrUpdateHillChart = () => {
		const hillChartData = data.project.todo_groups?.map((todo_group, i) => {
			return {
				id: todo_group.id,
				description: htmlToText(todo_group.title),
				x: todo_group.progress,
				color: hillChartColors[i % hillChartColors.length],
				link: `#todo-group-${todo_group.id}`
			};
		});
		if (hill) {
			hill.replaceAndUpdate(hillChartData);
		} else {
			hill = new HillChart(hillChartData, {
				target: `#hill-chart-${data.project.id}`,
				preview: true
			});
			hill.render();
		}
	};

	onMount(createOrUpdateHillChart);
</script>

<svelte:head>
	<title>
		{data.project.title} | minb
	</title>
</svelte:head>

<h1
	class="title is-1 has-text-centered"
	contenteditable
	spellcheck="false"
	bind:innerHTML={data.project.title}
	on:input={setIsEdited}
/>
<h1
	class="subtitle is-3 has-text-centered"
	contenteditable
	spellcheck="false"
	bind:innerHTML={data.project.description}
	on:input={setIsEdited}
/>

<div class="buttons is-justify-content-center">
	<button
		class="button is-success"
		disabled={!isEdited}
		class:is-loading={saveLoading}
		on:click={handleSave}
	>
		<span class="icon"><i class="fas fa-save" /></span>
	</button>
	<button class="button is-danger" class:is-loading={deleteLoading} on:click={handleDelete}>
		<span class="icon"><i class="fas fa-trash-alt" /></span>
	</button>
</div>

<h2 class="title is-2">Progress Overview</h2>
<section>
	<svg id="hill-chart-{data.project.id}" />
</section>

<h2 class="title is-2">Todo Groups</h2>

<section>
	{#if typeof data.project.todo_groups !== 'undefined'}
		{#each data.project.todo_groups as todo_group (todo_group.id)}
			<TodoGroupRenderer {todo_group} on:update={updateTodoGroups} />
		{/each}
	{/if}
	<section>
		<button class="button is-info" class:is-loading={createLoading} on:click={createTodoGroup}
			><span class="icon"><i class="fa fa-plus" /></span></button
		>
	</section>
</section>

<style>
	h2 {
		margin-top: 6rem;
	}
</style>
