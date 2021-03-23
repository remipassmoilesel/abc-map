import * as React from 'react';
import { getServices, Services } from './Services';

export interface ServiceProps {
  services: Services;
}

declare type WrappedComponent<P> = React.ComponentClass<Omit<P, keyof ServiceProps>>;

export function withServices<P extends ServiceProps>(Component: React.ComponentType<P>): WrappedComponent<P> {
  class ServiceWrapper extends React.Component<any, any> {
    public render() {
      return <Component {...(this.props as P)} services={getServices()} />;
    }
  }

  return ServiceWrapper;
}
