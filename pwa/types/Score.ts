import { Item } from "./item";

export class Score implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public player_id?: number,
    public score?: number,
    public fk_plaxer_id?: any,
    public playerId?: number,
    public fkPlaxerId?: any
  ) {
    this["@id"] = _id;
  }
}
