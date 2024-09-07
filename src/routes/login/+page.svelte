<script lang="ts">
	import { supabase } from '$lib/utils/supabase';
	import { notifier } from '@beyonk/svelte-notifications';

	let loading = false;
	let email: string;

	const handleLogin = async () => {
		if (loading) {
			return;
		}
		try {
			loading = true;
			const { error } = await supabase.auth.signIn({ email });
			if (error) throw error;
			notifier.success('Check your email for the login link!', 2000);
		} catch (error: any) {
			notifier.danger(error.error_description || error.message, 2000);
		} finally {
			loading = false;
		}
	};
</script>

<svelte:head>
	<title>Login | minb</title>
</svelte:head>

<h1 class="title is-1 has-text-centered">Login</h1>

<form on:submit|preventDefault={handleLogin}>
	<div class="field">
		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label class="label"> Sign in via Magic Link </label>
		<div class="control">
			<input
				class="input is-info"
				type="email"
				bind:value={email}
				placeholder="Enter your email address"
			/>
		</div>
	</div>
	<div class="control">
		<button type="submit" class="button is-info" class:is-loading={loading}>
			Send Magic Link
		</button>
	</div>
</form>
