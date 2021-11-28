/**
 * Copyright © 2021 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */
import { TestHelper } from '../../utils/test/TestHelper';

// This file must contains empty lines and final new line
export const File1 = TestHelper.sampleCsvFile(`\
"label","altitude"

"value1",1234

"value2",5678

`);

export const File2 = TestHelper.sampleCsvFile('');

export const File3 = TestHelper.sampleCsvFile(`\
"a";"b";"c"
"d";"e";"f"
`);

export const File4 = TestHelper.sampleCsvFile(`\
label,altitude
value1,1234
value2,1235
value3
`);