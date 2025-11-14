import { LabelledPointLayer } from '@map/utils/LayerSettings';

export const createIconLayer = (data: any, viewState: any) => {

  return new LabelledPointLayer({
    id: 'icons',
    data,
    viewState,
  });
}