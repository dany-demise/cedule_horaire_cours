<script lang="ts">
	import { Controller } from '$lib/domain/controller';
	import NouveauEtudiant from '$lib/components/NouveauEtudiant.svelte';
	import { onMount } from 'svelte';

	let controller: Controller;

	onMount(async () => {
		controller = Controller.getInstance();
		await insertAllStudents();
	});

	function switchtoNouveauEtudiant() {
		const switchFunc = controller.globalStore.get('SWITCH_COMPONENT');
		if (switchFunc) {
			switchFunc(NouveauEtudiant);
		}
	}

	async function insertAllStudents() {
		const students = await controller.getAllEtudiants();
		console.log(students);
		const tbody = document.getElementById('students-table-body') as HTMLTableElement;

		if (tbody && students) {
			tbody.innerHTML = ''; // Clear existing rows

			students.forEach(async (student) => {
				const row = document.createElement('tr');
				console.log(student)
				const programme = student.programId ? await controller.getProgrammeById(student.programId) : null ;
				const programmeName = programme ? programme.name : 'Aucun' ;
				row.innerHTML = `
					<td>${student.id}</td>
					<td>${student.firstName}</td>
					<td>${student.lastName}</td>
					<td>${programmeName}</td>
					<td>${student.startDate}</td>
				`;
				tbody.appendChild(row);
			});
		}
	}
</script>

<div
	class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center border-bottom"
>
	<h1 class="h3">Étudiants</h1>
	<div class="btn-toolbar mb-2 mb-md-0">
		<div class="btn-group mr-2 py-2">
			<button class="btn btn btn-outline-secondary" on:click={switchtoNouveauEtudiant}
				>Nouveau</button
			>
		</div>
	</div>
</div>

<div class="table-responsive mt-4">
	<table class="table table-striped table-hover">
		<thead class="thead-light">
			<tr>
				<th scope="col">ID</th>
				<th scope="col">Prénom</th>
				<th scope="col">Nom</th>
				<th scope="col">Programme</th>
				<th scope="col">Date de début</th>
			</tr>
		</thead>
		<tbody id="students-table-body">
			<!-- Students will be inserted here -->
		</tbody>
	</table>
</div>
