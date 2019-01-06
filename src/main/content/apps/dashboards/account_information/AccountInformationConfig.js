import AccountInformation from './AccountInformation';

export const AccountInformationConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes  : [
		{
			path     : '/apps/dashboards/account_information',
			component: AccountInformation
		}
	]
};
