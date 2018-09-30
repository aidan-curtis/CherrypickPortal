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
import { Player } from 'video-react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = theme => ({
    root: {
        width: '100%'
    }
});

class Video extends Component {

    constructor(props)
    {
        super(props);
    }

    state = {
        selected: -1
    }

    handleStateChange(state, prevState) {
        // copy player state to this component's state
        this.setState({
          player: state
        });
    }


    componentDidMount() {
        // subscribe state change
        this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));
        this.refs.player.play();
    }


    changeCurrentTime(seconds) {
        return () => {
          const { player } = this.refs.player.getState();
          const currentTime = player.currentTime;
          this.refs.player.seek(seconds);
        };
    }





    render()
    {
        const {classes} = this.props;
        return (
            <div className={classes.root} style = {{padding: 50}}>

            <Grid container spacing={24}>
                <Grid item xs={8}>
                   <Player
                        playsInline
                        ref="player"
                        poster="https://s3.amazonaws.com/cherrypick-game-videos/Ashton%26AJ+vs+Diemer%26Castelino+(DU)_2018-09-30-00.21.51.252-UTC_0.png"
                        src="https://s3.amazonaws.com/cherrypick-game-videos/Ashton%26AJ+vs+Diemer%26Castelino+(DU)_2018-09-30-00.21.51.252-UTC_0.mp4"
                    />  
                </Grid>
                <Grid item xs={4}>
                                <Paper>


                <div style={{ overflow: 'auto', height: '500px' }}>

                 <Table className={classes.table} style={{tableLayout: 'fixed'}}>
                   <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Timestamp (sec)</TableCell>
                      </TableRow>
                   </TableHead>
                    <TableBody >
                  {this.props.user.activeVideo.Segments.map((segment, index)=>
                    {
                        var cell_color = "#fff"
                        if(this.state.selected===index){
                            cell_color = "#eee"
                        }
                        return (<TableRow key={index} style ={{backgroundColor: cell_color}} onClick = {this.changeCurrentTime(segment.timestamp)}>

            

            <TableCell component="th" scope="row" onClick = {()=>{this.setState({selected: index})}}>
                   {segment.name}
                </TableCell>
                <TableCell component="th" scope="row" onClick = {()=>{this.setState({selected: index})}} >
                     {segment.timestamp} s
                </TableCell>
                </TableRow>)
                }

                
                    )}

                   </TableBody>
   
                </Table>

                </div>
                                </Paper>

                </Grid>
            </Grid>
    

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

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(Video)));
