export class Helpers {
  static firstLetterUppercase(str: string): string {
    const valueString = str.toLocaleLowerCase();
    return valueString
      .split(' ')
      .map((value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`)
      .join(' ');
  }

  static lowerCase(str: string): string {
    return str.toLowerCase();
  }
  static generateRandomIntegers(integerLength: number): number {
    const character = '0123456789';
    let result = ' ';
    const characterLenght = character.length;
    for (let i = 0; i < integerLength; i++) {
      result += character.charAt(Math.floor(Math.random() * characterLenght));
    }
    return parseInt(result, 10);
  }
  static parseJson(prop: string): any {
    try {
      return JSON.parse(prop);
    } catch (error) {
      return prop;
    }
  }
}
