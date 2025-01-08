import { Item } from "./item";

export class Player implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public Name?: string,
    public i?: string[],
    public name?: string
  ) {
    this["@id"] = _id;
  }
}
