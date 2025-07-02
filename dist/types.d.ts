declare module '@lookback/lookbook' {

  /** Lookback's color palette. */
  export type Color = 'grey-950' | 'grey-900' | 'grey-800' | 'grey-700' | 'grey-600' | 'grey-500' | 'grey-400' | 'grey-300' | 'grey-200' | 'grey-100' | 'grey-50' | 'teal-950' | 'teal-900' | 'teal-800' | 'teal-700' | 'teal-600' | 'teal-500' | 'teal-400' | 'teal-300' | 'teal-200' | 'teal-100' | 'teal-50' | 'purple-950' | 'purple-900' | 'purple-800' | 'purple-700' | 'purple-600' | 'purple-500' | 'purple-400' | 'purple-300' | 'purple-200' | 'purple-100' | 'purple-50' | 'red-950' | 'red-900' | 'red-800' | 'red-700' | 'red-600' | 'red-500' | 'red-400' | 'red-300' | 'red-200' | 'red-100' | 'red-50' | 'green-950' | 'green-900' | 'green-800' | 'green-700' | 'green-600' | 'green-500' | 'green-400' | 'green-300' | 'green-200' | 'green-100' | 'green-50' | 'orange-950' | 'orange-900' | 'orange-800' | 'orange-700' | 'orange-600' | 'orange-500' | 'orange-400' | 'orange-300' | 'orange-200' | 'orange-100' | 'orange-50' | 'blue-950' | 'blue-900' | 'blue-800' | 'blue-700' | 'blue-600' | 'blue-500' | 'blue-400' | 'blue-300' | 'blue-200' | 'blue-100' | 'blue-50' | 'white' | 'shadow-sm' | 'shadow-md' | 'shadow-lg';

  /** A concrete dictionary of colors exported by the Lookbook module. */
  export const colors: {
    [key in Color]: string;
  };
}

