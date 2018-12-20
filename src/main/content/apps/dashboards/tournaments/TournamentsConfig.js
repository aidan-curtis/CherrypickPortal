import Tournaments from './Tournaments';

export const TournamentsConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/apps/dashboards/tournaments/:type',
            component: Tournaments
        }
    ]
};
