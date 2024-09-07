import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { user } from '$lib/stores/user';
import { get } from 'svelte/store';

export const load = () => {
	if (browser && get(user)) {
		goto('/');
	}
};
