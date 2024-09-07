import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { user } from '$lib/stores/user';
import { supabase } from '$lib/utils/supabase';
import { get } from 'svelte/store';

export const load = async () => {
	if (!browser) {
		return {
			projects: [],
			error: null
		};
	}

	if (browser && !get(user)) {
		goto('/login');
	}

	try {
		const { data, error, status } = await supabase
			.from('projects')
			.select(`id, title, description`);

		if (data) {
			return {
				projects: data,
				error: null
			};
		}
		if (error && status !== 406) {
			throw error;
		}
	} catch (error: any) {
		return {
			projects: [],
			error: error.message
		};
	}
};
