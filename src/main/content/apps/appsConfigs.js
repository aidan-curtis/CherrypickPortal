import {VideoConfig} from './dashboards/video/VideoConfig';
import {MatchesConfig} from './dashboards/matches/MatchesConfig';
import {AccountInformationConfig} from './dashboards/account_information/AccountInformationConfig';
import {TaggedConfig} from './dashboards/tagged/TaggedConfig';
import {TagVideoConfig} from './dashboards/tagvideo/TagVideoConfig';
import {QualityCheckConfig} from './dashboards/quality_check/QualityCheckConfig';
import {VideoQualityConfig} from './dashboards/video_quality/VideoQualityConfig';
import {UntaggedConfig} from './dashboards/untagged/UntaggedConfig';

export const appsConfigs = [
	VideoConfig,
	MatchesConfig,
	TaggedConfig,
	UntaggedConfig,
	QualityCheckConfig,
	TagVideoConfig,
	VideoQualityConfig,
	AccountInformationConfig
];
