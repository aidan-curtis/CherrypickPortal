import React from 'react';
import {Button, Icon, IconButton, Tooltip} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles/index';
import {FuseAnimateGroup} from '@fuse';
import classNames from 'classnames';

const styles = theme => ({
    root: {}
});

function HomePage({classes})
{
    return (
        <div>Testing homepage</div>
    );
}

export default withStyles(styles, {withTheme: true})(HomePage);