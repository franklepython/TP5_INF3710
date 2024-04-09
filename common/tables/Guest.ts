export enum Gender {
  M = "M",
  F = "F",
  O = "O",
}

export interface Guest {
  guestnb: string;
  nas: string;
  nomCommun: string;
  gender: Gender;
  status: string;
}
