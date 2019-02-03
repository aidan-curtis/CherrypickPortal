import Video from './Video';

export const VideoConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/apps/dashboards/video/:pname1/:pname2/:vname/:vid',
            component: Video
        }
    ]
};
