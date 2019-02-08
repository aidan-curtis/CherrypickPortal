import QualityCheck from './QualityCheck';

export const QualityCheckConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes  : [
		{
            path     : '/apps/dashboards/quality',
			component: QualityCheck
		}
	]
};
