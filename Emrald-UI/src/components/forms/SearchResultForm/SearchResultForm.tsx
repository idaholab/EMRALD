import ItemTypeMenuResults from '../../layout/Header/SearchBar/ItemTypeMenuResults';
import type { EMRALD_Model } from '../../../types/EMRALD_Model';
import type { ReactNode } from 'react';
import type { ModelItem } from '../../../types/ModelUtils';

interface searchFormProps {
  model: EMRALD_Model;
  getModel: (item: ModelItem, direction: string) => ReactNode;
  expandable?: boolean;
}

const SearchResultForm: React.FC<React.PropsWithChildren<searchFormProps>> = ({
  model,
  getModel,
  expandable,
}) => {
  return (
    <>
      <ItemTypeMenuResults model={model} getModel={getModel} expandable={expandable} />
    </>
  );
};

export default SearchResultForm;
