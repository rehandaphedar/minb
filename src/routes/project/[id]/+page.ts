import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { user } from '$lib/stores/user';
import { supabase } from '$lib/utils/supabase';
import { get } from 'svelte/store';
import type { LoadEvent } from '@sveltejs/kit';

export const load = async ({ params }: LoadEvent) => {
	if (!browser) {
		return {
			project: {
				id: '',
				title: '',
				description: '',
				todo_groups: []
			},
			error: null
		};
	}

	if (browser && !get(user)) {
		goto('/login');
	}

	try {
		const { data, error, status } = await supabase
			.from('projects')
			.select(
				`id, title, description, todo_groups(id, title, description, progress, todos(id, title, description, completed))`
			)
			.eq('id', params.id)
			.order('weight', { foreignTable: 'todo_groups' })
			.order('weight', { foreignTable: 'todo_groups.todos' })
			.single();

		if (data) {
			return {
				project: data,
				error: null
			};
		}
		if (error && status !== 406) {
			throw error;
		}
	} catch (error: any) {
		return {
			project: {
				id: '',
				title: '',
				description: '',
				todo_groups: []
			},
			error: error.message
		};
	}
};
