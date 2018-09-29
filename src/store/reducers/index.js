import {combineReducers} from 'redux';
import fuse from './fuse';
import auth from 'auth/store/reducers';
import analyticsDashboardApp from 'main/content/apps/dashboards/analytics/store/reducers';
import calendarApp from 'main/content/apps/calendar/store/reducers';

const rootReducer = combineReducers({
    auth,
    fuse,
    analyticsDashboardApp,
    calendarApp
});

export default rootReducer;
