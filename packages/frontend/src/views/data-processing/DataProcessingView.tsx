import React, { Component, ReactNode } from 'react';
import { DataProcessingParams, FrontendRoutes, Logger } from '@abc-map/frontend-shared';
import { getModules } from '../../data-processing';
import { Link, RouteComponentProps } from 'react-router-dom';
import Cls from './DataProcessingView.module.scss';
import '../../data-processing/style.scss';

const logger = Logger.get('DataProcessingView.tsx');

declare type Props = RouteComponentProps<DataProcessingParams, any>;

const Modules = getModules();

class DataProcessingView extends Component<Props, {}> {
  public render(): ReactNode {
    const currentModuleId = this.props.match.params.moduleId;
    const module = Modules.find((mod) => mod.getId() === currentModuleId);

    return (
      <div className={Cls.dataProcessingView}>
        <div className={Cls.leftMenu}>
          <div className={'mx-2 my-4 font-weight-bold'}>Modules</div>
          {Modules.map((mod) => (
            <Link key={mod.getId()} className={'btn btn-link'} to={FrontendRoutes.dataProcessing(mod.getId())} data-cy={mod.getId()}>
              {mod.getReadableName()}
            </Link>
          ))}
        </div>
        <div className={Cls.viewPort}>
          {module && (
            <>
              <h4>{module.getReadableName()}</h4>
              {module.getUserInterface()}
            </>
          )}
          {!module && (
            <div className={Cls.welcome}>
              <i className={'fa fa-cogs'} />
              <h4>
                Sélectionnez un module
                <br /> dans le menu à gauche.
              </h4>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default DataProcessingView;
