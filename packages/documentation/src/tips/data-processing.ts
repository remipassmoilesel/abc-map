import { Tip } from './Tip';

export enum ProportionalSymbolsTips {
  SizeField = 'SizeField',
  JoinBy = 'JoinBy',
  Algorithm = 'Algorithm',
}

const ProportionalSymbols: Tip[] = [
  {
    id: ProportionalSymbolsTips.SizeField,
    content: `<p>Le <i>champ taille</i> est utilisé pour déterminer la taille de chaque symbole.</p>
              <p>Ce champ doit contenir la donnée à analyser. Exemples:</p>
              <ul>
                <li>population</li>
                <li>revenu annuel</li>
                <li>PIB</li>
              </ul>`,
  },
  {
    id: ProportionalSymbolsTips.JoinBy,
    content: `<p>Le <i>champ de jointure</i> est utilisé pour mettre en relation une donnée et une géométrie.</p>
              <p>Ce champ doit contenir un code qui sera présent dans la géométrie et dans la donnée à analyser. Exemples:</p>
              <ul>
                <li>code postal</li>
                <li>code de département</li>
                <li>code de région</li>
                <li>code de pays</li>
              </ul>`,
  },
  {
    id: ProportionalSymbolsTips.Algorithm,
    content: `<p>L'échelle des symboles détermine la méthode de calcul de la taille des symboles.</p>
              <ul>
                <li>Sur <i>l'échelle absolue</i> les tailles des symboles sont directement proportionnelles aux valeurs représentées.
                La proportionnalité des symboles est exacte.</li>
                <li>Sur <i>l'échelle interpolée</i> les tailles des symboles sont réparties entre la taille minimale et la taille maximale.
                La proportionnalité des symboles est faussée. Cette échelle est utile lorsque la plage des valeurs est large.</li>
              </ul>`,
  },
];

export const DataProcessing: Tip[] = [...ProportionalSymbols];
