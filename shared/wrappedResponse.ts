export interface Data<T = {}>{
  code: number;
  data?: T;
}

export const wrappedResponse = <T>(code: number, data: T): Data<T> => {
  if (code === 0 || code === 10){
    return {
      code,
      data
    }
  }
  return {
    code
  }
}