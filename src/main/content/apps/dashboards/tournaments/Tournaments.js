import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import {Typography} from '@material-ui/core';
import {Chart} from 'react-chartjs-2';
import {FuseAnimate} from '@fuse';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';


const styles = theme => ({
    root: {
        width: '100%'
    }
});

class Tournaments extends Component {

    constructor(props)
    {
        super(props);
    }

    render()
    {


        const {classes} = this.props;
        return (
            <div className={classes.root} style = {{padding: 50}}>
                 {this.props.user.team.Videos.map(function(video, index){
                    return (<Card key = {index} style = {{width: 200, height: 280}}>
                                <CardActionArea>
                                    <CardMedia
                                      title="Thumb"
                                    >
                                    <img src="https://s3.amazonaws.com/cherrypick-game-videos/Ashton%26AJ+vs+Diemer%26Castelino+(DU)_2018-09-30-00.21.51.252-UTC_0.png"/>
                                    </CardMedia>
                                    <CardContent>
                                      <Typography gutterBottom variant="headline" component="h2">
                                            {video.metadata.tournament}
                                      </Typography>
                                    </CardContent>
                                  </CardActionArea>
                                  <CardActions>
                                    <Button size="small" color="primary">
                                      View
                                    </Button>
                                  </CardActions>
                            </Card>)
                  })}
            </div>
        )
    };
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
    }, dispatch);
}

function mapStateToProps({auth})
{
    return {
        user: auth.user
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(Tournaments)));
