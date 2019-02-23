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
				'icon' : 'settings',
				'role' : 'team'
			},
			{
				'id'   : 'matches',
				'title': 'Matches',
				'type' : 'item',
				'url'  : '/apps/dashboards/matches',
				'icon' : 'dashboard',
				'role' : 'team'
			},
			{
				'id'   : 'quality',
				'title': 'Quality Checking',
				'type' : 'item',
				'url'  : '/apps/dashboards/quality',
				'icon' : 'remove_red_eye',
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
