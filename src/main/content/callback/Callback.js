import React, {Component} from 'react';
import {FuseSplashScreen} from '@fuse';
import auth0Service from 'auth0Service';
import {bindActionCreators} from 'redux';
import * as userActions from 'auth/store/actions';
import * as Actions from 'store/actions';
import connect from 'react-redux/es/connect/connect';
import {withRouter} from 'react-router-dom';

class Callback extends Component {
    componentDidMount()
    {
       
    }

    render()
    {
        return (
            <FuseSplashScreen/>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
            showMessage     : Actions.showMessage,
            hideMessage     : Actions.hideMessage
        },
        dispatch);
}

export default withRouter(connect(null, mapDispatchToProps)(Callback));
