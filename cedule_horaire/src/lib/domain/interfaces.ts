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
  machineType: string;
  startWeek: number;
  endWeek: number;
}
