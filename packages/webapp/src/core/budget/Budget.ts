/**
 * Copyright © 2023 Rémi Pace.
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

import { Expenses, Income } from './data';

let instance: Budget | undefined;

export class Budget {
  public static get(): Budget {
    if (!instance) {
      instance = new Budget();
    }
    return instance;
  }

  public readonly expenses = Object.freeze(Expenses);
  public readonly income = Object.freeze(Income);

  public getTotal(): number {
    const totalExpenses = this.expenses.reduce((a, b) => a + b.value, 0);
    const totalIncome = this.income.reduce((a, b) => a + b.value, 0);
    return totalExpenses + totalIncome;
  }
}

const floatFormat = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

export function formatEuro(n: number): string {
  return floatFormat.format(n);
}
