import TagVideo from './TagVideo';

export const TagVideoConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes  : [
		{
			path     : '/apps/dashboards/tagvideo/:type/:videoid/:videoname',
			component: TagVideo
		}
	]
};
