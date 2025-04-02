<script lang="ts">
	import { Controller } from '$lib/domain/controller';
	import { onMount } from 'svelte';
	import ListerProgrammes from '$lib/components/ListerProgrammes.svelte';

	let controller: Controller;

	onMount(() => {
		controller = Controller.getInstance();
	});

	function addProgram() {
		const programForm = getProgramForm();
		// controller.nouveauProgramme(programForm);
		const switchFunc = controller.globalStore.get('SWITCH_COMPONENT');
		if (switchFunc) {
			switchFunc(ListerProgrammes);
		}
	}

	function getProgramForm() {
		const form = document.getElementById('new-program-form') as HTMLFormElement;
		// return {
		console.log({
			name: form.name,
			durationWeeks: parseInt(form.durationWeeks.value),
			programType: form.programType.value,
			machineSequence: [] // To be populated separately
		});
		// };
	}
</script>

<div class="container d-flex justify-content-center align-items-center" style="min-height: 80vh;">
	<div class="row px-5" style="width: 100%;">
		<div class="col p-4">
			<h2 class="card-title text-center mb-4">Nouveau Programme</h2>

			<form id="new-program-form">
				<div class="mb-3">
					<label for="name" class="form-label">Nom du Programme</label>
					<input type="text" class="form-control" id="name" name="name" required />
				</div>

				<div class="mb-3">
					<label for="durationWeeks" class="form-label">Durée (semaines)</label>
					<input
						type="number"
						class="form-control"
						id="durationWeeks"
						name="durationWeeks"
						required
					/>
				</div>

				<div class="mb-3">
					<label for="programType" class="form-label">Type de Programme</label>
					<select id="programType" name="programType" class="form-control" required>
						<option value="">Sélectionner un type</option>
						<!-- ProgramType enum options would go here -->
					</select>
				</div>

				<div class="d-grid text-center">
					<button type="submit" class="btn btn-outline-dark px-5" on:click={addProgram}>
						Ajouter Programme
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
