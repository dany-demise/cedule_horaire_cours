
import type { DBSchema } from 'idb'
import type { Machine, Program, ProgramConstraints } from '$lib/domain/interfaces'
import type { ProgramType } from '$lib/domain/enums';


export interface DatabaseSchema extends DBSchema {
  programs: {
    key: number;
    value: {
      id?: number;
      name: string;
      machineSequence: {
        machine: DatabaseSchema['machines']['value'];
        durationWeeks: number;  // Duration specific to this program-machine pairing
      }[];
      programType: ProgramType;
    };
    indexes: {
      'by-name': string;
      'by-id': number;
    };
  };
  students: {
    key: number;
    value: {
      id?: number;
      firstName: string;
      lastName: string;
      programId?: number;
      startDate: Date;
    };
    indexes: {
      'by-program': number;
    };
  };
  machines: {
    key: number;
    value: {
      id?: number;
      name: string,
      type: string;
      rented: boolean;
      colorCode: string;
    };
    indexes: {
      'by-type': string;
    };
  };
}