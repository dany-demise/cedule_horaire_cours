
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
        machine: Machine;
        durationWeeks: number;  // Duration specific to this program-machine pairing
      }[];
      programType: ProgramType;
    };
    indexes: {
      'by-name': string;
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
      programme: Program[];
    };
    indexes: {
      'by-program': number;
    };
  };
  machines: {
    key: number;
    value: {
      id?: number;
      type: string;
      baseDuration: number;
      colorCode: string;
    };
    indexes: {
      'by-type': string;
    };
  };
}