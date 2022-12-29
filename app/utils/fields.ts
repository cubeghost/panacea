export enum FieldTypes {
  Range = 'Range',
  Options = 'Options',
  LongText = 'Long Text',
  ShortText = 'Short Text',
}

export interface RangeAttributes {
  min: number;
  max: number;
}

export interface OptionsAttributes {
  options: string[];
}

export interface Field {
  name: string;
  type: FieldTypes;
  attributes?: RangeAttributes & OptionsAttributes;
}
