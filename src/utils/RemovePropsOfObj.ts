interface MyObject {
  [key: string]: any;
}

export class RemovePropertyObj {
  static staticRemoveProperty(obj: MyObject, keys: string[]) {
    return Object.keys(obj).reduce((result, currentKey) => {
      if (!keys.includes(currentKey)) {
        //@ts-ignore
        result[currentKey] = obj[currentKey];
      }
      return result;
    }, {});
  }
}
