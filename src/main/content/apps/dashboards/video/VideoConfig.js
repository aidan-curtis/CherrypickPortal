import Video from './Video';

export const VideoConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/apps/dashboards/video',
            component: Video
        }
    ]
};
