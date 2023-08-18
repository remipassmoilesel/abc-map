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

import React from 'react';
import { getTextByLang } from '@abc-map/shared';
import { useTranslation } from 'react-i18next';
import { formatEuro } from '../../core/budget/Budget';
import clsx from 'clsx';
import { useBudget } from '../../core/budget/useBudget';

export function BudgetTable() {
  const { i18n, t } = useTranslation('FundingView');
  const lang = i18n.language;
  const { total, expenses, income, totalTheme } = useBudget();

  return (
    <div className={'d-flex flex-column w-50'}>
      <Line label={t('Total')} value={total} className={'mb-3'} valueClassName={totalTheme} />

      <div className={'mb-4'}>
        <div className={'fw-bold'}>{t('Expenses')}</div>
        {expenses.map((item) => (
          <Line key={item.id} label={getTextByLang(item.description, lang) ?? '<invalid-line>'} value={item.value} />
        ))}
      </div>

      <div className={'mb-4'}>
        <div className={'fw-bold'}>{t('Income')}</div>
        {income.map((item) => (
          <Line key={item.id} label={getTextByLang(item.description, lang) ?? '<invalid-line>'} value={item.value} />
        ))}
      </div>

      <small className={'text-end mb-4'}>{t('The_budget_is_manually_updated_every_month')}</small>

      <div className={'alert alert-info'}>
        <div>{t('And_the_cost_of_labor')}</div>
        <div>{t('A_year_of_development_costs_up_to')}</div>
      </div>
    </div>
  );
}

interface LineProps {
  label: string;
  value: number;
  className?: string;
  valueClassName?: string;
}

function Line({ label, value, className, valueClassName }: LineProps) {
  return (
    <div className={clsx('d-flex justify-content-between mb-2', className)}>
      <div>{label}</div>
      <div className={clsx('fw-bold', valueClassName)}>{(value > 0 ? '+' : '') + formatEuro(value)}</div>
    </div>
  );
}
