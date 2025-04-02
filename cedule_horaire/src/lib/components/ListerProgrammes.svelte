<script lang="ts">
	import { Controller } from '$lib/domain/controller';
	import { onMount } from 'svelte';
	import NouveauProgramme from '$lib/components/NouveauProgramme.svelte';
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
	<h1 class="h3">Programmes</h1>
	<div class="btn-toolbar mb-2 mb-md-0">
		<div class="btn-group mr-2 py-2">
			<button
				class="btn btn btn-outline-secondary"
				on:click={() => controller.globalStore.get('SWITCH_COMPONENT')?.(NouveauProgramme)}
				>Nouveau</button
			>
		</div>
	</div>
</div>

<div class="table-responsive">
	<table class="table table-hover align-middle">
		<thead class="table-light">
			<tr>
				<th>Nom</th>
				<th class="text-center">Durée</th>
				<th>Type</th>
				<th>Machines</th>
			</tr>
		</thead>
		<tbody>
			{#each programmes as programme}
				<tr>
					<td class="fw-semibold">{programme.name}</td>
					<td class="text-center">
						<span class="badge bg-light text-dark border m-1 rounded-pill">
							{calculateDuration(programme.machineSequence)} sem
						</span>
					</td>
					<td>{programme.programType}</td>
					<td>
						<div class="d-flex flex-wrap gap-1">
							{#each programme.machineSequence as item}
								<span class="badge bg-light text-dark border m-1">
									{item.machine.type} <small>({item.durationWeeks} sem)</small>
								</span>
							{/each}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
