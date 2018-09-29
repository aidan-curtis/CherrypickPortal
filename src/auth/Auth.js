import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as userActions from 'auth/store/actions';
import {bindActionCreators} from 'redux';
import * as Actions from 'store/actions';


class Auth extends Component {

    render()
    {
        const {children} = this.props;

        return (
            <React.Fragment>
                {children}
            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
            showMessage        : Actions.showMessage,
            hideMessage        : Actions.hideMessage
        },
        dispatch);
}

export default connect(null, mapDispatchToProps)(Auth);