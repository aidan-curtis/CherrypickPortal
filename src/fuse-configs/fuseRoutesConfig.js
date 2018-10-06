import React from 'react';
import {Redirect} from 'react-router-dom';
import {FuseUtils} from '@fuse/index';
import {appsConfigs} from 'main/content/apps/appsConfigs';
import {pagesConfigs} from 'main/content/pages/pagesConfigs';
import {UserInterfaceConfig} from 'main/content/user-interface/UserInterfaceConfig';
import {LoginConfig} from 'main/content/login/LoginConfig';
import {RegisterConfig} from 'main/content/register/RegisterConfig';
import {LogoutConfig} from 'main/content/logout/LogoutConfig';
import {CallbackConfig} from 'main/content/callback/CallbackConfig';
import {HomepageConfig} from 'main/content/homepage/HomepageConfig'

const routeConfigs = [
    ...appsConfigs,
    ...pagesConfigs,
    HomepageConfig,
    LoginConfig,
    UserInterfaceConfig,
    RegisterConfig,
    LogoutConfig,
    CallbackConfig
];

export const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
    {
        path     : '/',
        exact    : true,
        component: () => <Redirect to="/"/>
    },
    {
        component: () => <Redirect to="/pages/errors/error-404"/>
    }
];
