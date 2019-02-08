import VideoQuality from './VideoQuality';

export const VideoQualityConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/apps/dashboards/video_quality/:type/:videoid/:videoname',
            component: VideoQuality
        }
    ]
};
