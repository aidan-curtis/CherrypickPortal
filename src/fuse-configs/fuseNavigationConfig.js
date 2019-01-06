export const fuseNavigationConfig = [
	{
		'id'      : 'applications',
		'title'   : 'Applications',
		'type'    : 'group',
		'icon'    : 'apps',
		'children': [
			{
				'id'   : 'account_information',
				'title': 'Account Information',
				'type' : 'item',
				'url'  : '/apps/dashboards/account_information',
				'icon' : 'dashboard',
				'role' : 'team'
			},
			{
				'id'   : 'tournaments',
				'title': 'Dual Matches',
				'type' : 'item',
				'url'  : '/apps/dashboards/tournaments/tournament',
				'icon' : 'dashboard',
				'role' : 'team'
			},
			{
				'id'   : 'players',
				'title': 'Players',
				'type' : 'item',
				'url'  : '/apps/dashboards/players/player',
				'icon' : 'person',
				'role' : 'team'
			},
			{
				'id'   : 'processing',
				'title': 'Processing',
				'type' : 'item',
				'url'  : '/apps/dashboards/processing',
				'icon' : 'hourglass_empty',
				'role' : 'tagger'
			},
			{
				'id'   : 'untagged',
				'title': 'Untagged',
				'type' : 'item',
				'url'  : '/apps/dashboards/untagged',
				'icon' : 'markunread_mailbox',
				'role' : 'tagger'
			},            
			{
				'id'   : 'tagged',
				'title': 'Tagged',
				'type' : 'item',
				'url'  : '/apps/dashboards/tagged',
				'icon' : 'check',
				'role' : 'tagger'
			}
		]
	}
];
