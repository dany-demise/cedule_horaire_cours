<!-- Icons -->
<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import { IndexedDBManager } from '$lib/domain/db/indexed-db-manager';
	import Cedule from '$lib/components/Cedule.svelte';
	import NouveauEtudiant from '$lib/components/NouveauEtudiant.svelte';
	import NouvelleMachine from '$lib/components/NouvelleMachine.svelte';
	import ListerMachines from '$lib/components/ListerMachines.svelte';
	import ListerEtudiants from '$lib/components/ListerEtudiants.svelte';
	import ListerProgrammes from '$lib/components/ListerProgrammes.svelte';
	import NouveauProgramme from '$lib/components/NouveauProgramme.svelte';

	import { Controller } from '$lib/domain/controller';

	let selectedComponent: Component = Cedule;
	let controller: Controller;

	onMount(async () => {
		controller = Controller.getInstance();
		controller.globalStore.set('SWITCH_COMPONENT', switchComponent);
		await controller.initDbManager();

		// Set the IndexedDB to persistent storage
		if (navigator.storage && navigator.storage.persist) {
			navigator.storage.persist().then((persistent) => {
				if (persistent) {
					console.log('Storage will not be cleared except by explicit user action');
				} else {
					console.warn('Storage may be cleared by the UA under storage pressure.');
				}
			});
		}
	});

	function switchComponent(component: Component) {
		selectedComponent = component;
	}
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
	<meta name="description" content="" />
	<meta name="author" content="" />
	<link rel="icon" href="/docs/4.0/assets/img/favicons/favicon.ico" />
	<link rel="stylesheet" href="/css/dashboard.css" />
	<link rel="stylesheet" href="/css/bootstrap.min.css" />
	<title>Dashboard Template for Bootstrap</title>
	<!-- jQuery and Bootstrap JS CDNs -->
	<script
		src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
		integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
		crossorigin="anonymous"
	></script>
	<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chart.js@2.7.1/dist/Chart.min.js"></script>
	<script src="https://unpkg.com/feather-icons/dist/feather.min.js"></script>
</svelte:head>

<nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
	<a class="navbar-brand col-sm-3 col-md-2 mr-0" href="#0">Company name</a>
	<input
		class="form-control form-control-dark w-100"
		type="text"
		placeholder="Search"
		aria-label="Search"
	/>
	<ul class="navbar-nav px-3">
		<li class="nav-item text-nowrap">
			<a class="nav-link" href="#0">Sign out</a>
		</li>
	</ul>
</nav>

<div class="container-fluid">
	<div class="row">
		<nav class="col-md-2 d-none d-md-block bg-light sidebar">
			<div class="sidebar-sticky">
				<ul class="nav flex-column">
					<!-- Updated sidebar navigation -->
					<li class="nav-item">
						<a
							href="#0"
							class="nav-link"
							class:active={selectedComponent === Cedule}
							on:click|preventDefault={() => switchComponent(Cedule)}
							on:keydown|preventDefault={(e) => e.key === 'Enter' && switchComponent(Cedule)}
							role="button"
							tabindex="0"
						>
							📅 Cédule
						</a>
					</li>
					<li class="nav-item">
						<a
							href="#0"
							class="nav-link"
							class:active={selectedComponent === ListerMachines ||
								selectedComponent === NouvelleMachine}
							on:click|preventDefault={() => switchComponent(ListerMachines)}
							on:keydown|preventDefault={(e) =>
								e.key === 'Enter' && switchComponent(ListerMachines)}
							role="button"
							tabindex="0"
						>
							🏗️ Machines
						</a>
					</li>
					<li class="nav-item">
						<a
							href="#0"
							class="nav-link"
							class:active={selectedComponent === ListerEtudiants ||
								selectedComponent === NouveauEtudiant}
							on:click|preventDefault={() => switchComponent(ListerEtudiants)}
							on:keydown|preventDefault={(e) =>
								e.key === 'Enter' && switchComponent(ListerEtudiants)}
							role="button"
							tabindex="0"
						>
							👷 Étudiants
						</a>
					</li>
					<li class="nav-item">
						<a
							href="#0"
							class="nav-link"
							class:active={selectedComponent === ListerProgrammes ||
								selectedComponent === NouveauProgramme}
							on:click|preventDefault={() => switchComponent(ListerProgrammes)}
							on:keydown|preventDefault={(e) =>
								e.key === 'Enter' && switchComponent(ListerProgrammes)}
							role="button"
							tabindex="0"
						>
							📚 Programmes
						</a>
					</li>
				</ul>
			</div>
		</nav>

		<main class="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
			<svelte:component this={selectedComponent} />
		</main>
	</div>
</div>

<style>
	:global(body) {
		font-size: 0.875rem;
	}

	:global(.feather) {
		width: 16px;
		height: 16px;
		vertical-align: text-bottom;
	}

	.sidebar {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		z-index: 100; /* Behind the navbar */
		padding: 0;
		box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
	}

	.sidebar-sticky {
		position: -webkit-sticky;
		position: sticky;
		top: 48px; /* Height of navbar */
		height: calc(100vh - 48px);
		padding-top: 0.5rem;
		overflow-x: hidden;
		overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
	}

	.sidebar .nav-link {
		font-weight: 500;
		color: #333;
	}

	:global(.sidebar .nav-link .feather) {
		margin-right: 4px;
		color: #999;
	}

	.sidebar .nav-link.active {
		color: #333;
		font-weight: bold;
	}

	:global(.sidebar .nav-link:hover .feather),
	:global(.sidebar .nav-link.active .feather) {
		color: inherit;
	}

	:global(.sidebar-heading) {
		font-size: 0.75rem;
		text-transform: uppercase;
	}

	/*
   * Navbar
   */

	.navbar-brand {
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
		font-size: 1rem;
		background-color: rgba(0, 0, 0, 0.25);
		box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.25);
	}

	.navbar .form-control {
		padding: 0.75rem 1rem;
		border-width: 0;
		border-radius: 0;
	}

	.form-control-dark {
		color: #fff;
		background-color: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.form-control-dark:focus {
		border-color: transparent;
		box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25);
	}

	/*
   * Utilities
   */

	:global(.border-top) {
		border-top: 1px solid #e5e5e5;
	}
	.border-bottom {
		border-bottom: 1px solid #e5e5e5;
	}
</style>
