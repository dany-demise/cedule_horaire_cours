import { ProgramType } from '$lib/domain/enums';

export interface Machine {
  type: string;
  weeks: number;
  order: number;
}

export interface ProgramConstraints {
  allowConsecutive: boolean;
  allowGaps: boolean;
  programType: ProgramType;
}

export interface Program {
  name: string,
  programType: ProgramType,
  machineSequence: {machine: Machine, durationWeeks:number}[]
}
