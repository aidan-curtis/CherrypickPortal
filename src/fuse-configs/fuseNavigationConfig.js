import {MaterialUINavigation} from 'main/content/components/material-ui/MaterialUINavigation';
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
            },
            {
                'id'   : 'calendar',
                'title': 'Calendar',
                'type' : 'item',
                'icon' : 'today',
                'url'  : '/apps/calendar'
            }
        ]
    }
];
