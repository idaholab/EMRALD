export interface Initiator {
  name: string;
  comment: string;
  id?: string;
  value: string | number | boolean;
}

export interface Parameter {
  id?: string;
  name: string;
  value?:
    | string
    | number
    | boolean;
  unit?: string;
  useVariable: boolean;
  variable?: string;
  comment?: string;
}
