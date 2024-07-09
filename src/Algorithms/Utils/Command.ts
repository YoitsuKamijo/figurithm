import Action from "./Action";

class Command {
  action;
  color;
  values;
  private constructor(builder: any) {
    this.action = builder.action;
    this.color = builder.color;
    this.values = builder.values;
  }

  // Static nested Builder class
  public static Builder = class {
    color: string | undefined;
    action: Action | undefined;
    values: any | undefined;

    constructor() {}

    // Setter for color
    setColor(color: string): this {
      this.color = color;
      return this;
    }

    // Setter for color
    setAction(action: Action): this {
      this.action = action;
      return this;
    }

    // Setter for color
    setValues(values: any): this {
      this.values = values;
      return this;
    }

    // Build method to create a Record instance
    build(): Command {
      return new Command(this);
    }
  };
}

export default Command;
