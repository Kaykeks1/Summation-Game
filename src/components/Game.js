import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import PropTypes from 'prop-types';
import shuffle from 'lodash.shuffle'
import RandomNumber from './RandomNumber';

class Game extends Component{
    static propTypes = {
        randomNumberCount: PropTypes.number.isRequired,
        initialSeconds: PropTypes.number.isRequired,
        onPlayAgain: PropTypes.func.isRequired,
    };
    state = {
        selectedIds: [],
        remainingSeconds: this.props.initialSeconds,
    }
    gameStatus = "PLAYING"
    randomNumbers = Array.from({length: this.props.randomNumberCount}).map(()=>1 + Math.floor(10 * Math.random()))
    target = this.randomNumbers.slice(0, this.props.randomNumberCount-2).reduce((acc, curr)=> acc + curr, 0);
    shuffledRandomNumbers=shuffle(this.randomNumbers)
    componentDidMount(){
        this.intervalId = setInterval(()=>{
            this.setState((prevState)=>{
                return {remainingSeconds: prevState.remainingSeconds-1}
            }, ()=>{
                if(this.state.remainingSeconds===0) {
                    clearInterval(this.intervalId)
                }
            })
        },1000)
    }
    componentWillUnmount(){
        clearInterval(this.intervalId)
    }
    componentWillUpdate(nextProps, nextState){
        if(nextState.selectedIds !== this.state.selectedIds || nextState.remainingSeconds === 0){
            console.log("calc")
            this.gameStatus = this.calcGameStatus(nextState)
            if(this.gameStatus !== "PLAYING"){
                clearInterval(this.intervalId)
            }
        }
    }
    isNumberSelected = (numberIndex) => {
        return this.state.selectedIds.indexOf(numberIndex) >= 0
    }
    selectNumber = (numberIndex) =>{
        this.setState((prevState)=>({selectedIds: [...prevState.selectedIds, numberIndex]}))
    }
    calcGameStatus =(nextState)=>{
        const sumSelected = nextState.selectedIds.reduce((acc,curr)=>{
            return acc+this.shuffledRandomNumbers[curr]
        },0);
        // console.warn(sumSelected)
        if(nextState.remainingSeconds===0) {
            return "LOST";
        }
        if(sumSelected<this.target){
            return "PLAYING";
        }
        if(sumSelected===this.target){
            return "WON";
        }
        if(sumSelected>this.target){
            return "LOST";
        }
    }
    render(){
        const gameStatus = this.gameStatus;
        // console.log(shuffle([1,2,3,4]))
        // const x = 10 + Math.floor(40 * Math.random())
        // console.log("target: ",this.target)
        // console.log("x: ",x)
        return(
            <View style={styles.container}>
                <Text style={[styles.target, styles[`STATUS_${gameStatus}`]]}>{this.target}</Text>
                <View style={styles.numberContainer}>
                {
                    
                    this.shuffledRandomNumbers.map((item, index)=>(
                        <RandomNumber 
                        key={index}
                        id={index}
                        number={item}
                        isDisabled={this.isNumberSelected(index) || gameStatus !== "PLAYING"}
                        onPress={this.selectNumber}
                        />
                    ))
                
                }
                </View>
                {
                    this.gameStatus !== "PLAYING" &&
                    <Button title="Play Again!" onPress={this.props.onPlayAgain} />
                }
                <Text>{gameStatus}{this.state.remainingSeconds}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ddd',
        // paddingTop: 30,
    },
    target: {
        fontSize: 40,
        margin: 50,
        textAlign: 'center',
    },
    numberContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    number: {
        fontSize: 35,
        backgroundColor: '#999',
        width: 100,
        marginHorizontal: 15,
        marginVertical: 25,
        textAlign: 'center',
        // margin: 20,
        // flexDirection: 'row',
        // alignItems: 'stretch',        
    },
    STATUS_PLAYING: {
        backgroundColor: '#aaa',
    },
    STATUS_WON: {
        backgroundColor: 'green',
    },
    STATUS_LOST: {
        backgroundColor: 'red',
    }
})

export default Game;