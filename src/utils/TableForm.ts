import { TableFormHeader } from "@renderer/types/TableFormHeader";

export class TableForm {
  private tableHeader: TableFormHeader[];
  private inputProp: {
    propLabel: string;
    type: "select" | "input" | "input-number";
    value: string | number;
    options: string[];
  }[];

  constructor() {
    this.tableHeader = [];
    this.inputProp = [];
  }

  get getTableHeader() {
    return this.tableHeader;
  }

  get getInputProp(){
    return this.inputProp
  }
  set setTableHeader(tableHeader: TableFormHeader[]) {
    this.tableHeader = tableHeader;
  }
  pushTableHeaderProp(
    h: TableFormHeader,
    type: "select" | "input" | "input-number",
    value: string | number,
    options?: string[]
  ) {
    this.tableHeader.push(h);
    this.inputProp.push({
        propLabel:h.prop,
        type,
        value,
        options:options || []
    })
  }
}
