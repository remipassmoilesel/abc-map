export function sampleCsvFile(content: string): File {
  return new File([content], 'test.csv', { type: 'text/csv' });
}

// This file must contains empty lines and final new line
export const File1 = sampleCsvFile(`\
"label","altitude"

"value1",1234

"value2",5678

`);

export const File2 = sampleCsvFile(`\
"label","altitude"
"value3","11,88"
"value4",11.89
"value5","Hello, how are you ?"
`);

export const File3 = sampleCsvFile('');

export const File4 = sampleCsvFile(`
"a";"b";"c"
"d";"e";"f"
`);
