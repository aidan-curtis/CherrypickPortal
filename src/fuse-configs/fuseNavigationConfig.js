export const fuseNavigationConfig = [
    {
        'id'      : 'applications',
        'title'   : 'Applications',
        'type'    : 'group',
        'icon'    : 'apps',
        'children': [
            {
                'id'   : 'tournaments',
                'title': 'Tournaments',
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
            },            
            {
                'id'   : 'processing',
                'title': 'Processing',
                'type' : 'item',
                'url'  : '/apps/dashboards/processing',
                'icon' : 'hourglass_empty',
                'role' : 'tagger'
            },
            
        ]
    }
];
