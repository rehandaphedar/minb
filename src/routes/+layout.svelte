<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import { NotificationDisplay } from '@beyonk/svelte-notifications';
	import '../app.scss';
</script>

<NotificationDisplay />
<Nav />
<main class="container is-max-desktop p-2">
	<slot />
</main>
