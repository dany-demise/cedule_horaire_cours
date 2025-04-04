<script lang="ts">
	import { Controller } from '$lib/domain/controller';
	import { onMount } from 'svelte';
	import NouvelleMachine from '$lib/components/NouvelleMachine.svelte';
	import type { DatabaseSchema } from '$lib/domain/db/db-schema';

	const LOOKAHEAD_VALUE = 15;
	let controller: Controller;
	let machines: (DatabaseSchema['machines']['value'] & { availability: Record<number, boolean> })[] = [];
	let weeks: Date[] = [];

	onMount(async () => {
		controller = Controller.getInstance();
		const rawMachines = await controller.getMachines();
		
		// Generate week columns starting from current week
		const today = new Date();
		weeks = Array.from({ length: LOOKAHEAD_VALUE }, (_, i) => {
			const date = new Date(today);
			date.setDate(date.getDate() + i * 7);
			return getStartOfWeek(date);
		});

		// Initialize availability boilerplate
		machines = rawMachines.map(machine => {
			const availability: Record<number, boolean> = {};
			
			// Set default availability (true) for all weeks
			weeks.forEach(weekStart => {
				availability[weekStart.getTime()] = true;
			});

			return { 
				...machine, 
				availability 
			};
		});
	});

	function getStartOfWeek(date: Date): Date {
		// Adjust to start of week (Monday)
		const day = date.getDay();
		const diff = date.getDate() - day + (day === 0 ? -6 : 1);
		const start = new Date(date);
		start.setDate(diff);
		start.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
		return start;
	}

	function formatWeekHeader(date: Date): string {
		// Format as "MMM DD" (e.g. "Jun 05")
		return date.toLocaleDateString('en-US', { 
			month: 'short', 
			day: '2-digit' 
		});
	}

</script>

<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center border-bottom">
	<h1 class="h3">Machines</h1>
	<div class="btn-toolbar mb-2 mb-md-0">
		<div class="btn-group mr-2 py-2">
			<button
				class="btn btn-outline-secondary"
				on:click={() => controller.globalStore.get('SWITCH_COMPONENT')?.(NouvelleMachine)}
			>
				Nouveau
			</button>
		</div>
	</div>
</div>

<div class="table-container">
	<table class="machine-table">
		<thead>
			<tr>
				<th class="sticky-col machine-name">Machine</th>
				{#each weeks as weekStart}
					<th class="week-header">{formatWeekHeader(weekStart)}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each machines as machine (machine.id)}
				<tr>
					<td class="sticky-col machine-name text-start" style="text-align:left;color:{machine.rented ? "red": "black"};">{machine.name} - {machine.type} ({machine.rented ? "Loué": "Non-Loué"})</td>
					{#each weeks as weekStart}
						<td class="week-cell">
							<div class="checkbox-wrapper">
								<input 
									type="checkbox" 
									class="week-checkbox"
									bind:checked={machine.availability[weekStart.getTime()]}
								>
							</div>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.table-container {
		width: 100%;
		overflow: auto;
		border: 1px solid #dee2e6;
		border-radius: 4px;
		max-height: 80vh;
	}

	.machine-table {
		border-collapse: collapse;
		width: max-content;
		min-width: 100%;
	}

	.machine-table th, 
	.machine-table td {
		padding: 8px 12px;
		text-align: center;
		border: 1px solid #dee2e6;
		background: white;
		position: relative;
	}

	.machine-table th {
		position: sticky;
		top: 0;
		background: #f8f9fa;
		font-weight: 600;
		z-index: 10;
	}

	.sticky-col {
		position: sticky;
		left: 0;
		z-index: 5;
		min-width: 150px;
	}

	.machine-name {
		text-align: left;
	}

	.week-header {
		min-width: 80px;
	}

	.week-cell {
		min-width: 80px;
		height: 45px;
		padding: 0;
	}

	.checkbox-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
		padding: 8px;
	}

	.week-checkbox {
		margin: 0;
		width: 18px;
		height: 18px;
		cursor: pointer;
	}
</style>