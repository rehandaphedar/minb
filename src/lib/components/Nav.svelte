<script lang="ts">
	import { user } from '$lib/stores/user';
	import { supabase } from '$lib/utils/supabase';

	let isBurgerMenuActive = false;
	const toggleBurgerMenu = () => {
		isBurgerMenuActive = !isBurgerMenuActive;
	};

	const logout = () => {
		supabase.auth.signOut();
	};
</script>

<nav class="navbar is-primary is-fixed-top">
	<div class="navbar-brand">
		<a class="navbar-item" href="/"><img alt="minb" src="/favicon.png" /></a>
		<a
			href="."
			class="navbar-burger"
			class:is-active={isBurgerMenuActive}
			on:click|preventDefault={toggleBurgerMenu}
		>
			<span />
			<span />
			<span />
		</a>
	</div>
	<div class="navbar-menu" class:is-active={isBurgerMenuActive}>
		<div class="navbar-end">
			{#if $user}
				<a class="navbar-item" href="/projects">Projects</a>
				<a href="." class="navbar-item" on:click|preventDefault={logout}>Logout</a>
			{:else}
				<a class="navbar-item" href="/login">Login</a>
			{/if}
		</div>
	</div>
</nav>
