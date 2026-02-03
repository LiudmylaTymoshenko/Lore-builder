import { useSelector } from 'react-redux';
import { selectActiveLore } from '../features/lore/loreSelectors';

export const useActiveLore = () => {
  return useSelector(selectActiveLore);
};
