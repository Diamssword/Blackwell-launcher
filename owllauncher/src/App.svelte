<script lang="ts">
    import { onMount } from "svelte";
	import  "./types/neutralino"
	import { Alert } from 'flowbite-svelte';

	//tuto https://flowbite-svelte.com/pages/getting-started
	export let name: string;
	var BACK: typeof Neutralino;
	onMount(async ()=>{
		for(let d in (window as any).VARS)
		{
			window[d]=(window as any).VARS[d];
		}
		BACK = (window as any).Neutralino;
		BACK.init();
		console.log(await BACK.window.getPosition())
		await BACK.window.setTitle("loading...")
		console.log(await BACK.computer.getDisplays());
		
	})
	
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<Alert dismissable={true} accent>
		<span class="font-medium">Info alert!</span> Change a few things up and try submitting again.
	</Alert>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>