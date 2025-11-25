/**
 * If value is array, just return array
 * if the value is not array but in string, parse it and return as array of string
 * @param param0
 * @returns array of string
 */
export const ParseArrayTransformer = ({ value }) => {
  try {
    if (Array.isArray(value)) {
      return value as string[];
    } else {
      const strVal = value as string;
      return JSON.parse(strVal) as string[];
    }
  } catch {
    return [];
  }
};
