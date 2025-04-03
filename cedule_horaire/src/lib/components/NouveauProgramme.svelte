<script lang="ts">
	import { Controller } from '$lib/domain/controller';
	import { onMount } from 'svelte';
	import ListerProgrammes from '$lib/components/ListerProgrammes.svelte';
	import type { ProgramType } from '$lib/domain/enums';
	import type { DatabaseSchema } from '$lib/domain/db/db-schema';

	let controller: Controller;
	let name = '';
	let selectedProgramType: ProgramType;
	let machines: DatabaseSchema['machines']['value'][] = [];
	let machineSequence: Array<{ machineId: number | null; durationWeeks: number }> = [];
	let formError = '';

	onMount(async () => {
		controller = Controller.getInstance();
		machines = await controller.getMachines(); // Assuming this method exists
	});

	function addMachine() {
		machineSequence = [...machineSequence, { machineId: null, durationWeeks: 0 }];
	}

	function removeMachine(index: number) {
		machineSequence = machineSequence.filter((_, i) => i !== index);
	}

	function validateForm() {
		if (!name.trim()) {
			formError = 'Le nom du programme est requis';
			return false;
		}

		if (!selectedProgramType) {
			formError = 'Le type de programme est requis';
			return false;
		}

		if (machineSequence.length === 0) {
			formError = 'Au moins une machine doit être ajoutée';
			return false;
		}

		for (const [index, entry] of machineSequence.entries()) {
			if (entry.machineId === null) {
				formError = `La machine #${index + 1} doit être sélectionnée`;
				return false;
			}

			if (entry.durationWeeks <= 0) {
				formError = `La durée pour la machine #${index + 1} doit être supérieure à 0`;
				return false;
			}
		}

		formError = '';
		return true;
	}

	function addProgram() {
		if (!validateForm()) return;

		const programData = {
			name,
			programType: selectedProgramType,
			machineSequence: machineSequence.map((entry) => ({
				machine: machines.find((m) => m.id === entry.machineId)!,
				durationWeeks: entry.durationWeeks
			}))
		};

		controller.addProgramme(programData);
		const switchFunc = controller.globalStore.get('SWITCH_COMPONENT');
		if (switchFunc) switchFunc(ListerProgrammes);
	}
</script>

<div class="container d-flex justify-content-center align-items-center" style="min-height: 80vh;">
	<div class="row px-5" style="width: 100%;">
		<div class="col p-4">
			<h2 class="card-title text-center mb-4">Nouveau Programme</h2>

			{#if formError}
				<div class="alert alert-danger">{formError}</div>
			{/if}

			<form id="new-program-form">
				<div class="mb-3">
					<label for="name" class="form-label">Nom du Programme</label>
					<input type="text" class="form-control" id="name" bind:value={name} required />
					<div class="invalid-feedback">Veuillez fournir un nom pour le programme</div>
				</div>

				<div class="mb-3">
					<label for="programType" class="form-label">Type de Programme</label>
					<div class="btn-group btn-group-toggle" data-toggle="buttons">
						<label class="btn btn-outline-dark {selectedProgramType === 'Long' ? 'active' : ''}">
							<input
								type="radio"
								name="programType"
								value="Long"
								bind:group={selectedProgramType}
								required
							/> Long
						</label>
						<label class="btn btn-outline-dark {selectedProgramType === 'Court' ? 'active' : ''}">
							<input
								type="radio"
								name="programType"
								value="Court"
								bind:group={selectedProgramType}
								required
							/> Court
						</label>
					</div>
					<div class="invalid-feedback">Veuillez sélectionner un type de programme</div>
				</div>

				<div class="mb-4">
					<label for="selectMachinesDuration" class="form-label"
						>Machines <a href="#0" on:click|preventDefault={addMachine}>➕</a></label
					>
					{#if machineSequence.length === 0}
						<!-- <div class="alert alert-warning">Aucune machine ajoutée</div> -->
						 <p class="text-muted">Ajoutez une machine</p>
					{/if}
					{#each machineSequence as entry, index (index)}
						<div class="d-flex gap-2 mb-2">
							<select
								required
								class="form-select {entry.machineId === null ? '' : ''}"
								bind:value={entry.machineId}
							>
								<option value={null} disabled selected>Sélectionnez une machine</option>
								{#each machines as machine (machine.id)}
									<option value={machine.id}>{machine.type}</option>
								{/each}
							</select>
							<input
								type="number"
								class="form-control {entry.durationWeeks <= 0 ? '' : ''}"
								placeholder="Durée (semaines)"
								bind:value={entry.durationWeeks}
								min="1"
							/>
							<button
								type="button"
								class="btn btn-outline-danger"
								on:click={() => removeMachine(index)}>×</button
							>
						</div>
					{/each}
				</div>

				<div class="d-grid text-center">
					<button
						type="submit"
						class="btn btn-outline-dark px-5"
						on:click|preventDefault={addProgram}
					>
						Ajouter Programme
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
