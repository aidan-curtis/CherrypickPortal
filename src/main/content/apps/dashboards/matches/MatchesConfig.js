import Matches from './Matches';

export const MatchesConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes  : [
		{
			path     : '/apps/dashboards/matches',
			component: Matches
		}
	]
};
