// db.ts
import { openDB, } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb'
import { ProgramType } from '$lib/domain/enums';
import type { Machine, Program, ProgramConstraints  } from '$lib/domain/interfaces'
import type { DatabaseSchema } from '$lib/domain/db/db-schema'

export class IndexedDBManager {
  private db: IDBPDatabase<DatabaseSchema> | null = null;

  async initialize() {
    this.db = await openDB<DatabaseSchema>('ConstructionTrainingDB', 1, {
      upgrade(db) {
        // Create programs store
        const programsStore = db.createObjectStore('programs', {
          keyPath: 'id',
          autoIncrement: true
        });
        programsStore.createIndex('by-name', 'name', { unique: false });

        // Create students store
        const studentsStore = db.createObjectStore('students', {
          keyPath: 'id',
          autoIncrement: true
        });
        studentsStore.createIndex('by-program', 'programId', { unique: false });

        // Create machines store
        const machinesStore = db.createObjectStore('machines', {
          keyPath: 'id',
          autoIncrement: true
        });
        machinesStore.createIndex('by-type', 'type', { unique: false });
      },
    });

    // await this.seedInitialData();
    console.log(
        await this.getMachineByType('Loader')
    )
  }

  private async seedInitialData() {
    // Initial machines
    const initialMachines = [
      { type: 'Loader', baseDuration: 1, colorCode: '#FF5733' },
      { type: 'Pelle', baseDuration: 2, colorCode: '#33FF57' },
      { type: 'Pépine', baseDuration: 2, colorCode: '#3357FF' },
      { type: 'Bull', baseDuration: 2, colorCode: '#F333FF' },
      { type: 'Niveleuse', baseDuration: 2, colorCode: '#FF33F3' }
    ];

    // Initial program
    const initialProgram = {
      name: '5-Machine 13-Week Program',
      durationWeeks: 13,
      machineSequence: [
        { type: 'Pelle', weeks: 4, order: 1 },
        { type: 'Pépine', weeks: 3, order: 2 },
        { type: 'Bull', weeks: 3, order: 3 },
        { type: 'Niveleuse', weeks: 2, order: 4 },
        { type: 'Loader', weeks: 1, order: 5 }
      ],
      constraints: {
        allowConsecutive: false,
        allowGaps: false,
        programType: ProgramType.LONG
      }
    };

    const tx = this.db!.transaction(['machines', 'programs'], 'readwrite');
    await Promise.all([
       ...initialMachines.map(machine => tx.objectStore('machines').add(machine)),
    //   tx.objectStore('programs').add(initialProgram)
    ]);
    await tx.done;
  }

  // Program operations
  async addProgram(program: Omit<DatabaseSchema['programs']['value'], 'id'>) {
    return this.db!.add('programs', program);
  }

  async getProgramByName(name: string) {
    return this.db!.getFromIndex('programs', 'by-name', name);
  }

  // Student operations
  async addStudent(student: Omit<DatabaseSchema['students']['value'], 'id'>) {
    return this.db!.add('students', student);
  }

  async assignStudentToProgram(studentId: number, programId: number) {
    const tx = this.db!.transaction('students', 'readwrite');
    const student = await tx.store.get(studentId);
    if (!student) throw new Error('Student not found');
    
    student.programId = programId;
    await tx.store.put(student);
    await tx.done;
  }

  // Machine operations
  async getMachineByType(type: string) {
    return this.db!.getAllFromIndex('machines', 'by-type', type);
  }

  // Schedule generation with constraints
  async generateStudentSchedule(studentId: number) {
    const student = await this.db!.get('students', studentId);
    if (!student?.programId) throw new Error('Student not enrolled');

    const program = await this.db!.get('programs', student.programId);
    if (!program) throw new Error('Program not found');

    const schedule: Program[] = [];
    let currentWeek = 0;

    for (const machine of program.machineSequence) {
      const machineData = await this.getMachineByType(machine.type);
      if (!machineData) throw new Error(`Machine type ${machine.type} not found`);

      schedule.push({
        machineType: machine.type,
        startWeek: currentWeek + 1,
        endWeek: currentWeek + machine.weeks
      });

      currentWeek += machine.weeks;
    }

    // Validate constraints
    if (program.constraints.programType === ProgramType.LONG) {
      for (let i = 1; i < schedule.length; i++) {
        if (schedule[i].machineType === schedule[i - 1].machineType) {
          throw new Error('Consecutive machines detected in long program');
        }
      }
    }

    return schedule;
  }
}

