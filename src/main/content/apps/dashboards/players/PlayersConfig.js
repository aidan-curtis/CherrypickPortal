import Players from './Players';

export const PlayersConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/apps/dashboards/players',
            component: Players
        }
    ]
};
