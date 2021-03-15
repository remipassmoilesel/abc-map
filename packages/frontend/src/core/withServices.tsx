import * as React from 'react';
import { Services, getServices } from './Services';

export interface ServiceProps {
  services: Services;
}

type OmitServices<T> = {
  [L in Exclude<keyof T, keyof ServiceProps>]: T[L];
};

export function withServices<T extends ServiceProps>(WrappedComponent: React.ComponentType<T>): React.ComponentType<OmitServices<T>> {
  class ServiceWrapper extends React.Component<any, any> {
    public render() {
      return <WrappedComponent {...(this.props as T)} services={getServices()} />;
    }
  }

  return ServiceWrapper;
}
