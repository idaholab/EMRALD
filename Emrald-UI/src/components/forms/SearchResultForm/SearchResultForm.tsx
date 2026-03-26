import type { PropsWithChildren, ReactNode } from 'react';
import type { EMRALD_Model } from '../../../types/EMRALD_Model';
import type { ModelItem } from '../../../types/ModelUtils';
import { ItemTypeMenuResults } from '../../layout/Header/SearchBar/ItemTypeMenuResults';

interface searchFormProps {
  model: EMRALD_Model;
  getModel: (item: ModelItem, direction: string) => ReactNode;
  expandable?: boolean;
}

export const SearchResultForm: React.FC<
  PropsWithChildren<searchFormProps>
> = ({ model, getModel, expandable }) => (
  <ItemTypeMenuResults
    model={model}
    getModel={getModel}
    expandable={expandable}
  />
);
