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

import { Budget, formatEuro } from './Budget';
import { useMemo } from 'react';
import { BudgetItem } from './BudgetItem';

interface ReturnType {
  expenses: readonly BudgetItem[];
  income: readonly BudgetItem[];
  total: number;
  totalTheme: 'text-success' | 'text-danger' | 'text-warning';
  readableTotal: string;
}

export function useBudget(): ReturnType {
  const budget = Budget.get();
  const total = useMemo(() => budget.getTotal(), [budget]);
  const readableTotal = useMemo(() => formatEuro(total), [total]);

  const totalTheme = useMemo(() => {
    // Please stop laughing
    if (total > 1000) {
      return 'text-success';
    }

    if (total > 0) {
      return 'text-warning';
    }

    return 'text-danger';
  }, [total]);

  return {
    expenses: budget.expenses,
    income: budget.income,
    total,
    totalTheme,
    readableTotal,
  };
}
