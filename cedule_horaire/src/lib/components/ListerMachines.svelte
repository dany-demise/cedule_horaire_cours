<script lang="ts">
	import { Controller } from '$lib/domain/controller';
	import { onMount } from 'svelte';
	import NouvelleMachine from '$lib/components/NouvelleMachine.svelte';
	import type { DatabaseSchema } from '$lib/domain/db/db-schema';

	let controller: Controller;
	let programmes: DatabaseSchema['programs']['value'][] = [];

	onMount(async () => {
		controller = Controller.getInstance();
		programmes = await controller.getAllProgrammes();
	});

	function calculateDuration(machines: { durationWeeks: number }[]) {
		return machines.reduce((sum, m) => sum + m.durationWeeks, 0);
	}
</script>

<div
	class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center border-bottom"
>
	<h1 class="h3">Machines</h1>
	<div class="btn-toolbar mb-2 mb-md-0">
		<div class="btn-group mr-2 py-2">
			<button
				class="btn btn btn-outline-secondary"
				on:click={() => controller.globalStore.get('SWITCH_COMPONENT')?.(NouvelleMachine)}
				>Nouveau</button
			>
		</div>
	</div>
</div>

<div class="table-responsive">
	
</div>
