import Video from './Video';

export const VideoConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/apps/dashboards/video/:type/:name/:videoname/:videoid',
            component: Video
        }
    ]
};
