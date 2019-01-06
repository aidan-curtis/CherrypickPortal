import {PlayersConfig} from './dashboards/players/PlayersConfig';
import {TournamentsConfig} from './dashboards/tournaments/TournamentsConfig';
import {VideoConfig} from './dashboards/video/VideoConfig';
import {MatchesConfig} from './dashboards/matches/MatchesConfig';
import {AccountInformationConfig} from './dashboards/account_information/AccountInformationConfig';
import {TaggedConfig} from './dashboards/tagged/TaggedConfig';
import {TagVideoConfig} from './dashboards/tagvideo/TagVideoConfig';
import {UntaggedConfig} from './dashboards/untagged/UntaggedConfig';
import {ProcessingConfig} from './dashboards/processing/ProcessingConfig';

export const appsConfigs = [
	PlayersConfig,
	TournamentsConfig,
	VideoConfig,
	MatchesConfig,
	TaggedConfig,
	UntaggedConfig,
	ProcessingConfig,
	TagVideoConfig,
	AccountInformationConfig
];
