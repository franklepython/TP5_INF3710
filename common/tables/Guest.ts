export enum Gender {
  M = "M",
  F = "F",
  O = "O",
}

export interface Guest {
  guestnb: string;
  nas: string;
  nomcommun: string;
  gender: Gender;
  statutspeces: string;
}
