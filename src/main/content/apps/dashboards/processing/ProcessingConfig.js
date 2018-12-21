import Processing from './Processing';

export const ProcessingConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes  : [
		{
			path     : '/apps/dashboards/processing',
			component: Processing
		}
	]
};
