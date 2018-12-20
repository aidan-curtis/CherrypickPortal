import 'babel-polyfill'
import 'typeface-roboto';
import React from 'react';
import ReactDOM from 'react-dom';
import history from './history';
import './react-table-defaults';
import './styles/index.css';
import '../node_modules/video-react/dist/video-react.css'
import JssProvider from 'react-jss/lib/JssProvider';
import {create} from 'jss';
import {createGenerateClassName, jssPreset} from '@material-ui/core/styles';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from 'react-redux';
import {Router} from 'react-router-dom';
import {routes} from './fuse-configs/fuseRoutesConfig';
import {FuseLayout, FuseTheme, FuseAuthorization} from '@fuse';
import MainToolbar from './main/MainToolbar';
import MainNavbarContent from './main/MainNavbarContent';
import MainNavbarHeader from './main/MainNavbarHeader';
import jssExtend from 'jss-extend'
import {Auth} from 'auth';
import { PersistGate } from 'redux-persist/integration/react'
import store from 'store';
import { persistStore } from 'redux-persist'

require('dotenv').config({ path: './.env' })

const jss = create({
	...jssPreset(),
	plugins: [...jssPreset().plugins, jssExtend()]
});

jss.options.insertionPoint = document.getElementById('jss-insertion-point');
const generateClassName = createGenerateClassName();
const persistor = persistStore(store)

ReactDOM.render(
	<JssProvider jss={jss} generateClassName={generateClassName}>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Auth>
					<Router history={history}>
						<FuseAuthorization routes={routes}>
							<FuseTheme>
								<FuseLayout
									routes={routes}
									toolbar={
										<MainToolbar/>
									}
									navbarHeader={
										<MainNavbarHeader/>
									}
									navbarContent={
										<MainNavbarContent/>
									}
								>
								</FuseLayout>
							</FuseTheme>
						</FuseAuthorization>
					</Router>
				</Auth>
			</PersistGate>
		</Provider>
	</JssProvider>
	, document.getElementById('root'));

registerServiceWorker();
