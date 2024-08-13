export interface Target {
    useVariable: boolean;
    location: any;
    value: Value | string;
    type: string;
    arguments?: argument[];
  }
  
  export interface argument {
    value: string | number;
    type: string;
    units?: string;
  }
  
  export interface Value {
    useVariable?: boolean;
    type: string;
    value: string | number;
    units?: string;
  }
  export interface Initiator {
    desc: string;
    value: string;
    index: number;
    type: string;
    target: Target;
  }
  export interface Parameter {
    useVariable: boolean;
    id: string;
    location: any;
    target: Target;
    value: Value;
    type: string;
    variable?: string;
  }
  export interface InputBlock {
    test: Test;
    value: InputResultValue[];
    id: string;
  }
  export interface Test {
    value: InputValue;
  }
  export interface InputValue {
    left: Value | Target | Test;
    right: Value | Target | Test;
    op: string;
  }
  export interface InputResultValue {
    location: any;
    target: Target;
    type: string;
    value: Value | Test | string;
    comment?: string;
  }
  
  export interface Alias {
    target: Target;
    value: Value;
  }