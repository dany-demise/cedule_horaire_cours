<script lang="ts">
	import { Controller } from '$lib/domain/controller';
	import { onMount } from 'svelte';
	import ListerEtudiants from '$lib/components/ListerEtudiants.svelte';
	import type { DatabaseSchema } from '$lib/domain/db/db-schema';

	let controller: Controller;
	let programmes: DatabaseSchema['programs']['value'][] = [];

	onMount(async () => {
		controller = Controller.getInstance();
		// programmes = await controller.getAllProgrammes();
	});

	function addEtudiant() {
		const etudiantForm = getEtudiantForm();
		controller.nouveauEtudiant(etudiantForm);
		// Retourner a ListerEtudiants
		const switchFunc = controller.globalStore.get('SWITCH_COMPONENT');
		if (switchFunc) {
			switchFunc(ListerEtudiants);
		}
	}

	function getEtudiantForm(): Omit<DatabaseSchema['students']['value'], 'id'> {
		const form = document.getElementById('new-student-form') as HTMLFormElement;
		return {
			firstName: form.firstName.value,
			lastName: form.lastName.value,
			startDate: form.startDate.value,
			programId: parseInt(form.programId.value)
		};
	}
</script>

<div class="container d-flex justify-content-center align-items-center" style="min-height: 80vh;">
	<div class="row px-5" style="width: 100%;">
		<div class="col p-4">
			<h2 class="card-title text-center mb-4">Nouvelle machine</h2>

			<form id="new-student-form">
				<div class="mb-3">
					<label for="firstName" class="form-label">Prénom</label>
					<input type="text" class="form-control" id="firstName" name="firstName" required />
				</div>

				<div class="mb-3">
					<label for="lastName" class="form-label">Nom</label>
					<input type="text" class="form-control" id="lastName" name="lastName" required />
				</div>

				<div class="mb-3">
					<label for="startDate" class="form-label">Date de début</label>
					<input type="date" class="form-control" id="startDate" name="startDate" required />
				</div>

				<div class="btn-group btn-group-toggle" data-toggle="buttons">
					<label class="btn btn-outline-dark active">
						<input type="radio" name="options" id="option1" checked /> Long
					</label>
                    <label class="btn btn-outline-dark">
						<input type="radio" name="options" id="option1" checked /> Court
					</label>
				</div>

				<div class="d-grid text-center">
					<button type="submit" class="btn btn-outline-dark px-5" on:click={addEtudiant}
						>Add Student</button
					>
				</div>
			</form>
		</div>
	</div>
</div>
