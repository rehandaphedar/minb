import { user } from '$lib/stores/user';
import { supabase } from '$lib/utils/supabase';

export const load = () => {
	user.set(supabase.auth.user());

	supabase.auth.onAuthStateChange((_, session) => {
		user.set(session?.user);
	});
};
