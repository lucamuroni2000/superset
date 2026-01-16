export type ColumnStyleData = {
    backgroundColor?: string[];
    textColor?: string;
    textFont?: string;
}

export type AddParameters<
  TFunction extends (...args: any) => any,
  TParameters extends [...args: any]> = (
  ...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>; 