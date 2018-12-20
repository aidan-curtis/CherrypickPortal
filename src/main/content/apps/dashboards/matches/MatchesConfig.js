import Matches from './Matches';

export const MatchesConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes  : [
		{
			path     : '/apps/dashboards/matches/:type/:name',
			component: Matches
		}
	]
};
