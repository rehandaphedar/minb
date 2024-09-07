<script lang="ts">
	import { goto } from '$app/navigation';

	import { supabase } from '$lib/utils/supabase';
	import type { Project } from '$lib/utils/types';
	import { notifier } from '@beyonk/svelte-notifications';
	import { user } from '$lib/stores/user';

	export let data: {
		projects: Project[];
		error: string | null;
	};

	if (data.error) {
		notifier.danger(data.error, 2000);
	}

	let loading = false;

	const createProject = async () => {
		loading = true;
		const { data, error } = await supabase
			.from('projects')
			.insert([{ title: 'New Project', description: 'Project description' }]);

		if (error) {
			notifier.danger(error.message, 2000);
			loading = false;
		} else {
			goto(`/project/${data[0].id}`);
		}
	};

	const exportData = async () => {
		const { data: projects, error } = await supabase
			.from('projects')
			.select(
				'id, title, description, todo_groups(id, title,description, progress, weight, todos(id, title, description, completed, weight))'
			);
		if (error) {
			notifier.danger(error.message, 2000);
		}

		const data = {
			user: $user,
			projects
		};

		let link = URL.createObjectURL(
			new Blob([JSON.stringify(data)], {
				type: 'application/json'
			})
		);
		var a = document.createElement('a');
		a.download = `minb_data-${$user.id}.json`;
		a.href = link;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};
</script>

<svelte:head>
	<title>Projects | minb</title>
</svelte:head>

<h1 class="title is-1 has-text-centered">Projects</h1>

<button class="button is-link mx-auto my-6" on:click={exportData}>Export Data</button>

<section class="columns is-multiline">
	{#each data.projects as project}
		<div class="column is-half">
			<a href="/project/{project.id}" class="notification is-info">
				<span>
					{@html project.title}
				</span>
				<p>
					{@html project.description}
				</p>
			</a>
		</div>
	{/each}
	<div class="column is-full">
		<button class="button is-info mx-auto" class:is-loading={loading} on:click={createProject}>
			<span class="icon">
				<i class="fas fa-plus" />
			</span>
		</button>
	</div>
</section>

<style>
	.notification {
		display: block;
	}
	button {
		display: block;
	}
</style>
