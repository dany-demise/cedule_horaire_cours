// db.ts
import { openDB, } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb'
import { ProgramType } from '$lib/domain/enums';
import type { Machine, Program, ProgramConstraints } from '$lib/domain/interfaces'
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

    await this.seedInitialData();
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

    // Initial program data (without ID)
    const initialProgramData: Omit<DatabaseSchema["programs"]["value"], "id"> = {
      name: '1-Machine 5-Week Program',
      machineSequence: [
        { machine: { type: 'Pelle', colorCode: "#fafafa" }, durationWeeks: 3 },
        { machine: { type: 'Pépine', colorCode: "#fafafa" }, durationWeeks: 3 },
        { machine: { type: 'Bull', colorCode: "#fafafa" }, durationWeeks: 3 },
        { machine: { type: 'Niveleuse', colorCode: "#fafafa" }, durationWeeks: 3 },
        { machine: { type: 'Loader', colorCode: "#fafafa" }, durationWeeks: 3 }
      ],
      programType: ProgramType.LONG
    };

    // Initial students
    const initialStudents = [
      {
        firstName: 'John',
        lastName: 'Doe',
        startDate: new Date('2023-01-15'),
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        startDate: new Date('2023-02-01'),
      },
      {
        firstName: 'Robert',
        lastName: 'Johnson',
        startDate: new Date('2023-03-10'),
      },
      {
        firstName: 'Emily',
        lastName: 'Williams',
        startDate: new Date('2023-01-30'),
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        startDate: new Date('2023-02-15'),
      }
    ];

    const tx = this.db!.transaction(['machines', 'programs', 'students'], 'readwrite');

    // Add machines
    const machinePromises = initialMachines.map(machine => tx.objectStore('machines').add(machine));
    await Promise.all(machinePromises);

    // Add program and get its ID
    const programId = await tx.objectStore('programs').add(initialProgramData);
    console.log(programId);
    // Get the full program with ID to add to students
    const program = await tx.objectStore('programs').get(programId);
    if (!program) throw new Error('Failed to create program');

    // Add students with the single program in their programme array
    const studentPromises = initialStudents.map(student =>
      tx.objectStore('students').add({
        ...student,
        programId: programId ? programId : undefined
      })
    );

    await Promise.all(studentPromises);
    await tx.done;
  }

  // Program operations
  async addProgram(program: Omit<DatabaseSchema['programs']['value'], 'id'>) {
    return this.db!.add('programs', program);
  }

  async getProgramByName(name: string) {
    return this.db!.getFromIndex('programs', 'by-name', name);
  }

  async getProgramById(id: number): Promise<DatabaseSchema['programs']['value'] | null> {
    console.log(id);
    const programme = await this.db!.get('programs', id);
    console.log(programme)
    return programme ? programme : null;
  }

  // Student operations
  async getAllProgrammes() {
    return this.db!.getAll('programs');
  }

  // Student operations
  async addStudent(student: Omit<DatabaseSchema['students']['value'], 'id'>) {
    const tx = this.db!.transaction(['students'], 'readwrite');
    tx.objectStore('students').add(student)
    await tx.done;
    // return this.db!.add('students', student);
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

  // Machine operations
  async getMachines(): Promise<DatabaseSchema['machines']['value'][]> {
    return this.db!.getAll('machines');
  }

  async deleteMachine(id: number) {
    return this.db!.delete('machines', id);
  }

  // Program operations
  async deleteProgram(id: number) {
    return this.db!.delete('programs', id);
  }

  // Student operations
  async deleteStudent(id: number) {
    return this.db!.delete('students', id);
  }

  // Student operations
  async getAllStudents() {
    return this.db!.getAll('students');
  }

  async getStudentsByProgram(programId: number) {
    return this.db!.getAllFromIndex('students', 'by-program', programId);
  }

}

