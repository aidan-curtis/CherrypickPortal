import {authRoles} from 'auth';

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
                'url'  : '/apps/dashboards/tournaments',
                'icon' : 'dashboard'
            },
            {
                'id'   : 'players',
                'title': 'Players',
                'type' : 'item',
                'url'  : '/apps/dashboards/players',
                'icon' : 'person'
            }
        ]
    }
];
