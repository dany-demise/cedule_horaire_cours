<div
	class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center border-bottom"
>
	<h1 class="h3">Étudiants</h1>
	<div class="btn-toolbar mb-2 mb-md-0">
		<div class="btn-group mr-2 py-2">
			<button class="btn btn btn-outline-secondary" on:click={switchtoNouveauEtudiant}>Nouveau</button>
		</div>
	</div>
</div>

<script lang="ts">
	import { Controller } from "$lib/domain/controller";
	import NouveauEtudiant from '$lib/components/NouveauEtudiant.svelte';
	import { GlobalStoreEnum } from "$lib/domain/global-store-functions";
	import { onMount } from "svelte";

	let controller:Controller;

	onMount(() => {
		controller = Controller.getInstance();
	})

	function switchtoNouveauEtudiant() {
		const switchFunc = controller.globalStore.get("SWITCH_COMPONENT");
		if (switchFunc) {
			console.log(switchFunc)
			switchFunc(NouveauEtudiant);
		}
		// switchFunc(NouveauEtudiant);
	}


</script>
