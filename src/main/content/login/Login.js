import React, {Component} from 'react'
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles/index';
import {Card, CardContent, Typography} from '@material-ui/core';
import classNames from 'classnames';
import {FuseAnimate} from '@fuse';
import RegularLoginTab from './tabs/RegularLoginTab';

const styles = theme => ({
    root : {
        backgroundColor    : "#CB2F41",
        backgroundSize: 'cover'
    },
    intro: {
        color: '#ffffff'
    },
    card : {
        width   : '100%',
        maxWidth: 400
    }
});

class Login extends Component {
    state = {
        tabValue: 0
    };

    handleTabChange = (event, value) => {
        this.setState({tabValue: value});
    };


    render()
    {
        const {classes} = this.props;

        return (
            <div className={classNames(classes.root, "flex flex-col flex-1 flex-no-shrink p-24 md:flex-row md:p-0")}>

                <div
                    className={classNames(classes.intro, "flex flex-col flex-no-grow items-center p-16 text-center md:p-128 md:items-start md:flex-no-shrink md:flex-1 md:text-left")}>

                    <FuseAnimate animation="transition.expandIn">
                        <img className="w-128 mb-32" src="assets/images/logos/alpha_white.png"  alt="logo"/>
                    </FuseAnimate>

                    <FuseAnimate animation="transition.slideUpIn" delay={300}>
                        <Typography variant="display2" color="inherit" className="font-light">
                            Welcome to Cherrypick!
                        </Typography>
                    </FuseAnimate>

                    <FuseAnimate delay={400}>
                        <Typography variant="subheading" color="inherit" className="max-w-512 mt-16">
                            Log into your portal to get access to your segmented videos.
                        </Typography>
                    </FuseAnimate>
                </div>

                <FuseAnimate animation={{translateX: [0, '100%']}}>

                    <Card className={classNames(classes.card, "mx-auto m-16 md:m-0")}>

                        <CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">
                            <Typography variant="title" className="text-center md:w-full mb-48">LOG IN TO YOUR ACCOUNT</Typography>
                            <RegularLoginTab/>

                            <div className="flex flex-col items-center justify-center pt-32">
                                <a className="font-medium mt-8" href="https://cherrypick-analytics.com">Back to Homepage</a>
                            </div>

                        </CardContent>
                    </Card>
                </FuseAnimate>
            </div>
        )
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(Login));
